"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Cat = { id: string; name: string; slug: string; description: string | null; sortOrder: number; _count: { products: number } };

export function CategoryManager({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, sortOrder }) });
    if (res.ok) { setName(""); setSortOrder(0); router.refresh(); }
    else { const d = await res.json(); setErr(d.error || "Failed"); }
    setBusy(false);
  }

  async function rename(c: Cat) {
    const newName = prompt("Category name", c.name);
    if (!newName) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName, sortOrder: c.sortOrder }) });
    if (res.ok) router.refresh(); else alert("Update failed");
  }

  async function del(c: Cat) {
    if (!confirm(`Delete "${c.name}"? Products will be uncategorised.`)) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    if (res.ok) router.refresh(); else alert("Delete failed");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={add} className="card h-fit p-5 space-y-3">
        <h2 className="font-bold">Add Category</h2>
        <div><label className="label">Name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label className="label">Sort order</label><input className="input" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="btn-primary w-full">{busy ? "Adding…" : "Add Category"}</button>
      </form>

      <div className="card overflow-x-auto lg:col-span-2">
        <table className="w-full text-sm">
          <thead className="border-b border-brand-line bg-gray-50 text-left text-xs uppercase text-brand-gray">
            <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Products</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-brand-line">
            {initial.map((c) => (
              <tr key={c.id}>
                <td className="p-3 font-semibold">{c.name}</td>
                <td className="p-3 text-brand-gray">{c.slug}</td>
                <td className="p-3">{c._count.products}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => rename(c)} className="rounded-md border border-brand-line px-3 py-1.5 text-xs font-semibold hover:border-brand-orange hover:text-brand-orange">Rename</button>
                    <button onClick={() => del(c)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {initial.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-brand-gray">No categories yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
