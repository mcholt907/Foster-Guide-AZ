import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "Bienestar",
      description: "Herramientas para ayudarte a sentirte estable y apoyado/a. Ejercicios de manejo del estrés, recursos de crisis y recordatorio de que no estás solo/a.",
      alternates: { canonical: "https://fosterhubaz.com/es/wellness", languages: { "en": "https://fosterhubaz.com/en/wellness", "es": "https://fosterhubaz.com/es/wellness" } },
    };
  }
  return {
    title: "Wellness",
    description: "Tools to help you feel grounded and supported. Coping exercises, crisis hotlines, and a reminder that you are not alone.",
    alternates: { canonical: "https://fosterhubaz.com/en/wellness", languages: { "en": "https://fosterhubaz.com/en/wellness", "es": "https://fosterhubaz.com/es/wellness" } },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
