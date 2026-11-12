"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type S = { onlinePayment: boolean; whatsappNumber: string; announcement: string | null; heroHeadline: string; heroSubtext: string };

export function SettingsForm({ initial, razorpayReady }: { initial: S; razorpayReady: boolean }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const set = (k: keyof S, v: any) => setS((p) => ({ ...p, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    if (res.ok) { setMsg("Saved ✓"); router.refresh(); } else setMsg("Save failed");
    setBusy(false);
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      <div className="card p-5 space-y-4">
        <h2 className="font-bold">Payment</h2>
        <label className="flex items-start gap-3">
          <input type="checkbox" checked={s.onlinePayment} onChange={(e) => set("onlinePayment", e.target.checked)} className="mt-1" disabled={!razorpayReady} />
          <span>
            <span className="font-semibold">Enable online payment (Razorpay)</span>
            <span className="block text-sm text-brand-gray">
              {razorpayReady
                ? "When on, customers can pay online at checkout. When off, checkout uses WhatsApp ordering only."
                : "Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment to enable this."}
            </span>
          </span>
        </label>
        <div><label className="label">WhatsApp number (for orders)</label><input className="input" value={s.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="919458778082" /><p className="mt-1 text-xs text-brand-gray">Country code + number, digits only.</p></div>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="font-bold">Homepage</h2>
        <div><label className="label">Hero headline</label><input className="input" value={s.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} /></div>
        <div><label className="label">Hero subtext</label><textarea className="input" rows={2} value={s.heroSubtext} onChange={(e) => set("heroSubtext", e.target.value)} /></div>
        <div><label className="label">Announcement bar (optional)</label><input className="input" value={s.announcement ?? ""} onChange={(e) => set("announcement", e.target.value)} placeholder="e.g. Bulk discounts available this month" /></div>
      </div>

      <div className="flex items-center gap-3">
        <button disabled={busy} className="btn-primary">{busy ? "Saving…" : "Save Settings"}</button>
        {msg && <span className="text-sm font-medium text-green-600">{msg}</span>}
      </div>
    </form>
  );
}
