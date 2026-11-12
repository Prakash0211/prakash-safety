import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const STD_FEATURES = [
  "High-visibility reflective tape",
  "Multi-utility pockets",
  "ID card pocket",
  "Pen holder pocket",
  "Front zip closure",
  "Lightweight & breathable",
];

const categories = [
  { slug: "safety-jackets", name: "Safety Jackets", sortOrder: 1, description: "High-visibility multi-pocket safety jackets with reflective tape." },
  { slug: "reflective-vests", name: "Reflective Vests", sortOrder: 2, description: "Lightweight reflective safety vests for high-visibility workwear." },
  { slug: "industrial-safety-products", name: "Industrial Safety Products", sortOrder: 3, description: "Industrial safety and protective equipment supplied PAN India." },
];

type P = { slug: string; name: string; img: string; cat: string; color: string; price: number; mrp: number; vest?: boolean; featured?: boolean; desc: string };

const products: P[] = [
  { slug: "hi-vis-green-multi-pocket-safety-jacket", name: "Hi-Vis Green Multi-Pocket Safety Jacket", img: "1.jpeg", cat: "safety-jackets", color: "Fluorescent Green", price: 240, mrp: 480, featured: true, desc: "Fluorescent green high-visibility safety jacket with grey reflective tape, multiple utility pockets and a smooth front zip. Built for construction, traffic and industrial site work." },
  { slug: "hi-vis-orange-multi-pocket-safety-jacket", name: "Hi-Vis Orange Multi-Pocket Safety Jacket", img: "2.jpeg", cat: "safety-jackets", color: "Fluorescent Orange", price: 240, mrp: 480, featured: true, desc: "Fluorescent orange multi-pocket safety jacket with reflective bands for maximum visibility, day or night. Durable fabric with reinforced front zip." },
  { slug: "orange-reflective-safety-vest", name: "Orange Reflective Safety Vest", img: "3.jpeg", cat: "reflective-vests", color: "Fluorescent Orange", price: 130, mrp: 260, vest: true, desc: "Lightweight orange reflective safety vest with breathable fabric and high-visibility reflective strips. Ideal for site visitors, logistics and traffic management." },
  { slug: "orange-industrial-safety-jacket", name: "Orange Industrial Safety Jacket", img: "4.jpeg", cat: "safety-jackets", color: "Fluorescent Orange", price: 230, mrp: 460, desc: "Orange industrial safety jacket with full-length reflective tape and front zip closure for dependable protection on demanding worksites." },
  { slug: "orange-economy-safety-vest", name: "Orange Economy Safety Vest", img: "5.jpeg", cat: "reflective-vests", color: "Fluorescent Orange", price: 95, mrp: 199, vest: true, desc: "Economy orange safety vest with black trim and reflective bands. A cost-effective high-visibility option for bulk requirements." },
  { slug: "green-safety-jacket-orange-reflective-tape", name: "Green Safety Jacket with Orange Reflective Tape", img: "6.jpeg", cat: "safety-jackets", color: "Green / Orange", price: 260, mrp: 520, featured: true, desc: "Distinctive green safety jacket with dual orange reflective tape for enhanced contrast and visibility. Multi-pocket design with sturdy front zip." },
  { slug: "green-multi-pocket-safety-jacket-premium", name: "Green Multi-Pocket Safety Jacket (Premium)", img: "7.jpeg", cat: "safety-jackets", color: "Fluorescent Green", price: 250, mrp: 500, desc: "Premium fluorescent green safety jacket with reflective tape, ID-card pocket and pen holder. Comfortable, breathable and built to last." },
  { slug: "orange-mesh-reflective-vest", name: "Orange Mesh Reflective Vest", img: "8.jpeg", cat: "reflective-vests", color: "Fluorescent Orange", price: 110, mrp: 230, vest: true, desc: "Breathable orange mesh reflective vest with black trim — light, airy and high-visibility for warm-weather site work." },
  { slug: "green-reflective-safety-jacket", name: "Green Reflective Safety Jacket", img: "9.jpeg", cat: "safety-jackets", color: "Fluorescent Green", price: 240, mrp: 480, desc: "Fluorescent green reflective safety jacket with multi-utility pockets and front zip. Reliable everyday high-visibility workwear." },
  { slug: "green-heavy-duty-multi-pocket-jacket", name: "Green Heavy-Duty Multi-Pocket Jacket", img: "10.jpeg", cat: "safety-jackets", color: "Fluorescent Green", price: 270, mrp: 540, desc: "Heavy-duty green safety jacket with large utility pockets and broad reflective bands for high-demand industrial environments." },
];

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
  }
  const cats = await prisma.category.findMany();
  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  for (const p of products) {
    const data = {
      name: p.name,
      slug: p.slug,
      description: p.desc,
      price: p.price,
      mrp: p.mrp,
      images: [`/products/${p.img}`],
      features: STD_FEATURES,
      color: p.color,
      sizes: p.vest ? ["Free Size", "L", "XL", "XXL"] : ["M", "L", "XL", "XXL"],
      inStock: true,
      featured: Boolean(p.featured),
      categoryId: bySlug[p.cat],
    };
    // showPrice is only set on first insert: re-running the seed must not undo
    // a price tag the admin has since switched on (or off) in the dashboard.
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, showPrice: false },
    });
  }

  await prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  console.log("Seeded", categories.length, "categories and", products.length, "products.");
  console.log("Prices are stored but hidden — switch a product's price tag on in Admin → Products to publish it.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
