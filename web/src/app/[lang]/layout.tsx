import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BottomNav, SideNav } from "../../components/BottomNav";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "FosterHub AZ — Conoce Tus Derechos",
      description:
        "Conoce tus derechos, entiende tu caso y planifica tu futuro — para jóvenes en el sistema de cuidado adoptivo de Arizona.",
    };
  }
  return {
    title: "FosterHub AZ — Know Your Rights",
    description:
      "Know your rights, understand your case, and plan your future — for Arizona foster youth.",
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "es") notFound();

  return (
    <div className="min-h-screen">
      <SideNav lang={lang as "en" | "es"} />
      <main className="pb-20 md:pb-8 md:pl-56">
        <div className="w-full max-w-lg mx-auto px-4 pt-4">
          {children}
        </div>
      </main>
      <BottomNav lang={lang as "en" | "es"} />
    </div>
  );
}
