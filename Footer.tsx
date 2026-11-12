import Link from "next/link";
import { Logo } from "./Logo";
import { SITE, CONTACT, NAV } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-[1] bg-brand-black text-white/70">
      <div className="container-px grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo variant="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            Trusted manufacturer of high-quality safety jackets and reflective workwear, committed to protecting lives
            and building safer workplaces across India.
          </p>
        </div>

        <div className="lg:col-span-2">
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Quick links</h3>
          <ul className="space-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-white/60 transition-colors hover:text-brand-orange">{n.label}</Link>
              </li>
            ))}
            <li><Link href="/products" className="text-white/60 transition-colors hover:text-brand-orange">All Products</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Contact us</h3>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, "")}`} className="tnum transition-colors hover:text-brand-orange">{CONTACT.phonePrimary}</a></li>
            <li><a href={`tel:${CONTACT.phoneSecondary.replace(/\s/g, "")}`} className="tnum transition-colors hover:text-brand-orange">{CONTACT.phoneSecondary}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-brand-orange">{CONTACT.email}</a></li>
            <li className="pt-1 leading-relaxed">
              {CONTACT.address.line1}, {CONTACT.address.line2}<br />
              {CONTACT.address.city} – {CONTACT.address.pin}, {CONTACT.address.state}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Follow us</h3>
          <div className="flex gap-3">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors duration-200 hover:bg-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86 0 3.2 0 3.58-.07 4.85-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.86.07-3.2 0-3.58 0-4.85-.07-1.17-.05-1.81-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.58 2.2 15.2 2.2 12c0-3.2 0-3.58.07-4.85.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5 0-4.74.07-.9.04-1.38.2-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.81-.32 1.71C3.4 8.5 3.4 8.85 3.4 12c0 3.15 0 3.5.07 4.74.04.9.2 1.38.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.81.28 1.71.32 1.24.07 1.59.07 4.74.07 3.15 0 3.5 0 4.74-.07.9-.04 1.38-.2 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.81.32-1.71.07-1.24.07-1.59.07-4.74 0-3.15 0-3.5-.07-4.74-.04-.9-.2-1.38-.32-1.71a2.86 2.86 0 0 0-.69-1.06 2.86 2.86 0 0 0-1.06-.69c-.33-.13-.81-.28-1.71-.32C15.5 4 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06Zm0 8.14A3.2 3.2 0 1 0 8.8 12 3.2 3.2 0 0 0 12 15.2Zm5.14-8.34a1.15 1.15 0 1 1-1.15-1.15 1.15 1.15 0 0 1 1.15 1.15Z" /></svg>
            </a>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors duration-200 hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.06 24l1.68-6.13a11.82 11.82 0 0 1-1.58-5.92C.16 5.34 5.5 0 12.06 0a11.82 11.82 0 0 1 8.42 3.49 11.82 11.82 0 0 1 3.48 8.42c0 6.55-5.33 11.89-11.9 11.89a11.9 11.9 0 0 1-5.68-1.45L.06 24Zm6.6-3.8c1.68.99 3.28 1.58 5.39 1.58 5.45 0 9.89-4.43 9.9-9.88a9.88 9.88 0 0 0-16.86-7A9.88 9.88 0 0 0 2.4 15.74l-.99 3.62 3.7-.97.55.33Zm11.39-5.55c-.07-.12-.27-.2-.56-.34-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.19-.24-.57-.48-.5-.66-.51l-.56-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.86 1.21 3.06.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41Z" /></svg>
            </a>
            <a href={`mailto:${CONTACT.email}`} aria-label="Email" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors duration-200 hover:bg-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/40 sm:flex-row">
          <p className="tnum">© {year} {SITE.name}. All rights reserved.</p>
          <p className="tnum">GST: {SITE.gst}</p>
          <p className="text-white/30">created by hrsraiden</p>
        </div>
      </div>
    </footer>
  );
}
