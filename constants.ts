// Central business + site config. Reads public env with sensible fallbacks.
export const SITE = {
  name: "Prakash Safety",
  legalName: "Prakash Safety",
  tagline: "Your Safety, Our Responsibility",
  description:
    "Prakash Safety is a trusted safety jacket manufacturer and industrial safety products supplier, delivering high-visibility reflective workwear built for protection, visibility and comfort across India.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://prakashsafety.com",
  established: 2005,
  gst: "09AQGPS6695B1ZD",
};

export const CONTACT = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919458778082",
  phonePrimary: process.env.NEXT_PUBLIC_PHONE_PRIMARY || "+91 94587 78082",
  phoneSecondary: process.env.NEXT_PUBLIC_PHONE_SECONDARY || "+91 84334 09430",
  email: process.env.NEXT_PUBLIC_EMAIL || "prakashsafetyproducts@gmail.com",
  instagram: "https://www.instagram.com/prakash.safety",
  address: {
    line1: "237, Royal Palm Green Colony",
    line2: "NH-58, Vedvyaspuri",
    city: "Meerut",
    pin: "250002",
    state: "Uttar Pradesh, India",
  },
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Why Choose Us", href: "/#why-choose-us" },
  { label: "Contact Us", href: "/contact" },
];

export const KEY_FACTS = [
  "Established in 2005",
  "Manufacturer, Supplier & Trading Company",
  "GST Registered Company",
  "Specialized in Safety Jackets & Reflective Workwear",
  "Supplier of Industrial Safety Products",
  "PAN India Supply Network",
];
