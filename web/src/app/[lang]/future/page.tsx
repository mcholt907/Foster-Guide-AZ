"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FileText, CheckSquare, Square, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import type { AgeBandKey } from "../../../lib/prefs";
import { IMPORTANT_DOCS } from "../../../data/docs";
import { ScreenHero, StatCite } from "../../../components/ui";

const ETV_DEADLINE = "July 31, 2026";
const ETV_DEADLINE_ES = "31 de julio de 2026";
const ETV_AMOUNT = "$12,000";

export default function FuturePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);

  const band = (prefs.ageBand ?? "16-17") as AgeBandKey;
  const isOlderTeen = band === "16-17" || band === "18-21";
  const isAdult = band === "18-21";

  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const [openDoc, setOpenDoc] = useState<string | null>(null);

  function toggleDoc(id: string) {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="pb-8">
      <ScreenHero
        icon={FileText}
        title={lang === "es" ? "Mi plan de futuro" : "My Future Plan"}
        subtitle={
          isAdult
            ? lang === "es"
              ? "EFC, dinero para estudios, vivienda y documentos."
              : "EFC, school money, housing, and documents."
            : lang === "es"
            ? "Opciones, plazos y documentos antes de los 18."
            : "Options, deadlines, and documents before 18."
        }
        gradient="from-[#D97706] to-[#b45309]"
        lang={lang}
      />

      {/* Young kids — simple intro */}
      {band === "10-12" && (
        <div className="mt-4 rounded-3xl bg-white/85 p-5 ring-1 ring-black/5 shadow-sm">
          <p className="text-sm text-slate-700 leading-relaxed">
            {lang === "es"
              ? "Cuando cumplas 18, pasarán algunas cosas importantes. No tienes que resolverlo solo — hay personas que te pueden ayudar a planificar. Cuando seas mayor, esta sección tendrá más información para ti."
              : "When you turn 18, some important things will happen. You don't have to figure it out alone — there are people who can help you plan. When you're older, this section will have more for you."}
          </p>
        </div>
      )}

      {/* ETV Deadline Banner — 16+ */}
      {isOlderTeen && (
        <div className="mt-4 rounded-3xl bg-[#D97706]/10 p-4 ring-1 ring-[#D97706]/30">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-2xl bg-[#D97706]/15 p-2 shrink-0">
              <AlertTriangle className="h-5 w-5 text-[#D97706]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#92400e]">
                {lang === "es" ? "Plazo de la ETV" : "ETV Deadline"}
              </div>
              <div className="mt-1 text-xs text-[#78350f] leading-relaxed">
                {lang === "es" ? (
                  <>
                    El dinero de la Beca de Capacitación Educativa y Vocacional (ETV) debe solicitarse antes del{" "}
                    <strong>{ETV_DEADLINE_ES}</strong>. Hasta{" "}
                    <StatCite>{ETV_AMOUNT} por año</StatCite> para jóvenes elegibles en Arizona.
                  </>
                ) : (
                  <>
                    Education and Training Voucher (ETV) money must be applied for before{" "}
                    <strong>{ETV_DEADLINE}</strong>. Up to{" "}
                    <StatCite>{ETV_AMOUNT}/year</StatCite> for eligible Arizona youth.
                  </>
                )}
              </div>
              <div className="mt-2 text-xs text-[#78350f]">
                {lang === "es"
                  ? "Pídele a tu trabajador/a de casos que te conecte con el administrador de ETV de AFFCF."
                  : "Ask your caseworker to connect you with AFFCF's ETV administrator."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extended Foster Care — 16+ */}
      {isOlderTeen && (
        <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏠</span>
            <div className="text-base font-semibold text-[#1B3A5C]">
              {lang === "es" ? "Cuidado adoptivo extendido (EFC)" : "Extended Foster Care (EFC)"}
            </div>
          </div>
          <div className="grid gap-2.5">
            {[
              {
                emoji: "✅",
                en: "You can stay in care until age 21 — you don't have to leave at 18.",
                es: "Puedes quedarte en el cuidado hasta los 21 años — no tienes que irte a los 18.",
              },
              {
                emoji: "💵",
                en: "EFC includes housing help, case management, and a monthly payment.",
                es: "EFC incluye ayuda con vivienda, manejo de caso y un pago mensual.",
              },
              {
                emoji: "📋",
                en: "You must meet at least one requirement: school, work, job training, or have a medical barrier.",
                es: "Debes cumplir al menos un requisito: escuela, trabajo, capacitación laboral, o tener una barrera médica.",
              },
              {
                emoji: "🔄",
                en: "Ask your caseworker about re-entering EFC if you left — it's possible before 21.",
                es: "Pregunta a tu trabajador/a de casos sobre reingresar al EFC si te fuiste — es posible antes de los 21.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-base shrink-0 mt-0.5">{item.emoji}</span>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {lang === "es" ? item.es : item.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Housing — 18-21 */}
      {isAdult && (
        <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
          <div className="text-base font-semibold text-[#1B3A5C] mb-3">
            {lang === "es" ? "Vivienda" : "Housing"}
          </div>
          <div className="grid gap-2 mb-3">
            {[
              {
                en: "If you're in EFC, your caseworker is required to help you find stable housing before you exit care.",
                es: "Si estás en EFC, tu trabajador/a de casos está obligado a ayudarte a encontrar vivienda estable antes de que salgas del cuidado.",
              },
              {
                en: "If you need housing tonight: call 211. Tell them you're a former foster youth.",
                es: "Si necesitas vivienda esta noche: llama al 211. Diles que eres un joven que estuvo en cuidado adoptivo.",
              },
              {
                en: "AzCA and New Culture (Maricopa) offer transitional housing — call first to check availability.",
                es: "AzCA y New Culture (Maricopa) ofrecen vivienda transitional — llama primero para verificar disponibilidad.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2A7F8E] shrink-0" />
                <p className="text-sm text-slate-700 leading-relaxed">
                  {lang === "es" ? item.es : item.en}
                </p>
              </div>
            ))}
          </div>
          <a
            href="tel:211"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#2A7F8E] px-4 py-2.5 text-sm font-semibold text-white"
          >
            {lang === "es" ? "Llamar al 211 ahora" : "Call 211 now"}
          </a>
        </div>
      )}

      {/* Document checklist — 16+ */}
      {isOlderTeen && (
        <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
          <div className="text-base font-semibold text-[#1B3A5C] mb-1">
            {lang === "es" ? "Lista de documentos" : "Document Checklist"}
          </div>
          <div className="text-xs text-slate-500 mb-3">
            {lang === "es"
              ? "Toca un documento para ver cómo conseguirlo."
              : "Tap a document to see how to get it."}
          </div>
          <div className="grid gap-2">
            {IMPORTANT_DOCS.map((doc) => {
              const isChecked = checkedDocs.has(doc.id);
              const isOpen = openDoc === doc.id;
              return (
                <div key={doc.id} className="rounded-2xl bg-slate-50/80 ring-1 ring-black/5 overflow-hidden">
                  <div className="flex items-center gap-3 px-3 py-3">
                    <button onClick={() => toggleDoc(doc.id)} className="shrink-0">
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-300" />
                      )}
                    </button>
                    <button
                      onClick={() => setOpenDoc(isOpen ? null : doc.id)}
                      className="flex-1 text-left"
                    >
                      <div className={`text-sm font-semibold ${isChecked ? "line-through text-slate-400" : "text-slate-900"}`}>
                        {lang === "es" ? doc.label_es : doc.label}
                      </div>
                      <div className="text-xs text-slate-400 leading-snug">
                        {lang === "es" ? doc.why_es : doc.why}
                      </div>
                    </button>
                    <button onClick={() => setOpenDoc(isOpen ? null : doc.id)}>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-3 py-3 grid gap-1.5">
                      {(lang === "es" ? doc.steps_es : doc.steps).map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="mt-0.5 text-xs font-bold text-[#2A7F8E] shrink-0">{i + 1}.</span>
                          <p className="text-xs text-slate-600 leading-relaxed">{step}</p>
                        </div>
                      ))}
                      <div className="mt-1 rounded-xl bg-white p-2 ring-1 ring-black/5">
                        <span className="text-xs font-semibold text-slate-500">
                          {lang === "es" ? "Contacto: " : "Contact: "}
                        </span>
                        <span className="text-xs text-slate-600">
                          {lang === "es" ? doc.contact_es : doc.contact}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ICWA note — tribal members */}
      {prefs.tribal && (
        <div className="mt-4 rounded-3xl bg-[#1B3A5C]/8 p-4 ring-1 ring-[#1B3A5C]/20">
          <div className="text-sm font-semibold text-[#1B3A5C] mb-2">
            {lang === "es" ? "Nota sobre ICWA" : "ICWA Note"}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === "es"
              ? "La Ley de Bienestar Infantil Indígena (ICWA) puede aplicar a tu caso. Asegúrate de que tu tribu esté notificada de todas las audiencias. Pídele a tu abogado que explique cómo afecta ICWA tus opciones — incluyendo la adopción y la tutela."
              : "The Indian Child Welfare Act (ICWA) may apply to your case. Make sure your tribe has been notified of all hearings. Ask your attorney to explain how ICWA affects your options — including adoption and guardianship."}
          </p>
        </div>
      )}
    </div>
  );
}
