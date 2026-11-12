"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = { id: string; name: string };
export type ProductInput = {
  id?: string; name: string; slug?: string; description: string;
  price: number | null; mrp: number | null; showPrice: boolean; images: string[]; features: string[];
  color: string | null; sizes: string[]; sku: string | null;
  inStock: boolean; featured: boolean; categoryId: string | null;
};

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductInput }) {
  const router = useRouter();
  const [f, setF] = useState<ProductInput>(
    // New products start with no price and the price tag switched off.
    initial || { name: "", description: "", price: null, mrp: null, showPrice: false, images: [], features: [], color: "", sizes: [], sku: "", inStock: true, featured: false, categoryId: categories[0]?.id || null }
  );
  const [featuresText, setFeaturesText] = useState((initial?.features || []).join("\n"));
  const [sizesText, setSizesText] = useState((initial?.sizes || []).join(", "));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof ProductInput, v: any) => setF((p) => ({ ...p, [k]: v }));

  async function upload(file: File) {
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error || "Upload failed");
    return d.url as string;
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setErr("");
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await upload(file));
      set("images", [...f.images, ...urls]);
    } catch (e: any) { setErr(e.message); }
    e.target.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    if (f.showPrice && f.price === null) {
      setErr("Enter a price, or switch the price tag off to show “Price on request”.");
      setBusy(false);
      return;
    }
    const payload = {
      ...f,
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      sizes: sizesText.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const url = initial?.id ? `/api/admin/products/${initial.id}` : "/api/admin/products";
    try {
      const res = await fetch(url, { method: initial?.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Save failed"); }
      router.push("/admin/products"); router.refresh();
    } catch (e: any) { setErr(e.message); setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      <div className="card p-5 space-y-4">
        <div><label className="label">Product Name *</label><input className="input" value={f.name} onChange={(e) => set("name", e.target.value)} required /></div>
        <div><label className="label">Description</label><textarea className="input" rows={3} value={f.description} onChange={(e) => set("description", e.target.value)} /></div>
        <div><label className="label">Category</label>
          <select className="input" value={f.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value || null)}>
            <option value="">— None —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Colour</label><input className="input" value={f.color ?? ""} onChange={(e) => set("color", e.target.value)} /></div>
          <div><label className="label">SKU</label><input className="input" value={f.sku ?? ""} onChange={(e) => set("sku", e.target.value)} /></div>
        </div>
        <div><label className="label">Sizes (comma separated)</label><input className="input" value={sizesText} onChange={(e) => setSizesText(e.target.value)} placeholder="M, L, XL, XXL" /></div>
        <div><label className="label">Features (one per line)</label><textarea className="input" rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} /></div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-brand-ink">Pricing</h2>
            <p className="mt-1 text-sm text-brand-gray">
              Off by default. While the price tag is off the storefront shows “Price on request” and the item is added to the cart as an enquiry line.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={f.showPrice}
            aria-label="Show price on website"
            onClick={() => set("showPrice", !f.showPrice)}
            className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors ${f.showPrice ? "bg-brand-orange" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${f.showPrice ? "translate-x-[22px]" : "translate-x-0.5"}`} />
          </button>
        </div>
        {f.showPrice ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Price (₹) *</label>
              <input className="input" type="number" min={0} value={f.price ?? ""} onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))} placeholder="240" />
            </div>
            <div>
              <label className="label">MRP (₹)</label>
              <input className="input" type="number" min={0} value={f.mrp ?? ""} onChange={(e) => set("mrp", e.target.value === "" ? null : Number(e.target.value))} placeholder="480" />
              <p className="mt-1 text-xs text-brand-gray">Shown struck through when higher than the price.</p>
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium text-brand-gray">
            Showing “Price on request”{f.price !== null ? ` · saved price ₹${f.price} stays hidden` : ""}
          </p>
        )}
      </div>

      <div className="card p-5">
        <label className="label">Images</label>
        <div className="flex flex-wrap gap-3">
          {f.images.map((src) => (
            <div key={src} className="relative h-24 w-24 overflow-hidden rounded-lg border border-brand-line">
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              <button type="button" onClick={() => set("images", f.images.filter((i) => i !== src))} className="absolute right-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white">✕</button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-brand-line text-sm text-brand-gray hover:border-brand-orange">
            + Upload
            <input type="file" accept="image/*" multiple className="hidden" onChange={onFile} />
          </label>
        </div>
        <p className="mt-2 text-xs text-brand-gray">JPG/PNG/WebP up to 5MB each. In production these upload to Vercel Blob.</p>
      </div>

      <div className="card flex flex-wrap gap-6 p-5">
        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={f.inStock} onChange={(e) => set("inStock", e.target.checked)} /> In stock</label>
        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured on homepage</label>
      </div>

      {err && <p className="text-sm font-medium text-red-600">{err}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="btn-primary">{busy ? "Saving…" : initial?.id ? "Update Product" : "Create Product"}</button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
