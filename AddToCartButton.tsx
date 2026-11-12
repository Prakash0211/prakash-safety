"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";

type Props = {
  product: { id: string; name: string; slug: string; price: number | null; image?: string };
  size?: string;
  qty?: number;
  className?: string;
  label?: string;
};

export function AddToCartButton({ product, size, qty = 1, className = "btn-primary w-full", label }: Props) {
  // Unpriced products join the cart as an enquiry line, so say so.
  const text = label ?? (typeof product.price === "number" ? "Add to Cart" : "Add to Enquiry");
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add({ ...product, size }, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
    >
      {added ? "Added ✓" : text}
    </button>
  );
}
