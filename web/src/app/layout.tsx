import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FosterHub AZ — Know Your Rights",
  description:
    "Know your rights, understand your case, and plan your future — for Arizona foster youth ages 10–21. Free, private, bilingual.",
  keywords: ["foster care", "Arizona", "foster youth", "rights", "DCS", "dependency court"],
  openGraph: {
    title: "FosterHub AZ",
    description: "Know your rights, understand your case, and plan your future.",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon-192.svg",
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
