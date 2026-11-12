import type { Metadata } from "next";
import { RIGHTS } from "../../../data/rights";
import { baseMetadata } from "../../../lib/siteMetadata";

const SITE = "https://www.fosterhubaz.com";
const PATH = "/rights";

// The count comes from the data, so the description never goes stale when a
// right is added to data/rights.ts.
const COUNT = RIGHTS.length;

const COPY = {
  en: {
    title: "What Are Your Rights in Foster Care?",
    description: `Arizona law gives you real rights in foster care. Read all ${COUNT} in plain words — like being safe, seeing your siblings, your privacy, and having a say in your case.`,
  },
  es: {
    title: "¿Cuáles son tus derechos en el cuidado de crianza?",
    description: `La ley de Arizona te da derechos reales en el cuidado de crianza. Lee los ${COUNT} en palabras sencillas — como estar a salvo, ver a tus hermanos y tener voz en tu caso.`,
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang === "es" ? "es" : "en";
  const { title, description } = COPY[l];
  const url = `${SITE}/${l}${PATH}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: `${SITE}/en${PATH}`, es: `${SITE}/es${PATH}`, "x-default": `${SITE}/en${PATH}` },
    },
    // Set in full: a child `openGraph` replaces the parent's, image included.
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url,
      locale: l === "es" ? "es_MX" : "en_US",
      alternateLocale: l === "es" ? "en_US" : "es_MX",
    },
    twitter: { ...baseMetadata.twitter, title, description },
  };
}

// The page shows the 13-15 wording when no age has been picked (search engines,
// first visits), so the FAQ data uses the same tier and matches what is on screen.
const FAQ_TIER = "13-15" as const;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isEs = lang === "es";

  // One FAQ entry per right in data/rights.ts — all of them, built from the data.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: isEs ? "es" : "en",
    mainEntity: RIGHTS.map((right) => {
      const tier = right.tiers[FAQ_TIER];
      return {
        "@type": "Question",
        name: isEs ? `${right.title_es} (${right.citation})` : `${right.title} (${right.citation})`,
        acceptedAnswer: {
          "@type": "Answer",
          text: isEs ? `${tier.plain_es} ${tier.example_es}` : `${tier.plain} ${tier.example}`,
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so data text can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
