"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="relative z-[1] flex min-h-screen bg-brand-paper">
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 transform bg-brand-black text-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center px-5 font-display text-lg font-extrabold tracking-tight">
          PRA<span className="text-brand-orange">KASH</span><span className="ml-2 text-xs font-normal text-gray-400">Admin</span>
        </div>
        <nav className="mt-2 flex flex-col gap-1 px-3">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black ${isActive(l.href) ? "bg-brand-orange text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-3">
          <Link href="/" className="block rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white">← View site</Link>
          <button onClick={logout} className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 active:translate-y-px">Log out</button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-brand-line bg-brand-paper/90 px-4 backdrop-blur-md lg:px-8">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange lg:hidden" aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="font-display text-lg font-bold tracking-tight text-brand-ink">{title}</h1>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
