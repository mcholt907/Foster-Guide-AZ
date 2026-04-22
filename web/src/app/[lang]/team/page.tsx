"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import type { AgeBandKey } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { TeamTeen } from "../../../components/teen/TeamTeen";

const TEAM_MEMBERS = [
  {
    title: "Social Worker",
    titleEs: "Trabajador Social",
    what: "Your main helper. They visit you and make sure you're safe and have what you need.",
    whatEs: "Tu ayudante principal. Te visitan y se aseguran de que estés seguro y tengas lo que necesitas.",
    bgColor: "bg-blue-100",
    avatar: "/avatars/caseworker.png",
  },
  {
    title: "Judge",
    titleEs: "Juez",
    what: "The person who listens to everyone and makes the final decisions about where you'll live.",
    whatEs: "La persona que escucha a todos y toma las decisiones finales sobre dónde vivirás.",
    bgColor: "bg-green-100",
    avatar: "/avatars/judge.png",
  },
  {
    title: "Foster Parent or Caregiver",
    titleEs: "Padre Adoptivo o Cuidador",
    what: "The person or family taking care of you at your new home.",
    whatEs: "La persona o familia que te cuida en tu nuevo hogar.",
    bgColor: "bg-yellow-200",
    avatar: "/avatars/caregiver.png",
  },
  {
    title: "Lawyer",
    titleEs: "Abogado",
    what: "Your special advocate. They speak up for you and tell the judge what you want.",
    whatEs: "Tu defensor especial. Hablan por ti y le dicen al juez lo que quieres.",
    bgColor: "bg-orange-100",
    avatar: "/avatars/attorney.png",
  },
  {
    title: "CASA Volunteer",
    titleEs: "Voluntario CASA",
    what: "A community volunteer who gets to know you personally and speaks up for you in court. Not every case has a CASA — but if you don't have one, you can ask your caseworker or lawyer to request one for you.",
    whatEs: "Un voluntario comunitario que te conoce personalmente y habla por ti en la corte. No todos los casos tienen un CASA — pero si no tienes uno, puedes pedirle a tu trabajador social o abogado que solicite uno para ti.",
    bgColor: "bg-purple-100",
    avatar: "/avatars/casa.png",
  },
  {
    title: "Guardian ad Litem",
    titleEs: "Tutor ad Litem",
    what: "Appointed by the court specifically to represent your best interests.",
    whatEs: "Nombrado por la corte específicamente para representar tus mejores intereses.",
    bgColor: "bg-pink-100",
    avatar: "/avatars/gal.png",
  },
  {
    title: "DCS Supervisor",
    titleEs: "Supervisor de DCS",
    what: "Your caseworker's boss. Who you can talk to if things aren't getting fixed.",
    whatEs: "El jefe de tu trabajador social. Con quien puedes hablar si las cosas no se arreglan.",
    bgColor: "bg-teal-100",
    avatar: "/avatars/supervisor.png",
  },
];

const FAQS = [
  {
    q: "Can I talk to the judge?",
    qEs: "¿Puedo hablar con el juez?",
    a: "Yes, you can! You can talk to the judge in court or in their office. Your lawyer can help you with this.",
    aEs: "¡Sí, puedes! Puedes hablar con el juez en la corte o en su oficina. Tu abogado puede ayudarte con esto.",
  },
  {
    q: "Who can I talk to if I'm scared?",
    qEs: "¿Con quién puedo hablar si tengo miedo?",
    a: "You can reach out to your Caseworker, CASA Volunteer, or Attorney immediately. They are there to keep you safe.",
    aEs: "Puedes comunicarte inmediatamente con tu Trabajador Social, Voluntario CASA o Abogado. Están ahí para mantenerte seguro.",
  },
  {
    q: "What if I don't like my foster home?",
    qEs: "¿Qué pasa si no me gusta mi hogar adoptivo?",
    a: "Tell your Caseworker or Lawyer. They will listen to your concerns and can advocate for a better situation if needed.",
    aEs: "Dile a tu Trabajador Social o Abogado. Escucharán tus preocupaciones y pueden abogar por una mejor situación si es necesario.",
  },
  {
    q: "How often will I see my social worker?",
    qEs: "¿Con qué frecuencia veré a mi trabajador social?",
    a: "By law, your DCS Case Manager is required to visit you at least once a month in person.",
    aEs: "Por ley, tu Administrador de Casos de DCS está obligado a visitarte en persona al menos una vez al mes.",
  },
];

export default function TeamPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;
  if (!prefs.ageBand) return null;

  if (prefs.ageBand === "10-12") {
    return <Team1012 lang={lang} />;
  }

  const band = prefs.ageBand as AgeBandKey;
  return (
    <TeenShell active="team" lang={lang}>
      <TeamTeen lang={lang} band={band} />
    </TeenShell>
  );
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
          {lang === "es" ? "Mi Equipo" : "My Team"}
        </h1>
      </div>

      {/* Hero */}
      <div className="text-center pt-6 pb-10 flex flex-col items-center">
        <Image
          src="/avatars/group_avatar.png"
          alt={lang === "es" ? "Mi equipo" : "My Team"}
          width={512}
          height={512}
          priority
          className="w-56 h-auto mb-6 object-cover rounded-[2.5rem] shadow-sm border border-slate-200"
        />
        <h2 className="text-3xl font-bold text-[#629DA7] mb-3">
          {lang === "es" ? "Mi Equipo" : "My Team"}
        </h2>
        <p className="text-slate-600">
          {lang === "es"
            ? "Estas son las personas que están aquí para apoyarte."
            : "These are the helpful people here to support you on your journey."}
        </p>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 gap-6 mb-16">
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

      {/* FAQ */}
      <h2 className="text-2xl text-center font-semibold text-[#629DA7] mb-5">
        {lang === "es" ? "Preguntas frecuentes" : "Frequently Asked Questions"}
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
