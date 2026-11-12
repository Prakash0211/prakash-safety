import { prisma } from "./prisma";

// All storefront reads are wrapped so a missing/unreachable DB never breaks rendering.
export async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  } catch {
    return [];
  }
}

export async function getProducts(opts: { category?: string; featured?: boolean; take?: number } = {}) {
  try {
    return await prisma.product.findMany({
      where: {
        ...(opts.category ? { category: { slug: opts.category } } : {}),
        ...(opts.featured ? { featured: true } : {}),
      },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: opts.take,
    });
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  } catch {
    return null;
  }
}

export async function getRelated(categoryId: string | null, excludeId: string) {
  if (!categoryId) return [];
  try {
    return await prisma.product.findMany({
      where: { categoryId, id: { not: excludeId } },
      include: { category: { select: { name: true, slug: true } } },
      take: 4,
    });
  } catch {
    return [];
  }
}
