export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RAZORPAY_API, basicAuth, hmacMatches, razorpayKeys } from "@/lib/razorpay";

/**
 * POST /api/razorpay/verify — called by the browser from Checkout's success
 * handler. Razorpay signs `order_id|payment_id` with the key secret;
 * recomputing it proves the callback was not faked by the browser.
 */
export async function POST(req: NextRequest) {
  const keys = razorpayKeys();
  if (!keys) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 500 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const orderId = body.razorpay_order_id || "";
  const paymentId = body.razorpay_payment_id || "";
  const signature = body.razorpay_signature || "";

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Incomplete payment details." }, { status: 400 });
  }

  if (!hmacMatches(`${orderId}|${paymentId}`, signature, keys.keySecret)) {
    console.error("[Razorpay verify] Signature mismatch for order", orderId);
    return NextResponse.json(
      { verified: false, error: "We could not verify this payment." },
      { status: 400 }
    );
  }

  // Signature is valid — confirm with Razorpay that the payment actually went
  // through before unlocking the template.
  try {
    const res = await fetch(`${RAZORPAY_API}/payments/${paymentId}`, {
      headers: { Authorization: basicAuth(keys.keyId, keys.keySecret) },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Razorpay HTTP ${res.status}`);
    const payment = await res.json();

    if (payment.status !== "captured" && payment.status !== "authorized") {
      return NextResponse.json(
        { verified: false, error: `Payment is ${payment.status}. Please try again.` },
        { status: 400 }
      );
    }
    if (payment.order_id !== orderId) {
      return NextResponse.json(
        { verified: false, error: "We could not verify this payment." },
        { status: 400 }
      );
    }
  } catch (err) {
    // The signature already proved the payment is genuine, so don't block the
    // user just because this lookup failed.
    console.error(
      "[Razorpay verify] Payment lookup failed:",
      err instanceof Error ? err.message : err
    );
  }

  try {
    await prisma.lead.updateMany({
      where: { razorpayOrderId: orderId },
      data: { paymentStatus: "paid", razorpayPaymentId: paymentId, paidAt: new Date() },
    });
  } catch (err) {
    // The webhook will record it as a fallback.
    console.error("[Razorpay verify] DB update failed:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ verified: true, paymentId, orderId });
}
