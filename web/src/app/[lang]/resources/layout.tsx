import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "Encuentra Ayuda Cerca de Ti — Arizona",
      description: "Organizaciones reales en Arizona que ayudan a jóvenes en cuidado adoptivo con vivienda, escuela, ayuda legal, trabajo y más. Filtradas para tu edad y condado.",
      alternates: { canonical: "https://www.fosterhubaz.com/es/resources", languages: { "en": "https://www.fosterhubaz.com/en/resources", "es": "https://www.fosterhubaz.com/es/resources" } },
    };
  }
  return {
    title: "Find Help Near You — Arizona Foster Youth Resources",
    description: "Real organizations in Arizona that help foster youth with housing, school, legal help, jobs, and more. Filtered for your age and county — free to use.",
    alternates: { canonical: "https://www.fosterhubaz.com/en/resources", languages: { "en": "https://www.fosterhubaz.com/en/resources", "es": "https://www.fosterhubaz.com/es/resources" } },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
