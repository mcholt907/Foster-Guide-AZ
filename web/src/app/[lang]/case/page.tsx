"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import type { AgeBandKey } from "../../../lib/prefs";
import { CaseTeen } from "../../../components/teen/CaseTeen";
import { TribalNote } from "../../../components/TribalNote";

const STAGES = [
  {
    id: "prelim",
    title: "First Safety Hearing",
    titleEs: "Primera Audiencia de Seguridad",
    imgIcon: "/my_case/safety_hearing_icon.png",
    bgColor: "bg-blue-50",
    accentColor: "bg-blue-200",
    what: "The judge checks that you're safe and decides where you'll stay for now. This happens fast — usually just a few days after you come into care.",
    whatEs: "El juez revisa que estés a salvo y decide dónde te quedarás por ahora. Esto pasa rápido — generalmente a pocos días de entrar al cuidado.",
    forYou: "Before the hearing starts, tell your lawyer anything you want the judge to know. Your voice matters right from the start.",
    forYouEs: "Antes de que empiece la audiencia, dile a tu abogado/a todo lo que quieras que el juez sepa. Tu voz importa desde el principio.",
    next: "The dates for your next hearings get set, so everyone knows what's coming.",
    nextEs: "Se fijan las fechas de las próximas audiencias para que todos sepan qué viene.",
  },
  {
    id: "adjudication",
    title: "Facts Hearing",
    titleEs: "Audiencia de Hechos",
    imgIcon: "/my_case/facts_hearing_icon.png",
    bgColor: "bg-purple-50",
    accentColor: "bg-purple-200",
    what: "The judge looks at the facts and decides if the worries in your case are true and if your case should keep going. This is not about anything you did.",
    whatEs: "El juez mira los hechos y decide si las preocupaciones en tu caso son ciertas y si el caso debe continuar. Esto no es por nada que tú hiciste.",
    forYou: 'Ask your lawyer: "What does this mean for where I live and my school?" They\'re there to explain it to you.',
    forYouEs: "Pregúntale a tu abogado/a: «¿Qué significa esto para donde vivo y mi escuela?» Está ahí para explicártelo.",
    next: "The judge decides on a plan for your case.",
    nextEs: "El juez decide un plan para tu caso.",
  },
  {
    id: "disposition",
    title: "Plan Hearing",
    titleEs: "Audiencia del Plan",
    imgIcon: "/my_case/case_header_icon.png",
    bgColor: "bg-emerald-50",
    accentColor: "bg-emerald-200",
    what: "The judge decides where you will live for now and what the plan is. The plan says what the grown-ups need to do. Sometimes this happens the same day as the Facts Hearing.",
    whatEs: "El juez decide dónde vivirás por ahora y cuál es el plan. El plan dice lo que los adultos necesitan hacer. A veces esto pasa el mismo día que la Audiencia de Hechos.",
    forYou: "Ask your lawyer to tell you what the plan says, in plain words.",
    forYouEs: "Pídele a tu abogado/a que te diga lo que dice el plan, en palabras sencillas.",
    next: "Check-in hearings start.",
    nextEs: "Empiezan las audiencias de seguimiento.",
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
    forYouEs: "Llega con 1 o 2 cosas que quieras que la gente sepa: qué va bien y qué no. Mereces que te escuchen.",
    next: "More check-in hearings get set, or people start planning what happens long-term.",
    nextEs: "Se programan más audiencias de seguimiento, o se empieza a planear qué pasará a largo plazo.",
  },
  {
    id: "permanency",
    title: "Long-Term Plan Hearing",
    titleEs: "Audiencia del Plan a Largo Plazo",
    imgIcon: "/my_case/long_term_plan_icon.png",
    bgColor: "bg-amber-50",
    accentColor: "bg-amber-200",
    what: "The judge talks about the long-term plan for you — like going back home, living with a guardian, or being adopted.",
    whatEs: "El juez habla sobre el plan a largo plazo para ti — como regresar a casa, vivir con un tutor o ser adoptado/a.",
    forYou: "Ask your lawyer to walk you through each choice in plain words. You get to say what you want.",
    forYouEs: "Pídele a tu abogado/a que te explique cada opción en palabras sencillas. Puedes decir lo que quieres.",
    next: "Everyone starts taking steps to make that long-term plan happen.",
    nextEs: "Todos empiezan a dar pasos para hacer realidad ese plan a largo plazo.",
  },
];

const FAQS = [
  { q: "Do I have to go to court?", qEs: "¿Tengo que ir a la corte?", a: "Lots of kids go, and it helps the judge hear from you. Your lawyer will tell you what to expect, and you won't be alone. If going feels too hard, tell your lawyer.", aEs: "Muchos niños van, y eso ayuda a que el juez te escuche. Tu abogado/a te dirá qué esperar, y no estarás solo/a. Si ir se siente muy difícil, díselo a tu abogado/a." },
  { q: "Can I talk to the judge?", qEs: "¿Puedo hablar con el juez?", a: "Yes! You can ask your lawyer to help you talk to the judge — in court, or sometimes in a smaller room with the lawyers there. Judges want to hear from you.", aEs: "¡Sí! Puedes pedirle a tu abogado/a que te ayude a hablar con el juez — en la sala del tribunal, o a veces en un cuarto más pequeño con los abogados presentes. Los jueces quieren escucharte." },
  { q: "What if I don't understand what's happening?", qEs: "¿Qué pasa si no entiendo lo que está pasando?", a: "Stop and ask your lawyer to explain it — that's their job. It's always okay to ask, \"What does that mean?\"", aEs: "Detente y pídele a tu abogado/a que te lo explique — ese es su trabajo. Siempre está bien preguntar: «¿Qué significa eso?»" },
  { q: "How many hearings will there be?", qEs: "¿Cuántas audiencias habrá?", a: "Every case is different. Some end quickly, others take longer. Your lawyer can tell you what to expect in your case.", aEs: "Cada caso es diferente. Algunos terminan rápido, otros tardan más. Tu abogado/a puede decirte qué esperar en tu caso." },
  { q: "What does it mean if a parent's rights end?", qEs: "¿Qué significa si terminan los derechos de un padre o madre?", a: "In some cases, a judge decides that a parent can no longer make decisions for their child. Grown-ups may call this \"severance.\" It is the judge's decision. It is not your fault, and it is not because of anything you said or did. Many cases never get to this step. If you wonder about it, ask your lawyer or caseworker. It's okay to have big feelings about it.", aEs: "En algunos casos, un juez decide que un padre o madre ya no puede tomar decisiones por su hijo o hija. Es decisión del juez. No es tu culpa, y no es por nada que dijiste o hiciste. Muchos casos nunca llegan a este paso. Si tienes dudas, pregúntale a tu abogado/a o a tu trabajador/a de casos. Está bien tener sentimientos grandes sobre esto." },
];

export default function CasePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);

  // Default to the 13-15 teen variant when prefs aren't set yet (first-time
  // visitors, search engines). Avoids returning blank HTML on SSR.
  const band: AgeBandKey = prefs.ageBand ?? "13-15";
  if (band === "10-12") return <Case1012 lang={lang} />;

  return <CaseTeen lang={lang} band={band} />;
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
          className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
          aria-label={lang === "es" ? "Volver" : "Back to home"}
        >
          <ChevronLeft size={20} className="text-slate-600" aria-hidden="true" />
        </Link>
        <h1 className="text-lg font-bold text-[#1F6470] tracking-tight flex-1">
          {lang === "es" ? "Tu Caso Explicado" : "Your Case Explained"}
        </h1>
      </div>

      {/* Header card */}
      <div className="text-center mb-10 pt-4">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-black/5 flex items-center justify-center relative overflow-hidden">
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-[#DDEBFA]/50 to-transparent pointer-events-none" />
            <Image src="/my_case/case_header_icon.png" alt="" width={256} height={256} className="w-24 h-24 object-cover scale-[1.15] mix-blend-multiply" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-[#1F6470] mb-3">
          {lang === "es" ? "Tu Caso Explicado" : "Your Case Explained"}
        </h2>
        <p className="text-slate-600">
          {lang === "es"
            ? "Lo que pasa en la corte — paso a paso, en palabras sencillas."
            : "Here's what happens in court — step by step, in plain words."}
        </p>
      </div>

      {/* Timeline */}
      <div className="grid gap-4 mb-8">
        {STAGES.map((stage) => {
          const isOpen = openStage === stage.id;
          const title = lang === "es" ? stage.titleEs : stage.title;
          const what = lang === "es" ? stage.whatEs : stage.what;
          const forYou = lang === "es" ? stage.forYouEs : stage.forYou;
          const next = lang === "es" ? stage.nextEs : stage.next;
          return (
            <div key={stage.id} className={`rounded-3xl overflow-hidden shadow-sm border border-black/5 ${stage.bgColor}`}>
              <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenStage(isOpen ? null : stage.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:brightness-[0.97] transition-all"
              >
                <span className="flex-1 flex items-center gap-4">
                  <Image src={stage.imgIcon} alt="" width={192} height={192} className="w-14 h-14 object-contain drop-shadow-sm scale-[1.1]" />
                  <span className="text-xl font-bold text-gray-800">{title}</span>
                </span>
                {isOpen ? <ChevronUp size={20} className="shrink-0 text-gray-600" aria-hidden="true" /> : <ChevronDown size={20} className="shrink-0 text-gray-600" aria-hidden="true" />}
              </button>
              </h3>
              {isOpen && (
                <div className="border-t border-black/5 px-5 pb-5 pt-5 grid gap-4">
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <h4 className="text-lg font-extrabold text-slate-800 mb-2"><span aria-hidden="true">👀</span> {lang === "es" ? "Qué pasa" : "What happens"}</h4>
                    <p className="text-[17px] text-slate-600 leading-relaxed font-medium">{what}</p>
                  </div>
                  <div className="bg-[#fffdf5] border-2 border-[#fbbf24] rounded-[2rem] p-6">
                    <h4 className="text-lg font-extrabold text-[#b45309] mb-2"><span aria-hidden="true">✋</span> {lang === "es" ? "Tu turno" : "Your turn"}</h4>
                    <p className="text-[17px] text-[#78350f] leading-relaxed font-medium">{forYou}</p>
                  </div>
                  <div className={`${stage.accentColor}/50 border-2 border-white rounded-[2rem] p-6`}>
                    <h4 className="text-lg font-extrabold text-slate-800 mb-2"><span aria-hidden="true">➡️</span> {lang === "es" ? "Qué sigue" : "What's next"}</h4>
                    <p className="text-[17px] text-slate-700 leading-relaxed font-medium">{next}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TribalNote lang={lang} variant="kid" className="mb-12" />

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
              <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenFAQ(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left font-extrabold text-lg transition-colors hover:bg-[#DDEBFA]"
              >
                <span>{q}</span>
                {isOpen ? <ChevronUp size={24} className="shrink-0" aria-hidden="true" /> : <ChevronDown size={24} className="shrink-0" aria-hidden="true" />}
              </button>
              </h3>
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
      <div className="rounded-3xl bg-slate-50 border-2 border-slate-100 px-6 py-5 text-[15px] font-medium text-slate-600 text-center leading-relaxed">
        {lang === "es"
          ? "Esta es información general, no consejo legal. Habla con tu abogado/a sobre tu caso — está ahí para ayudarte."
          : "This is general information, not legal advice. Talk to your lawyer about your case — they're there to help you."}
      </div>
    </div>
  );
}
