export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hmacMatches } from "@/lib/razorpay";

/**
 * Razorpay calls this endpoint server-to-server once a payment settles.
 *
 * It is the reliable half of the flow: the browser callback in LeadFormModal
 * is lost if the visitor closes the tab mid-payment, but this still fires —
 * so a paid lead is always marked paid on the dashboard.
 *
 * Configure in Razorpay → Settings → Webhooks:
 *   URL     https://<your-domain>/api/razorpay/webhook
 *   Secret  RAZORPAY_WEBHOOK_SECRET
 *   Events  payment.captured, payment.failed
 */

interface RazorpayPayment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  notes?: Record<string, string>;
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Razorpay webhook] RAZORPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // The signature covers the exact bytes Razorpay sent, so the raw text must be
  // read before any JSON parsing.
  const rawBody = await req.text();

  if (!hmacMatches(rawBody, signature, secret)) {
    console.error("[Razorpay webhook] Signature mismatch — request rejected");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let body: { event?: string; payload?: { payment?: { entity?: RazorpayPayment } } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const event = body.event || "";
  const payment = body.payload?.payment?.entity;

  // Anything we don't act on is acknowledged with 200 so Razorpay stops retrying.
  if (event !== "payment.captured" && event !== "payment.failed") {
    return NextResponse.json({ received: true, ignored: event }, { status: 200 });
  }
  if (!payment?.id || !payment.order_id) {
    return NextResponse.json({ received: true, ignored: "no payment entity" }, { status: 200 });
  }

  // Other Razorpay products on the same account also post here — only touch
  // orders this page created.
  const where =
    event === "payment.captured"
      ? { razorpayOrderId: payment.order_id }
      : // A failed attempt must never overwrite a later successful retry.
        { razorpayOrderId: payment.order_id, NOT: { paymentStatus: "paid" } };

  let updated = 0;
  try {
    const res = await prisma.lead.updateMany({
      where,
      data:
        event === "payment.captured"
          ? {
              paymentStatus: "paid",
              razorpayPaymentId: payment.id,
              amountPaise: payment.amount,
              paidAt: new Date(),
            }
          : { paymentStatus: "failed", razorpayPaymentId: payment.id },
    });
    updated = res.count;
  } catch (err) {
    console.error("[Razorpay webhook] DB update failed:", err instanceof Error ? err.message : err);
    // A 500 here makes Razorpay retry, which is what we want for a DB blip.
    return NextResponse.json({ error: "Could not record payment." }, { status: 500 });
  }

  return NextResponse.json(
    { received: true, event, paymentId: payment.id, updated },
    { status: 200 }
  );
}
