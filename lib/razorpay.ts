import crypto from "crypto";

export const RAZORPAY_API = "https://api.razorpay.com/v1";

export function razorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return keyId && keySecret ? { keyId, keySecret } : null;
}

export function basicAuth(keyId: string, keySecret: string) {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

// The amount is decided here, on the server, and never taken from the client —
// otherwise a visitor could edit the request and pay ₹1 for the template.
export function templateAmountInPaise() {
  const rupees = Number(process.env.RAZORPAY_TEMPLATE_AMOUNT);
  if (!Number.isFinite(rupees) || rupees <= 0) return null;
  return Math.round(rupees * 100);
}

/** HMAC-SHA256 hex of `data`, compared in constant time against `signature`. */
export function hmacMatches(data: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(data).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
