import type { Metadata } from "next";
import { baseMetadata } from "../../../lib/siteMetadata";

// Metadata only: this route's page is a client component, so its title,
// description, canonical and hreflang links live here.
const SITE = "https://www.fosterhubaz.com";
const PATH = "/resources";

const COPY = {
  en: {
    title: "Find Help Near You — Arizona Foster Youth Resources",
    description:
      "Real organizations in Arizona that help foster youth with housing, school, legal help, jobs, and more. Filtered for your age and county — free to use.",
  },
  es: {
    title: "Ayuda cerca de ti para jóvenes en cuidado de crianza — Arizona",
    description:
      "Organizaciones reales en Arizona que ayudan a jóvenes en cuidado de crianza con vivienda, escuela, ayuda legal, trabajo y más. Filtradas para tu edad y condado.",
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
