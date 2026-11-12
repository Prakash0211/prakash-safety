"use client";
import { useState } from "react";

const OPTIONS = ["Safety Jackets", "Reflective Vests", "Industrial Safety Products", "Bulk / Wholesale Order", "Custom Requirement", "Other"];

export function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-bold text-green-700">Thank you! Your enquiry has been sent.</p>
        <p className="mt-2 text-sm text-green-700">Our team will get in touch with you shortly.</p>
        <button onClick={() => setStatus("idle")} className="btn-outline mt-5">Send another enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">Full Name *</label><input id="name" name="name" required className="input" placeholder="Your name" /></div>
        <div><label className="label" htmlFor="company">Company (optional)</label><input id="company" name="company" className="input" placeholder="Company name" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="phone">Mobile Number *</label><input id="phone" name="phone" required inputMode="tel" className="input" placeholder="+91 …" /></div>
        <div><label className="label" htmlFor="email">Email Address</label><input id="email" name="email" type="email" className="input" placeholder="you@example.com" /></div>
      </div>
      <div>
        <label className="label" htmlFor="productRequirement">Product Requirement</label>
        <select id="productRequirement" name="productRequirement" className="input" defaultValue="">
          <option value="" disabled>Select a product…</option>
          {OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div><label className="label" htmlFor="message">Tell us more about your requirement</label><textarea id="message" name="message" rows={4} className="input" placeholder="Quantity, sizes, colour, delivery location…" /></div>
      {status === "error" && <p className="text-sm font-medium text-red-600">Something went wrong. Please try again or call us directly.</p>}
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto">
        {status === "sending" ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="text-xs text-brand-gray">🔒 Your information is safe with us. We will never share your details.</p>
    </form>
  );
}
