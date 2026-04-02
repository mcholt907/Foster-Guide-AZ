import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fosterhubaz.com"),
  title: {
    default: "FosterHub AZ — Help for Arizona Foster Youth",
    template: "%s — FosterHub AZ",
  },
  description:
    "Confused about foster care? Get answers about your rights, what happens in court, and what comes next — made for Arizona youth ages 10 to 21. Free, nothing is saved.",
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
    apple: "/icons/icon-192.svg",
  },
  alternates: {
    canonical: "https://www.fosterhubaz.com",
    languages: {
      "en": "https://www.fosterhubaz.com/en",
      "es": "https://www.fosterhubaz.com/es",
      "x-default": "https://www.fosterhubaz.com",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FosterHub",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2A7F8E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-full bg-[#F5F2EE] antialiased">{children}</body>
    </html>
  );
}
