"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  /** null when the product is quote-on-request rather than priced. */
  price: number | null;
  image?: string;
  size?: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  /** Sum of the priced lines only — unpriced lines are quoted by the team. */
  total: number;
  /** True when at least one line has no price and needs a manual quote. */
  hasUnpriced: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, size: string | undefined, qty: number) => void;
  remove: (id: string, size?: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ps_cart_v1";
const lineKey = (id: string, size?: string) => `${id}::${size || ""}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) {
        // Carts saved before prices became optional stored a number for every
        // line; normalise anything unusable to "quote on request".
        setItems(
          parsed
            .filter((i) => i && typeof i.id === "string" && typeof i.qty === "number")
            .map((i) => ({ ...i, price: typeof i.price === "number" ? i.price : null }))
        );
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const api: CartCtx = useMemo(() => {
    const add: CartCtx["add"] = (item, qty = 1) =>
      setItems((prev) => {
        const k = lineKey(item.id, item.size);
        const found = prev.find((p) => lineKey(p.id, p.size) === k);
        if (found) return prev.map((p) => (lineKey(p.id, p.size) === k ? { ...p, qty: p.qty + qty } : p));
        return [...prev, { ...item, qty }];
      });
    const setQty: CartCtx["setQty"] = (id, size, qty) =>
      setItems((prev) =>
        prev
          .map((p) => (lineKey(p.id, p.size) === lineKey(id, size) ? { ...p, qty: Math.max(1, qty) } : p))
          .filter((p) => p.qty > 0)
      );
    const remove: CartCtx["remove"] = (id, size) =>
      setItems((prev) => prev.filter((p) => lineKey(p.id, p.size) !== lineKey(id, size)));
    const clear = () => setItems([]);
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + (typeof i.price === "number" ? i.qty * i.price : 0), 0);
    const hasUnpriced = items.some((i) => typeof i.price !== "number");
    return { items, count, total, hasUnpriced, add, setQty, remove, clear };
  }, [items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
