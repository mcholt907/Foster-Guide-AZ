// Strings for the Case and Team pages that are not in i18n.ts / i18n-teen.ts:
// the tribal (ICWA) note, the safety answer, and a few labels.
// Plain language, youth voice, EN + ES, 6th-grade reading level or lower.

export type CaseLang = "en" | "es";

const CASE_STRINGS = {
  // ── Teen Case page ──────────────────────────────────────────────────────
  "case.hero.subtitle": {
    en: "Most cases go through the same main hearings. Here's what each one is for, and how to get ready.",
    es: "La mayoría de los casos pasan por las mismas audiencias principales. Aquí ves para qué es cada una y cómo prepararte.",
  },
  "case.stage":           { en: "Step",            es: "Paso" },
  "case.stage.sometimes": { en: "Some cases only", es: "Solo en algunos casos" },

  // ── Safety answer (Team pages) ──────────────────────────────────────────
  "safety.now": {
    en: "If you are in danger right now, call 911. To report abuse any time, day or night, call 1-888-SOS-CHILD (1-888-767-2445).",
    es: "Si estás en peligro ahora mismo, llama al 911. Para reportar abuso a cualquier hora, de día o de noche, llama al 1-888-SOS-CHILD (1-888-767-2445).",
  },
  "safety.then.teen": {
    en: "Then tell your caseworker, lawyer, or CASA as soon as you can. It is their job to help keep you safe. You will not get in trouble for telling.",
    es: "Después, díselo a tu trabajador/a de casos, abogado/a o CASA lo más pronto que puedas. Su trabajo es ayudar a mantenerte a salvo. No te meterás en problemas por decirlo.",
  },
  "safety.then.kid": {
    en: "Then tell your caseworker, lawyer, CASA, or another grown-up you trust. You will not get in trouble for telling.",
    es: "Después, díselo a tu trabajador/a de casos, abogado/a, CASA u otro adulto en quien confíes. No te meterás en problemas por decirlo.",
  },

  // ── Tribal note (Indian Child Welfare Act) ──────────────────────────────
  "tribal.kicker":      { en: "Tribal nations", es: "Naciones tribales" },

  "tribal.yes.title": {
    en: "Your tribe has a say in your case",
    es: "Tu tribu tiene voz en tu caso",
  },
  "tribal.yes.body": {
    en: "A law called the Indian Child Welfare Act (ICWA) may protect you. It says your tribe gets a say in your case. It also says the court should try to keep you connected to your family, your tribe, and your culture.",
    es: "Una ley llamada Ley de Bienestar del Niño Indígena (ICWA) puede protegerte. Dice que tu tribu tiene voz en tu caso. También dice que el tribunal debe tratar de mantenerte conectado/a con tu familia, tu tribu y tu cultura.",
  },
  "tribal.yes.ask": {
    en: "Ask your lawyer: \"Does ICWA apply to my case?\"",
    es: "Pregúntale a tu abogado/a: «¿ICWA aplica a mi caso?»",
  },
  "tribal.yes.title.kid": {
    en: "Your tribe is part of your team",
    es: "Tu tribu es parte de tu equipo",
  },
  "tribal.yes.body.kid": {
    en: "A law called ICWA says your tribe gets a say in your case. The court should try to keep you close to your family, your tribe, and your culture.",
    es: "Una ley llamada ICWA dice que tu tribu tiene voz en tu caso. El tribunal debe tratar de mantenerte cerca de tu familia, tu tribu y tu cultura.",
  },
  "tribal.yes.ask.kid": {
    en: "You can ask your lawyer: \"Does ICWA apply to my case?\"",
    es: "Puedes preguntarle a tu abogado/a: «¿ICWA aplica a mi caso?»",
  },

  "tribal.unsure.title": {
    en: "Not sure if you are part of a tribe?",
    es: "¿No sabes si eres parte de una tribu?",
  },
  "tribal.unsure.body": {
    en: "Ask your lawyer or caseworker if you or your parents are members of a tribe — extra protections may apply.",
    es: "Pregúntale a tu abogado/a o a tu trabajador/a de casos si tú o tus padres son miembros de una tribu — pueden aplicar protecciones extra.",
  },
  "tribal.unsure.body.kid": {
    en: "Ask your lawyer or caseworker if you or your parents are part of a tribe. If so, there are extra rules to protect you.",
    es: "Pregúntale a tu abogado/a o a tu trabajador/a de casos si tú o tus padres son parte de una tribu. Si es así, hay reglas extra para protegerte.",
  },

  // ── Setup: tribal question ──────────────────────────────────────────────
  "setup.tribal.yes.desc":    { en: "I am, or my family is",  es: "Yo o mi familia" },
  "setup.tribal.no.desc":     { en: "I am not",               es: "No lo soy" },
  "setup.tribal.unsure.desc": { en: "That's okay",            es: "Está bien" },
} as const;

export type CaseStringKey = keyof typeof CASE_STRINGS;

export function tc(key: CaseStringKey, lang: CaseLang): string {
  return CASE_STRINGS[key][lang];
}
