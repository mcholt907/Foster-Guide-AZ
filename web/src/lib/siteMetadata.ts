import type { Metadata, Viewport } from "next";

// Shared by both root layouts: `app/(picker)/layout.tsx` (the `/` language
// picker) and `app/[lang]/layout.tsx` (every /en and /es page). There are two
// root layouts so the server can send <html lang="es"> for Spanish pages.

export const baseMetadata: Metadata = {
  metadataBase: new URL("https://www.fosterhubaz.com"),
  description:
    "Confused about foster care? Get answers about your rights, what happens in court, and what comes next — made for Arizona youth ages 10 to 21. Free, and nothing leaves your device.",
  keywords: [
    "foster care Arizona", "foster youth rights", "Arizona DCS", "dependency court",
    "foster care rights", "foster youth resources", "Arizona foster care law",
    "A.R.S. 8-529", "Education Training Voucher Arizona", "ETV Arizona",
    "foster care help", "CASA Arizona", "foster youth support",
  ],
  openGraph: {
    title: "FosterHub AZ — Help for Arizona Foster Youth",
    description: "Confused about foster care? Get answers about your rights, what happens in court, and what comes next — made for Arizona youth ages 10 to 21.",
    url: "https://www.fosterhubaz.com",
    siteName: "FosterHub AZ",
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "FosterHub AZ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FosterHub AZ — Know Your Rights",
    description: "A free, private resource for Arizona foster youth ages 10–21.",
    images: ["/opengraph-image"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FosterHub",
  },
};

// No `maximumScale` — pinch-zoom must stay available (WCAG 1.4.4).
export const baseViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2A7F8E",
};
