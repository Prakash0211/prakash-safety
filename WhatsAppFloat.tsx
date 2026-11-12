import { CONTACT } from "@/lib/constants";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hello Prakash Safety, I have an enquiry about your safety products.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(22,101,52,0.6)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 active:translate-y-0"
    >
      <svg width="22" height="22" aria-hidden viewBox="0 0 24 24" fill="currentColor"><path d="M.06 24l1.68-6.13a11.82 11.82 0 0 1-1.58-5.92C.16 5.34 5.5 0 12.06 0a11.82 11.82 0 0 1 8.42 3.49 11.82 11.82 0 0 1 3.48 8.42c0 6.55-5.33 11.89-11.9 11.89a11.9 11.9 0 0 1-5.68-1.45L.06 24Zm6.6-3.8c1.68.99 3.28 1.58 5.39 1.58 5.45 0 9.89-4.43 9.9-9.88a9.88 9.88 0 0 0-16.86-7A9.88 9.88 0 0 0 2.4 15.74l-.99 3.62 3.7-.97.55.33Z" /></svg>
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
