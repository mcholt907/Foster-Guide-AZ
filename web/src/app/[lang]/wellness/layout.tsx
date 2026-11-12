import type { Metadata } from "next";
import { baseMetadata } from "../../../lib/siteMetadata";

// Metadata only: this route's page is a client component, so its title,
// description, canonical and hreflang links live here.
const SITE = "https://www.fosterhubaz.com";
const PATH = "/wellness";

const COPY = {
  en: {
    title: "Feeling Overwhelmed? Support for Foster Youth",
    description:
      "It's okay to not be okay. Find breathing exercises, grounding tools, and real people you can call right now — because you don't have to go through this alone.",
  },
  es: {
    title: "¿Te sientes abrumado/a? Apoyo para jóvenes en cuidado de crianza",
    description:
      "Está bien no estar bien. Encuentra ejercicios de respiración, herramientas para calmarte y personas reales a las que puedes llamar ahora mismo. No estás solo/a.",
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
