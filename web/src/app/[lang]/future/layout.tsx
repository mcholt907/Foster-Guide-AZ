import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "Mi Plan para el Futuro",
      description: "Planifica tu vida después del cuidado adoptivo en Arizona. Becas ETV, cuidado extendido hasta los 21, documentos importantes y recursos de vivienda.",
      alternates: { canonical: "https://www.fosterhubaz.com/es/future", languages: { "en": "https://www.fosterhubaz.com/en/future", "es": "https://www.fosterhubaz.com/es/future" } },
    };
  }
  return {
    title: "My Future Plan",
    description: "Plan for life after foster care in Arizona. Education and Training Vouchers (ETV), extended foster care to 21, important documents, and housing resources.",
    alternates: { canonical: "https://www.fosterhubaz.com/en/future", languages: { "en": "https://www.fosterhubaz.com/en/future", "es": "https://www.fosterhubaz.com/es/future" } },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
