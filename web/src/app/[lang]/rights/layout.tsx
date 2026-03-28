import type { Metadata } from "next";

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
      alternates: { canonical: "https://fosterhubaz.com/es/rights" },
    };
  }
  return {
    title: "Your Rights",
    description: "Understand your legal rights as a foster youth in Arizona under A.R.S. §8-529 — in plain language, with real examples.",
    alternates: { canonical: "https://fosterhubaz.com/en/rights" },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
