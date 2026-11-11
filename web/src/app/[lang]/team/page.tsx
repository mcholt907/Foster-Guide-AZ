"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import type { AgeBandKey } from "../../../lib/prefs";
import { TeamTeen } from "../../../components/teen/TeamTeen";
import { CrisisQuickLinks } from "../../../components/CrisisQuickLinks";
import { TribalNote } from "../../../components/TribalNote";
import { tc } from "../../../lib/i18n-case";

const TEAM_MEMBERS = [
  {
    title: "Caseworker",
    titleEs: "Trabajador/a de casos",
    what: "Your main helper at DCS. They visit you and make sure you're safe and have what you need.",
    whatEs: "Tu ayudante principal en DCS. Te visita y se asegura de que estés a salvo y tengas lo que necesitas.",
    bgColor: "bg-blue-100",
    avatar: "/avatars/caseworker.png",
  },
  {
    title: "Judge",
    titleEs: "Juez",
    what: "The person who listens to everyone and makes the big decisions, like where you will live.",
    whatEs: "La persona que escucha a todos y toma las decisiones grandes, como dónde vivirás.",
    bgColor: "bg-green-100",
    avatar: "/avatars/judge.png",
  },
  {
    title: "Foster Parent or Caregiver",
    titleEs: "Padre o madre de crianza, o cuidador/a",
    what: "The person or family taking care of you where you live now.",
    whatEs: "La persona o familia que te cuida donde vives ahora.",
    bgColor: "bg-yellow-200",
    avatar: "/avatars/caregiver.png",
  },
  {
    title: "Lawyer",
    titleEs: "Abogado/a",
    what: "Your lawyer tells the judge what you want. You can ask them: \"Are you my lawyer or my GAL? Do you tell the judge what I want, or what you think is best?\" Ask them what they keep private, too.",
    whatEs: "Tu abogado/a le dice al juez lo que tú quieres. Puedes preguntarle: «¿Eres mi abogado/a o mi GAL? ¿Le dices al juez lo que yo quiero, o lo que tú crees que es mejor?» También pregúntale qué mantiene en privado.",
    bgColor: "bg-orange-100",
    avatar: "/avatars/attorney.png",
  },
  {
    title: "CASA Volunteer",
    titleEs: "Voluntario/a CASA",
    what: "A helper from the community who gets to know you and tells the judge what they think you need. Not every case has a CASA. If you don't have one, you can ask your caseworker or lawyer to ask for one.",
    whatEs: "Un/a ayudante de la comunidad que te conoce y le dice al juez lo que cree que necesitas. No todos los casos tienen un CASA. Si no tienes uno, puedes pedirle a tu trabajador/a de casos o a tu abogado/a que solicite uno.",
    bgColor: "bg-purple-100",
    avatar: "/avatars/casa.png",
  },
  {
    title: "Guardian ad Litem (GAL)",
    titleEs: "Tutor ad litem (GAL)",
    what: "A person who tells the judge what they think is best for you. That may not be the same as what you want. You might have a lawyer, a GAL, or both.",
    whatEs: "Una persona que le dice al juez lo que cree que es mejor para ti. Puede no ser lo mismo que tú quieres. Puedes tener un/a abogado/a, un GAL o los dos.",
    bgColor: "bg-pink-100",
    avatar: "/avatars/gal.png",
  },
  {
    title: "DCS Supervisor",
    titleEs: "Supervisor/a de DCS",
    what: "Your caseworker's boss. You can ask to talk to them if things aren't getting fixed.",
    whatEs: "El/la jefe/a de tu trabajador/a de casos. Puedes pedir hablar con esta persona si las cosas no se arreglan.",
    bgColor: "bg-teal-100",
    avatar: "/avatars/supervisor.png",
  },
];

const FAQS: { q: string; qEs: string; a: string; aEs: string; crisis?: boolean }[] = [
  {
    q: "Can I talk to the judge?",
    qEs: "¿Puedo hablar con el juez?",
    a: "Yes! You can ask your lawyer to help you talk to the judge — in court, or sometimes in a smaller room with the lawyers there.",
    aEs: "¡Sí! Puedes pedirle a tu abogado/a que te ayude a hablar con el juez — en la sala del tribunal, o a veces en un cuarto más pequeño con los abogados presentes.",
  },
  {
    q: "Who can I talk to if I'm scared?",
    qEs: "¿Con quién puedo hablar si tengo miedo?",
    a: `${tc("safety.now", "en")} ${tc("safety.then.kid", "en")}`,
    aEs: `${tc("safety.now", "es")} ${tc("safety.then.kid", "es")}`,
    crisis: true,
  },
  {
    q: "What if I don't like my foster home?",
    qEs: "¿Qué pasa si no me gusta mi hogar de crianza?",
    a: "Tell your caseworker or lawyer. They will listen, and they can ask for things to change. If you are not safe, call 911.",
    aEs: "Díselo a tu trabajador/a de casos o a tu abogado/a. Te escucharán y pueden pedir que las cosas cambien. Si no estás a salvo, llama al 911.",
  },
  {
    q: "How often will I see my caseworker?",
    qEs: "¿Cada cuánto veré a mi trabajador/a de casos?",
    a: "Your caseworker is supposed to visit you in person at least once a month.",
    aEs: "Tu trabajador/a de casos debe visitarte en persona al menos una vez al mes.",
  },
];

export default function TeamPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);

  // Default to the 13-15 teen variant when prefs aren't set yet (first-time
  // visitors, search engines). Avoids returning blank HTML on SSR.
  const band: AgeBandKey = prefs.ageBand ?? "13-15";
  if (band === "10-12") {
    return <Team1012 lang={lang} />;
  }

  return <TeamTeen lang={lang} band={band} />;
}

function Team1012({ lang }: { lang: Lang }) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

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
          {lang === "es" ? "Tu Equipo" : "Your Team"}
        </h1>
      </div>

      {/* Hero */}
      <div className="text-center pt-6 pb-10 flex flex-col items-center">
        <Image
          src="/avatars/group_avatar.png"
          alt=""
          width={512}
          height={512}
          priority
          className="w-56 h-auto mb-6 object-cover rounded-[2.5rem] shadow-sm border border-slate-200"
        />
        <h2 className="text-3xl font-bold text-[#629DA7] mb-3">
          {lang === "es" ? "Tu Equipo" : "Your Team"}
        </h2>
        <p className="text-slate-600">
          {lang === "es"
            ? "Estas son las personas que están aquí para ayudarte."
            : "These are the people who are here to help you."}
        </p>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {TEAM_MEMBERS.map((member, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-6 ${member.bgColor} shadow-sm border border-black/5 hover:shadow-md transition-shadow flex items-start space-x-5`}
          >
            <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full overflow-hidden shadow-inner flex items-center justify-center">
              <Image
                src={member.avatar}
                alt={lang === "es" ? member.titleEs : member.title}
                width={256}
                height={256}
                className="object-cover w-full h-full scale-[1.3] pt-4"
              />
            </div>
            <div className="pt-2">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {lang === "es" ? member.titleEs : member.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {lang === "es" ? member.whatEs : member.what}
              </p>
            </div>
          </div>
        ))}
      </div>

      <TribalNote lang={lang} variant="kid" className="mb-12" />

      {/* FAQ */}
      <h2 className="text-2xl text-center font-semibold text-[#629DA7] mb-5">
        {lang === "es" ? "Preguntas que podrías tener" : "Questions you might have"}
      </h2>
      <div className="space-y-3 mb-8">
        {FAQS.map((faq, idx) => {
          const isOpen = openFAQ === idx;
          const q = lang === "es" ? faq.qEs : faq.q;
          const a = lang === "es" ? faq.aEs : faq.a;
          return (
            <div key={idx} className="bg-[#DDEBFA] rounded-xl overflow-hidden text-[#1E3A5F]">
              <button
                onClick={() => setOpenFAQ(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium hover:bg-[#c9e0f6] transition-colors"
              >
                <span>{q}</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm bg-white pt-3 border-x border-b border-[#DDEBFA] rounded-b-xl shadow-sm">
                  {a}
                  {faq.crisis && (
                    <div className="mt-3 pb-1">
                      <CrisisQuickLinks lang={lang} variant="compact" />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
