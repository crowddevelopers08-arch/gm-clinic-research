import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Prisma needs the Node runtime; leads must never be statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v);
}

/**
 * POST /api/leads — public endpoint the landing-page form submits to.
 * Stores the full survey payload plus a few surfaced columns.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "name, email and phone are required." },
      { status: 400 }
    );
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        speciality: str(body.speciality) || null,
        city: str(body.city) || null,
        stage: str(body.stage) || null,
        source: str(body.source) || null,
        data: body as Prisma.InputJsonValue,
      },
      select: { id: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("Failed to save lead:", err);
    return NextResponse.json(
      { error: "Could not save your submission. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads — protected list endpoint for the dashboard.
 * Requires header `x-dashboard-key` matching DASHBOARD_PASSWORD.
 */
export async function GET(req: Request) {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    return NextResponse.json(
      { error: "DASHBOARD_PASSWORD is not configured on the server." },
      { status: 500 }
    );
  }

  const provided =
    req.headers.get("x-dashboard-key") ??
    new URL(req.url).searchParams.get("key");

  if (provided !== password) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    });
    return NextResponse.json({ ok: true, count: leads.length, leads });
  } catch (err) {
    console.error("Failed to fetch leads:", err);
    return NextResponse.json(
      { error: "Could not load leads." },
      { status: 500 }
    );
  }
}
