import { CONTACT } from "./constants";
import { formatINR } from "./utils";
import { PRICE_ON_REQUEST } from "./pricing";

export type WaItem = { name: string; qty: number; price: number | null };

// Builds a wa.me link with a prefilled order/enquiry message. Items without a
// price are listed as quote-on-request and left out of the indicative total.
export function buildWhatsAppOrderLink(
  items: WaItem[],
  total: number,
  customer?: { name?: string; phone?: string },
  number?: string
) {
  const unpriced = items.some((i) => typeof i.price !== "number");
  const priced = items.some((i) => typeof i.price === "number");
  const lines = [
    "Hello Prakash Safety, I would like to order:",
    "",
    ...items.map(
      (i, n) =>
        `${n + 1}. ${i.name} — Qty ${i.qty} × ${typeof i.price === "number" ? formatINR(i.price) : PRICE_ON_REQUEST}`
    ),
    "",
    priced
      ? `Total${unpriced ? " (priced items only)" : ""}: ${formatINR(total)}`
      : "Total: to be quoted",
  ];
  if (customer?.name) lines.push("", `Name: ${customer.name}`);
  if (customer?.phone) lines.push(`Phone: ${customer.phone}`);
  lines.push("", unpriced ? "Please share a quote for the items above." : "Please confirm availability and bulk pricing.");
  const num = (number || CONTACT.whatsapp).replace(/\D/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildWhatsAppEnquiryLink(text: string, number?: string) {
  const num = (number || CONTACT.whatsapp).replace(/\D/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
