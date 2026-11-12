import type { Metadata, Viewport } from "next";
import { RootDocument } from "../../components/RootDocument";
import { baseMetadata, baseViewport } from "../../lib/siteMetadata";

// Root layout for `/` only (the language picker). Every /en and /es page uses
// the other root layout, `app/[lang]/layout.tsx`, which sets <html lang> from
// the URL. Moving between the two is a full page load.

export const metadata: Metadata = {
  ...baseMetadata,
  title: "FosterHub AZ — Help for Arizona Foster Youth",
  alternates: {
    canonical: "https://www.fosterhubaz.com",
    languages: {
      "en": "https://www.fosterhubaz.com/en",
      "es": "https://www.fosterhubaz.com/es",
      "x-default": "https://www.fosterhubaz.com",
    },
  },
};

export const viewport: Viewport = baseViewport;

export default function PickerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
