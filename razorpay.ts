import crypto from "crypto";
import Razorpay from "razorpay";

export function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function getRazorpay() {
  if (!razorpayConfigured()) throw new Error("Razorpay keys not configured");
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

// Verifies the signature returned by Razorpay checkout (HMAC-SHA256).
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(String(signature), "utf8");
  // timingSafeEqual throws on a length mismatch — check that first so a junk
  // signature is a clean "invalid" rather than a 500.
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
