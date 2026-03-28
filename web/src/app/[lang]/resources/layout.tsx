import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "Encuentra Recursos",
      description: "Organizaciones en Arizona que apoyan a jóvenes en cuidado adoptivo — filtradas por edad y condado. Ayuda legal, vivienda, salud mental, educación y más.",
      alternates: { canonical: "https://fosterhubaz.com/es/resources" },
    };
  }
  return {
    title: "Find Resources",
    description: "Arizona organizations that support foster youth — filtered by your age and county. Legal aid, housing, mental health, education, and more.",
    alternates: { canonical: "https://fosterhubaz.com/en/resources" },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
