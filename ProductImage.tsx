import Image from "next/image";

/**
 * Product photo with a neutral fallback. Products without an image used to fall
 * back to /brand/hero-orange.jpeg, which is a marketing flyer — showing that in
 * a product slot reads as a mistake, so an empty slot is drawn instead.
 */
export function ProductImage({
  src,
  alt,
  sizes,
  priority,
  className = "object-cover",
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-brand-sand text-brand-lineStrong" role="img" aria-label={`${alt} — no photo available`}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-4.5-4.5L7 20" />
        </svg>
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
}
