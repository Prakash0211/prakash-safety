"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/utils";
import { formatPrice, lineTotal } from "@/lib/pricing";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import { CONTACT } from "@/lib/constants";

type Props = { onlinePayment: boolean; whatsapp: string; razorpayKeyId: string };

declare global { interface Window { Razorpay?: any } }

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function Checkout({ onlinePayment, whatsapp, razorpayKeyId }: Props) {
  const { items, total, hasUnpriced, clear } = useCart();
  // Nothing can be charged online while any line still needs a quote.
  const canPayOnline = onlinePayment && Boolean(razorpayKeyId) && !hasUnpriced && total > 0;
  const router = useRouter();
  const [form, setForm] = useState({ customerName: "", phone: "", email: "", address: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const payload = (paymentMethod: string) => ({ ...form, paymentMethod, total, items: items.map((i) => ({ productId: i.id, name: i.name + (i.size ? ` (${i.size})` : ""), price: i.price, qty: i.qty })) });

  function validate() {
    if (!form.customerName.trim() || !form.phone.trim()) { setErr("Please enter your name and mobile number."); return false; }
    if (items.length === 0) { setErr("Your cart is empty."); return false; }
    setErr(""); return true;
  }

  async function orderWhatsApp() {
    if (!validate()) return;
    setBusy(true);
    try { await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload("WHATSAPP")) }); } catch {}
    const link = buildWhatsAppOrderLink(
      items.map((i) => ({ name: i.name + (i.size ? ` (${i.size})` : ""), qty: i.qty, price: i.price })),
      total, { name: form.customerName, phone: form.phone }, whatsapp
    );
    clear();
    window.open(link, "_blank");
    router.push("/order/success?via=whatsapp");
  }

  async function payOnline() {
    if (!validate()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/payment/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload("RAZORPAY")) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Failed to load payment gateway");
      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount: data.amount,
        currency: "INR",
        name: "Prakash Safety",
        description: "Safety products order",
        order_id: data.razorpayOrderId,
        prefill: { name: form.customerName, contact: form.phone, email: form.email },
        theme: { color: "#F26522" },
        handler: async (r: any) => {
          await fetch("/api/payment/verify", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId, razorpay_order_id: r.razorpay_order_id, razorpay_payment_id: r.razorpay_payment_id, razorpay_signature: r.razorpay_signature }),
          });
          clear();
          router.push("/order/success?via=online");
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch (e: any) {
      setErr(e.message || "Payment failed");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h2 className="font-display text-xl font-bold tracking-tight text-brand-ink">Your details</h2>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Full name *</label><input className="input" value={form.customerName} onChange={set("customerName")} placeholder="Your name" /></div>
            <div><label className="label">Mobile number *</label><input className="input" value={form.phone} onChange={set("phone")} inputMode="tel" placeholder="+91 …" /></div>
          </div>
          <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" /></div>
          <div><label className="label">Delivery address</label><textarea className="input" rows={3} value={form.address} onChange={set("address")} placeholder="Full address with city & PIN" /></div>
          <div><label className="label">Notes (sizes, colours, bulk quantity…)</label><textarea className="input" rows={2} value={form.notes} onChange={set("notes")} /></div>
        </div>
      </div>

      <div className="h-fit lg:col-span-2 lg:sticky lg:top-24">
        <div className="card p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold tracking-tight text-brand-ink">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={`${i.id}-${i.size}`} className="flex justify-between gap-2">
                <span className="text-brand-gray">{i.name}{i.size ? ` (${i.size})` : ""} × {i.qty}</span>
                <span className="tnum shrink-0 font-medium">{formatPrice(lineTotal(i.price, i.qty))}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-brand-line pt-3 text-lg font-bold">
            <span>{hasUnpriced ? "Total (priced items)" : "Total"}</span>
            <span className="tnum">{formatINR(total)}</span>
          </div>
          {hasUnpriced && (
            <p className="mt-2 text-xs text-brand-gray">
              Some items are priced on request. Send the order on WhatsApp and we'll reply with a quote.
            </p>
          )}

          {err && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{err}</p>}

          <div className="mt-5 space-y-2">
            {canPayOnline && (
              <button onClick={payOnline} disabled={busy} className="btn-primary w-full">{busy ? "Please wait…" : `Pay Online · ${formatINR(total)}`}</button>
            )}
            <button onClick={orderWhatsApp} disabled={busy} className="btn w-full bg-green-500 text-white hover:bg-green-600">
              {hasUnpriced ? "Send Order & Get a Quote" : "Order on WhatsApp"}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-brand-gray">
            Prefer to talk? Call <a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, "")}`} className="font-semibold text-brand-orange">{CONTACT.phonePrimary}</a> for bulk &amp; wholesale pricing.
          </p>
        </div>
      </div>
    </div>
  );
}
