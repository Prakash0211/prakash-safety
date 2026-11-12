"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Generic edit/delete actions for admin list rows.
export function RowActions({ editHref, deleteUrl, confirmText = "Delete this item?" }: { editHref?: string; deleteUrl: string; confirmText?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!confirm(confirmText)) return;
    setBusy(true);
    const res = await fetch(deleteUrl, { method: "DELETE" });
    if (res.ok) router.refresh();
    else { alert("Delete failed"); setBusy(false); }
  }

  return (
    <div className="flex justify-end gap-2">
      {editHref && <Link href={editHref} className="rounded-md border border-brand-line px-3 py-1.5 text-xs font-semibold hover:border-brand-orange hover:text-brand-orange">Edit</Link>}
      <button onClick={del} disabled={busy} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
    </div>
  );
}
