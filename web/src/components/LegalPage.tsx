import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Lang } from "../lib/i18n";

export function LegalPage({
  lang,
  title,
  lead,
  children,
  lastUpdated,
}: {
  lang: Lang;
  title: string;
  lead: string;
  children: React.ReactNode;
  lastUpdated?: string;
}) {
  return (
    <div className="pb-16">
      <Link
        href={`/${lang}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ChevronLeft size={16} />
        {lang === "es" ? "Volver al inicio" : "Back to home"}
      </Link>

      <h1 className="text-3xl font-extrabold text-[#1B3A5C] leading-tight tracking-tight mb-3">
        {title}
      </h1>
      <p className="text-base text-slate-600 leading-relaxed mb-8">{lead}</p>

      <div className="space-y-6 text-[15px] leading-relaxed text-[#35322d]">{children}</div>

      {lastUpdated ? (
        <p className="mt-10 text-xs text-slate-400">
          {lang === "es" ? "Última actualización" : "Last updated"}: {lastUpdated}
        </p>
      ) : null}
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-[#1B3A5C] mb-2">{heading}</h2>
      <div className="space-y-2 text-slate-700">{children}</div>
    </section>
  );
}
