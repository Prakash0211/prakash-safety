import { formatINR } from "./utils";

// A product's price is optional and hidden by default. The storefront only ever
// shows a figure when the admin has explicitly switched the price tag on AND a
// price is actually set — everything else reads "Price on request".
export const PRICE_ON_REQUEST = "Price on request";

export type Priceable = { price: number | null; showPrice: boolean };

export function hasPrice(p: Priceable): p is Priceable & { price: number } {
  return p.showPrice && typeof p.price === "number";
}

/** Visible unit price, or null when the product is quote-on-request. */
export function visiblePrice(p: Priceable): number | null {
  return hasPrice(p) ? p.price : null;
}

/** Strike-through MRP, only when it is meaningful next to a visible price. */
export function visibleMrp(p: Priceable & { mrp: number | null }): number | null {
  const price = visiblePrice(p);
  return price !== null && p.mrp && p.mrp > price ? p.mrp : null;
}

export function discountPercent(p: Priceable & { mrp: number | null }): number {
  const price = visiblePrice(p);
  const mrp = visibleMrp(p);
  if (price === null || mrp === null) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/** Money for a known amount, the request label otherwise. */
export function formatPrice(amount: number | null | undefined) {
  return typeof amount === "number" ? formatINR(amount) : PRICE_ON_REQUEST;
}

/** Line total for a cart/order row; null when the unit price is unknown. */
export function lineTotal(price: number | null | undefined, qty: number) {
  return typeof price === "number" ? price * qty : null;
}
