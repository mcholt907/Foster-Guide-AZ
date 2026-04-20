"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import type { AgeBandKey } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { CaseTeen } from "../../../components/teen/CaseTeen";

const STAGES = [
  {
    id: "prelim",
    title: "First Safety Hearing",
    titleEs: "Primera Audiencia de Seguridad",
    imgIcon: "/my_case/safety_hearing_icon.png",
    bgColor: "bg-blue-50",
    accentColor: "bg-blue-200",
    what: "The judge checks that you're safe and makes a quick decision about where you'll stay — usually within just a few days of coming into care.",
    whatEs: "El juez verifica que estés seguro y toma una decisión rápida sobre dónde vivirás — generalmente a pocos días de entrar al cuidado.",
    forYou: "Before the hearing starts, tell your lawyer anything you want the judge to know. Your voice matters right from the start.",
    forYouEs: "Antes de que empiece la audiencia, dile a tu abogado todo lo que quieras que el juez sepa. Tu voz importa desde el principio.",
    next: "The dates for your next hearings get set, so everyone knows what's coming.",
    nextEs: "Se establecen las fechas de las próximas audiencias para que todos sepan qué viene.",
  },
  {
    id: "adjudication",
    title: "Facts Hearing",
    titleEs: "Audiencia de Hechos",
    imgIcon: "/my_case/facts_hearing_icon.png",
    bgColor: "bg-purple-50",
    accentColor: "bg-purple-200",
    what: "The court looks at all the facts and decides if the concerns in your case are true and if your case should keep going.",
    whatEs: "El tribunal examina todos los hechos y decide si las preocupaciones en tu caso son verdaderas y si el caso debe continuar.",
    forYou: 'Ask your lawyer: "What does this mean for where I live and my school?" They\'re there to explain everything to you.',
    forYouEs: 'Pregúntale a tu abogado: "¿Qué significa esto para donde vivo y mi escuela?" Están ahí para explicarte todo.',
    next: "Your case plan — the plan for your care — gets reviewed and updated based on what the court decided.",
    nextEs: "Tu plan de caso — el plan para tu cuidado — se revisa y actualiza según lo que decidió el tribunal.",
  },
  {
    id: "review",
    title: "Check-In Hearing",
    titleEs: "Audiencia de Seguimiento",
    imgIcon: "/my_case/checkin_hearing_icon.png",
    bgColor: "bg-teal-50",
    accentColor: "bg-teal-200",
    what: "The judge checks in on how your plan is going — what's working and what might need to change.",
    whatEs: "El juez revisa cómo va tu plan — qué está funcionando y qué podría necesitar cambiar.",
    forYou: "Come ready with 1 or 2 things you want people to know: what's going well and what isn't. You deserve to be heard.",
    forYouEs: "Llega listo con 1 o 2 cosas que quieras que la gente sepa: qué va bien y qué no. Mereces ser escuchado.",
    next: "More check-in hearings get scheduled, or you move toward planning what happens long-term.",
    nextEs: "Se programan más audiencias de seguimiento, o empiezas a planear qué pasará a largo plazo.",
  },
  {
    id: "permanency",
    title: "Long-Term Plan Hearing",
    titleEs: "Audiencia del Plan a Largo Plazo",
    imgIcon: "/my_case/long_term_plan_icon.png",
    bgColor: "bg-amber-50",
    accentColor: "bg-amber-200",
    what: "The judge talks about the long-term plan for your future — like going back home, living with a guardian, or being adopted.",
    whatEs: "El juez habla sobre el plan a largo plazo para tu futuro — como regresar a casa, vivir con un tutor, o ser adoptado.",
    forYou: "Ask your lawyer to walk you through each option in plain words. You have a say in this — your opinion counts.",
    forYouEs: "Pídele a tu abogado que te explique cada opción en palabras sencillas. Tienes voz en esto — tu opinión cuenta.",
    next: "Everyone starts taking steps toward making that long-term plan happen.",
    nextEs: "Todos empiezan a tomar medidas para hacer realidad ese plan a largo plazo.",
  },
];

const FAQS = [
  { q: "Do I have to go to court?", qEs: "¿Tengo que ir a la corte?", a: "Usually yes — but your lawyer will tell you what to expect ahead of time. You won't be alone. Your lawyer goes with you.", aEs: "Generalmente sí — pero tu abogado te dirá qué esperar de antemano. No estarás solo. Tu abogado va contigo." },
  { q: "Can I talk to the judge?", qEs: "¿Puedo hablar con el juez?", a: "Yes! You can speak up at hearings through your lawyer, or ask to speak directly to the judge. Judges want to hear from you.", aEs: "¡Sí! Puedes hablar en las audiencias a través de tu abogado, o pedir hablar directamente con el juez. Los jueces quieren escucharte." },
  { q: "What if I don't understand what's happening?", qEs: "¿Qué pasa si no entiendo lo que está pasando?", a: "Stop and ask your lawyer to explain it — that's their job. You should understand everything that's going on in your case.", aEs: "Para y pídele a tu abogado que te lo explique — ese es su trabajo. Debes entender todo lo que está pasando en tu caso." },
  { q: "How many hearings will there be?", qEs: "¿Cuántas audiencias habrá?", a: "Every case is different. Some end quickly, others take longer. Your lawyer can give you a better idea of what to expect for your specific case.", aEs: "Cada caso es diferente. Algunos terminan rápido, otros tardan más. Tu abogado puede darte una mejor idea de qué esperar para tu caso específico." },
];

export default function CasePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;
  if (!prefs.ageBand) return null;
  if (prefs.ageBand === "10-12") return <Case1012 lang={lang} />;

  const band = prefs.ageBand as AgeBandKey;
  return (
    <TeenShell active="case" lang={lang}>
      <CaseTeen lang={lang} band={band} />
    </TeenShell>
  );
}

function Case1012({ lang }: { lang: Lang }) {
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="font-['Outfit',_sans-serif] pb-8">

      {/* Sticky header */}
      <div className="-mx-4 px-4 py-4 flex items-center gap-3 sticky top-0 bg-[#FFF9F3]/90 backdrop-blur-md z-30">
        <Link
          href={`/${lang}`}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
          aria-label={lang === "es" ? "Volver" : "Back to home"}
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="text-lg font-bold text-[#629DA7] tracking-tight flex-1">
          {lang === "es" ? "Mi Caso Explicado" : "My Case Explained"}
        </h1>
      </div>

      {/* Header card */}
      <div className="text-center mb-10 pt-4">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-black/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#DDEBFA]/50 to-transparent pointer-events-none" />
            <img src="/my_case/case_header_icon.png" alt="" className="w-24 h-24 object-cover scale-[1.15] mix-blend-multiply" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-[#629DA7] mb-3">
          {lang === "es" ? "Mi Caso Explicado" : "My Case Explained"}
        </h2>
        <p className="text-slate-600">
          {lang === "es"
            ? "Lo que pasa en la corte — paso a paso, en palabras sencillas."
            : "Here's what happens in court — step by step, in plain language."}
        </p>
      </div>

      {/* Timeline */}
      <div className="grid gap-4 mb-16">
        {STAGES.map((stage) => {
          const isOpen = openStage === stage.id;
          const title = lang === "es" ? stage.titleEs : stage.title;
          const what = lang === "es" ? stage.whatEs : stage.what;
          const forYou = lang === "es" ? stage.forYouEs : stage.forYou;
          const next = lang === "es" ? stage.nextEs : stage.next;
          return (
            <div key={stage.id} className={`rounded-3xl overflow-hidden shadow-sm border border-black/5 ${stage.bgColor}`}>
              <button
                onClick={() => setOpenStage(isOpen ? null : stage.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:brightness-[0.97] transition-all"
              >
                <div className="flex-1 flex items-center gap-4">
                  <img src={stage.imgIcon} alt="" className="w-14 h-14 object-contain drop-shadow-sm scale-[1.1]" />
                  <span className="text-xl font-bold text-gray-800">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={20} className="shrink-0 text-gray-500" /> : <ChevronDown size={20} className="shrink-0 text-gray-500" />}
              </button>
              {isOpen && (
                <div className="border-t border-black/5 px-5 pb-5 pt-5 grid gap-4">
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <div className="text-lg font-extrabold text-slate-800 mb-2">👀 {lang === "es" ? "Qué pasa" : "What happens"}</div>
                    <p className="text-[17px] text-slate-600 leading-relaxed font-medium">{what}</p>
                  </div>
                  <div className="bg-[#fffdf5] border-2 border-[#fbbf24] rounded-[2rem] p-6">
                    <div className="text-lg font-extrabold text-[#b45309] mb-2">✋ {lang === "es" ? "Tu turno" : "Your turn"}</div>
                    <p className="text-[17px] text-[#78350f] leading-relaxed font-medium">{forYou}</p>
                  </div>
                  <div className={`${stage.accentColor}/50 border-2 border-white rounded-[2rem] p-6`}>
                    <div className="text-lg font-extrabold text-slate-800 mb-2">➡️ {lang === "es" ? "Qué sigue" : "What's next"}</div>
                    <p className="text-[17px] text-slate-700 leading-relaxed font-medium">{next}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <h2 className="text-2xl text-center font-extrabold text-[#115e59] mb-6">
        {lang === "es" ? "Preguntas que podrías tener" : "Questions you might have"}
      </h2>
      <div className="space-y-4 mb-12">
        {FAQS.map((faq, idx) => {
          const isOpen = openFAQ === idx;
          const q = lang === "es" ? faq.qEs : faq.q;
          const a = lang === "es" ? faq.aEs : faq.a;
          return (
            <div key={idx} className="bg-[#DDEBFA]/50 border-2 border-[#DDEBFA] rounded-[2rem] overflow-hidden text-[#1E3A5F]">
              <button
                onClick={() => setOpenFAQ(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-extrabold text-lg transition-colors hover:bg-[#DDEBFA]"
              >
                <span>{q}</span>
                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-[17px] font-medium leading-relaxed bg-white border-x-2 border-b-2 border-[#DDEBFA] rounded-b-[2rem] shadow-sm">
                  {a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safe notice */}
      <div className="rounded-3xl bg-slate-50 border-2 border-slate-100 px-6 py-5 text-[15px] font-medium text-slate-500 text-center leading-relaxed">
        {lang === "es"
          ? "Esta es información general, no asesoramiento legal. Habla con tu abogado sobre tu caso específico — están ahí para ayudarte."
          : "This is general information, not legal advice. Talk to your lawyer about your specific case — they're there to help you."}
      </div>
    </div>
  );
}
