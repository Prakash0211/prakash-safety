import type { Config } from "tailwindcss";

// Brand theme: hi-vis orange on a warm neutral ground (Prakash Safety).
// The neutrals carry a slight warm tint so nothing clashes with the orange —
// no cool grays mixed in with warm accents.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Hi-vis orange is the product, not a decorative accent — it stays at
          // full saturation on purpose.
          orange: "#F26522",
          orangeDark: "#D9531A",
          orangeLight: "#FF7A3C",
          black: "#12100E",
          ink: "#1A1714",
          gray: "#6E6862",
          grayLight: "#918A83",
          line: "#E7E2DC",
          lineStrong: "#D6CFC6",
          paper: "#FBF9F7",
          sand: "#F4F0EB",
        },
        hivis: { green: "#C6E600", orange: "#F26522" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-archivo)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: { tighter2: "-0.035em" },
      container: {
        center: true,
        padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
        screens: { "2xl": "1280px" },
      },
      boxShadow: {
        // Warm-tinted, matching the paper ground rather than generic black.
        card: "0 1px 2px rgba(41,31,22,0.05), 0 8px 24px -12px rgba(41,31,22,0.10)",
        cardHover: "0 2px 4px rgba(41,31,22,0.06), 0 18px 40px -16px rgba(41,31,22,0.22)",
        lift: "0 24px 60px -28px rgba(41,31,22,0.38)",
        glow: "0 12px 32px -12px rgba(242,101,34,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        marquee: "marquee 34s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
