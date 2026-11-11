// Strings for the "How are you feeling right now?" check-in on the Wellness
// pages (components/FeelingCheckIn.tsx). Plain language, youth voice, EN + ES.
//
// Rules for this copy: calm and kind, never alarming, never blaming, never a
// diagnosis. Keep it at a 6th-grade reading level or lower.
//
// Band-specific lines use a tier suffix:
//   .kid   → ages 10-12 (shortest, simplest)
//   .mid   → ages 13-15
//   .older → ages 16-17 and 18-21 (more direct)

import type { AgeBandKey } from "./prefs";

export type WellnessLang = "en" | "es";
export type WellnessTier = "kid" | "mid" | "older";

const WELLNESS_STRINGS = {
  // ── Question ─────────────────────────────────────────────────────────────
  "checkin.kicker":        { en: "Check in",
                             es: "Un momento para ti" },
  "checkin.question":      { en: "How are you feeling right now?",
                             es: "¿Cómo te sientes ahora mismo?" },
  "checkin.note":          { en: "This is just for you. Nothing is saved.",
                             es: "Esto es solo para ti. No se guarda nada." },

  // ── Choices ──────────────────────────────────────────────────────────────
  "checkin.mood.great":    { en: "Great",          es: "Genial" },
  "checkin.mood.okay":     { en: "Okay",           es: "Bien" },
  "checkin.mood.unsure":   { en: "Not sure",       es: "No sé" },
  "checkin.mood.sad":      { en: "Sad or worried", es: "Triste o con preocupación" },
  "checkin.mood.bad":      { en: "Really bad",     es: "Muy mal" },

  // ── Great ────────────────────────────────────────────────────────────────
  "checkin.great.line.kid":   { en: "That is great to hear! Hold on to that good feeling.",
                                es: "¡Qué bueno! Guarda ese sentimiento bonito." },
  "checkin.great.line.mid":   { en: "Glad to hear it. Good days count.",
                                es: "Qué bueno saberlo. Los días buenos cuentan." },
  "checkin.great.line.older": { en: "Good to hear. Good days count, so notice this one.",
                                es: "Qué bueno. Los días buenos cuentan, así que fíjate en este." },
  "checkin.great.idea.kid":   { en: "Think of one good thing from today. Write it down or tell someone.",
                                es: "Piensa en una cosa buena de hoy. Escríbela o cuéntasela a alguien." },
  "checkin.great.idea.mid":   { en: "Write 3 lines: what happened, how you felt, and one good thing.",
                                es: "Escribe 3 líneas: qué pasó, cómo te sentiste y una cosa buena." },
  "checkin.great.idea.older": { en: "Write 3 lines: what happened, how you felt, and one good thing. It helps to look back on later.",
                                es: "Escribe 3 líneas: qué pasó, cómo te sentiste y una cosa buena. Ayuda leerlo después." },

  // ── Okay ─────────────────────────────────────────────────────────────────
  "checkin.okay.line.kid":    { en: "Okay is a fine way to feel.",
                                es: "Sentirse bien, así nada más, está perfecto." },
  "checkin.okay.line.mid":    { en: "Okay is okay. You don't have to feel great all the time.",
                                es: "Estar bien es suficiente. No tienes que sentirte genial todo el tiempo." },
  "checkin.okay.line.older":  { en: "Okay is okay. You don't have to feel great all the time.",
                                es: "Estar bien es suficiente. No tienes que sentirte genial todo el tiempo." },
  "checkin.okay.idea.kid":    { en: "Move your body for one song. Walk, stretch, or dance.",
                                es: "Mueve tu cuerpo durante una canción. Camina, estírate o baila." },
  "checkin.okay.idea.mid":    { en: "Move for 5 minutes. Walk, stretch, or dance to one song.",
                                es: "Muévete 5 minutos. Camina, estírate o baila una canción." },
  "checkin.okay.idea.older":  { en: "Move for 5 minutes. Walk, stretch, or put on one song. It can shift how you feel.",
                                es: "Muévete 5 minutos. Camina, estírate o pon una canción. Puede cambiar cómo te sientes." },

  "checkin.idea.label":       { en: "One small idea", es: "Una idea pequeña" },

  // ── Not sure / Sad or worried ────────────────────────────────────────────
  "checkin.unsure.line.kid":   { en: "It's okay not to know how you feel. Lots of kids in foster care feel this way. It's not your fault.",
                                 es: "Está bien no saber cómo te sientes. Muchos niños en cuidado de crianza se sienten así. No es tu culpa." },
  "checkin.unsure.line.mid":   { en: "It's okay not to know how you feel. Lots of kids in foster care feel this way. It's not your fault.",
                                 es: "Está bien no saber cómo te sientes. Muchos jóvenes en cuidado de crianza se sienten así. No es tu culpa." },
  "checkin.unsure.line.older": { en: "It's okay not to know how you feel. A lot of people in foster care feel this way. It's not your fault.",
                                 es: "Está bien no saber cómo te sientes. Muchas personas en cuidado de crianza se sienten así. No es tu culpa." },
  "checkin.sad.line.kid":      { en: "That sounds hard. Lots of kids in foster care feel this way. It's not your fault.",
                                 es: "Eso suena difícil. Muchos niños en cuidado de crianza se sienten así. No es tu culpa." },
  "checkin.sad.line.mid":      { en: "That sounds hard. Lots of kids in foster care feel this way. It's not your fault.",
                                 es: "Eso suena difícil. Muchos jóvenes en cuidado de crianza se sienten así. No es tu culpa." },
  "checkin.sad.line.older":    { en: "That sounds hard. A lot of people in foster care feel this way. It's not your fault.",
                                 es: "Eso suena difícil. Muchas personas en cuidado de crianza se sienten así. No es tu culpa." },

  // ── Things to try (shared by Not sure, Sad or worried, Really bad → No) ──
  "checkin.try.heading":       { en: "Things you can try right now",
                                 es: "Cosas que puedes probar ahora" },
  "checkin.try.breathe":       { en: "Breathe in slowly and count to 4. Breathe out slowly. Do it 3 times.",
                                 es: "Inhala despacio y cuenta hasta 4. Exhala despacio. Hazlo 3 veces." },
  "checkin.try.see":           { en: "Look around. Name 5 things you can see.",
                                 es: "Mira a tu alrededor. Nombra 5 cosas que puedes ver." },
  "checkin.try.tell.kid":      { en: "Tell a grown-up you trust how you feel.",
                                 es: "Cuéntale cómo te sientes a un adulto en quien confías." },
  "checkin.try.tell.mid":      { en: "Tell an adult you trust how you feel.",
                                 es: "Cuéntale cómo te sientes a un adulto en quien confías." },
  "checkin.try.tell.older":    { en: "Tell someone you trust how you feel. A friend, an adult, or your case manager.",
                                 es: "Cuéntale cómo te sientes a alguien en quien confías. Un amigo, un adulto o tu trabajador de casos." },

  "checkin.offer.heading":     { en: "Want to talk to someone?",
                                 es: "¿Quieres hablar con alguien?" },
  "checkin.offer.body":        { en: "Real people answer. Calling is free. You are not in trouble for asking.",
                                 es: "Te contesta una persona real. Llamar es gratis. No estás en problemas por pedir ayuda." },

  // ── Really bad ───────────────────────────────────────────────────────────
  "checkin.bad.lead":          { en: "You matter. You don't have to handle this alone.",
                                 es: "Tú importas. No tienes que pasar por esto a solas." },
  "checkin.bad.sub.kid":       { en: "Feeling this bad is hard. It is not your fault.",
                                 es: "Sentirse tan mal es difícil. No es tu culpa." },
  "checkin.bad.sub.mid":       { en: "Feeling this bad is hard. It is not your fault.",
                                 es: "Sentirse tan mal es difícil. No es tu culpa." },
  "checkin.bad.sub.older":     { en: "Feeling this bad is hard, and it is not your fault.",
                                 es: "Sentirse tan mal es difícil, y no es tu culpa." },
  "checkin.bad.question":      { en: "Are you thinking about hurting yourself, or are you in danger?",
                                 es: "¿Estás pensando en hacerte daño, o estás en peligro?" },
  "checkin.bad.question.hint": { en: "Either answer is okay. You are not in trouble.",
                                 es: "Cualquier respuesta está bien. No estás en problemas." },
  "checkin.bad.yes":           { en: "Yes", es: "Sí" },
  "checkin.bad.no":            { en: "No",  es: "No" },
  "checkin.bad.yes.line":      { en: "If you are in danger right now, call 911. To talk or text with a caring person any time, use 988.",
                                 es: "Si estás en peligro ahora mismo, llama al 911. Para hablar o escribir con una persona que se preocupa por ti, a cualquier hora, usa el 988." },
  "checkin.bad.no.line":       { en: "Okay. Feeling really bad still counts. You can talk to someone any time.",
                                 es: "Está bien. Sentirse muy mal también cuenta. Puedes hablar con alguien a cualquier hora." },
} as const;

export type WellnessStringKey = keyof typeof WELLNESS_STRINGS;

export function tierForBand(band: AgeBandKey): WellnessTier {
  if (band === "10-12") return "kid";
  if (band === "13-15") return "mid";
  return "older";
}

export function tw(key: WellnessStringKey, lang: WellnessLang): string {
  return WELLNESS_STRINGS[key][lang];
}

type TieredBase = {
  [K in WellnessStringKey]: K extends `${infer B}.kid` ? B : never;
}[WellnessStringKey];

/** Resolve a band-specific line, e.g. twBand("checkin.great.line", "10-12", "en"). */
export function twBand(base: TieredBase, band: AgeBandKey, lang: WellnessLang): string {
  const key = `${base}.${tierForBand(band)}` as WellnessStringKey;
  return WELLNESS_STRINGS[key][lang];
}
