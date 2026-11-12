import { prisma } from "./prisma";

export type SiteSettings = {
  id: number;
  onlinePayment: boolean;
  whatsappNumber: string;
  announcement: string | null;
  heroHeadline: string;
  heroSubtext: string;
};

const DEFAULTS: SiteSettings = {
  id: 1,
  onlinePayment: false,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919458778082",
  announcement: null,
  heroHeadline: "Safety That Stands Out",
  heroSubtext: "High visibility. Maximum protection. Built for every job that matters.",
};

// Read-only: the settings row is created lazily by the admin save (and by the
// seed), so a storefront render never writes to the database.
// Never crash the page if the DB is unreachable (e.g. during build) — fall back to defaults.
export async function getSettings(): Promise<SiteSettings> {
  try {
    return (await prisma.settings.findUnique({ where: { id: 1 } })) ?? DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
