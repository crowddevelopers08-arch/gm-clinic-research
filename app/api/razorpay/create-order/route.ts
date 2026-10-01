export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RAZORPAY_API, basicAuth, razorpayKeys, templateAmountInPaise } from "@/lib/razorpay";

/**
 * POST /api/razorpay/create-order — body: { leadId }
 * Creates a Razorpay order for the lead that was just saved by /api/leads.
 * Contact details come from the stored lead, not from the browser.
 */
export async function POST(req: NextRequest) {
  const keys = razorpayKeys();
  const amount = templateAmountInPaise();
  if (!keys || amount === null) {
    console.error(
      "[Razorpay] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET / RAZORPAY_TEMPLATE_AMOUNT not set correctly"
    );
    return NextResponse.json(
      { error: "Payments are not configured yet. Please try again later." },
      { status: 500 }
    );
  }

  let leadId = "";
  try {
    const body = await req.json();
    if (typeof body?.leadId === "string") leadId = body.leadId.trim();
  } catch {
    // handled below
  }
  if (!leadId) {
    return NextResponse.json({ error: "Missing lead." }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true, name: true, email: true, phone: true, paymentStatus: true },
  });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }
  if (lead.paymentStatus === "paid") {
    return NextResponse.json({ alreadyPaid: true });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${RAZORPAY_API}/orders`, {
      method: "POST",
      headers: {
        Authorization: basicAuth(keys.keyId, keys.keySecret),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        // Razorpay caps receipt at 40 chars.
        receipt: `gmcr_${lead.id}`.slice(0, 40),
        notes: {
          product: "Clinic BMC Starter Template",
          source: "gm-clinic-research-lp",
          leadId: lead.id,
          name: lead.name.slice(0, 80),
          email: lead.email.slice(0, 80),
          phone: lead.phone.replace(/\D/g, "").slice(0, 15),
        },
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    const order = await res.json();
    if (!res.ok) {
      throw new Error(order?.error?.description || `Razorpay HTTP ${res.status}`);
    }

    await prisma.lead.update({
      where: { id: lead.id },
      data: { razorpayOrderId: order.id, amountPaise: order.amount, paymentStatus: "pending" },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keys.keyId, // publishable key — safe to expose to the browser
      prefill: { name: lead.name, email: lead.email, contact: lead.phone },
    });
  } catch (err) {
    clearTimeout(timeout);
    console.error("[Razorpay create-order] Error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Could not start the payment. Please try again." },
      { status: 502 }
    );
  }
}
