// Prakash Safety - Next.js config
// Author: Harsh Sharma
const securityHeaders = [
  // Vercel already sends this for custom domains; setting it here makes the
  // policy explicit and survives a move off Vercel.
  // NOTE: no `includeSubDomains` and no `preload` on purpose. Adding either
  // while a subdomain lacks a valid certificate (see the SSL section of the
  // README) would hard-block that subdomain in every browser that has visited
  // the apex, with no click-through. Only add them once every subdomain you
  // serve has its own working certificate.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lint is run separately via `npm run lint`; don't let a stylistic rule block production builds.
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
