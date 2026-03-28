import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "Mi Caso Explicado",
      description: "Entiende tus audiencias en el tribunal de dependencia de Arizona — qué significa cada una, quién participa y cómo prepararte.",
      alternates: { canonical: "https://fosterhubaz.com/es/case" },
    };
  }
  return {
    title: "My Case Explained",
    description: "Understand your Arizona dependency court hearings — what each one means, who's involved, and how to prepare. Plain language for foster youth.",
    alternates: { canonical: "https://fosterhubaz.com/en/case" },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
