// Prakash Safety brand mark (SVG shield + wordmark). Author: Harsh Sharma
export function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "light"; className?: string }) {
  const word = variant === "light" ? "#ffffff" : "#111111";
  const tag = variant === "light" ? "#cbd5e1" : "#6B7280";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Prakash Safety">
      <svg width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <path d="M20 1.5 36.5 7v13.5C36.5 31 29.5 39 20 42.5 10.5 39 3.5 31 3.5 20.5V7L20 1.5Z" fill="#111111" />
        <path d="M20 4.5 33.5 9v11.4C33.5 29.2 27.7 36 20 39.2 12.3 36 6.5 29.2 6.5 20.4V9L20 4.5Z" fill="url(#psg)" />
        <path d="M14.5 13h7.2c3.4 0 5.6 2 5.6 5.1 0 3.1-2.2 5.1-5.6 5.1h-3.1V31h-4.1V13Zm4.1 3.4v3.6h2.6c1.2 0 2-.7 2-1.8s-.8-1.8-2-1.8h-2.6Z" fill="#ffffff" />
        <defs>
          <linearGradient id="psg" x1="6.5" y1="4.5" x2="33.5" y2="39.2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF7A3C" />
            <stop offset="1" stopColor="#D9531A" />
          </linearGradient>
        </defs>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: word }}>
          PRA<span style={{ color: "#F26522" }}>KASH</span>
        </span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] sm:text-[9px]" style={{ color: tag }}>
          Your Safety, Our Responsibility
        </span>
      </span>
    </span>
  );
}
