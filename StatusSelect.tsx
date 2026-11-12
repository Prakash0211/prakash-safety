"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StatusSelect({ url, value, options }: { url: string; value: string; options: string[] }) {
  const router = useRouter();
  const [val, setVal] = useState(value);
  const [busy, setBusy] = useState(false);

  async function change(next: string) {
    setBusy(true); setVal(next);
    const res = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    if (res.ok) router.refresh(); else { setVal(value); alert("Update failed"); }
    setBusy(false);
  }

  return (
    <select value={val} disabled={busy} onChange={(e) => change(e.target.value)} className="rounded-md border border-brand-line px-2 py-1 text-xs font-semibold focus:border-brand-orange focus:outline-none">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
