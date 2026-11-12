// Strings for the teen Home page: greeting, search, starter questions and the
// tiles that have no entry in i18n-teen.ts. Plain language, youth voice, EN + ES.
import type { AgeBandKey } from "./prefs";

type HomeLang = "en" | "es";

const HOME_STRINGS = {
  "home.title":            { en: "You're in the right place.", es: "Estás en el lugar correcto." },
  "home.subtitle":         { en: "Ask a question, or pick a place to start.",
                             es: "Haz una pregunta o elige por dónde empezar." },
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
} as const;

export type HomeStringKey = keyof typeof HOME_STRINGS;

export function tho(key: HomeStringKey, lang: HomeLang): string {
  return HOME_STRINGS[key][lang];
}

/** A starter question: what the youth sees, and the search words it runs. */
export interface StarterQuestion {
  label: { en: string; es: string };
  query: string;
}

const FAMILY: StarterQuestion = {
  label: { en: "When can I see my family?", es: "¿Cuándo puedo ver a mi familia?" },
  query: "can i call my mom",
};
const SCHOOL: StarterQuestion = {
  label: { en: "Can I stay at my school?", es: "¿Puedo quedarme en mi escuela?" },
  query: "can i stay at my school",
};

export const STARTER_QUESTIONS: Record<Exclude<AgeBandKey, "10-12">, StarterQuestion[]> = {
  "13-15": [
    { label: { en: "Why am I in foster care?", es: "¿Por qué estoy en cuidado de crianza?" }, query: "why was i taken" },
    FAMILY,
    { label: { en: "Will I see my brothers and sisters?", es: "¿Voy a ver a mis hermanos?" }, query: "will i see my siblings" },
    SCHOOL,
  ],
  "16-17": [
    FAMILY,
    { label: { en: "What if I don't like where I live?", es: "¿Y si no me gusta donde vivo?" }, query: "i dont like my foster home" },
    { label: { en: "What happens when I turn 18?", es: "¿Qué pasa cuando cumpla 18?" }, query: "what happens when i turn 18" },
    SCHOOL,
  ],
  "18-21": [
    { label: { en: "Can I stay in foster care after 18?", es: "¿Puedo seguir en cuidado de crianza después de los 18?" }, query: "extended foster care" },
    { label: { en: "How do I keep my health insurance?", es: "¿Cómo mantengo mi seguro médico?" }, query: "health insurance" },
    { label: { en: "Is there money for college?", es: "¿Hay dinero para la universidad?" }, query: "money for college" },
    { label: { en: "How do I get my documents?", es: "¿Cómo consigo mis documentos?" }, query: "birth certificate" },
  ],
};
