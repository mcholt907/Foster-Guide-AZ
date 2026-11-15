// Strings for the teen Home page: greeting, search, starter questions and the
// tiles that have no entry in i18n-teen.ts. Plain language, youth voice, EN + ES.
import type { AgeBandKey } from "./prefs";

type HomeLang = "en" | "es";

const HOME_STRINGS = {
  "home.hello":            { en: "Hi. We're glad you're here.", es: "Hola. Qué bueno que estás aquí." },
  "home.title":            { en: "You're in the right place.", es: "Estás en el lugar correcto." },
  "home.reassure":         { en: "Whatever is going on, it is not your fault — and you don't have to figure it out alone.",
                             es: "Pase lo que pase, no es tu culpa — y no tienes que resolverlo a solas." },
  "home.closing.title":    { en: "This is a lot. Go at your own pace.",
                             es: "Esto es mucho. Ve a tu propio ritmo." },
  "home.closing.body":     { en: "You don't have to read everything today. Come back any time — this page will be here.",
                             es: "No tienes que leer todo hoy. Vuelve cuando quieras — esta página va a estar aquí." },
  "home.subtitle":         { en: "Ask anything, or pick a place to start.",
                             es: "Pregunta lo que quieras, o elige por dónde empezar." },
  "home.search.label":     { en: "Search for an answer", es: "Busca una respuesta" },
  "home.search.placeholder": { en: "Type your question…", es: "Escribe tu pregunta…" },
  "home.search.button":    { en: "Search", es: "Buscar" },
  "home.starters.label":   { en: "Questions other youth ask", es: "Preguntas que hacen otros jóvenes" },
  "home.tiles.label":      { en: "Places to start", es: "Por dónde empezar" },

  "home.tile.rights.desc":    { en: "What the law says you get, and what to do if it isn't happening.",
                                es: "Lo que la ley dice que te toca, y qué hacer si no está pasando." },
  "home.tile.resources.desc": { en: "Free help near you — housing, food, legal help, and more.",
                                es: "Ayuda gratis cerca de ti — vivienda, comida, ayuda legal y más." },
  "home.tile.future.desc":    { en: "Getting ready for 18 and after: school, money, and a place to live.",
                                es: "Prepararte para los 18 y después: escuela, dinero y dónde vivir." },

  // County picker on the Resources page
  "resources.county.label": { en: "Show help near", es: "Mostrar ayuda cerca de" },
  "resources.county.all":   { en: "All of Arizona", es: "Todo Arizona" },
  "resources.county.hint":  { en: "Pick your county and age to see the help that fits you. It stays on this device.",
                              es: "Elige tu condado y tu edad para ver la ayuda que va contigo. Se queda en este dispositivo." },
  "resources.age.label":    { en: "For ages", es: "Para edades" },
  "resources.age.all":      { en: "All ages", es: "Todas las edades" },
  "shell.pick_age":         { en: "Pick your age", es: "Elige tu edad" },

  // Setup and language picker
  "setup.back":             { en: "Back", es: "Atrás" },
  "setup.age.hint":         { en: "We ask so we can show you what fits your age. Tap one to start.",
                              es: "Preguntamos para mostrarte lo que va con tu edad. Toca una para empezar." },

  // 18-21: still in care, or already left
  "left.ask":          { en: "Are you still in foster care?", es: "¿Sigues en cuidado de crianza?" },
  "left.in":           { en: "I'm still in care", es: "Sigo en cuidado" },
  "left.out":          { en: "I've left care", es: "Ya salí del cuidado" },
  "left.reassure":     { en: "You left foster care — and you still have help. None of this needs a caseworker.",
                         es: "Saliste del cuidado de crianza — y todavía tienes ayuda. Nada de esto necesita un trabajador de casos." },
  "left.start.title":  { en: "Start here", es: "Empieza aquí" },
  "left.start.sub":    { en: "The things young adults ask about most after leaving care.",
                         es: "Lo que más preguntan los adultos jóvenes después de salir del cuidado." },
  "left.read":         { en: "Read more", es: "Leer más" },
  "left.listings":     { en: "See places to stay", es: "Ver lugares para quedarte" },
  "setup.left.label":  { en: "18–21, and I've left foster care", es: "18–21, y ya salí del cuidado de crianza" },
  "setup.left.desc":   { en: "Housing, health coverage, coming back", es: "Vivienda, seguro médico, regresar" },
} as const;

export type HomeStringKey = keyof typeof HOME_STRINGS;

export function tho(key: HomeStringKey, lang: HomeLang): string {
  return HOME_STRINGS[key][lang];
}

/**
 * A starter question: what the youth sees, and the id of the answer it opens
 * (from data/questions.ts). The search box is filled with the label in the
 * youth's own language.
 */
export interface StarterQuestion {
  label: { en: string; es: string };
  answerId: string;
}

const FAMILY: StarterQuestion = {
  label: { en: "When can I see my family?", es: "¿Cuándo puedo ver a mi familia?" },
  answerId: "q-contact-parents",
};
const SCHOOL: StarterQuestion = {
  label: { en: "Can I stay at my school?", es: "¿Puedo quedarme en mi escuela?" },
  answerId: "q-stay-at-my-school",
};

export const STARTER_QUESTIONS: Record<Exclude<AgeBandKey, "10-12">, StarterQuestion[]> = {
  "13-15": [
    { label: { en: "Why am I in foster care?", es: "¿Por qué estoy en cuidado de crianza?" }, answerId: "q-why-was-i-taken" },
    FAMILY,
    { label: { en: "Will I see my brothers and sisters?", es: "¿Voy a ver a mis hermanos?" }, answerId: "q-see-siblings" },
    SCHOOL,
  ],
  "16-17": [
    FAMILY,
    { label: { en: "What if I don't like where I live?", es: "¿Y si no me gusta donde vivo?" }, answerId: "q-dont-like-foster-home" },
    { label: { en: "What happens when I turn 18?", es: "¿Qué pasa cuando cumpla 18?" }, answerId: "q-do-i-have-to-leave-at-18" },
    SCHOOL,
  ],
  "18-21": [
    { label: { en: "Can I stay in foster care after 18?", es: "¿Puedo seguir en cuidado de crianza después de los 18?" }, answerId: "q-what-is-efc" },
    { label: { en: "How do I keep my health insurance?", es: "¿Cómo mantengo mi seguro médico?" }, answerId: "q-what-is-ahcccs-yati" },
    { label: { en: "Is there money for college?", es: "¿Hay dinero para la universidad?" }, answerId: "q-what-is-etv" },
    { label: { en: "How do I get my documents?", es: "¿Cómo consigo mis documentos?" }, answerId: "q-what-docs-should-i-have" },
  ],
};

/** Starter questions for a young adult who has already left foster care. */
export const LEFT_CARE_STARTERS: StarterQuestion[] = [
  { label: { en: "I need a place to stay tonight", es: "Necesito dónde quedarme hoy" }, answerId: "q-nowhere-to-go-tonight" },
  { label: { en: "Can I come back to foster care?", es: "¿Puedo regresar al cuidado de crianza?" }, answerId: "q-come-back-to-care" },
  { label: { en: "How do I keep my health insurance?", es: "¿Cómo mantengo mi seguro médico?" }, answerId: "q-what-is-ahcccs-yati" },
  { label: { en: "How do I get my documents?", es: "¿Cómo consigo mis documentos?" }, answerId: "q-get-birth-certificate" },
];

/**
 * "Start here" cards for a young adult who has left care. Every next step
 * works without a caseworker. Phone numbers here are the ones already
 * verified in data/resources.ts (2-1-1 Arizona; AHCCCS 602-417-4000).
 */
export interface LeftCareStep {
  id: "stay" | "return" | "health" | "school" | "papers";
  title: { en: string; es: string };
  body: { en: string; es: string };
  answerId: string;
}

export const LEFT_CARE_STEPS: LeftCareStep[] = [
  {
    id: "stay",
    title: { en: "A place to stay", es: "Un lugar donde quedarte" },
    body: {
      en: "Nowhere to sleep tonight? Call 2-1-1, any time. They can find a shelter bed near you. If you are in danger, call 911.",
      es: "¿No tienes dónde dormir hoy? Llama al 2-1-1, a cualquier hora. Pueden encontrarte una cama en un refugio cerca. Si estás en peligro, llama al 911.",
    },
    answerId: "q-nowhere-to-go-tonight",
  },
  {
    id: "return",
    title: { en: "Coming back to care", es: "Regresar al cuidado" },
    body: {
      en: "If you were in foster care in Arizona when you turned 18, you can ask to come back any time before you turn 21. Leaving was not a mistake you have to live with.",
      es: "Si estabas en cuidado de crianza en Arizona cuando cumpliste 18, puedes pedir regresar en cualquier momento antes de cumplir 21. Haber salido no es un error con el que tengas que cargar.",
    },
    answerId: "q-come-back-to-care",
  },
  {
    id: "health",
    title: { en: "Health coverage", es: "Seguro médico" },
    body: {
      en: "If you were in foster care when you turned 18, you can usually get free health coverage until you turn 26. Call AHCCCS at 602-417-4000 and say you were in foster care at 18.",
      es: "Si estabas en cuidado de crianza cuando cumpliste 18, normalmente puedes tener seguro médico gratis hasta los 26. Llama a AHCCCS al 602-417-4000 y di que estabas en cuidado de crianza a los 18.",
    },
    answerId: "q-what-is-ahcccs-yati",
  },
  {
    id: "school",
    title: { en: "School, training and work", es: "Escuela, capacitación y trabajo" },
    body: {
      en: "There is money for college or job training for young people who were in foster care, and a tuition waiver at Arizona public colleges if you are under 23. Tell the school's financial aid office you were in foster care.",
      es: "Hay dinero para la universidad o capacitación para jóvenes que estuvieron en cuidado de crianza, y una exención de matrícula en las universidades públicas de Arizona si tienes menos de 23. Dile a la oficina de ayuda financiera que estuviste en cuidado de crianza.",
    },
    answerId: "q-what-is-etv",
  },
  {
    id: "papers",
    title: { en: "Your documents", es: "Tus documentos" },
    body: {
      en: "You can order your own birth certificate, Social Security card and state ID. Some have a fee when you order them yourself. Start with the birth certificate — you need it for the others.",
      es: "Puedes pedir tu propia acta de nacimiento, tarjeta de Seguro Social e identificación estatal. Algunas tienen un costo cuando las pides tú. Empieza con el acta de nacimiento — la necesitas para las demás.",
    },
    answerId: "q-get-birth-certificate",
  },
];
