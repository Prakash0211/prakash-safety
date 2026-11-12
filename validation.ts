import { z } from "zod";

// "" and undefined both mean "no value"; anything else is coerced to a number.
const optionalRupees = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? null : v),
  z.coerce.number().int().nonnegative().nullable()
);

export const enquirySchema = z.object({
  name: z.string().min(1).max(120),
  company: z.string().max(160).optional().or(z.literal("")),
  phone: z.string().min(5).max(20),
  email: z.string().email().max(160).optional().or(z.literal("")),
  productRequirement: z.string().max(120).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
});

export const orderItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1).max(200),
  // null when the item is quoted on request rather than priced on the site.
  price: z.number().int().nonnegative().nullable().default(null),
  qty: z.number().int().positive().max(100000),
});

export const orderSchema = z.object({
  customerName: z.string().min(1).max(120),
  phone: z.string().min(5).max(20),
  email: z.string().email().max(160).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  // Indicative only — the server recomputes anything it charges for.
  total: z.number().int().nonnegative().default(0),
  paymentMethod: z.enum(["WHATSAPP", "RAZORPAY", "ENQUIRY"]).default("WHATSAPP"),
  items: z.array(orderItemSchema).min(1),
});

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().default(""),
  // Price is optional: a product can be launched with no price tag at all.
  price: optionalRupees.default(null),
  mrp: optionalRupees.default(null),
  // Price tag is off by default; the admin opts in per product.
  showPrice: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  color: z.string().max(80).optional().nullable(),
  sizes: z.array(z.string()).default([]),
  sku: z.string().max(80).optional().nullable(),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
})
  // A price tag can only be shown when there is a price to show.
  .refine((d) => !d.showPrice || d.price !== null, {
    message: "Set a price before switching the price tag on.",
    path: ["price"],
  });

export const categorySchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(1000).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export const settingsSchema = z.object({
  onlinePayment: z.boolean(),
  whatsappNumber: z.string().min(5).max(20),
  announcement: z.string().max(200).optional().nullable(),
  heroHeadline: z.string().min(1).max(120),
  heroSubtext: z.string().min(1).max(300),
});
