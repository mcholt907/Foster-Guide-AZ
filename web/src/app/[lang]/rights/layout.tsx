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
      title: "Tus Derechos",
      description: "Conoce tus derechos legales bajo la ley de cuidado adoptivo de Arizona (A.R.S. §8-529) — en lenguaje sencillo, con ejemplos reales.",
      alternates: { canonical: "https://fosterhubaz.com/es/rights", languages: { "en": "https://fosterhubaz.com/en/rights", "es": "https://fosterhubaz.com/es/rights" } },
    };
  }
  return {
    title: "Your Rights",
    description: "Understand your legal rights as a foster youth in Arizona under A.R.S. §8-529 — in plain language, with real examples.",
    alternates: { canonical: "https://fosterhubaz.com/en/rights", languages: { "en": "https://fosterhubaz.com/en/rights", "es": "https://fosterhubaz.com/es/rights" } },
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
