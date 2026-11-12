import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KEY_FACTS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: "Established in 2005, Prakash Safety is a trusted safety jacket manufacturer and industrial safety products supplier serving industries across India.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-brand-black py-14 text-white sm:py-20">
        <div className="container-px max-w-3xl">
          <p className="eyebrow">About Us</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Enhancing workplace safety across India since 2005</h1>
          <p className="mt-5 text-lg text-gray-300">{SITE.tagline}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
            <Image src="/brand/hero-multicolour.jpeg" alt="Prakash safety jackets range" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl">Who We Are</h2>
            <div className="mt-4 space-y-4 text-brand-gray">
              <p>PRAKASH is a trusted Safety Jacket Manufacturer and Industrial Safety Products Supplier dedicated to enhancing workplace safety through quality-driven solutions.</p>
              <p>We specialize in high-visibility Safety Jackets, Reflective Workwear and Industrial Safety Products designed for protection, visibility and comfort.</p>
              <p>Serving construction, infrastructure, logistics, manufacturing and industrial sectors, we deliver reliable products, customized solutions and dependable service.</p>
              <p>Built on quality, trust and customer satisfaction, PRAKASH continues to support safer workplaces across India.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container-px">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Key Facts</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-ink">At a Glance</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KEY_FACTS.map((f) => (
              <div key={f} className="card flex items-start gap-3 p-6">
                <span className="mt-0.5 text-xl text-brand-orange">✓</span>
                <span className="font-semibold text-brand-ink">{f}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-brand-gray">GST Number: {SITE.gst}</p>
        </div>
      </section>

      <section className="bg-brand-orange">
        <div className="container-px flex flex-col items-center justify-between gap-4 py-10 text-center sm:flex-row sm:text-left">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Partner with a safety brand you can trust</h2>
          <Link href="/contact" className="btn bg-white text-brand-orange hover:bg-brand-black hover:text-white">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
