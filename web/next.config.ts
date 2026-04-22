import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy — no third-party scripts, no analytics. 'unsafe-inline'
// is required for Next.js hydration payload and Tailwind v4 injected styles, since
// we rely on static rendering (a nonce-based CSP would force every page dynamic).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  trailingSlash: false,
  // Empty turbopack config silences the "webpack config present" warning in Next.js 16
  turbopack: {},
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/en/:path*", headers: [{ key: "Content-Language", value: "en" }] },
      { source: "/es/:path*", headers: [{ key: "Content-Language", value: "es" }] },
    ];
  },
};

export default withPWA(nextConfig);
