import type { Metadata } from "next";
import { RIGHTS } from "../../../data/rights";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "¿Cuáles son mis derechos en el cuidado adoptivo?",
      description: "La ley de Arizona te da derechos reales — como hablar con tu abogado, ver a tus hermanos y tener voz en tu caso. Descúbrelos en palabras sencillas.",
      alternates: { canonical: "https://www.fosterhubaz.com/es/rights", languages: { "en": "https://www.fosterhubaz.com/en/rights", "es": "https://www.fosterhubaz.com/es/rights" } },
    };
  }
  return {
    title: "What Are My Rights in Foster Care?",
    description: "Arizona law gives you real rights — like the right to talk to your lawyer, see your siblings, and have a say in your case. Find out what they are, in plain words.",
    alternates: { canonical: "https://www.fosterhubaz.com/en/rights", languages: { "en": "https://www.fosterhubaz.com/en/rights", "es": "https://www.fosterhubaz.com/es/rights" } },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isEs = lang === "es";

  // FAQPage schema using the 16-17 tier as the default plain-language voice
  const faqItems = RIGHTS.map((right) => ({
    "@type": "Question",
    name: isEs
      ? `${right.title_es} — ${right.citation}`
      : `${right.title} (${right.citation})`,
    acceptedAnswer: {
      "@type": "Answer",
      text: isEs
        ? right.tiers["16-17"].plain_es
        : right.tiers["16-17"].plain,
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
