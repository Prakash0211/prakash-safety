"use client";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { ProductImage } from "./ProductImage";
import { formatINR } from "@/lib/utils";
import { PRICE_ON_REQUEST, discountPercent, visibleMrp, visiblePrice } from "@/lib/pricing";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

type P = {
  id: string; name: string; slug: string; description: string;
  price: number | null; mrp: number | null; showPrice: boolean; images: string[]; features: string[];
  sizes: string[]; color: string | null; inStock: boolean; sku: string | null;
  category: { name: string } | null;
};

export function ProductDetail({ product, whatsapp }: { product: P; whatsapp: string }) {
  const { add } = useCart();
  const [img, setImg] = useState<string | undefined>(product.images[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const price = visiblePrice(product);
  const mrp = visibleMrp(product);
  const off = discountPercent(product);
  const cartItem = { id: product.id, name: product.name, slug: product.slug, price, image: product.images[0] };
  const waName = `${product.name}${size ? ` (${size})` : ""}`;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-line bg-brand-sand">
          <ProductImage src={img} alt={product.name} priority sizes="(max-width:1024px) 100vw, 55vw" />
          {off > 0 && (
            <span className="tnum absolute left-3 top-3 rounded-md bg-brand-orange px-2.5 py-1 text-sm font-bold text-white">
              {off}% off
            </span>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setImg(src)}
                aria-label={`View image ${i + 1} of ${product.name}`}
                aria-pressed={img === src}
                className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 ${
                  img === src ? "border-brand-orange" : "border-brand-line hover:border-brand-lineStrong"
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-5">
        {product.category && <p className="eyebrow">{product.category.name}</p>}
        <h1 className="display mt-3 text-3xl text-brand-ink sm:text-4xl">{product.name}</h1>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          {price !== null ? (
            <>
              <span className="tnum font-display text-4xl font-extrabold tracking-tighter2 text-brand-ink">{formatINR(price)}</span>
              {mrp !== null && <span className="tnum text-lg text-brand-grayLight line-through">{formatINR(mrp)}</span>}
            </>
          ) : (
            <span className="font-display text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl">{PRICE_ON_REQUEST}</span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              product.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-green-600" : "bg-red-600"}`} aria-hidden />
            {product.inStock ? "In stock" : "Out of stock"}
          </span>
        </div>
        <p className="mt-2 text-sm text-brand-gray">
          {price !== null
            ? "Indicative per-piece price — contact us for bulk and wholesale rates."
            : "Tell us your quantity and we'll send per-piece and bulk rates."}
        </p>

        <dl className="mt-6 space-y-2 text-sm">
          {product.color && (
            <div className="flex gap-2">
              <dt className="font-semibold text-brand-ink">Colour</dt>
              <dd className="text-brand-gray">{product.color}</dd>
            </div>
          )}
          {product.sku && (
            <div className="flex gap-2">
              <dt className="font-semibold text-brand-ink">SKU</dt>
              <dd className="tnum text-brand-gray">{product.sku}</dd>
            </div>
          )}
        </dl>

        {product.sizes.length > 0 && (
          <fieldset className="mt-6">
            <legend className="label">Size</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`min-w-12 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 ${
                    size === s
                      ? "border-brand-orange bg-brand-orange text-white"
                      : "border-brand-line text-brand-ink hover:border-brand-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-6">
          <p className="label">Quantity</p>
          <div className="inline-flex items-center rounded-lg border border-brand-line bg-white">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-4 py-2.5 text-lg font-bold text-brand-ink transition-colors hover:text-brand-orange active:translate-y-px disabled:opacity-40"
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="tnum w-12 text-center font-semibold" aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(100000, q + 1))}
              className="px-4 py-2.5 text-lg font-bold text-brand-ink transition-colors hover:text-brand-orange active:translate-y-px"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="btn-primary flex-1"
            disabled={!product.inStock}
            onClick={() => {
              add({ ...cartItem, size }, qty);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
          >
            {added ? "Added ✓" : price !== null ? "Add to cart" : "Add to enquiry"}
          </button>
          <a
            href={buildWhatsAppOrderLink([{ name: waName, qty, price }], price !== null ? price * qty : 0, undefined, whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-green-600 text-white hover:bg-green-700 sm:flex-1"
          >
            {price !== null ? "Order on WhatsApp" : "Get a quote on WhatsApp"}
          </a>
        </div>

        {product.description && <p className="prose-lead mt-8">{product.description}</p>}

        {product.features.length > 0 && (
          <div className="mt-8 rounded-2xl border border-brand-line bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-grayLight">Key features</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-brand-gray">
                  <span className="mt-0.5 shrink-0 text-brand-orange" aria-hidden>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
