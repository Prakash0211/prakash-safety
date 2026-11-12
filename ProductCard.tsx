import Link from "next/link";
import { formatINR } from "@/lib/utils";
import { PRICE_ON_REQUEST, discountPercent, visibleMrp, visiblePrice } from "@/lib/pricing";
import { AddToCartButton } from "./AddToCartButton";
import { ProductImage } from "./ProductImage";

export type CardProduct = {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  mrp: number | null;
  showPrice: boolean;
  images: string[];
  color?: string | null;
  inStock: boolean;
  category?: { name: string } | null;
};

export function ProductCard({ product }: { product: CardProduct }) {
  const img = product.images[0];
  const price = visiblePrice(product);
  const mrp = visibleMrp(product);
  const off = discountPercent(product);

  return (
    <article className="card card-hover group relative flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-brand-sand">
        <ProductImage
          src={img}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {/* Warm scrim so white badges and text keep contrast over any photo. */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {off > 0 && (
          <span className="tnum absolute left-2.5 top-2.5 rounded-md bg-brand-orange px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {off}% off
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-brand-black/90 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {product.category && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-grayLight">{product.category.name}</p>
        )}
        <h3 className="mt-1.5">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 text-sm font-semibold text-brand-ink transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 sm:text-base"
          >
            {/* Stretches the click target over the whole card. */}
            <span className="absolute inset-0" aria-hidden />
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          {price !== null ? (
            <>
              <span className="tnum text-lg font-bold text-brand-ink">{formatINR(price)}</span>
              {mrp !== null && <span className="tnum text-sm text-brand-grayLight line-through">{formatINR(mrp)}</span>}
            </>
          ) : (
            <span className="text-sm font-semibold text-brand-gray">{PRICE_ON_REQUEST}</span>
          )}
        </div>

        <div className="mt-3 flex-1" />
        <AddToCartButton
          product={{ id: product.id, name: product.name, slug: product.slug, price, image: img }}
          className="btn-primary relative z-[1] mt-1 w-full !py-2.5 text-sm"
        />
      </div>
    </article>
  );
}
