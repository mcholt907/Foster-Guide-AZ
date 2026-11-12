import type { Metadata } from "next";
import { baseMetadata } from "../../../lib/siteMetadata";

// Metadata only: this route's page is a client component, so its title,
// description, canonical and hreflang links live here.
const SITE = "https://www.fosterhubaz.com";
const PATH = "/team";

const COPY = {
  en: {
    title: "Your Team: Who's Who in Your Foster Care Case",
    description:
      "Meet the people on your team — your caseworker, your lawyer, the judge, and more. Find out what each one does and what you can ask them.",
  },
  es: {
    title: "Tu equipo: quién es quién en tu caso de cuidado de crianza",
    description:
      "Conoce a las personas de tu equipo — tu trabajador/a de casos, tu abogado/a, el juez y más. Aprende qué hace cada persona y qué le puedes pedir.",
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
