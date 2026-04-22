import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BottomNav, SideNav } from "../../components/BottomNav";
import { LangSync } from "../../components/LangSync";
import { LegalFooter } from "../../components/LegalFooter";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

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
      title: "FosterHub AZ — Ayuda para Jóvenes en Cuidado Adoptivo",
      description:
        "¿Confundido sobre el cuidado adoptivo? Aprende qué está pasando en tu caso, conoce tus derechos y planifica tu futuro. Gratis, nada se guarda.",
      alternates: {
        canonical: "https://www.fosterhubaz.com/es",
        languages: { "en": "https://www.fosterhubaz.com/en", "es": "https://www.fosterhubaz.com/es" },
      },
      openGraph: { locale: "es_MX", alternateLocale: "en_US" },
    };
  }
  return {
    title: "FosterHub AZ — Help for Arizona Foster Youth",
    description:
      "Confused about foster care? Learn what's happening in your case, find out your rights, and get help with what comes next. Free, nothing is saved.",
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
    <div className="min-h-screen">
      <LangSync lang={lang as "en" | "es"} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-[#1B3A5C] focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        {lang === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>
      <SideNav lang={lang as "en" | "es"} />
      <main id="main-content" tabIndex={-1} className="pb-32 md:pb-8 md:pl-40 focus:outline-none">
        <div className="w-full max-w-lg mx-auto px-4 pt-4">
          {children}
          <LegalFooter lang={lang as "en" | "es"} />
        </div>
      </main>
      <BottomNav lang={lang as "en" | "es"} />
    </div>
  );
}
