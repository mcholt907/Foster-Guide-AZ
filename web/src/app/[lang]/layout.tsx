import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { BandShell } from "../../components/BandShell";
import { RootDocument } from "../../components/RootDocument";
import { baseMetadata, baseViewport } from "../../lib/siteMetadata";

// This is a ROOT layout (there is no app/layout.tsx): it renders <html> so the
// server-sent HTML carries lang="es" for /es/* pages. The `/` language picker
// has its own root layout in app/(picker)/layout.tsx.

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

// Only /en and /es exist; anything else is a 404 without rendering.
export const dynamicParams = false;

export const viewport: Viewport = baseViewport;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  // Only set canonical + hreflang for the homepage segment (/en, /es).
  // Sub-pages set their own correct alternates in their own layout.tsx files.
  if (lang === "es") {
    return {
      ...baseMetadata,
      title: "FosterHub AZ — Ayuda para Jóvenes en Cuidado de Crianza",
      description:
        "¿Tienes dudas sobre el cuidado de crianza? Aprende qué está pasando en tu caso, conoce tus derechos y planifica tu futuro. Gratis, y nada sale de tu dispositivo.",
      alternates: {
        canonical: "https://www.fosterhubaz.com/es",
        languages: { "en": "https://www.fosterhubaz.com/en", "es": "https://www.fosterhubaz.com/es" },
      },
      openGraph: { locale: "es_MX", alternateLocale: "en_US" },
    };
  }
  return {
    ...baseMetadata,
    title: "FosterHub AZ — Help for Arizona Foster Youth",
    description:
      "Confused about foster care? Learn what's happening in your case, find out your rights, and get help with what comes next. Free, and nothing leaves your device.",
    alternates: {
      canonical: "https://www.fosterhubaz.com/en",
      languages: { "en": "https://www.fosterhubaz.com/en", "es": "https://www.fosterhubaz.com/es" },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "es") notFound();

  return (
    <RootDocument lang={lang} bandScript>
      <div className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-[#1B3A5C] focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          {lang === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>
        <BandShell lang={lang}>{children}</BandShell>
      </div>
    </RootDocument>
  );
}
