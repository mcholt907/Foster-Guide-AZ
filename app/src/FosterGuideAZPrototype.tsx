import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  House,
  Gavel as GavelFill,
  ChatCircle,
  ShieldChevron,
  FileText as FileTextFill,
  MapPin as MapPinFill,
} from "@phosphor-icons/react";
import {
  Home as HomeIcon,
  Shield,
  Gavel,
  MapPin,
  HeartPulse,
  MessageCircle,
  X,
  Search,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Globe,
  ExternalLink,
  GraduationCap,
  FileText,
  Users,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { sendChatMessage } from "./api/chat";

/**
 * Compass — lightweight click-through prototype
 * - No backend
 * - No PII
 * - "AI chat" is a scripted simulator for storytelling
 * - Local-only personalization (language, age band, county, tribal indicator)
 */

// ─── i18n ─────────────────────────────────────────────────────────────────
type Lang = 'en' | 'es'

const UI_STRINGS = {
  // Onboarding
  onboarding_step_language:     { en: 'What language do you prefer?',           es: '¿Qué idioma prefieres?' },
  onboarding_step_age:          { en: 'How old are you?',                       es: '¿Cuántos años tienes?' },
  onboarding_step_county:       { en: 'What county do you live in?',            es: '¿En qué condado vives?' },
  onboarding_step_tribal:       { en: 'Are you affiliated with a tribal nation?', es: '¿Estás afiliado a una nación tribal?' },
  onboarding_btn_next:          { en: 'Next',                                   es: 'Siguiente' },
  onboarding_btn_start:         { en: "Let's go",                               es: 'Comenzar' },
  onboarding_btn_skip:          { en: 'Skip',                                   es: 'Omitir' },
  onboarding_tribal_yes:        { en: 'Yes',                                    es: 'Sí' },
  onboarding_tribal_no:         { en: 'No',                                     es: 'No' },
  age_band_10_12_desc:          { en: 'Learn the basics',                       es: 'Aprende lo básico' },
  age_band_13_15_desc:          { en: 'Your rights + court',                    es: 'Tus derechos + tribunal' },
  age_band_16_17_desc:          { en: 'Planning ahead',                         es: 'Planifica el futuro' },
  age_band_18_21_desc:          { en: 'Extended care + next steps',             es: 'Cuidado extendido + próximos pasos' },
  // Nav
  nav_home:                     { en: 'Home',                                   es: 'Inicio' },
  nav_case:                     { en: 'My Case',                                es: 'Mi Caso' },
  nav_ask:                      { en: 'Ask',                                    es: 'Preguntar' },
  nav_rights:                   { en: 'My Rights',                              es: 'Mis Derechos' },
  nav_future:                   { en: 'My Future',                              es: 'Mi Futuro' },
  nav_resources:                { en: 'Resources',                              es: 'Recursos' },
  nav_wellness:                 { en: 'Wellness',                               es: 'Bienestar' },
  // Home
  home_crisis_title:            { en: 'Crisis & Safety Lines',                  es: 'Líneas de Crisis y Seguridad' },
  home_crisis_always_open:      { en: 'Always open',                            es: 'Siempre disponibles' },
  // Rights
  rights_tab_what:              { en: 'What it means',                          es: 'Qué significa' },
  rights_tab_how:               { en: 'How to ask for it',                      es: 'Cómo pedirlo' },
  rights_tab_ignored:           { en: "If it's being ignored",                  es: 'Si lo están ignorando' },
  rights_escalation_title:      { en: 'If Your Rights Are Being Violated',      es: 'Si Están Violando Tus Derechos' },
  // Resources
  resources_search_placeholder: { en: 'Search resources\u2026',                 es: 'Buscar recursos\u2026' },
  resources_spanish_label:      { en: 'Spanish-speaking staff',                 es: 'Personal que habla español' },
  // Ask/Chat
  ask_title:                    { en: 'Ask Compass',                            es: 'Pregúntale a Compass' },
  ask_placeholder:              { en: 'Type your question\u2026',               es: 'Escribe tu pregunta\u2026' },
  ask_send:                     { en: 'Send',                                   es: 'Enviar' },
  ask_thinking:                 { en: 'Thinking\u2026',                         es: 'Pensando\u2026' },
  ask_crisis_header:            { en: 'Here are people who can help you right now:', es: 'Aquí hay personas que pueden ayudarte ahora mismo:' },
  // Common
  common_call:                  { en: 'Call',                                   es: 'Llamar' },
  common_text_msg:              { en: 'Text',                                   es: 'Mensaje' },
  common_website:               { en: 'Website',                                es: 'Sitio web' },
  // Onboarding hero
  onboarding_welcome_subtitle:  { en: 'You deserve real answers. This is a safe place to find them — no sign-up, nothing stored.', es: 'Mereces respuestas reales. Este es un lugar seguro para encontrarlas — sin registro, nada guardado.' },
  // Onboarding step hints
  onboarding_county_hint:       { en: 'This helps us show resources near you.', es: 'Esto nos ayuda a mostrarte recursos cerca de ti.' },
  onboarding_county_unknown:    { en: "I don't know",                           es: 'No sé' },
  onboarding_tribal_hint:       { en: "If you're a tribal member, we can show steps that may apply to your case. This stays on your device only.", es: 'Si eres miembro de una tribu, podemos mostrarte pasos que podrían aplicar a tu caso. Esto solo se guarda en tu dispositivo.' },
  onboarding_tribal_not_sure:   { en: 'Not sure',                               es: 'No estoy seguro' },
  onboarding_btn_back:          { en: 'Back',                                   es: 'Atrás' },
  // Home screen hero + CTA
  home_what_today:              { en: 'What do you need today?',                es: '¿Qué necesitas hoy?' },
  home_start_over:              { en: 'Start over',                             es: 'Empezar de nuevo' },
  home_ask_compass_btn:         { en: 'Ask Compass',                            es: 'Pregúntale a Compass' },
  // Feature card titles
  feature_case_title:           { en: 'My case explained',                      es: 'Mi caso explicado' },
  feature_rights_title:         { en: 'Know your rights',                       es: 'Conoce tus derechos' },
  feature_future_title:         { en: 'My future plan',                         es: 'Mi plan de futuro' },
  feature_resources_title:      { en: 'Find resources',                         es: 'Encuentra recursos' },
  feature_wellness_title:       { en: 'Wellness check-in',                      es: 'Chequeo de bienestar' },
  // Feature card badge
  feature_case_badge:           { en: 'Timeline + hearing prep',                es: 'Línea de tiempo + preparación' },
} as const

type StringKey = keyof typeof UI_STRINGS

function t(key: StringKey, lang: Lang | null | undefined): string {
  return UI_STRINGS[key][lang === 'es' ? 'es' : 'en']
}

const COUNTIES = [
  "Apache",
  "Cochise",
  "Coconino",
  "Gila",
  "Graham",
  "Greenlee",
  "La Paz",
  "Maricopa",
  "Mohave",
  "Navajo",
  "Pima",
  "Pinal",
  "Santa Cruz",
  "Yavapai",
  "Yuma",
];

const AGE_BANDS = [
  { id: "10-12", label: "10–12" },
  { id: "13-15", label: "13–15" },
  { id: "16-17", label: "16–17" },
  { id: "18-21", label: "18–21" },
];

type AgeBandKey = "10-12" | "13-15" | "16-17" | "18-21";



const CRISIS_PINS = [
  {
    name: "988 Suicide & Crisis Lifeline",
    how: "Call or text 988",
    how_es: "Llama o envía mensaje al 988",
    url: "https://988lifeline.org/",
  },
  {
    name: "Crisis Text Line",
    how: "Text HOME to 741741",
    how_es: "Envía HOME al 741741",
    url: "https://www.crisistextline.org/",
  },
  {
    name: "AZ DCS Child Abuse Hotline",
    how: "1-888-SOS-CHILD",
    how_es: "1-888-SOS-CHILD",
    url: "https://dcs.az.gov/about/contact",
  },
  {
    name: "ALWAYS (legal help)",
    how: "Youth legal services (AZ)",
    how_es: "Servicios legales para jóvenes (AZ)",
    url: "https://alwaysaz.org/",
  },
];

const RESOURCES = [
  {
    id: "always",
    name: "ALWAYS",
    categories: ["legal"],
    counties: ["Statewide"],
    ages: [10, 21],
    spanish: true,
    phone: "(602) 442-7230",
    url: "https://alwaysaz.org/",
    description:
      "Youth legal services and advocacy; helps kids navigate dependency court and rights.",
  },
  {
    id: "211",
    name: "211 Arizona",
    categories: ["emergency", "housing", "food"],
    counties: ["Statewide"],
    ages: [10, 99],
    spanish: true,
    phone: "2-1-1",
    url: "https://211arizona.org/",
    description:
      "Human navigators for food, shelter, help paying bills, and more. Great fallback when unsure.",
  },
  {
    id: "yati",
    name: "AHCCCS — YATI (Young Adults Transitional Insurance)",
    categories: ["health"],
    counties: ["Statewide"],
    ages: [18, 26],
    spanish: true,
    phone: "(602) 417-4000",
    url: "https://www.azahcccs.gov/Members/GetCovered/Categories/YATI.html",
    description:
      "Health coverage pathway for eligible young adults formerly in foster care.",
  },
  {
    id: "azca",
    name: "Arizona's Children Association (AzCA) — Transition supports",
    categories: ["housing", "transition"],
    counties: ["Maricopa", "Pima", "Pinal", "Coconino", "Statewide"],
    ages: [16, 21],
    spanish: true,
    phone: "(480) 247-1413",
    url: "https://www.arizonaschildren.org/",
    description:
      "Transition-to-adulthood supports; includes re-entry pathways in some programs (availability varies).",
  },
  {
    id: "newculture",
    name: "New Culture",
    categories: ["housing", "transition"],
    counties: ["Maricopa"],
    ages: [18, 24],
    spanish: true,
    phone: "(602) 461-6488",
    url: "https://www.newcultureaz.org/",
    description: "Transitional housing and supports (capacity and eligibility vary).",
  },
  {
    id: "thrive",
    name: "Thrive AZ — Transitional Housing",
    categories: ["housing"],
    counties: ["Pima"],
    ages: [18, 24],
    spanish: true,
    phone: "(520) 299-4614",
    url: "https://www.thriveaz.org/transitional-housing",
    description: "Transitional housing support (capacity varies; call first).",
  },
  {
    id: "fosteringadvocates",
    name: "Fostering Advocates Arizona",
    categories: ["rights", "community"],
    counties: ["Statewide"],
    ages: [14, 26],
    spanish: true,
    phone: "(602) 697-7184",
    url: "https://www.fosteringadvocatesarizona.org/",
    description:
      "Youth voice, advocacy, and supports for current and former foster youth.",
  },
  {
    id: "affcf",
    name: "Arizona Friends of Foster Children Foundation (AFFCF)",
    categories: ["education", "money", "transition"],
    counties: ["Statewide"],
    ages: [0, 21],
    spanish: true,
    phone: "(602) 438-7230",
    url: "https://www.affcf.org/",
    description: "Programs and support for foster youth and caregivers; resources vary by need.",
  },
  {
    id: "arizonaatwork",
    name: "ARIZONA@WORK — Local Job Center Locator",
    categories: ["employment"],
    counties: ["Statewide"],
    ages: [16, 99],
    spanish: true,
    phone: "(877) 600-2722",
    url: "https://arizonaatwork.com/locations",
    description: "Job search help, training, and local support.",
  },
];

const RIGHTS = [
  {
    id: "participate",
    title: "Having a Say in Your Case",
    citation: "A.R.S. §8-529(A)(18)",
    tiers: {
      "10-12": {
        plain:
          "The adults in your case are supposed to listen to what you need and what matters to you. Your voice counts.",
        plain_es: "Los adultos en tu caso deben escuchar lo que necesitas y lo que es importante para ti. Tu voz importa.",
        example:
          "You can tell your caseworker what helps you feel safe — at home, at school, wherever.",
        example_es: "Puedes decirle a tu trabajador de casos lo que te ayuda a sentirte seguro — en casa, en la escuela, donde sea.",
        howToAsk:
          "Before your next meeting, make a list of the things that matter most to you. You can hand it to your caseworker or ask a trusted adult to help you share it.",
        howToAsk_es: "Antes de tu próxima reunión, haz una lista de las cosas que más te importan. Puedes dársela a tu trabajador de casos o pedirle a un adulto de confianza que te ayude a compartirla.",
        ifIgnored:
          "Tell your lawyer that your wishes weren't listened to. Your lawyer has to speak up for you at the next hearing — that's their job.",
        ifIgnored_es: "Dile a tu abogado que no escucharon tus deseos. Tu abogado tiene que defender lo que quieres en la próxima audiencia — ese es su trabajo.",
      },
      "13-15": {
        plain:
          "You can be part of making your case plan and share what you want — things like school, visits, and where you live.",
        plain_es: "Puedes participar en la creación de tu plan de caso y compartir lo que quieres — cosas como la escuela, las visitas y dónde vives.",
        example:
          "Before a hearing, write down 3 things you want your attorney to say to the judge for you.",
        example_es: "Antes de una audiencia, escribe 3 cosas que quieres que tu abogado le diga al juez.",
        howToAsk:
          "Write down 3 things you want your attorney to say to the judge and give them the list before the hearing. They are required to share your wishes.",
        howToAsk_es: "Escribe 3 cosas que quieres que tu abogado le diga al juez y dáselas antes de la audiencia. Están obligados a compartir tus deseos.",
        ifIgnored:
          "Tell your attorney directly. They are required to advocate for what you want. If they aren't doing that, you can ask to have a different attorney assigned.",
        ifIgnored_es: "Díselo directamente a tu abogado. Están obligados a defender lo que quieres. Si no lo hacen, puedes pedir que te asignen otro abogado.",
      },
      "16-17": {
        plain:
          "You have a right to participate in planning your future — including questions about permanency and what happens after 18.",
        plain_es: "Tienes el derecho de participar en la planificación de tu futuro — incluyendo preguntas sobre permanencia y qué pasa después de los 18.",
        example: `Check out the hearing prep questions in the "My Case" tab to get ready.`,
        example_es: "Revisa las preguntas de preparación para la audiencia en la pestaña 'Mi Caso' para prepararte.",
        howToAsk:
          "Ask your attorney: \"Can I speak at my next hearing or submit a written statement?\" Both are options you have the right to use.",
        howToAsk_es: "Pregúntale a tu abogado: '¿Puedo hablar en mi próxima audiencia o presentar una declaración escrita?' Ambas son opciones que tienes el derecho de usar.",
        ifIgnored:
          "Ask your attorney to file an objection. You can also contact the DCS Ombudsman if you believe your voice is being systematically excluded from planning.",
        ifIgnored_es: "Pídele a tu abogado que presente una objeción. También puedes contactar al DCS Ombudsman si crees que tu voz está siendo excluida sistemáticamente de la planificación.",
      },
      "18-21": {
        plain:
          "Your plan in extended care should actually reflect your goals — school, work, housing. If it doesn't, you can ask for it to be updated.",
        plain_es: "Tu plan en el cuidado extendido debe reflejar realmente tus metas — escuela, trabajo, vivienda. Si no es así, puedes pedir que se actualice.",
        example:
          "Ask for a written summary of what was agreed to and what the next steps are.",
        example_es: "Pide un resumen escrito de lo que se acordó y cuáles son los próximos pasos.",
        howToAsk:
          "Request a copy of your current case plan and ask for a meeting to update it with your actual goals. Put the request in writing so there's a record.",
        howToAsk_es: "Solicita una copia de tu plan de caso actual y pide una reunión para actualizarlo con tus metas reales. Haz la solicitud por escrito para que quede un registro.",
        ifIgnored:
          "Contact your attorney or the DCS Ombudsman. In extended care, your participation in planning is not optional — it's required by law.",
        ifIgnored_es: "Comunícate con tu abogado o el DCS Ombudsman. En el cuidado extendido, tu participación en la planificación no es opcional — es requerida por ley.",
      },
    },
  },
  {
    id: "privacy",
    title: "Your Privacy & Communication",
    citation: "A.R.S. §8-529 (privacy provisions)",
    tiers: {
      "10-12": {
        plain: "You have the right to talk with your caseworker privately — without other people listening in.",
        plain_es: "Tienes el derecho de hablar con tu trabajador de casos en privado — sin que otras personas escuchen.",
        example: `You can say: "Can I talk with my caseworker alone for a minute?"`,
        example_es: "Puedes decir: '¿Puedo hablar con mi trabajador de casos a solas un momento?'",
        howToAsk:
          "Say: \"I'd like to talk to my caseworker alone.\" A trusted adult or teacher can help you ask if you need it.",
        howToAsk_es: "Di: 'Quisiera hablar con mi trabajador de casos a solas.' Un adulto de confianza o un maestro puede ayudarte a pedirlo si lo necesitas.",
        ifIgnored:
          "Tell your lawyer or a trusted adult what happened. Private conversations with your caseworker and lawyer are your right, not a privilege.",
        ifIgnored_es: "Dile a tu abogado o a un adulto de confianza lo que pasó. Las conversaciones privadas con tu trabajador de casos y tu abogado son tu derecho, no un privilegio.",
      },
      "13-15": {
        plain:
          "You can ask to speak privately with your caseworker and your attorney. You don't have to talk in front of others if you don't want to.",
        plain_es: "Puedes pedir hablar en privado con tu trabajador de casos y tu abogado. No tienes que hablar frente a otros si no quieres.",
        example:
          "If you don't feel comfortable speaking freely, ask: \"Can we find a private time and place to talk?\"",
        example_es: "Si no te sientes cómodo hablando libremente, pregunta: '¿Podemos encontrar un momento y lugar privado para hablar?'",
        howToAsk:
          "Say: \"Can we find a private time and place to talk?\" You can also ask your attorney to schedule a private call directly with you.",
        howToAsk_es: "Di: '¿Podemos encontrar un momento y lugar privado para hablar?' También puedes pedirle a tu abogado que programe una llamada privada directamente contigo.",
        ifIgnored:
          "Tell your attorney. Private communication with your lawyer is protected by law — even if others disagree or push back.",
        ifIgnored_es: "Díselo a tu abogado. La comunicación privada con tu abogado está protegida por ley — aunque otros no estén de acuerdo o se opongan.",
      },
      "16-17": {
        plain:
          "You have the right to private calls and meetings with your attorney and caseworker. If someone keeps blocking that, you can push back.",
        plain_es: "Tienes el derecho a llamadas y reuniones privadas con tu abogado y trabajador de casos. Si alguien sigue bloqueando eso, puedes defenderte.",
        example: "If it keeps getting blocked, follow the steps in the escalation ladder below.",
        example_es: "Si sigue siendo bloqueado, sigue los pasos en la escalera de escalada que aparece abajo.",
        howToAsk:
          "Request private meeting times in writing (text or email) so you have a record. Ask your attorney to call you directly, not through a third party.",
        howToAsk_es: "Solicita tiempos de reunión privados por escrito (texto o correo electrónico) para tener un registro. Pídele a tu abogado que te llame directamente, no a través de un tercero.",
        ifIgnored:
          "This is a right, not a favor. Escalate to the caseworker's supervisor, then to the DCS Ombudsman if it keeps being blocked.",
        ifIgnored_es: "Este es un derecho, no un favor. Escala al supervisor del trabajador de casos, luego al DCS Ombudsman si sigue siendo bloqueado.",
      },
      "18-21": {
        plain:
          "You can ask for privacy in your communications and ask who has access to your information — that's a fair question.",
        plain_es: "Puedes pedir privacidad en tus comunicaciones y preguntar quién tiene acceso a tu información — esa es una pregunta justa.",
        example:
          "If you're in extended care, ask which provider or coach is responsible for your case.",
        example_es: "Si estás en cuidado extendido, pregunta qué proveedor o entrenador es responsable de tu caso.",
        howToAsk:
          "Ask who has access to your records and request that sensitive communications come directly to you, not through a third party.",
        howToAsk_es: "Pregunta quién tiene acceso a tus registros y solicita que las comunicaciones confidenciales lleguen directamente a ti, no a través de un tercero.",
        ifIgnored:
          "Contact your attorney. Privacy rights don't end at 18. In extended care, you still control your own information.",
        ifIgnored_es: "Comunícate con tu abogado. Los derechos de privacidad no terminan a los 18. En el cuidado extendido, tú controlas tu propia información.",
      },
    },
  },
  {
    id: "siblings",
    title: "Seeing Your Brothers & Sisters",
    citation: "A.R.S. §8-529(A)(4)",
    tiers: {
      "10-12": {
        plain:
          "You can usually visit and talk with your brothers and sisters. The adults in your case should help make that happen.",
        plain_es: "Por lo general puedes visitar y hablar con tus hermanos y hermanas. Los adultos en tu caso deben ayudar a que eso suceda.",
        example:
          "If you haven't been able to see your sibling, you can ask your caseworker: \"Why not, and when can I?\"",
        example_es: "Si no estás con tus hermanos, puedes preguntarle a tu trabajador de casos: '¿Cuándo puedo ver a mis hermanos?'",
        howToAsk:
          "Ask your caseworker: \"When can I see my brother or sister? Who makes that happen?\" If you need help asking, a teacher or trusted adult can ask for you.",
        howToAsk_es: "Di: 'Extraño a mis hermanos y quiero visitarlos.' Tu trabajador de casos debe organizar visitas regulares. Si puedes, escríbelo también.",
        ifIgnored:
          "Tell your lawyer that you haven't been able to see your sibling. They can ask the judge to help at the next hearing.",
        ifIgnored_es: "Dile a tu abogado que no se están organizando las visitas. Tu abogado puede pedirle al juez que ordene las visitas.",
      },
      "13-15": {
        plain:
          "You have a right to stay in contact with your siblings — unless a judge has decided it isn't safe. That's the rule, and you can ask about it.",
        plain_es: "Tienes el derecho a ver regularmente a tus hermanos, aunque estén en distintos hogares de cuidado. DCS debe ayudar a organizar las visitas.",
        example: `Ask your caseworker: "When is my next sibling visit, and who sets it up?"`,
        example_es: "Pide visitas programadas para que sean consistentes y no dependan solo de que alguien se acuerde.",
        howToAsk:
          "Ask for a date, not just a promise: \"When is my next sibling visit, and who sets it up?\" Keep a record of what they say.",
        howToAsk_es: "Dile a tu trabajador de casos: 'Quiero visitas regulares con mis hermanos — ¿podemos programarlas?' Pide que se pongan por escrito en tu plan de caso.",
        ifIgnored:
          "Tell your attorney you haven't had contact. They can raise it at the next hearing. DCS must show a reason for restricting sibling visits — the burden is not on you.",
        ifIgnored_es: "Díselo a tu abogado. Las visitas entre hermanos están protegidas legalmente. Tu abogado puede solicitar una orden del tribunal si DCS no las organiza.",
      },
      "16-17": {
        plain:
          "You have a right to sibling contact. If it isn't happening, you can ask for a clear reason and a plan to fix it — and you deserve a real answer.",
        plain_es: "Tienes el derecho a mantener el contacto con tus hermanos. Si las visitas se bloquean sin una razón válida, eso puede ser una violación de tus derechos.",
        example:
          "If your caseworker doesn't follow through, you can ask to speak with their supervisor.",
        example_es: "Lleva un registro de cuándo se negaron o cancelaron las visitas — esa documentación importa.",
        howToAsk:
          "Ask for a written schedule of visits. If contact is being restricted, you have a right to know the specific reason in writing.",
        howToAsk_es: "Solicita visitas programadas por escrito y pide que se incluyan en tu plan de caso. Si se rechazan, pide una explicación por escrito también.",
        ifIgnored:
          "Ask your attorney to request a court order. A judge can order sibling visits if DCS isn't following through on its own.",
        ifIgnored_es: "Contacta a tu abogado de inmediato. Las visitas entre hermanos son un derecho legal. Tu abogado puede llevar esto al juez.",
      },
      "18-21": {
        plain:
          "Even in extended care, you can advocate for staying connected with your family and siblings. That matters, and it can be part of your plan.",
        plain_es: "Incluso en el cuidado extendido, mantener el contacto con tus hermanos importa. Si DCS no está apoyando eso, puedes defender tu derecho.",
        example: "Write down your requests with dates so you have a record if you need to follow up.",
        example_es: "Si ya saliste del sistema pero tienes hermanos que todavía están en él, contacta a ALWAYS o Fostering Advocates AZ para orientación.",
        howToAsk:
          "Ask your case manager to write sibling connection into your transition plan — not just as a note, but as an action item with a timeline.",
        howToAsk_es: "Comunícate directamente con tus hermanos si puedes, y pide a tu trabajador de casos apoyo para las visitas o transporte si lo necesitas.",
        ifIgnored:
          "Contact your attorney or Fostering Advocates AZ. Sibling rights don't expire at 18, and a lawyer can help you enforce them.",
        ifIgnored_es: "Contacta a ALWAYS (1-855-ALWAYS-1) o Fostering Advocates AZ para ayuda legal. Los derechos de contacto entre hermanos no desaparecen cuando cumples 18.",
      },
    },
  },
];

const COURT_STAGES = [
  {
    id: "prelim",
    title: "First safety hearing (Preliminary Protective Hearing)",
    title_es: "Primera audiencia de seguridad (Audiencia Preliminar de Protección)",
    what: "The judge checks if you're safe and decides what happens right away — usually within a few days.",
    what_es: "El juez verifica si estás seguro y decide qué pasa de inmediato — generalmente en unos pocos días.",
    youth: "Before it starts, tell your lawyer what you want the judge to hear. They're there to speak up for you.",
    youth_es: "Antes de que comience, dile a tu abogado lo que quieres que el juez escuche. Están ahí para hablar por ti.",
    next: "Dates for the next hearings are set.",
    next_es: "Se establecen fechas para las próximas audiencias.",
  },
  {
    id: "adjudication",
    title: "Facts hearing (Adjudication)",
    title_es: "Audiencia de hechos (Adjudicación)",
    what: "The court decides if the concerns in your case are proven and whether the case continues.",
    what_es: "El tribunal decide si las preocupaciones en tu caso están probadas y si el caso continúa.",
    youth: `Ask your lawyer: "What does this mean for where I live and my school?"`,
    youth_es: "Pregúntale a tu abogado: '¿Qué significa esto para dónde vivo y mi escuela?'",
    next: "Your case plan and services get reviewed and updated.",
    next_es: "Tu plan de caso y los servicios se revisan y actualizan.",
  },
  {
    id: "review",
    title: "Check‑in hearing (Review Hearing)",
    title_es: "Audiencia de seguimiento (Audiencia de Revisión)",
    what: "The judge checks in on how your plan is going and what needs to change.",
    what_es: "El juez verifica cómo va tu plan y qué necesita cambiar.",
    youth: "Come with 1–2 updates you want people to know: what's working and what isn't.",
    youth_es: "Ven con 1 o 2 actualizaciones que quieres que la gente sepa: qué está funcionando y qué no.",
    next: "More check-ins are scheduled, or you move toward a long-term plan hearing.",
    next_es: "Se programan más seguimientos, o avanzas hacia una audiencia de plan a largo plazo.",
  },
  {
    id: "permanency",
    title: "Long‑term plan hearing (Permanency Hearing)",
    title_es: "Audiencia de plan a largo plazo (Audiencia de Permanencia)",
    what: "The judge discusses the long-term plan for you — like going home, guardianship, or adoption.",
    what_es: "El juez discute el plan a largo plazo para ti — como regresar a casa, tutela o adopción.",
    youth: "Ask your lawyer to walk you through each option in plain words. You have a say in this.",
    youth_es: "Pídele a tu abogado que te explique cada opción en palabras simples. Tienes voz en esto.",
    next: "Everyone takes steps toward the long-term plan.",
    next_es: "Todos toman medidas hacia el plan a largo plazo.",
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function bandToRange(bandId: string) {
  const map: Record<string, [number, number]> = {
    "10-12": [10, 12],
    "13-15": [13, 15],
    "16-17": [16, 17],
    "18-21": [18, 21],
  };
  return map[bandId] || [10, 21];
}


function pill(cls: string) {
  return `inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${cls}`;
}

function getCategoryAccent(categories: string[]): string {
  if (categories.includes("legal")) return "bg-[#1B3A5C]";
  if (categories.includes("emergency")) return "bg-rose-500";
  if (categories.includes("housing")) return "bg-[#2A7F8E]";
  if (categories.includes("health")) return "bg-emerald-500";
  if (categories.includes("employment")) return "bg-[#D97706]";
  if (categories.includes("education")) return "bg-purple-500";
  if (categories.includes("rights")) return "bg-[#2A7F8E]";
  return "bg-slate-300";
}


// ─── who's who data ────────────────────────────────────────────────────────────

const WHO_IN_YOUR_CASE = [
  {
    id: "caseworker",
    title: "Your DCS Case Manager",
    title_es: "Tu trabajador/a de casos (DCS)",
    aka: "Also called: caseworker",
    aka_es: "También llamado: caseworker",
    emoji: "👤",
    color: "#2A7F8E",
    role: "Your main point of contact at the Department of Child Safety (DCS).",
    role_es: "Tu contacto principal en el Departamento de Seguridad Infantil (DCS).",
    what: "They manage your case day-to-day — writing your case plan, scheduling visits, and connecting you to services. By law they're supposed to meet with you at least once a month in person.",
    what_es: "Maneja tu caso día a día — escribe tu plan de caso, programa visitas y te conecta con servicios. Por ley debe reunirse contigo en persona al menos una vez al mes.",
    tip: "Keep their number saved. If something feels wrong or isn't happening, they're your first call.",
    tip_es: "Guarda su número. Si algo se siente mal o no está pasando, es tu primera llamada.",
  },
  {
    id: "judge",
    title: "The Judge",
    title_es: "El/La juez",
    aka: "Also called: dependency court judge",
    aka_es: "También llamado: juez del tribunal de dependencia",
    emoji: "⚖️",
    color: "#1B3A5C",
    role: "Makes the big legal decisions about your case — including where you live.",
    role_es: "Toma las grandes decisiones legales sobre tu caso — incluyendo dónde vives.",
    what: "A Superior Court judge oversees your dependency case. They approve your case plan, decide placement, and make the final call at every hearing. You have the right to speak at hearings — your voice counts.",
    what_es: "Un juez del Tribunal Superior supervisa tu caso de dependencia. Aprueba tu plan de caso, decide la colocación y da el veredicto final en cada audiencia. Tienes el derecho de hablar — tu voz cuenta.",
    tip: "You can tell the judge how you feel, what you want, and what's not working — through your attorney or by asking to address the court directly.",
    tip_es: "Puedes decirle al juez cómo te sientes, qué quieres y qué no está funcionando — a través de tu abogado o pidiéndole al tribunal que te dé la palabra.",
  },
  {
    id: "attorney",
    title: "Your Attorney",
    title_es: "Tu abogado/a",
    aka: "Also called: your lawyer",
    aka_es: "También llamado: tu abogado",
    emoji: "📋",
    color: "#D97706",
    role: "Represents only you — not DCS, not your parents, not the foster family.",
    role_es: "Te representa solo a ti — no a DCS, no a tus padres, no a la familia adoptiva.",
    what: "Arizona law gives every youth in foster care the right to an attorney. They go to court with you, explain what's happening, and argue for what you want. Everything you tell them stays private.",
    what_es: "La ley de Arizona le da a todo joven en cuidado adoptivo el derecho a un abogado. Va al tribunal contigo, explica lo que está pasando y argumenta lo que tú quieres. Todo lo que le cuentes queda en privado.",
    tip: "Be honest with your attorney — they can only fight for you if they know what's really going on. If you don't have one, ask your caseworker immediately.",
    tip_es: "Sé honesto con tu abogado — solo puede luchar por ti si sabe lo que realmente está pasando. Si no tienes uno, pídelo a tu trabajador/a de casos de inmediato.",
  },
  {
    id: "casa",
    title: "CASA Volunteer",
    title_es: "Voluntario/a CASA",
    aka: "Court Appointed Special Advocate",
    aka_es: "Defensor Especial Nombrado por el Tribunal",
    emoji: "🤝",
    color: "#2A7F8E",
    role: "A trained community volunteer who gets to know you personally and speaks up for you in court.",
    role_es: "Un voluntario de la comunidad capacitado que te conoce personalmente y habla por ti en el tribunal.",
    what: "Unlike your caseworker, a CASA has one job: figure out what's best for you and tell the judge. They visit you regularly, read your full case file, and write a report for the court. Not everyone has one — but you can request one.",
    what_es: "A diferencia de tu trabajador/a de casos, un CASA tiene un solo trabajo: determinar qué es mejor para ti y decírselo al juez. Te visita regularmente, lee tu expediente completo y escribe un informe para el tribunal. No todos tienen uno — pero puedes pedirlo.",
    tip: "CASA volunteers are not DCS employees. They chose to be there for kids. They tend to have more time for you than a caseworker does.",
    tip_es: "Los voluntarios de CASA no son empleados de DCS. Eligieron estar ahí para los jóvenes. Suelen tener más tiempo para ti que un trabajador de casos.",
  },
  {
    id: "caregiver",
    title: "Foster Parent or Kinship Caregiver",
    title_es: "Padre/madre adoptivo/a o cuidador/a pariente",
    aka: "Also called: foster family, relative caregiver",
    aka_es: "También llamado: familia adoptiva, cuidador pariente",
    emoji: "🏠",
    color: "#059669",
    role: "The adult(s) you live with, licensed or approved by DCS to provide a safe home.",
    role_es: "El/los adulto(s) con quien vives, autorizado/s o aprobado/s por DCS para proveer un hogar seguro.",
    what: "They're responsible for your day-to-day care — meals, school, safety, and activities. A kinship caregiver is a relative or someone you already knew. They are not your caseworker, but they should be a source of stability.",
    what_es: "Son responsables de tu cuidado diario — comidas, escuela, seguridad y actividades. Un cuidador pariente es un familiar o alguien que ya conocías. No son tu trabajador/a de casos, pero deben ser una fuente de estabilidad.",
    tip: "If you ever feel unsafe where you're living, tell your caseworker, attorney, or CASA right away. You have the right to be safe.",
    tip_es: "Si alguna vez te sientes inseguro donde vives, díselo a tu trabajador/a de casos, abogado o CASA de inmediato. Tienes el derecho a estar seguro.",
  },
  {
    id: "gal",
    title: "Guardian ad Litem (GAL)",
    title_es: "Guardian ad Litem (GAL)",
    aka: "Sometimes the same person as your attorney",
    aka_es: "A veces es la misma persona que tu abogado",
    emoji: "🛡️",
    color: "#7c3aed",
    role: "Someone appointed by the court specifically to represent your best interests.",
    role_es: "Alguien nombrado por el tribunal específicamente para representar tu mejor interés.",
    what: "In some cases the court appoints a GAL who is separate from your attorney. They look at your whole situation — school, health, placement, relationships — and advise the judge. In Arizona, this role is sometimes filled by your attorney or your CASA.",
    what_es: "En algunos casos el tribunal nombra un GAL separado de tu abogado. Revisa toda tu situación — escuela, salud, colocación, relaciones — y aconseja al juez. En Arizona, este rol a veces lo cumple tu abogado o tu CASA.",
    tip: "Ask your attorney or caseworker if you have a GAL and who they are.",
    tip_es: "Pregúntale a tu abogado o trabajador/a de casos si tienes un GAL y quién es.",
  },
  {
    id: "supervisor",
    title: "DCS Supervisor",
    title_es: "Supervisor/a de DCS",
    aka: "Your caseworker's boss",
    aka_es: "El/la jefe/a de tu trabajador/a de casos",
    emoji: "📞",
    color: "#1B3A5C",
    role: "Oversees your caseworker. Your escalation contact when things aren't being resolved.",
    role_es: "Supervisa a tu trabajador/a de casos. Tu contacto de escalación cuando las cosas no se resuelven.",
    what: "If you've raised a concern with your caseworker and nothing is changing, ask to speak with their supervisor. Keep a written record of when you asked and what was said — dates matter.",
    what_es: "Si has planteado una preocupación con tu trabajador/a de casos y nada está cambiando, pide hablar con su supervisor/a. Guarda un registro escrito de cuándo preguntaste y qué dijeron — las fechas importan.",
    tip: "Asking to escalate is normal and OK. The system is designed for it. You won't get in trouble for asking.",
    tip_es: "Pedir escalar es normal y está bien. El sistema está diseñado para ello. No te meterás en problemas por preguntar.",
  },
] as const;

// ─── documents data ────────────────────────────────────────────────────────────

const IMPORTANT_DOCS = [
  {
    id: "birth-cert",
    label: "Birth certificate",
    label_es: "Acta de nacimiento",
    why: "You need this to get almost everything else — start here.",
    why_es: "Necesitas esto para obtener casi todo lo demás — empieza aquí.",
    steps: [
      "Ask your caseworker first. DCS can request your birth certificate for free on your behalf.",
      "If that doesn't work, contact the Arizona Department of Health Services (ADHS) directly.",
      "Call (602) 364-1300 or go to azdhs.gov to order a copy online.",
      "It's free for foster youth in Arizona — if anyone tries to charge you, remind them of A.R.S. §8-514.06.",
    ],
    steps_es: [
      "Primero pregúntale a tu trabajador/a de casos. DCS puede solicitar tu acta de nacimiento gratis en tu nombre.",
      "Si eso no funciona, comunícate directamente con el Departamento de Servicios de Salud de Arizona (ADHS).",
      "Llama al (602) 364-1300 o ve a azdhs.gov para pedir una copia en línea.",
      "Es gratis para jóvenes en cuidado adoptivo en Arizona — si alguien intenta cobrarte, recuérdales A.R.S. §8-514.06.",
    ],
    contact: "ADHS Vital Records: (602) 364-1300",
    contact_es: "Registros Vitales de ADHS: (602) 364-1300",
  },
  {
    id: "ssn-card",
    label: "Social Security card",
    label_es: "Tarjeta de Seguro Social",
    why: "Needed for jobs, benefits, and your state ID. Your number may already be in your DCS file.",
    why_es: "Necesaria para empleos, beneficios y tu identificación estatal. Tu número puede estar ya en tu expediente de DCS.",
    steps: [
      "Ask your caseworker for your Social Security number — it should be in your case file.",
      "To get a physical replacement card, go to ssa.gov or call 1-800-772-1213.",
      "Bring your birth certificate when you apply (or ask your caseworker to help).",
      "Replacement cards are free — you can get up to 3 per year.",
    ],
    steps_es: [
      "Pídele a tu trabajador/a de casos tu número de Seguro Social — debe estar en tu expediente.",
      "Para obtener una tarjeta de reemplazo, ve a ssa.gov o llama al 1-800-772-1213.",
      "Lleva tu acta de nacimiento cuando solicites (o pídele a tu trabajador/a que te ayude).",
      "Las tarjetas de reemplazo son gratis — puedes obtener hasta 3 por año.",
    ],
    contact: "Social Security Administration: 1-800-772-1213",
    contact_es: "Administración del Seguro Social: 1-800-772-1213",
  },
  {
    id: "state-id",
    label: "State ID / driver's license",
    label_es: "Identificación estatal / licencia de conducir",
    why: "Get your birth certificate and Social Security card first — you'll need both.",
    why_es: "Obtén primero tu acta de nacimiento y tarjeta de Seguro Social — necesitarás ambas.",
    steps: [
      "Get your birth certificate and Social Security card before you go.",
      "Visit an Arizona MVD office or start at azmvdnow.gov.",
      "Ask your caseworker about a fee waiver — foster youth often qualify.",
      "Bring proof of Arizona address (a letter from DCS on their letterhead works).",
    ],
    steps_es: [
      "Consigue tu acta de nacimiento y tarjeta de Seguro Social antes de ir.",
      "Visita una oficina de MVD de Arizona o comienza en azmvdnow.gov.",
      "Pregúntale a tu trabajador/a de casos sobre una exención de tarifas — los jóvenes en cuidado adoptivo frecuentemente califican.",
      "Lleva comprobante de domicilio en Arizona (una carta de DCS en su membrete funciona).",
    ],
    contact: "AZ Motor Vehicle Division: azmvdnow.gov",
    contact_es: "División de Vehículos de Motor de AZ: azmvdnow.gov",
  },
  {
    id: "immunizations",
    label: "Immunization records",
    label_es: "Registro de vacunas",
    why: "Schools and some jobs require these. Your caseworker may already have them.",
    why_es: "Las escuelas y algunos empleos los requieren. Tu trabajador/a de casos puede tenerlos.",
    steps: [
      "Ask your caseworker — DCS is required to keep your immunization records.",
      "Check with your school's health office — they often keep records on file.",
      "If you still can't find them, Arizona has a statewide registry. Call ADHS at (602) 364-3630.",
      "Any doctor or clinic you've visited can also provide records of shots they gave you.",
    ],
    steps_es: [
      "Pregúntale a tu trabajador/a de casos — DCS está obligado a conservar tus registros de vacunas.",
      "Consulta con la enfermería de tu escuela — frecuentemente guardan registros.",
      "Si aún no los encuentras, Arizona tiene un registro estatal. Llama a ADHS al (602) 364-3630.",
      "Cualquier médico o clínica que hayas visitado también puede darte registros de vacunas que aplicaron.",
    ],
    contact: "AZ Immunization Registry: (602) 364-3630",
    contact_es: "Registro de Vacunas de AZ: (602) 364-3630",
  },
] as const;

// ─── feature card config ───────────────────────────────────────────────────────

const FEATURE_CARDS = [
  {
    id: "case",
    icon: Gavel,
    title: "My case explained",
    subtitle: "What your hearings actually mean, who will be there, and how to show up ready.",
    badge: "Timeline + hearing prep",
    gradient: "from-[#1B3A5C]/8 to-transparent",
    iconBg: "bg-[#1B3A5C]/10",
    iconColor: "text-[#1B3A5C]",
    pillCls: "bg-[#1B3A5C]/10 text-[#1B3A5C] ring-1 ring-[#1B3A5C]/20",
    chevronColor: "text-[#1B3A5C]/40",
  },
  {
    id: "rights",
    icon: Shield,
    title: "Know your rights",
    subtitle: "Your rights, in plain words — and what to do if they're not being respected.",
    badge: "",
    gradient: "from-[#2A7F8E]/10 to-transparent",
    iconBg: "bg-[#2A7F8E]/10",
    iconColor: "text-[#2A7F8E]",
    pillCls: "bg-[#2A7F8E]/10 text-[#2A7F8E] ring-1 ring-[#2A7F8E]/25",
    chevronColor: "text-[#2A7F8E]/50",
  },
  {
    id: "future",
    icon: FileText,
    title: "My future plan",
    subtitle: "Turning 18 is a lot. Here's your checklist — options, deadlines, and documents.",
    badge: "",
    gradient: "from-[#D97706]/10 to-transparent",
    iconBg: "bg-[#D97706]/10",
    iconColor: "text-[#D97706]",
    pillCls: "bg-[#D97706]/10 text-[#D97706] ring-1 ring-[#D97706]/25",
    chevronColor: "text-[#D97706]/50",
  },
  {
    id: "resources",
    icon: MapPin,
    title: "Find resources",
    subtitle: "Real organizations near you that can help — filtered for your county and age.",
    badge: "",
    gradient: "from-emerald-500/8 to-transparent",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-700",
    pillCls: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20",
    chevronColor: "text-emerald-600/40",
  },
  {
    id: "wellness",
    icon: HeartPulse,
    title: "Wellness check-in",
    subtitle: "Tools to help you feel calmer — and how to reach a real person when you need one.",
    badge: "",
    gradient: "from-rose-400/8 to-transparent",
    iconBg: "bg-rose-400/10",
    iconColor: "text-rose-600",
    pillCls: "bg-rose-400/10 text-rose-700 ring-1 ring-rose-400/20",
    chevronColor: "text-rose-400/40",
  },
];

// Age-adapted feature card subtitles keyed by card id → age band
const FEATURE_CARD_SUBTITLES: Record<string, Record<AgeBandKey, string>> = {
  rights: {
    "10-12": "Find out what you're allowed to do and who has to listen to you.",
    "13-15": "Your rights — plain words, real examples, and what to do if they're ignored.",
    "16-17": "Your rights, in plain words — and what to do if they're not being respected.",
    "18-21": "Arizona law protects you even after 18. Know your rights and how to use them.",
  },
  case: {
    "10-12": "What's happening in court and who all those people are.",
    "13-15": "What your hearings mean, who's there, and how to prepare.",
    "16-17": "What your hearings actually mean, who will be there, and how to show up ready.",
    "18-21": "Understanding your hearings and what each one could mean for your future.",
  },
  future: {
    "10-12": "Learn what turning 18 means — you don't have to figure it out alone.",
    "13-15": "Start learning about what happens when you turn 18 — it's closer than it seems.",
    "16-17": "Turning 18 is a lot. Here's your checklist — options, deadlines, and documents.",
    "18-21": "EFC, school money, housing, and documents — your step-by-step plan.",
  },
  resources: {
    "10-12": "Find real people and places near you that can help.",
    "13-15": "Real organizations near you — filtered for your county and what you need.",
    "16-17": "Real organizations near you that can help — filtered for your county and age.",
    "18-21": "Housing, jobs, health, legal help — organizations filtered for you.",
  },
  wellness: {
    "10-12": "It's okay to feel a lot of feelings. Here are some things that can help.",
    "13-15": "Tools to help when things feel overwhelming — and how to reach a real person.",
    "16-17": "Tools to help you feel calmer — and how to reach a real person when you need one.",
    "18-21": "Support tools and real contacts for when things get heavy.",
  },
};

const FEATURE_CARD_SUBTITLES_ES: Record<string, Record<AgeBandKey, string>> = {
  rights: {
    "10-12": "Descubre lo que tienes permitido hacer y quién tiene que escucharte.",
    "13-15": "Tus derechos — palabras sencillas, ejemplos reales, y qué hacer si los ignoran.",
    "16-17": "Tus derechos, en palabras sencillas — y qué hacer si no los están respetando.",
    "18-21": "La ley de Arizona te protege incluso después de los 18. Conoce tus derechos y cómo usarlos.",
  },
  case: {
    "10-12": "Qué está pasando en el tribunal y quiénes son todas esas personas.",
    "13-15": "Qué significan tus audiencias, quién está ahí y cómo prepararte.",
    "16-17": "Qué significan realmente tus audiencias, quién estará ahí y cómo llegar listo.",
    "18-21": "Entiende tus audiencias y lo que cada una podría significar para tu futuro.",
  },
  future: {
    "10-12": "Aprende qué significa cumplir 18 — no tienes que resolverlo solo.",
    "13-15": "Empieza a aprender qué pasa cuando cumples 18 — está más cerca de lo que crees.",
    "16-17": "Cumplir 18 es mucho. Aquí está tu lista — opciones, plazos y documentos.",
    "18-21": "EFC, dinero para estudios, vivienda y documentos — tu plan paso a paso.",
  },
  resources: {
    "10-12": "Encuentra personas y lugares reales cerca de ti que pueden ayudar.",
    "13-15": "Organizaciones reales cerca de ti — filtradas para tu condado y lo que necesitas.",
    "16-17": "Organizaciones reales cerca de ti — filtradas para tu condado y edad.",
    "18-21": "Vivienda, empleos, salud, ayuda legal — organizaciones filtradas para ti.",
  },
  wellness: {
    "10-12": "Está bien sentir muchas cosas. Aquí hay cosas que pueden ayudar.",
    "13-15": "Herramientas para cuando todo se siente abrumador — y cómo contactar a una persona real.",
    "16-17": "Herramientas para sentirte más tranquilo — y cómo contactar a una persona real cuando lo necesites.",
    "18-21": "Herramientas de apoyo y contactos reales para cuando las cosas se ponen difíciles.",
  },
};

// ─── small UI primitives ───────────────────────────────────────────────────────

function ScreenHero({
  title,
  subtitle,
  gradient,
  icon: Icon,
  right,
}: {
  title: string;
  subtitle: string;
  gradient: string;
  icon: React.ElementType;
  right?: React.ReactNode;
}) {
  return (
    <div className={`rounded-3xl bg-gradient-to-br ${gradient} p-5 shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="rounded-2xl bg-white/15 p-2.5 backdrop-blur-sm">
          <Icon className="h-5 w-5 text-white" />
        </div>
        {right}
      </div>
      <div className="text-xl font-bold text-white leading-snug">{title}</div>
      <div className="mt-1.5 text-sm text-white/80 leading-relaxed">{subtitle}</div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  right,
  iconClassName,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-2xl p-2 shadow-sm ring-1 ring-black/5 ${iconClassName ?? "bg-white/60"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-semibold leading-tight text-[#1B3A5C]">{title}</div>
          {subtitle ? (
            <div className="mt-0.5 text-sm text-slate-500">{subtitle}</div>
          ) : null}
        </div>
      </div>
      {right}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className={pill("bg-white/70 text-slate-600 shadow-sm ring-1 ring-black/8")}>
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ElementType;
  variant?: "default" | "amber" | "teal";
}) {
  const cls =
    variant === "amber"
      ? "bg-[#D97706] hover:bg-[#c96a00] text-white"
      : variant === "teal"
        ? "bg-[#2A7F8E] hover:bg-[#236d7a] text-white"
        : "bg-[#1B3A5C] hover:bg-[#152e49] text-white";
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm active:scale-[0.99] transition-all ${cls}`}
    >
      <span className="flex items-center justify-center gap-2">
        {Icon ? <Icon className="h-4 w-4" /> : null}
        {children}
      </span>
    </button>
  );
}

function Card({
  children,
  onClick,
  className = "",
  accentColor,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  accentColor?: string;
}) {
  const clickable = !!onClick;
  if (accentColor) {
    return (
      <div
        onClick={onClick}
        className={
          "flex overflow-hidden rounded-3xl bg-white/85 shadow-sm ring-1 ring-black/5 " +
          (clickable ? "cursor-pointer hover:shadow-md active:scale-[0.995] " : "") +
          className
        }
      >
        <div className={`w-1 shrink-0 ${accentColor}`} />
        <div className="flex-1 p-4">{children}</div>
      </div>
    );
  }
  return (
    <div
      onClick={onClick}
      className={
        "rounded-3xl bg-white/85 p-4 shadow-sm ring-1 ring-black/5 " +
        (clickable ? "cursor-pointer hover:shadow-md active:scale-[0.995] " : "") +
        className
      }
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-3 h-px w-full bg-slate-200/70" />;
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ y: 30, opacity: 0.9, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#1B3A5C] px-4 py-3">
              <div className="text-sm font-semibold text-white">{title}</div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-white/70 hover:bg-white/10"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function StatCite({ children }: { children: React.ReactNode }) {
  return (
    <span className={pill("bg-[#D97706]/10 text-[#9a5200] ring-1 ring-[#D97706]/25")}>
      {children}
    </span>
  );
}

function SafeNotice() {
  return (
    <div className="rounded-2xl bg-white/60 p-3 text-xs text-slate-500 ring-1 ring-slate-200/80">
      <div className="font-semibold text-slate-700">Just so you know</div>
      <div className="mt-1">
        I share information to help you understand your situation — but I can't give legal or medical advice.
        For your specific situation, talk to your caseworker, lawyer, or a trusted adult.
      </div>
    </div>
  );
}

// ─── visual components ─────────────────────────────────────────────────────────

function EscalationLadder({ ageBand, lang }: { ageBand?: string | null; lang?: Lang | null }) {
  const steps = [
    {
      n: 1,
      role: "Your caseworker",
      role_es: "Tu trabajador/a de casos",
      action: "Tell them what's not right and ask them to fix it. Sending a text or email creates a record you can refer back to.",
      action_es: "Diles qué está mal y pídeles que lo corrijan. Enviar un texto o correo crea un registro al que puedes referirte después.",
    },
    {
      n: 2,
      role: "Their supervisor",
      role_es: "Su supervisor/a",
      action: `If nothing changes, ask: "Can I speak with your supervisor?" Write down the date you asked and what they said.`,
      action_es: "Si nada cambia, pregunta: '¿Puedo hablar con su supervisor/a?' Anota la fecha y lo que dijeron.",
    },
    {
      n: 3,
      role: "DCS Ombudsman",
      role_es: "Ombudsman de DCS",
      action: "You can file a formal complaint. They're separate from DCS — and they have to respond.",
      action_es: "Puedes presentar una queja formal. Son independientes de DCS — y tienen que responder.",
    },
    {
      n: 4,
      role: "Your attorney / court",
      role_es: "Tu abogado / tribunal",
      action: "Your lawyer can bring this up at your next hearing. That's exactly what they're there for.",
      action_es: "Tu abogado puede plantearlo en tu próxima audiencia. Para eso está exactamente.",
    },
  ];
  return (
    <div>
      {steps.map((s, i) => (
        <div key={s.n} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2A7F8E] text-white text-xs font-bold shadow-sm">
              {s.n}
            </div>
            {i < steps.length - 1 && (
              <div className="my-1 w-0.5 flex-1 bg-[#2A7F8E]/20 min-h-[18px]" />
            )}
          </div>
          <div className="pb-4 flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#1B3A5C]">{lang === 'es' ? s.role_es : s.role}</div>
            <div className="mt-0.5 text-xs text-slate-600 leading-relaxed">{lang === 'es' ? s.action_es : s.action}</div>
          </div>
        </div>
      ))}
      {ageBand !== "10-12" && ageBand !== "13-15" && (
        <div className="mt-1 flex flex-wrap gap-2">
          <StatCite>A.R.S. §8-529(D)</StatCite>
        </div>
      )}
    </div>
  );
}

function DeadlineBanner({
  label,
  date,
  note,
  onAct,
  lang,
}: {
  label: string;
  date: string;
  note?: string;
  onAct?: () => void;
  lang?: Lang | null;
}) {
  return (
    <div className="rounded-3xl bg-[#D97706] px-4 py-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/20 p-2.5 shadow-sm">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-100/80">
            {label}
          </div>
          <div className="text-xl font-bold text-white leading-tight">{date}</div>
          {note && <div className="mt-0.5 text-xs text-amber-100/70">{note}</div>}
        </div>
        <button
          onClick={onAct}
          className="shrink-0 rounded-2xl bg-white/15 px-3 py-2 ring-1 ring-white/25 hover:bg-white/25 transition-colors"
        >
          <div className="flex items-center gap-1 text-xs font-semibold text-white">
            {lang === 'es' ? 'Actuar ahora' : 'Act now'}
            <ArrowRight className="h-3 w-3" />
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── layout shell ──────────────────────────────────────────────────────────────

function TopBar({
  title,
  onQuickExit,
  onOpenChat,
  onBack,
}: {
  title: string;
  onQuickExit: () => void;
  onOpenChat: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="sticky top-0 z-40">
      <div className="flex items-center justify-between bg-[#1B3A5C] px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              onClick={onBack}
              className="rounded-2xl bg-white/10 p-2 text-white/80 ring-1 ring-white/20 hover:bg-white/15 transition-colors"
              aria-label="Back to Home"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md ring-2 ring-white/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
                <circle cx="12" cy="12" r="4" fill="white" />
                <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-white leading-tight">{title}</div>
              <div className="text-[11px] text-white/45 leading-tight tracking-wide">
                Compass · prototype
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChat}
            className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20 hover:bg-white/15 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              Ask
            </span>
          </button>
          <button
            onClick={onQuickExit}
            className="rounded-2xl bg-white/10 p-2 text-white/75 ring-1 ring-white/20 hover:bg-white/15 transition-colors"
            aria-label="Quick Exit"
            title="Quick Exit — leaves this page instantly"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


// Each tab's active colour mirrors its page hero
const TAB_ACCENT: Record<string, string> = {
  home:      "#2A7F8E",
  ask:       "#2A7F8E",
  rights:    "#2A7F8E",
  case:      "#1B3A5C",
  future:    "#D97706",
  resources: "#059669",
  wellness:  "#f43f5e",
};

function TabBar({
  active,
  onGo,
  lang,
}: {
  active: string;
  onGo: (id: string) => void;
  lang?: Lang | null;
}) {
  // Phosphor filled icons — solid shapes instead of outlines
  const items = [
    { id: "home",      label: t('nav_home', lang),      Icon: House         },
    { id: "case",      label: t('nav_case', lang),      Icon: GavelFill     },
    { id: "ask",       label: t('nav_ask', lang),       Icon: ChatCircle    },
    { id: "rights",    label: t('nav_rights', lang),    Icon: ShieldChevron },
    { id: "future",    label: t('nav_future', lang),    Icon: FileTextFill  },
    { id: "resources", label: t('nav_resources', lang), Icon: MapPinFill    },
  ];

  return (
    <div className="sticky bottom-0 z-40 px-3 pb-3 pt-2">
      <div className="relative mx-auto max-w-md">
        <div
          className="rounded-[26px]"
          style={{
            background: "rgba(255, 253, 250, 0.98)",
            boxShadow:
              "0 -1px 0 rgba(0,0,0,0.03), " +
              "0 4px 6px rgba(27,58,92,0.05), " +
              "0 12px 32px rgba(27,58,92,0.12), " +
              "inset 0 1px 0 rgba(255,255,255,1)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center">
            {items.map((it) => {
              const is = active === it.id;
              const { Icon } = it;
              const accent = TAB_ACCENT[it.id] ?? "#2A7F8E";
              return (
                <button
                  key={it.id}
                  onClick={() => onGo(it.id)}
                  className="flex flex-1 flex-col items-center gap-1 py-3 transition-transform duration-150 active:scale-90"
                >
                  {/* Filled icon — accent color at rest, white + bg when active */}
                  <div
                    className="rounded-xl p-1.5 transition-all duration-200"
                    style={{ backgroundColor: is ? accent : "transparent" }}
                  >
                    <Icon
                      weight="fill"
                      size={20}
                      style={{ color: is ? "#ffffff" : accent }}
                      className="transition-colors duration-200"
                    />
                  </div>
                  {/* Label: accent color when active, neutral gray at rest */}
                  <span
                    className="text-[9px] font-semibold uppercase tracking-wide leading-none text-slate-400 transition-colors duration-200"
                    style={is ? { color: accent } : {}}
                  >
                    {it.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── hooks ─────────────────────────────────────────────────────────────────────

function useLocalPref<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // ignore
    }
  }, [key, val]);
  return [val, setVal] as const;
}

function isCrisis(text: string) {
  const t = (text || "").toLowerCase();
  const flags = [
    "suicide",
    "kill myself",
    "end it",
    "hurt myself",
    "self harm",
    "cut myself",
    "overdose",
    "i want to die",
    "abuse",
    "hit me",
    "molest",
    "rape",
    "unsafe",
  ];
  return flags.some((f) => t.includes(f));
}

// ─── types ─────────────────────────────────────────────────────────────────────

type Prefs = {
  language: "en" | "es" | null;
  ageBand: string | null;
  county: string | null;
  pathway: string | null;
  tribal: boolean;
};


function CitationsRow({ cites }: { cites?: string[] }) {
  if (!cites?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {cites.map((c, i) => (
        <StatCite key={`${c}-${i}`}>{c}</StatCite>
      ))}
    </div>
  );
}

// ─── onboarding ────────────────────────────────────────────────────────────────

function Onboarding({
  prefs,
  setPrefs,
  onDone,
}: {
  prefs: Prefs;
  setPrefs: React.Dispatch<React.SetStateAction<Prefs>>;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);

  const stepTitle =
    step === 0 ? t('onboarding_step_language', 'en')
    : step === 1 ? t('onboarding_step_age', prefs.language)
    : step === 2 ? t('onboarding_step_county', prefs.language)
    : t('onboarding_step_tribal', prefs.language);

  const isReady =
    !!prefs.language &&
    !!prefs.ageBand &&
    !!prefs.county &&
    (step < 3 || typeof prefs.tribal === "boolean");

  return (
    <div className="px-4 pb-28 pt-4">
      {/* Warm hero banner */}
      <div className="mb-5 rounded-3xl bg-gradient-to-br from-[#2A7F8E] to-[#1B3A5C] p-6 shadow-md">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="white" />
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-2xl font-bold text-white leading-snug">
          {prefs.language === 'es' ? <>Bienvenido a<br />Compass</> : <>Welcome to<br />Compass</>}
        </div>
        <div className="mt-2 text-sm text-white/80 leading-relaxed">
          {t('onboarding_welcome_subtitle', prefs.language)}
        </div>
      </div>

      {/* Step card */}
      <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-[#1B3A5C]">{stepTitle}</div>
          {/* Dot indicator */}
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (i === step
                    ? "w-6 bg-[#2A7F8E]"
                    : i < step
                      ? "w-2 bg-[#2A7F8E]/35"
                      : "w-2 bg-slate-200")
                }
              />
            ))}
          </div>
        </div>

        {step === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setPrefs((p) => ({ ...p, language: "en" }));
                setStep(1);
              }}
              className={
                "rounded-3xl py-5 px-4 text-center ring-1 transition-all " +
                (prefs.language === "en"
                  ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                  : "bg-white ring-black/10 hover:ring-black/20")
              }
            >
              <div className="text-lg font-bold text-slate-900">English</div>
            </button>
            <button
              onClick={() => {
                setPrefs((p) => ({ ...p, language: "es" }));
                setStep(1);
              }}
              className={
                "rounded-3xl py-5 px-4 text-center ring-1 transition-all " +
                (prefs.language === "es"
                  ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                  : "bg-white ring-black/10 hover:ring-black/20")
              }
            >
              <div className="text-lg font-bold text-slate-900">Español</div>
            </button>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid grid-cols-2 gap-3">
            {AGE_BANDS.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setPrefs((p) => ({ ...p, ageBand: b.id }));
                  setStep(2);
                }}
                className={
                  "rounded-3xl p-4 text-left ring-1 transition-all " +
                  (prefs.ageBand === b.id
                    ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                    : "bg-white ring-black/10 hover:ring-black/20")
                }
              >
                <div className="text-base font-bold text-slate-900">{b.label}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {b.id === "10-12"
                    ? t('age_band_10_12_desc', prefs.language)
                    : b.id === "13-15"
                      ? t('age_band_13_15_desc', prefs.language)
                      : b.id === "16-17"
                        ? t('age_band_16_17_desc', prefs.language)
                        : t('age_band_18_21_desc', prefs.language)}
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <div className="text-xs text-slate-500 mb-3">
              {t('onboarding_county_hint', prefs.language)}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COUNTIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setPrefs((p) => ({ ...p, county: c }));
                    setStep(3);
                  }}
                  className={
                    "rounded-2xl px-3 py-2.5 text-left text-sm font-semibold ring-1 transition-all " +
                    (prefs.county === c
                      ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 text-[#1B3A5C]"
                      : "bg-white ring-black/10 text-slate-700 hover:ring-black/20")
                  }
                >
                  {c}
                </button>
              ))}
              <button
                onClick={() => {
                  setPrefs((p) => ({ ...p, county: "Unknown" }));
                  setStep(3);
                }}
                className={
                  "col-span-2 rounded-2xl px-3 py-2.5 text-center text-sm font-semibold ring-1 transition-all " +
                  (prefs.county === "Unknown"
                    ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 text-[#1B3A5C]"
                    : "bg-white ring-black/10 text-slate-500 hover:ring-black/20")
                }
              >
                {t('onboarding_county_unknown', prefs.language)}
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <div className="text-xs text-slate-500 mb-3">
              {t('onboarding_tribal_hint', prefs.language)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setPrefs((p) => ({ ...p, tribal: true }));
                }}
                className={
                  "rounded-3xl p-4 text-left ring-1 transition-all " +
                  (prefs.tribal === true
                    ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                    : "bg-white ring-black/10 hover:ring-black/20")
                }
              >
                <div className="text-sm font-bold text-slate-900">{t('onboarding_tribal_yes', prefs.language)}</div>
              </button>
              <button
                onClick={() => {
                  setPrefs((p) => ({ ...p, tribal: false }));
                }}
                className={
                  "rounded-3xl p-4 text-left ring-1 transition-all " +
                  (prefs.tribal === false
                    ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                    : "bg-white ring-black/10 hover:ring-black/20")
                }
              >
                <div className="text-sm font-bold text-slate-900">{t('onboarding_tribal_no', prefs.language)} / {t('onboarding_tribal_not_sure', prefs.language)}</div>
              </button>
            </div>
          </div>
        ) : null}

        <Divider />
        <div className="flex gap-3">
          <button
            onClick={() => setStep((s) => clamp(s - 1, 0, 3))}
            className={
              "flex-1 rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition-all " +
              (step === 0
                ? "bg-slate-50 text-slate-300 ring-slate-200 cursor-not-allowed"
                : "bg-white text-slate-700 ring-black/10 hover:bg-slate-50")
            }
            disabled={step === 0}
          >
            {t('onboarding_btn_back', prefs.language)}
          </button>
          <button
            onClick={() => {
              if (!isReady) return;
              if (step < 3) setStep((s) => s + 1);
              else onDone();
            }}
            className={
              "flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition-all " +
              (isReady
                ? "bg-[#1B3A5C] text-white hover:bg-[#152e49] shadow-sm"
                : "bg-slate-100 text-slate-400 cursor-not-allowed")
            }
            disabled={!isReady}
          >
            {step < 3 ? t('onboarding_btn_next', prefs.language) : t('onboarding_btn_start', prefs.language)}
          </button>
        </div>
      </div>

      {/* Story mode — persona cards (hidden) */}
    </div>
  );
}

// ─── home screen ───────────────────────────────────────────────────────────────

function HomeScreen({
  prefs,
  onGo,
  onOpenChat,
  onReset,
}: {
  prefs: Prefs;
  onGo: (route: string) => void;
  onOpenChat: () => void;
  onReset: () => void;
}) {
  const visibleFeatureCards = useMemo(() => {
    const band = prefs.ageBand as AgeBandKey | null;
    if (band === "10-12") return FEATURE_CARDS.filter((fc) => fc.id !== "future");
    if (band === "18-21") {
      const order = ["future", "resources", "rights", "case", "wellness"];
      return order.map((id) => FEATURE_CARDS.find((fc) => fc.id === id)!);
    }
    return FEATURE_CARDS;
  }, [prefs.ageBand]);

  return (
    <div className="px-4 pb-28 pt-4">
      <ScreenHero
        icon={HomeIcon}
        title={t('home_what_today', prefs.language)}
        subtitle={`Set up for ${prefs.county === "Unknown" ? "county unknown" : (prefs.county ?? "—")} · Age ${AGE_BANDS.find((a) => a.id === prefs.ageBand)?.label ?? "—"} · ${prefs.language === "es" ? "Español" : "English"}`}
        gradient="from-[#2A7F8E] to-[#1B3A5C]"
        right={
          <button
            onClick={onReset}
            className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/25 transition-colors"
          >
            {t('home_start_over', prefs.language)}
          </button>
        }
      />

      {/* Color-coded feature cards */}
      <div className="mt-4 grid gap-3">
        {visibleFeatureCards.map((fc) => {
          const Icon = fc.icon;
          return (
            <div
              key={fc.id}
              onClick={() => onGo(fc.id)}
              className={`cursor-pointer rounded-3xl bg-gradient-to-br ${fc.gradient} bg-white/80 p-4 shadow-sm ring-1 ring-black/5 hover:shadow-md active:scale-[0.995] transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-2xl ${fc.iconBg} p-2.5 shadow-sm`}>
                  <Icon className={`h-5 w-5 ${fc.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-[#1B3A5C]">
                    {prefs.language === 'es'
                      ? t(`feature_${fc.id}_title` as StringKey, 'es')
                      : fc.title}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 leading-snug">
                    {prefs.language === 'es'
                      ? (FEATURE_CARD_SUBTITLES_ES[fc.id]?.[prefs.ageBand as AgeBandKey] ?? fc.subtitle)
                      : (FEATURE_CARD_SUBTITLES[fc.id]?.[prefs.ageBand as AgeBandKey] ?? fc.subtitle)}
                  </div>
                </div>
                <ChevronRight className={`mt-1 h-5 w-5 shrink-0 ${fc.chevronColor}`} />
              </div>
              {fc.badge && (
                <div className="mt-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${fc.pillCls}`}>
                    {prefs.language === 'es'
                      ? t(`feature_${fc.id}_badge` as StringKey, 'es')
                      : fc.badge}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <PrimaryButton onClick={onOpenChat} icon={MessageCircle} variant="teal">
          {t('home_ask_compass_btn', prefs.language)}
        </PrimaryButton>
      </div>

      {/* Crisis strip */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl bg-rose-50 p-2 ring-1 ring-rose-200">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{t('home_crisis_title', prefs.language)}</div>
            <div className="mt-1 text-xs text-slate-500">
              <span className={`inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200`}>{t('home_crisis_always_open', prefs.language)}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          {CRISIS_PINS.slice(0, 2).map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-semibold ring-1 ring-black/10 hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-800">
                {c.name}
                <span className="ml-2 text-xs font-normal text-slate-500">· {prefs.language === 'es' ? c.how_es : c.how}</span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── rights screen ─────────────────────────────────────────────────────────────

type RightTab = "means" | "ask" | "ignored";

const RIGHT_META: Record<string, {
  Icon: React.FC<{ className?: string }>;
  accentBar: string;
  iconBg: string;
  iconColor: string;
  tabActiveClass: string;
  contentBg: string;
}> = {
  participate: {
    Icon: CheckCircle2,
    accentBar: "bg-[#2A7F8E]",
    iconBg: "bg-[#2A7F8E]/12",
    iconColor: "text-[#2A7F8E]",
    tabActiveClass: "bg-[#2A7F8E]/10 text-[#2A7F8E] ring-[#2A7F8E]/30",
    contentBg: "bg-[#2A7F8E]/5",
  },
  privacy: {
    Icon: MessageCircle,
    accentBar: "bg-[#1B3A5C]",
    iconBg: "bg-[#1B3A5C]/10",
    iconColor: "text-[#1B3A5C]",
    tabActiveClass: "bg-[#1B3A5C]/10 text-[#1B3A5C] ring-[#1B3A5C]/25",
    contentBg: "bg-[#1B3A5C]/5",
  },
  siblings: {
    Icon: Users,
    accentBar: "bg-[#D97706]",
    iconBg: "bg-[#D97706]/12",
    iconColor: "text-[#D97706]",
    tabActiveClass: "bg-[#D97706]/10 text-[#D97706] ring-[#D97706]/30",
    contentBg: "bg-[#D97706]/6",
  },
};

function RightCard({
  r,
  tierData,
  tier,
  meta,
  lang,
}: {
  r: { id: string; title: string; citation: string };
  tierData: {
    plain: string; plain_es?: string;
    example: string; example_es?: string;
    howToAsk: string; howToAsk_es?: string;
    ifIgnored: string; ifIgnored_es?: string;
  };
  tier: string;
  meta: typeof RIGHT_META[string];
  lang: Lang;
}) {
  const [activeTab, setActiveTab] = useState<RightTab>("means");
  const Icon = meta.Icon;

  const plain    = lang === 'es' ? (tierData.plain_es    ?? tierData.plain)    : tierData.plain;
  const example  = lang === 'es' ? (tierData.example_es  ?? tierData.example)  : tierData.example;
  const howToAsk = lang === 'es' ? (tierData.howToAsk_es ?? tierData.howToAsk) : tierData.howToAsk;
  const ifIgnored = lang === 'es' ? (tierData.ifIgnored_es ?? tierData.ifIgnored) : tierData.ifIgnored;

  const tabDefs: Array<{ id: RightTab; label: string; body: string }> = [
    { id: "means",   label: t('rights_tab_what', lang),    body: plain     },
    { id: "ask",     label: t('rights_tab_how', lang),     body: howToAsk  },
    { id: "ignored", label: t('rights_tab_ignored', lang), body: ifIgnored },
  ];

  return (
    <Card accentColor={meta.accentBar}>
      {/* Header: icon + title + optional citation */}
      <div className="flex items-center gap-3">
        <div className={`shrink-0 rounded-xl p-2 ${meta.iconBg}`}>
          <Icon className={`h-4 w-4 ${meta.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0 text-sm font-semibold text-[#1B3A5C]">{r.title}</div>
        {tier !== "10-12" && tier !== "13-15" && (
          <StatCite>{r.citation}</StatCite>
        )}
      </div>

      {/* Tab buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {tabDefs.map((td) => (
          <button
            key={td.id}
            onClick={() => setActiveTab(td.id)}
            className={
              "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors " +
              (activeTab === td.id
                ? meta.tabActiveClass
                : "bg-white text-slate-600 ring-black/10 hover:bg-slate-50")
            }
          >
            {td.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className={
          "mt-3 rounded-2xl text-sm text-slate-700 leading-relaxed " +
          (activeTab !== "means" ? `p-3 ${meta.contentBg}` : "")
        }
      >
        {tabDefs.find((td) => td.id === activeTab)?.body}
      </div>
      {activeTab === "means" && example && (
        <div className="mt-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{lang === 'es' ? 'Por ejemplo:' : 'For example:'}</span> {example}
        </div>
      )}
    </Card>
  );
}

const RIGHTS_HERO_SUBTITLE: Record<AgeBandKey, { en: string; es: string }> = {
  '10-12': {
    en: 'You have rights just by being in foster care. Here\'s what they mean for you.',
    es: 'Tienes derechos solo por estar en cuidado adoptivo. Aquí está lo que significan para ti.',
  },
  '13-15': {
    en: 'Know your rights. Use your voice. Here\'s what the law says for your age group.',
    es: 'Conoce tus derechos. Usa tu voz. Aquí está lo que dice la ley para tu grupo de edad.',
  },
  '16-17': {
    en: 'You have powerful rights. Here\'s how to use them before you turn 18.',
    es: 'Tienes derechos poderosos. Aquí está cómo usarlos antes de cumplir 18.',
  },
  '18-21': {
    en: 'Your rights don\'t end at 18. Here\'s what extended care means for you.',
    es: 'Tus derechos no terminan a los 18. Aquí está lo que el cuidado extendido significa para ti.',
  },
};

function RightsScreen({ prefs }: { prefs: Prefs }) {
  const tier = prefs.ageBand || "10-12";
  const lang: Lang = prefs.language === 'es' ? 'es' : 'en';
  return (
    <div className="px-4 pb-28 pt-4">
      <ScreenHero
        icon={Shield}
        title="Know Your Rights"
        subtitle={RIGHTS_HERO_SUBTITLE[tier as AgeBandKey]?.[lang] ?? "These are your rights. They're real, and they're yours — even if no one has told you yet."}
        gradient="from-[#2A7F8E] to-[#1B3A5C]"
      />

      {/* Rights explorer meta banner */}
      <div className="mt-4 flex overflow-hidden rounded-3xl bg-white/85 ring-1 ring-black/5 shadow-sm">
        <div className="w-1 shrink-0 bg-[#2A7F8E]/30" />
        <div className="flex flex-1 items-center justify-between gap-3 p-4">
          <div>
            <div className="text-sm font-semibold text-[#1B3A5C]">{lang === 'es' ? 'Explorador de derechos' : 'Your rights explorer'}</div>
            <div className="mt-0.5 text-xs text-slate-500">
              {lang === 'es' ? 'Toca cualquier tarjeta para aprender qué significa cada derecho y cómo usarlo.' : 'Tap any card to learn what each right means and how to use it.'}
            </div>
          </div>
          <Chip>Age {AGE_BANDS.find((a) => a.id === tier)?.label}</Chip>
        </div>
      </div>

      {/* Rights cards */}
      <div className="mt-4 grid gap-3">
        {RIGHTS.map((r) => {
          const defaultTier = "10-12";
          const tierData = (r.tiers as Record<string, {
            plain: string; plain_es?: string;
            example: string; example_es?: string;
            howToAsk: string; howToAsk_es?: string;
            ifIgnored: string; ifIgnored_es?: string;
          }>)[tier] || (r.tiers as Record<string, {
            plain: string; plain_es?: string;
            example: string; example_es?: string;
            howToAsk: string; howToAsk_es?: string;
            ifIgnored: string; ifIgnored_es?: string;
          }>)[defaultTier];
          const meta = RIGHT_META[r.id] ?? RIGHT_META.participate;
          return <RightCard key={r.id} r={r} tierData={tierData} tier={tier} meta={meta} lang={lang} />;
        })}
      </div>

      {/* Escalation ladder — amber "action" treatment */}
      <div className="mt-4 overflow-hidden rounded-3xl bg-white/85 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-start gap-3 bg-[#D97706]/8 px-4 pt-4 pb-3 border-b border-[#D97706]/15">
          <div className="mt-0.5 shrink-0 rounded-xl bg-[#D97706]/15 p-2 ring-1 ring-[#D97706]/25">
            <AlertTriangle className="h-4 w-4 text-[#D97706]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1B3A5C]">{lang === 'es' ? 'Si no están respetando tus derechos' : "If your rights aren't being respected"}</div>
            <div className="mt-0.5 text-xs text-slate-500">
              {lang === 'es' ? 'Prueba estos pasos en orden. Anota las fechas y lo que se dijo en cada paso.' : 'Try these steps in order. Write down dates and what was said at each step.'}
            </div>
          </div>
        </div>
        <div className="p-4">
          <EscalationLadder ageBand={tier} lang={lang} />
        </div>
      </div>

      <div className="mt-4">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── case screen ───────────────────────────────────────────────────────────────

const CASE_HERO_SUBTITLE: Record<AgeBandKey, string> = {
  "10-12": "What's happening in court — who all those people are and what it means for you.",
  "13-15": "What your hearings mean, who's there, and how to prepare.",
  "16-17": "What your hearings actually mean, who will be there, and how to show up ready.",
  "18-21": "How the dependency process works — and what each hearing could mean for your case.",
};

const CASE_HERO_SUBTITLE_ES: Record<AgeBandKey, string> = {
  "10-12": "Qué pasa en la corte — quiénes son todas esas personas y qué significa para ti.",
  "13-15": "Qué significan tus audiencias, quién estará ahí y cómo prepararte.",
  "16-17": "Qué significan tus audiencias, quién estará ahí y cómo llegar listo.",
  "18-21": "Cómo funciona el proceso de dependencia — y qué podría significar cada audiencia para tu caso.",
};

function CaseScreen({ prefs }: { prefs: Prefs }) {
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [openPerson, setOpenPerson] = useState<string | null>(null);
  const tier = prefs.ageBand;
  const lang: Lang = prefs.language === 'es' ? 'es' : 'en';
  return (
    <div className="px-4 pb-28 pt-4">
      <ScreenHero
        icon={Gavel}
        title={lang === 'es' ? 'Mi Caso Explicado' : 'My Case Explained'}
        subtitle={lang === 'es'
          ? (CASE_HERO_SUBTITLE_ES[tier as AgeBandKey] ?? "Qué significan tus audiencias, quién estará ahí y cómo llegar listo.")
          : (CASE_HERO_SUBTITLE[tier as AgeBandKey] ?? "What your hearings mean, who's there, and how to show up ready.")}
        gradient="from-[#1B3A5C] to-[#0f2640]"
      />

      {prefs.tribal ? (
        <div className="mt-4 rounded-3xl bg-[#2A7F8E]/8 p-4 ring-1 ring-[#2A7F8E]/20 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[#2A7F8E]/15 p-2">
              <Users className="h-5 w-5 text-[#2A7F8E]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1B3A5C]">{lang === 'es' ? 'Guía ICWA activada' : 'ICWA guidance is on'}</div>
              <div className="mt-1 text-xs text-slate-600">
                {lang === 'es'
                  ? 'En la app completa, esta sección se construye con socios tribales — verías los contactos específicos de tu tribu y los pasos que aplican a tu caso.'
                  : 'In the full app, this section is built with tribal partners — you\'d see your tribe\'s specific contacts and steps that apply to your case.'}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatCite>ICWA (25 U.S.C. §§1901–1963)</StatCite>
                <StatCite>AZ courts ICWA guidance</StatCite>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Section: People in your case ── */}
      <div className="mt-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/8" />
          <div className="flex items-center gap-1.5 rounded-full bg-[#2A7F8E]/10 px-3 py-1.5">
            <Users className="h-3.5 w-3.5 text-[#2A7F8E]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[#2A7F8E]">{lang === 'es' ? 'Personas en tu caso' : 'People in your case'}</span>
          </div>
          <div className="h-px flex-1 bg-black/8" />
        </div>
        <p className="mb-3 text-center text-xs text-slate-500">{lang === 'es' ? 'Toca cada persona para conocer su rol y cómo trabajar con ella.' : 'Tap each person to learn their role and how to work with them.'}</p>
        <div className="grid gap-2">
          {WHO_IN_YOUR_CASE.map((person) => {
            const isOpen = openPerson === person.id;
            return (
              <div key={person.id} className="overflow-hidden rounded-2xl ring-1 ring-black/8">
                <button
                  onClick={() => setOpenPerson(isOpen ? null : person.id)}
                  className="flex w-full items-center gap-3 bg-white/85 p-3.5 text-left transition-colors hover:bg-white"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-base"
                    style={{ backgroundColor: person.color + "18" }}
                  >
                    {person.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900">{lang === 'es' ? person.title_es : person.title}</div>
                    {!isOpen && (
                      <div className="mt-0.5 text-xs text-slate-500">{lang === 'es' ? person.role_es : person.role}</div>
                    )}
                  </div>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-slate-400 transition-transform"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-black/6 bg-white px-4 pb-4 pt-3">
                    <div
                      className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                      style={{ backgroundColor: person.color + "18", color: person.color }}
                    >
                      {lang === 'es' ? person.aka_es : person.aka}
                    </div>
                    <div className="text-xs leading-relaxed text-slate-700">{lang === 'es' ? person.what_es : person.what}</div>
                    <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
                      <span className="text-sm">💡</span>
                      <div className="text-xs leading-relaxed text-amber-800">{lang === 'es' ? person.tip_es : person.tip}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: Your hearings ── */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/8" />
          <div className="flex items-center gap-1.5 rounded-full bg-[#1B3A5C]/10 px-3 py-1.5">
            <Gavel className="h-3.5 w-3.5 text-[#1B3A5C]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[#1B3A5C]">{lang === 'es' ? 'Tus audiencias' : 'Your hearings'}</span>
          </div>
          <div className="h-px flex-1 bg-black/8" />
        </div>
        <p className="mb-3 text-center text-xs text-slate-500">{lang === 'es' ? 'Estas son las principales audiencias en un caso de dependencia — toca cada una para aprender más.' : 'These are the main hearings in a dependency case — tap each one to learn more.'}</p>
        <div>
          {COURT_STAGES.map((s, i) => {
            const isOpen = openStage === s.id;
            const nodeColor = i < 2 ? "#2A7F8E" : "#D97706";
            return (
              <div key={s.id} className="flex gap-4">
                {/* Left: node + connector */}
                <div className="flex flex-col items-center">
                  <div
                    className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                    style={{ backgroundColor: nodeColor }}
                  >
                    {i + 1}
                  </div>
                  {i < COURT_STAGES.length - 1 && (
                    <div
                      className="my-1 w-0.5 flex-1 min-h-[20px]"
                      style={{
                        background:
                          i === 1
                            ? "linear-gradient(to bottom, #2A7F8E55, #D9770655)"
                            : i < 2
                              ? "#2A7F8E33"
                              : "#D9770633",
                      }}
                    />
                  )}
                </div>
                {/* Right: accordion card */}
                <div className="flex-1 pb-4 last:pb-0">
                  <button
                    onClick={() => setOpenStage(isOpen ? null : s.id)}
                    className="w-full rounded-3xl bg-white/85 p-4 text-left shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-[#1B3A5C]">{lang === 'es' ? (s.title_es ?? s.title) : s.title}</div>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-slate-400 transition-transform"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </div>
                    {!isOpen && (
                      <div className="mt-1 text-xs text-slate-500">{lang === 'es' ? (s.what_es ?? s.what) : s.what}</div>
                    )}
                  </button>
                  {isOpen && (
                    <div className="-mt-3 mx-2 rounded-b-3xl bg-white/70 px-4 pb-4 pt-3 shadow-sm ring-1 ring-black/5 ring-t-0">
                      <div className="mt-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">{lang === 'es' ? 'Qué es:' : 'What it is:'}</span> {lang === 'es' ? (s.what_es ?? s.what) : s.what}
                      </div>
                      <div className="mt-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">{lang === 'es' ? 'Qué puedes hacer:' : 'What you can do:'}</span> {lang === 'es' ? (s.youth_es ?? s.youth) : s.youth}
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-600">{lang === 'es' ? 'Qué sigue:' : "What's next:"}</span> {lang === 'es' ? (s.next_es ?? s.next) : s.next}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: Before your hearing ── */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/8" />
          <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-700" />
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">{lang === 'es' ? 'Antes de tu audiencia' : 'Before your hearing'}</span>
          </div>
          <div className="h-px flex-1 bg-black/8" />
        </div>
        <div className="rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
          <div className="mb-3 text-xs text-slate-500">{lang === 'es' ? 'Preguntas que vale la pena hacerle a tu abogado o trabajador/a de casos:' : 'Questions worth asking your attorney or caseworker:'}</div>
          <div className="grid gap-2">
            {(lang === 'es' ? [
              "¿Cuál es el objetivo de la audiencia de hoy?",
              "¿Qué podría cambiar después, y cuándo?",
              "¿Qué necesitas para sentirte seguro en casa y en la escuela?",
              "¿A quién debo llamar si algo no está pasando?",
            ] : [
              "What is the goal of today's hearing?",
              "What could change next, and when?",
              "What do you need to feel safe at home and school?",
              "Who should I call if something isn't happening?",
            ]).map((q) => (
              <div
                key={q}
                className="flex items-start gap-2.5 rounded-2xl bg-white p-3 ring-1 ring-black/8"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2A7F8E]" />
                <div className="text-sm text-slate-700">{q}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── future screen ─────────────────────────────────────────────────────────────

const FUTURE_HERO_SUBTITLE: Record<AgeBandKey, string> = {
  "10-12": "What turning 18 means — you'll have choices, and people who can help you make them.",
  "13-15": "It may feel far away, but knowing what's coming makes it less scary.",
  "16-17": "Turning 18 is a big moment. Here's everything broken down into simple steps.",
  "18-21": "Your next steps — EFC, school money, housing, and the documents you need.",
};

const FUTURE_HERO_SUBTITLE_ES: Record<AgeBandKey, string> = {
  "10-12": "Qué significa cumplir 18 años — tendrás opciones, y personas que pueden ayudarte a tomarlas.",
  "13-15": "Puede parecer lejano, pero saber lo que viene hace que sea menos aterrador.",
  "16-17": "Cumplir 18 es un momento importante. Aquí está todo explicado en pasos simples.",
  "18-21": "Tus próximos pasos — EFC, dinero para la escuela, vivienda, y los documentos que necesitas.",
};

function FutureScreen({ prefs, onAskChat }: { prefs: Prefs; onAskChat?: (q: string) => void }) {
  const [showSensitive, setShowSensitive] = useState(false);
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const tier = prefs.ageBand;
  const isOldEnough = tier === "16-17" || tier === "18-21";
  const lang: Lang = prefs.language === 'es' ? 'es' : 'en';

  function toggleDoc(id: string) {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="px-4 pb-28 pt-4">
      <ScreenHero
        icon={FileText}
        title={lang === 'es' ? 'Mi Plan de Futuro' : 'My Future Plan'}
        subtitle={lang === 'es'
          ? (FUTURE_HERO_SUBTITLE_ES[tier as AgeBandKey] ?? "Cumplir 18 es un momento importante. Aquí está todo explicado en pasos simples.")
          : (FUTURE_HERO_SUBTITLE[tier as AgeBandKey] ?? "Turning 18 is a big moment. Here's everything broken down into simple steps.")}
        gradient="from-[#D97706] to-[#92400e]"
      />

      {!isOldEnough ? (
        <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
          <div className="text-sm font-semibold text-[#1B3A5C]">{lang === 'es' ? 'Verás más aquí cuando seas mayor' : "You'll see more here as you get older"}</div>
          <div className="mt-1 text-xs text-slate-500">
            {lang === 'es' ? 'Las herramientas de planificación completas aparecen cuando te acercas a los 16. Regresa entonces — hay mucho aquí para ti.' : "The full planning tools show up as you get closer to 16. Come back then — there's a lot here for you."}
          </div>
        </div>
      ) : null}

      {isOldEnough ? (
        <>
          {/* School money deadline banner */}
          <div className="mt-4">
            <DeadlineBanner
              label={lang === 'es' ? 'Dinero gratis para la escuela — solicita antes del:' : 'Free school money — apply by:'}
              date="July 31, 2026"
              note={lang === 'es'
                ? 'El Bono de Educación y Capacitación (ETV) da a jóvenes en cuidado adoptivo hasta $5,000/año para estudios o formación laboral. Si pierdes esta fecha, esperas otro año.'
                : "The Education & Training Voucher (ETV) gives foster youth up to $5,000/year for school or job training. Miss this date and you wait another year."}
              onAct={() => onAskChat?.(lang === 'es' ? '¿Cómo solicito el Bono de Educación y Capacitación (ETV)?' : "How do I apply for the Education & Training Voucher (ETV)?")}
              lang={lang}
            />
          </div>

          {/* Content note */}
          <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-amber-50 p-2 ring-1 ring-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#1B3A5C]">{lang === 'es' ? 'Antes de continuar' : 'Before you read on'}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {lang === 'es' ? 'Algunos temas son difíciles — como vivienda y qué pasa cuando cumples 18 años. Ve a tu ritmo. Puedes saltar lo que no estés listo para leer.' : 'Some of this covers tough topics — like housing and what happens when you turn 18. Go at your own pace. You can skip anything you\'re not ready for.'}
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setShowSensitive((s) => !s)}
                    className={
                      "rounded-2xl px-4 py-2 text-xs font-semibold ring-1 transition-all " +
                      (showSensitive
                        ? "bg-[#1B3A5C] text-white ring-[#1B3A5C]"
                        : "bg-white text-slate-700 ring-black/10 hover:bg-slate-50")
                    }
                  >
                    {showSensitive
                      ? (lang === 'es' ? 'Ocultar secciones detalladas' : 'Hide detailed sections')
                      : (lang === 'es' ? 'Mostrar secciones detalladas' : 'Show detailed sections')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {/* EFC decision */}
            <Card accentColor="bg-[#2A7F8E]">
              <SectionTitle
                icon={CheckCircle2}
                title={lang === 'es' ? 'Cumplir 18: ¿qué pasa después?' : 'Turning 18: what happens next?'}
                subtitle={lang === 'es' ? 'Tú decides — quedarte en el cuidado con apoyo extra, o salir en tus propios términos. Aquí está lo que cada camino significa realmente.' : "You get to choose — stay in care with extra support, or leave on your own terms. Here's what each path actually means."}
                iconClassName="bg-[#2A7F8E]/10 text-[#2A7F8E]"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <StatCite>AZ Extended Foster Care law</StatCite>
                <StatCite>A.R.S. §8-521.02</StatCite>
              </div>
            </Card>

            {/* Education funding */}
            <Card accentColor="bg-[#D97706]">
              <SectionTitle
                icon={GraduationCap}
                title={lang === 'es' ? 'Dinero para la escuela' : 'Money for school'}
                subtitle={lang === 'es' ? 'Hay dinero disponible para ayudar a pagar la escuela o la formación. Los plazos son reales — no esperes.' : "There's money available to help pay for school or training. Deadlines are real — don't wait."}
                iconClassName="bg-[#D97706]/10 text-[#D97706]"
              />
              <div className="mt-3 grid gap-2">
                {(lang === 'es' ? [
                  { label: "Bono de Educación y Capacitación (ETV)", note: "El ETV da hasta $5,000/año para estudios o formación laboral. Reúne tus documentos y solicita antes del 31 de julio.", href: "https://www.fc2success.org/programs/arizona/" },
                  { label: "Formulario de ayuda universitaria gratis (FAFSA)", note: "Este formulario desbloquea becas y ayuda económica. Un consejero escolar o un adulto de confianza puede ayudarte a llenarlo.", href: "https://studentaid.gov/h/apply-for-aid/fafsa" },
                ] : [
                  { label: "Education and Training Voucher (ETV)", note: "The Education and Training Voucher (ETV) provides up to $5,000/year for school or training. Gather your documents and apply before July 31.", href: "https://www.fc2success.org/programs/arizona/" },
                  { label: "Free college aid form (FAFSA)", note: "This form unlocks grants and aid. A school counselor or trusted adult can help you fill it out.", href: "https://studentaid.gov/h/apply-for-aid/fafsa" },
                ]).map((x) => (
                  <a
                    key={x.label}
                    href={x.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl bg-white/70 p-3 ring-1 ring-black/8 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-[#1B3A5C]">{x.label}</div>
                      <ExternalLink className="h-4 w-4 text-[#2A7F8E] shrink-0" />
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">{x.note}</div>
                  </a>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatCite>Education & Training Voucher (ETV)</StatCite>
                <StatCite>A.R.S. §15-1809.01</StatCite>
              </div>
            </Card>

            {/* Documents */}
            <Card accentColor="bg-[#1B3A5C]">
              <SectionTitle
                icon={FileText}
                title={lang === 'es' ? 'Tus documentos importantes' : 'Your Important Documents'}
                subtitle={lang === 'es' ? 'Estos son los documentos más importantes que debes obtener. Hazlos en este orden — cada uno desbloquea el siguiente.' : "These are the most important documents to get. Do them in this order — each one unlocks the next."}
                iconClassName="bg-[#1B3A5C]/10 text-[#1B3A5C]"
              />
              {checkedDocs.size > 0 && (
                <div className="mt-2 text-xs text-emerald-700 font-medium">
                  {lang === 'es' ? `${checkedDocs.size} de ${IMPORTANT_DOCS.length} documentos obtenidos` : `${checkedDocs.size} of ${IMPORTANT_DOCS.length} documents collected`}
                </div>
              )}
              <div className="mt-3 grid gap-2">
                {IMPORTANT_DOCS.map((doc, i) => {
                  const isChecked = checkedDocs.has(doc.id);
                  const isOpen = openDoc === doc.id;
                  return (
                    <div key={doc.id} className="overflow-hidden rounded-2xl ring-1 ring-black/8">
                      {/* Row */}
                      <div
                        className={
                          "flex items-center justify-between p-3 transition-colors " +
                          (isChecked ? "bg-emerald-50" : "bg-white/70")
                        }
                      >
                        {/* Check circle + label */}
                        <button
                          onClick={() => toggleDoc(doc.id)}
                          className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                          aria-label={lang === 'es'
                            ? (isChecked ? `Marcar ${doc.label_es} como no obtenido` : `Marcar ${doc.label_es} como obtenido`)
                            : (isChecked ? `Mark ${doc.label} as not collected` : `Mark ${doc.label} as collected`)}
                        >
                          <div
                            className={
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all " +
                              (isChecked
                                ? "bg-emerald-500 ring-0"
                                : "bg-white ring-1 ring-[#1B3A5C]/30")
                            }
                          >
                            {isChecked && (
                              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                                <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className={
                              "text-sm font-semibold " +
                              (isChecked ? "text-emerald-800 line-through decoration-emerald-400" : "text-slate-800")
                            }>
                              <span className="text-[#1B3A5C]/40 font-normal mr-1">{i + 1}.</span>
                              {lang === 'es' ? doc.label_es : doc.label}
                            </div>
                          </div>
                        </button>
                        {/* Steps toggle */}
                        <button
                          onClick={() => setOpenDoc(isOpen ? null : doc.id)}
                          className={
                            "ml-2 shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold ring-1 transition-all " +
                            (isOpen
                              ? "bg-[#1B3A5C] text-white ring-[#1B3A5C]"
                              : "bg-white text-[#1B3A5C] ring-[#1B3A5C]/20 hover:ring-[#1B3A5C]/40")
                          }
                        >
                          {isOpen ? (lang === 'es' ? 'Cerrar' : 'Close') : (lang === 'es' ? 'Cómo obtenerlo' : 'How to get it')}
                        </button>
                      </div>
                      {/* Expanded steps */}
                      {isOpen && (
                        <div className="border-t border-black/6 bg-white px-4 py-3">
                          <div className="text-xs text-slate-500 mb-3 italic">{lang === 'es' ? doc.why_es : doc.why}</div>
                          <div className="grid gap-2.5">
                            {(lang === 'es' ? doc.steps_es : doc.steps).map((step, si) => (
                              <div key={si} className="flex gap-3">
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1B3A5C]/8 text-[10px] font-bold text-[#1B3A5C]">
                                  {si + 1}
                                </div>
                                <div className="text-xs text-slate-700 leading-relaxed pt-0.5">{step}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-black/6">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-[#2A7F8E]" />
                            <span className="text-xs text-slate-600">{lang === 'es' ? doc.contact_es : doc.contact}</span>
                          </div>
                          <button
                            onClick={() => { toggleDoc(doc.id); setOpenDoc(null); }}
                            className={
                              "mt-3 w-full rounded-xl py-2 text-xs font-semibold transition-all " +
                              (isChecked
                                ? "bg-slate-100 text-slate-500 ring-1 ring-black/8"
                                : "bg-emerald-500 text-white hover:bg-emerald-600")
                            }
                          >
                            {isChecked ? (lang === 'es' ? 'Marcar como no obtenido' : 'Mark as not collected') : (lang === 'es' ? '¡Obtuve este documento!' : 'I got this document!')}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatCite>A.R.S. §8-514.06</StatCite>
              </div>
            </Card>

            {showSensitive ? (
              <Card accentColor="bg-emerald-500">
                <SectionTitle
                  icon={MapPin}
                  title={lang === 'es' ? 'Opciones de vivienda' : 'Housing path'}
                  subtitle={lang === 'es' ? `Mostrando opciones cerca de ${prefs.county}. Los lugares se llenan — llama antes de ir.` : `Showing options near ${prefs.county}. Spots fill up — call before you go.`}
                  iconClassName="bg-emerald-500/10 text-emerald-700"
                />
                <div className="mt-3 grid gap-2">
                  {RESOURCES.filter((r) => r.categories.includes("housing"))
                    .slice(0, 3)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="rounded-2xl bg-white/70 p-3 ring-1 ring-black/8"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                          <span className={pill("bg-[#D97706]/10 text-[#9a5200] ring-1 ring-[#D97706]/25")}>
                            {lang === 'es' ? 'Llama primero' : 'Call first'}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{r.description}</div>
                      </div>
                    ))}
                </div>
              </Card>
            ) : null}

            {prefs.tribal ? (
              <Card accentColor="bg-[#2A7F8E]">
                <SectionTitle
                  icon={Users}
                  title={lang === 'es' ? 'Notas de transición con ICWA' : 'ICWA-aware transition notes'}
                  subtitle={lang === 'es' ? 'En la app completa: los contactos específicos de tu tribu y lo que tus preferencias de colocación significan para tu caso.' : "In the full app: your tribe's specific contacts and what your placement preferences mean for your case."}
                  iconClassName="bg-[#2A7F8E]/10 text-[#2A7F8E]"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatCite>ICWA</StatCite>
                  <StatCite>Tribal resources (co-designed)</StatCite>
                </div>
              </Card>
            ) : null}
          </div>
        </>
      ) : null}

      <div className="mt-4">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── resources screen ──────────────────────────────────────────────────────────

function ResourcesScreen({ prefs }: { prefs: Prefs }) {
  const [q, setQ] = useState("");
  const [need, setNeed] = useState("all");
  const lang: Lang = prefs.language === 'es' ? 'es' : 'en';

  const ageRange = useMemo(() => bandToRange(prefs.ageBand || ""), [prefs.ageBand]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const [amin, amax] = ageRange;

    return RESOURCES.filter((r) => {
      const matchesNeed = need === "all" ? true : r.categories.includes(need);
      const matchesAge = r.ages[0] <= amax && r.ages[1] >= amin;
      const matchesCounty =
        r.counties.includes("Statewide") ||
        (prefs.county && prefs.county !== "Unknown" ? r.counties.includes(prefs.county) : false);
      const matchesQuery =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.categories.some((c) => c.includes(query));
      return matchesNeed && matchesAge && matchesCounty && matchesQuery;
    }).sort((a, b) => {
      const aScore =
        (a.categories.includes("emergency") ? 2 : 0) +
        (a.categories.includes("legal") ? 1 : 0);
      const bScore =
        (b.categories.includes("emergency") ? 2 : 0) +
        (b.categories.includes("legal") ? 1 : 0);
      return bScore - aScore;
    });
  }, [q, need, ageRange, prefs.county]);

  const NEEDS = lang === 'es' ? [
    { id: "all", label: "Todo" },
    { id: "housing", label: "Vivienda" },
    { id: "education", label: "Educación" },
    { id: "legal", label: "Legal" },
    { id: "health", label: "Salud" },
    { id: "employment", label: "Trabajo" },
    { id: "emergency", label: "Emergencia" },
    { id: "transition", label: "Transición" },
    { id: "rights", label: "Derechos" },
    { id: "money", label: "Dinero" },
    { id: "food", label: "Comida" },
  ] : [
    { id: "all", label: "All" },
    { id: "housing", label: "Housing" },
    { id: "education", label: "Education" },
    { id: "legal", label: "Legal" },
    { id: "health", label: "Health" },
    { id: "employment", label: "Work" },
    { id: "emergency", label: "Emergency" },
    { id: "transition", label: "Transition" },
    { id: "rights", label: "Rights" },
    { id: "money", label: "Money" },
    { id: "food", label: "Food" },
  ];

  return (
    <div className="px-4 pb-28 pt-4">
      <ScreenHero
        icon={MapPin}
        title={lang === 'es' ? 'Encuentra Recursos' : 'Find Resources'}
        subtitle={lang === 'es'
          ? `Organizaciones reales cerca de ti — filtradas para ${prefs.county ?? "tu condado"} · Edades ${ageRange[0]}–${ageRange[1]}`
          : `Real organizations near you — filtered for ${prefs.county ?? "your county"} · Ages ${ageRange[0]}–${ageRange[1]}`}
        gradient="from-emerald-600 to-emerald-900"
      />

      {/* Search + filter */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-slate-100 p-2">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('resources_search_placeholder', prefs.language)}
            className="w-full rounded-2xl bg-white px-3 py-2 text-sm ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-[#2A7F8E]/35 transition-all"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {NEEDS.map((n) => (
            <button
              key={n.id}
              onClick={() => setNeed(n.id)}
              className={
                "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-all " +
                (need === n.id
                  ? "bg-[#1B3A5C] text-white ring-[#1B3A5C]"
                  : "bg-white text-slate-600 ring-black/10 hover:ring-black/20")
              }
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned crisis */}
      <div className="mt-4 rounded-3xl bg-rose-50/80 p-4 ring-1 ring-rose-200/60 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <div className="text-sm font-semibold text-rose-900">
            {prefs.language === 'es' ? '¿Necesitas ayuda ahora? Siempre están disponibles.' : 'Need help right now? These are always here.'}
          </div>
        </div>
        <div className="grid gap-2">
          {CRISIS_PINS.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-semibold ring-1 ring-black/8 hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-800">
                {c.name}
                <span className="ml-2 text-xs font-normal text-slate-500">· {prefs.language === 'es' ? c.how_es : c.how}</span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Resource results */}
      <div className="mt-4 grid gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white/85 p-5 text-center ring-1 ring-black/5 shadow-sm">
            <div className="text-sm font-semibold text-slate-700">{lang === 'es' ? 'No se encontraron resultados' : 'No matches found'}</div>
            <div className="mt-1 text-xs text-slate-500">{lang === 'es' ? 'Intenta llamar al 211 — una persona real responde y puede ayudarte a encontrar lo que está disponible cerca de ti.' : 'Try calling 211 — a real person answers and can help you figure out what\'s available near you.'}</div>
          </div>
        ) : null}

        {filtered.map((r) => {
          const accentColor = getCategoryAccent(r.categories);
          return (
            <div
              key={r.id}
              className="flex overflow-hidden rounded-3xl bg-white/85 shadow-sm ring-1 ring-black/5"
            >
              <div className={`w-1 shrink-0 ${accentColor}`} />
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#1B3A5C]">{r.name}</div>
                    <div className="mt-1 text-xs text-slate-500 leading-relaxed">{r.description}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.categories.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className={pill("bg-slate-50 text-slate-600 ring-1 ring-slate-200")}
                        >
                          {c}
                        </span>
                      ))}
                      {r.spanish ? (
                        <span className={pill("bg-[#2A7F8E]/8 text-[#2A7F8E] ring-1 ring-[#2A7F8E]/20")}>
                          {t('resources_spanish_label', prefs.language)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-black/10 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        {t('common_website', prefs.language)}
                      </span>
                    </a>
                    <button
                      onClick={() =>
                        alert("Prototype: click-to-call would trigger a phone dialer on mobile.")
                      }
                      className="rounded-2xl bg-[#1B3A5C] px-3 py-2 text-xs font-semibold text-white hover:bg-[#152e49] transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {t('common_call', prefs.language)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── wellness screen ───────────────────────────────────────────────────────────

function WellnessScreen({ prefs }: { prefs: Prefs }) {
  const [mood, setMood] = useState(3);
  const lang: Lang = prefs.language === 'es' ? 'es' : 'en';
  const moodConfig = lang === 'es' ? [
    { n: 1, label: "Muy mal", color: "bg-slate-400", active: "bg-slate-500 ring-slate-400/40" },
    { n: 2, label: "Mal", color: "bg-slate-300", active: "bg-slate-400 ring-slate-300/40" },
    { n: 3, label: "Regular", color: "bg-[#2A7F8E]/50", active: "bg-[#2A7F8E] ring-[#2A7F8E]/30" },
    { n: 4, label: "Bien", color: "bg-[#2A7F8E]/75", active: "bg-[#2A7F8E] ring-[#2A7F8E]/30" },
    { n: 5, label: "Muy bien", color: "bg-[#D97706]/60", active: "bg-[#D97706] ring-[#D97706]/30" },
  ] : [
    { n: 1, label: "Really bad", color: "bg-slate-400", active: "bg-slate-500 ring-slate-400/40" },
    { n: 2, label: "Bad", color: "bg-slate-300", active: "bg-slate-400 ring-slate-300/40" },
    { n: 3, label: "Meh", color: "bg-[#2A7F8E]/50", active: "bg-[#2A7F8E] ring-[#2A7F8E]/30" },
    { n: 4, label: "Okay", color: "bg-[#2A7F8E]/75", active: "bg-[#2A7F8E] ring-[#2A7F8E]/30" },
    { n: 5, label: "Good", color: "bg-[#D97706]/60", active: "bg-[#D97706] ring-[#D97706]/30" },
  ];
  const currentMood = moodConfig[mood - 1];

  return (
    <div className="px-4 pb-28 pt-4">
      <ScreenHero
        icon={HeartPulse}
        title={lang === 'es' ? 'Chequeo de Bienestar' : 'Wellness Check‑In'}
        subtitle={lang === 'es' ? 'Herramientas para ayudarte a calmarte — y cómo comunicarte con una persona real cuando lo necesites.' : 'Tools to help you feel calmer — and how to reach a real person when you need one.'}
        gradient="from-rose-500 to-[#1B3A5C]"
      />

      {/* Mood scale */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="text-sm font-semibold text-[#1B3A5C] mb-3">{lang === 'es' ? '¿Cómo te sientes ahora mismo?' : 'How are you feeling right now?'}</div>
        <div className="flex items-center justify-between gap-2">
          {moodConfig.map((m) => (
            <button
              key={m.n}
              onClick={() => setMood(m.n)}
              className={
                "flex flex-col items-center gap-1.5 rounded-2xl p-2 flex-1 transition-all " +
                (mood === m.n ? "bg-slate-50 ring-1 ring-black/8" : "")
              }
              aria-label={m.label}
            >
              <div
                className={
                  "h-8 w-8 rounded-full transition-all " +
                  (mood === m.n ? `${m.active} ring-4 shadow-sm` : m.color)
                }
              />
              <div className={`text-[10px] font-semibold ${mood === m.n ? "text-slate-800" : "text-slate-400"} leading-tight text-center`}>
                {m.label}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 text-center text-xs text-slate-500">
          {lang === 'es' ? 'Estado: ' : 'Feeling: '}<span className="font-semibold text-slate-700">{currentMood.label}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <Card accentColor="bg-[#2A7F8E]">
          <SectionTitle
            icon={CheckCircle2}
            title={lang === 'es' ? 'Reinicio de un minuto' : 'One-minute reset'}
            subtitle={lang === 'es' ? 'Estas toman menos de un minuto y realmente pueden ayudar.' : 'These take under a minute and can genuinely help.'}
            iconClassName="bg-[#2A7F8E]/10 text-[#2A7F8E]"
          />
          <div className="mt-3 rounded-2xl bg-[#2A7F8E]/5 p-4 ring-1 ring-[#2A7F8E]/15">
            <div className="text-sm font-semibold text-[#1B3A5C]">{lang === 'es' ? 'Respiración cuadrada (4‑4‑4‑4)' : 'Box breathing (4‑4‑4‑4)'}</div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {(lang === 'es'
                ? ["Inhala\n4 seg", "Aguanta\n4 seg", "Exhala\n4 seg", "Aguanta\n4 seg"]
                : ["Breathe in\n4 sec", "Hold\n4 sec", "Breathe out\n4 sec", "Hold\n4 sec"]
              ).map((step) => (
                <div key={step} className="rounded-xl bg-white p-2 text-center ring-1 ring-[#2A7F8E]/15">
                  <div className="whitespace-pre-line text-[10px] text-slate-600 leading-tight">{step}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-center text-[11px] text-slate-500">{lang === 'es' ? 'Repite 3 veces' : 'Repeat 3 times'}</div>
          </div>
        </Card>

        <Card accentColor="bg-rose-400">
          <SectionTitle
            icon={Users}
            title={prefs.language === 'es' ? '¿Quieres hablar con alguien?' : 'Want to talk to a person?'}
            subtitle={prefs.language === 'es' ? 'No tienes que estar en crisis para llamar. Estas personas hablarán contigo.' : "You don't have to be in a crisis to call. These people will talk with you."}
            iconClassName="bg-rose-400/10 text-rose-600"
          />
          <div className="mt-3 grid gap-2">
            {CRISIS_PINS.slice(0, 2).map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-semibold ring-1 ring-black/8 hover:bg-slate-50 transition-colors"
              >
                <span className="text-slate-800">
                  {c.name}
                  <span className="ml-2 text-xs font-normal text-slate-500">· {prefs.language === 'es' ? c.how_es : c.how}</span>
                </span>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            ))}
          </div>
        </Card>

        <div className="rounded-3xl bg-slate-50/80 p-4 ring-1 ring-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-700">{lang === 'es' ? 'Una cosa importante' : 'One important thing'}</div>
          <div className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            {lang === 'es' ? 'Esta app no puede reemplazar el apoyo real. Si sientes que podrías hacerte daño, comunícate usando los enlaces de crisis o llama al 911. Mereces ayuda real.' : "This app can't replace real support. If you feel like you might hurt yourself, please reach out using the crisis links or call 911. You deserve real help."}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── markdown renderer ────────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key++} className="mt-2 space-y-1">
        {listItems.map((item, i) => (
          <li key={i} className="flex gap-2 items-start">
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A7F8E]" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    if (line.startsWith("# ") || line.startsWith("## ")) {
      flushList();
      const content = line.replace(/^#{1,2} /, "");
      elements.push(
        <p key={key++} className="mt-2 font-semibold text-[#1B3A5C]">
          {renderInline(content)}
        </p>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.slice(2));
    } else if (line === "---") {
      flushList();
      elements.push(<hr key={key++} className="my-2 border-slate-100" />);
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={key++} className="mt-1 first:mt-0">
          {renderInline(line)}
        </p>
      );
    }
  }
  flushList();
  return <>{elements}</>;
}

// ─── chat modal ─────────────────────────────────────────────────────────────────

function ChatModal({
  open,
  onClose,
  prefs,
  onNavigate,
  prefill = "",
}: {
  open: boolean;
  onClose: () => void;
  prefs: Prefs;
  onNavigate: (route: string) => void;
  prefill?: string;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [msgs, setMsgs] = useState<
    Array<{
      role: string;
      text?: string;
      title?: string;
      body?: string;
      cites?: string[];
      kind?: string;
    }>
  >([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!open) {
      timeout = setTimeout(() => {
        setMsgs([]);
        setText("");
      }, 300);
    } else if (prefill) {
      setText(prefill);
    }
    return () => clearTimeout(timeout);
  }, [open, prefill]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs]);

  const lang: Lang = prefs.language === 'es' ? 'es' : 'en';
  const prompts = useMemo(() => {
    if (lang === 'es') {
      const base = [...SUGGESTED_ES];
      if (prefs.tribal) base.unshift('¿Qué significa ICWA para mi caso?');
      return base;
    }
    const base = [
      "What's a permanency hearing?",
      "Can I see my brother or sister?",
      "How do I get my birth certificate?",
      "How can I pay for college?",
      "I feel stressed and need support",
    ];
    if (prefs.tribal) base.unshift("What does ICWA mean for my case?");
    return base;
  }, [prefs.tribal, lang]);

  const send = async (q?: string) => {
    const trimmed = (q ?? text).trim();
    if (!trimmed || sending) return;

    setSending(true);
    setMsgs((m) => [...m, { role: "user", text: trimmed }]);
    setText("");

    try {
      const res = await sendChatMessage(
        trimmed,
        (prefs.ageBand ?? "13-15") as import("./api/chat").AgeBand,
        (prefs.language ?? "en") as "en" | "es",
        prefs.county ?? undefined,
      );

      if (res.isCrisis) {
        setMsgs((m) => [
          ...m,
          {
            role: "bot",
            body: res.reply,
            cites: res.crisisResources?.map((r) => `${r.name}: ${r.number}`) ?? [],
            kind: "crisis",
          },
        ]);
        onNavigate("resources");
      } else {
        setMsgs((m) => [
          ...m,
          {
            role: "bot",
            body: res.reply,
            cites: res.citations.map((c) => c.label),
            kind: "normal",
          },
        ]);
      }
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "bot",
          body: lang === 'es'
            ? 'Estoy teniendo problemas ahora mismo. Si necesitas ayuda, puedes llamar o enviar un mensaje al 211 Arizona — una persona real responderá.'
            : "I'm having trouble right now. If you need help, you can call or text 211 Arizona — a real person will answer.",
          kind: "normal",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t('ask_title', lang)}>
      {/* Chat hero */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2A7F8E] to-[#1B3A5C] p-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 rounded-xl bg-white/15 p-2 backdrop-blur-sm">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{lang === 'es' ? 'Estoy aquí para ayudarte a encontrar respuestas' : "I'm here to help you find answers"}</div>
            <div className="mt-0.5 text-xs text-white/75 leading-relaxed">
              {lang === 'es' ? 'Información real sobre tus derechos, caso y recursos. No soy un consejero — pero estoy aquí para ayudar.' : 'Real info about your rights, case, and resources. Not a counselor — but here to help.'}
            </div>
          </div>
        </div>
      </div>

      {/* Message thread */}
      <div ref={listRef} className="mt-3 max-h-[42vh] space-y-3 overflow-y-auto pr-1">
        {msgs.length === 0 ? (
          <div className="py-2 text-center text-sm text-slate-400">
            {lang === 'es' ? 'Prueba una de las preguntas de abajo, o pregunta lo que tengas en mente.' : "Try one of the questions below, or ask whatever's on your mind."}
          </div>
        ) : null}

        {msgs.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} className={"flex " + (isUser ? "justify-end" : "justify-start")}>
              {isUser ? (
                <div className="max-w-[80%] rounded-3xl rounded-br-md bg-[#1B3A5C] px-4 py-2.5 text-sm text-white shadow-sm">
                  {m.text}
                </div>
              ) : (
                <div className="max-w-[88%] overflow-hidden rounded-3xl rounded-bl-md bg-white shadow-sm ring-1 ring-black/8 flex">
                  <div className="w-1 shrink-0 bg-[#2A7F8E]" />
                  <div className="flex-1 p-3">
                    <div className="text-xs font-bold text-[#1B3A5C]">{m.title}</div>
                    <div className="mt-1 text-sm text-slate-700 leading-relaxed">{renderMarkdown(m.body ?? "")}</div>
                    <CitationsRow cites={m.cites} />
                    <div className="mt-2 text-[10px] text-slate-400">
                      {lang === 'es' ? 'Para tu situación específica, habla con tu trabajador/a de casos o abogado.' : 'For your specific situation, talk to your caseworker or lawyer.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested prompts */}
      <div className="mt-3">
        <div className="flex flex-wrap gap-1.5">
          {prompts.slice(0, 5).map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="rounded-full bg-[#1B3A5C]/5 px-3 py-1.5 text-xs font-semibold text-[#1B3A5C] ring-1 ring-[#1B3A5C]/15 hover:bg-[#1B3A5C]/10 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('ask_placeholder', lang)}
          className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-[#2A7F8E]/35 transition-all"
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          onClick={() => send()}
          disabled={sending || !text.trim()}
          className="rounded-2xl bg-[#1B3A5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#152e49] transition-colors shadow-sm disabled:opacity-50"
        >
          {sending ? "…" : t('ask_send', lang)}
        </button>
      </div>

      <div className="mt-2 text-[10px] text-slate-400">
        {lang === 'es' ? 'Los mensajes se borran cuando cierras esta ventana — no se guarda ningún historial.' : 'Messages clear when you close this window — no history is stored.'}
      </div>
    </Modal>
  );
}

// ─── ask screen ────────────────────────────────────────────────────────────────

const SUGGESTED_ES = [
  '¿Cuáles son mis derechos en el cuidado adoptivo?',
  '¿Qué pasa en una audiencia de dependencia?',
  '¿Qué es el EFC y cómo lo solicito?',
  '¿Puedo ver a mis hermanos si estamos en distintos hogares?',
];

function AskScreen({
  prefs,
  onNavigate,
}: {
  prefs: Prefs;
  onNavigate: (route: string) => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [msgs, setMsgs] = useState<
    Array<{
      role: string;
      text?: string;
      body?: string;
      cites?: string[];
      kind?: string;
    }>
  >([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const lang: Lang = prefs.language === 'es' ? 'es' : 'en';

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs]);

  const prompts = useMemo(() => {
    if (lang === 'es') {
      const base = [...SUGGESTED_ES];
      if (prefs.tribal) base.unshift('¿Qué significa ICWA para mi caso?');
      return base;
    }
    const base = [
      "What's a permanency hearing?",
      "Can I see my brother or sister?",
      "How do I get my birth certificate?",
      "How can I pay for college?",
      "I feel stressed and need support",
    ];
    if (prefs.tribal) base.unshift("What does ICWA mean for my case?");
    return base;
  }, [prefs.tribal, lang]);

  const send = async (q?: string) => {
    const trimmed = (q ?? text).trim();
    if (!trimmed || sending) return;
    setSending(true);
    setMsgs((m) => [...m, { role: "user", text: trimmed }]);
    setText("");
    try {
      const res = await sendChatMessage(
        trimmed,
        (prefs.ageBand ?? "13-15") as import("./api/chat").AgeBand,
        (prefs.language ?? "en") as "en" | "es",
        prefs.county ?? undefined,
      );
      if (res.isCrisis) {
        setMsgs((m) => [
          ...m,
          {
            role: "bot",
            body: res.reply,
            cites: res.crisisResources?.map((r) => `${r.name}: ${r.number}`) ?? [],
            kind: "crisis",
          },
        ]);
        onNavigate("resources");
      } else {
        setMsgs((m) => [
          ...m,
          {
            role: "bot",
            body: res.reply,
            cites: res.citations.map((c) => c.label),
            kind: "normal",
          },
        ]);
      }
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "bot",
          body: lang === 'es'
            ? 'Estoy teniendo problemas ahora mismo. Si necesitas ayuda, puedes llamar o enviar un mensaje al 211 Arizona — una persona real responderá.'
            : "I'm having trouble right now. If you need help, you can call or text 211 Arizona — a real person will answer.",
          kind: "normal",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-4 pb-28 pt-4">
      {/* Hero */}
      <div className="mb-4 rounded-3xl bg-gradient-to-br from-[#2A7F8E] to-[#1B3A5C] p-5 shadow-md">
        <div className="flex items-center gap-3">
          <div className="shrink-0 rounded-2xl bg-white/15 p-2.5 backdrop-blur-sm">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-white">{t('ask_title', lang)}</div>
            <div className="mt-0.5 text-xs text-white/75 leading-relaxed">
              {lang === 'es' ? 'Respuestas reales sobre tus derechos, caso y recursos. No se guarda. No se comparte.' : 'Real answers about your rights, case, and resources. Not stored. Not shared.'}
            </div>
          </div>
        </div>
      </div>

      {/* Message thread */}
      <div ref={listRef} className="mb-3 max-h-[45vh] space-y-3 overflow-y-auto pr-1">
        {msgs.length === 0 ? (
          <div className="py-4 text-center text-sm text-slate-400">
            {lang === 'es' ? 'Prueba una de las preguntas de abajo, o pregunta lo que tengas en mente.' : "Try one of the questions below, or ask whatever's on your mind."}
          </div>
        ) : null}
        {msgs.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} className={"flex " + (isUser ? "justify-end" : "justify-start")}>
              {isUser ? (
                <div className="max-w-[80%] rounded-3xl rounded-br-md bg-[#1B3A5C] px-4 py-2.5 text-sm text-white shadow-sm">
                  {m.text}
                </div>
              ) : (
                <div className="max-w-[88%] overflow-hidden rounded-3xl rounded-bl-md bg-white shadow-sm ring-1 ring-black/8 flex">
                  <div className="w-1 shrink-0 bg-[#2A7F8E]" />
                  <div className="flex-1 p-3">
                    <div className="mt-1 text-sm text-slate-700 leading-relaxed">{renderMarkdown(m.body ?? "")}</div>
                    <CitationsRow cites={m.cites} />
                    <div className="mt-2 text-[10px] text-slate-400">
                      {lang === 'es' ? 'Para tu situación específica, habla con tu trabajador/a de casos o abogado.' : 'For your specific situation, talk to your caseworker or lawyer.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-3xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-slate-400 shadow-sm ring-1 ring-black/8">
              {t('ask_thinking', lang)}
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {prompts.slice(0, 5).map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="rounded-full bg-[#1B3A5C]/5 px-3 py-1.5 text-xs font-semibold text-[#1B3A5C] ring-1 ring-[#1B3A5C]/15 hover:bg-[#1B3A5C]/10 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('ask_placeholder', lang)}
          className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-[#2A7F8E]/35 transition-all"
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          onClick={() => send()}
          disabled={sending || !text.trim()}
          className="rounded-2xl bg-[#1B3A5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#152e49] transition-colors shadow-sm disabled:opacity-50"
        >
          {sending ? "…" : t('ask_send', lang)}
        </button>
      </div>

      <div className="mt-2 text-[10px] text-slate-400">
        {lang === 'es' ? 'Los mensajes se borran cuando sales de esta página — nada se guarda.' : 'Messages clear when you leave this page — nothing is stored.'}
      </div>
    </div>
  );
}

// ─── self-tests ────────────────────────────────────────────────────────────────

function runSelfTests() {
  const assert = (cond: boolean, msg: string) => {
    if (!cond) throw new Error(`Self-test failed: ${msg}`);
  };

  assert(JSON.stringify(bandToRange("10-12")) === JSON.stringify([10, 12]), "bandToRange 10-12");
  assert(JSON.stringify(bandToRange("18-21")) === JSON.stringify([18, 21]), "bandToRange 18-21");
  assert(isCrisis("I want to die") === true, "isCrisis detects self-harm phrase");
  assert(isCrisis("I love pizza") === false, "isCrisis ignores benign text");

}

// ─── root component ────────────────────────────────────────────────────────────

export default function FosterGuideAZPrototype() {
  const [prefs, setPrefs] = useLocalPref<Prefs>("fgaz_prefs", {
    language: null,
    ageBand: null,
    county: null,
    pathway: null,
    tribal: false,
  });

  const [route, setRoute] = useState("onboarding");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPrefill, setChatPrefill] = useState("");
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    try {
      // @ts-expect-error - process might not be defined in browser
      const isDev = typeof process !== "undefined" && process?.env?.NODE_ENV !== "production";
      if (isDev) runSelfTests();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [showBreakReminder, setShowBreakReminder] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowBreakReminder(true), 20 * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  const onDoneOnboarding = () => {
    const tab =
      prefs.pathway === "rights"
        ? "rights"
        : prefs.pathway === "court"
          ? "case"
          : prefs.pathway === "future"
            ? "future"
            : prefs.pathway === "resources"
              ? "resources"
              : prefs.pathway === "wellness"
                ? "wellness"
                : "home";
    setRoute(tab);
  };

  const onReset = () => {
    setPrefs({ language: null, ageBand: null, county: null, pathway: null, tribal: false });
    setRoute("onboarding");
  };

  const quickExit = () => {
    window.open("https://www.google.com", "_blank", "noopener,noreferrer");
    setToast({ title: "Quick Exit", body: "Opened a neutral page in a new tab (prototype behavior)." });
  };

  const titleByRoute: Record<string, string> = {
    onboarding: "Compass",
    home: "Home",
    ask: "Ask Compass",
    rights: "My Rights",
    case: "My Case",
    future: "My Future",
    resources: "Resources",
    wellness: "Wellness",
  };

  const main = () => {
    if (route === "onboarding") {
      return <Onboarding prefs={prefs} setPrefs={setPrefs} onDone={onDoneOnboarding} />;
    }
    if (route === "home") {
      return (
        <HomeScreen
          prefs={prefs}
          onGo={(r) => setRoute(r)}
          onOpenChat={() => setChatOpen(true)}
          onReset={onReset}
        />
      );
    }
    if (route === "ask") return <AskScreen prefs={prefs} onNavigate={(r) => setRoute(r)} />;
    if (route === "rights") return <RightsScreen prefs={prefs} />;
    if (route === "case") return <CaseScreen prefs={prefs} />;
    if (route === "future") return <FutureScreen prefs={prefs} onAskChat={(q) => { setChatPrefill(q); setChatOpen(true); }} />;
    if (route === "resources") return <ResourcesScreen prefs={prefs} />;
    if (route === "wellness") return <WellnessScreen prefs={prefs} />;
    return null;
  };

  const showTabs = route !== "onboarding";

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        background:
          "radial-gradient(ellipse at 85% 8%, rgba(42,127,142,0.13) 0%, transparent 52%), " +
          "radial-gradient(ellipse at 15% 92%, rgba(217,119,6,0.09) 0%, transparent 50%), " +
          "#F5F2EE",
      }}
    >
      <div className="mx-auto max-w-md">
        <TopBar
          title={titleByRoute[route] || "Compass"}
          onQuickExit={quickExit}
          onOpenChat={() => setChatOpen(true)}
          onBack={route !== "onboarding" && route !== "home" ? () => setRoute("home") : undefined}
        />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={route}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {main()}
            </motion.div>
          </AnimatePresence>
        </div>

        {showBreakReminder && (
          <div className="fixed top-16 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <div
              className="mx-4 mt-2 px-4 py-3 rounded-xl shadow-lg text-sm flex items-center gap-3 pointer-events-auto"
              style={{ backgroundColor: "#2A7F8E", color: "#fff", maxWidth: 400 }}
            >
              <span>
                You&apos;ve been here a while. Take a break when you need one — this
                will still be here.
              </span>
              <button
                onClick={() => setShowBreakReminder(false)}
                className="ml-auto text-white/80 hover:text-white font-medium shrink-0"
                aria-label="Dismiss break reminder"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {showTabs ? <TabBar active={route} onGo={(r) => setRoute(r)} lang={prefs.language} /> : null}

        <ChatModal
          open={chatOpen}
          onClose={() => { setChatOpen(false); setChatPrefill(""); }}
          prefs={prefs}
          onNavigate={(r) => setRoute(r)}
          prefill={chatPrefill}
        />

        {/* Toast */}
        <AnimatePresence>
          {toast ? (
            <motion.div
              className="fixed bottom-20 left-0 right-0 z-[60] mx-auto max-w-md px-4"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
            >
              <div className="rounded-3xl bg-[#1B3A5C] px-4 py-3 text-white shadow-xl">
                <div className="text-sm font-semibold">{toast.title}</div>
                <div className="mt-0.5 text-xs text-white/70">{toast.body}</div>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => setToast(null)}
                    className="rounded-2xl bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15 transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Floating chat button */}
        {showTabs ? (
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-24 right-4 z-50 rounded-full bg-[#D97706] p-4 text-white shadow-xl hover:brightness-105 active:scale-[0.97] transition-all"
            aria-label="Open chat"
            title="Ask Compass"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
