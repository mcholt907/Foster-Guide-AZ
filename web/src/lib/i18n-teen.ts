import type { Lang } from "./i18n";
import type { AgeBandKey } from "./prefs";

export const TEEN_STRINGS = {
  "nav.dashboard":           { en: "Dashboard",              es: "Inicio" },
  "nav.case":                { en: "My Case Explained",      es: "Mi Caso Explicado" },
  "nav.team":                { en: "My Advocates",           es: "Mis Defensores" },
  "nav.wellness":            { en: "Mental Health",          es: "Salud Mental" },
  "nav.answers":             { en: "Search Portal",          es: "Portal de Búsqueda" },
  "nav.rights":              { en: "Know Your Rights",       es: "Conoce Tus Derechos" },
  "nav.resources":           { en: "Resources",              es: "Recursos" },
  "nav.future":              { en: "My Future",              es: "Mi Futuro" },
  "shell.brand":             { en: "FosterHub",              es: "FosterHub" },
  "shell.brand_sub":         { en: "Arizona",                es: "Arizona" },
  "shell.command_center":    { en: "Command Center",         es: "Centro de Comando" },
  "shell.band_language.en":  { en: "Ages {band} · English",  es: "Edades {band} · Inglés" },
  "shell.band_language.es":  { en: "Ages {band} · Spanish",  es: "Edades {band} · Español" },
  "shell.start_over":        { en: "↩ Start over",           es: "↩ Empezar de nuevo" },
  "shell.start_over_confirm":{ en: "This clears your preferences. Continue?",
                               es: "Esto borra tus preferencias. ¿Continuar?" },
  "shell.start_over_yes":    { en: "Yes, start over",        es: "Sí, empezar de nuevo" },
  "shell.start_over_no":     { en: "Cancel",                 es: "Cancelar" },
  "shell.footer_tagline":    { en: "Arizona Youth Services", es: "Servicios para Jóvenes de Arizona" },

  "dashboard.greeting.morning":    { en: "Good morning.", es: "Buenos días." },
  "dashboard.greeting.subtitle":   {
    en: "Welcome to your secure command center. {date}.",
    es: "Bienvenido/a a tu centro de comando seguro. {date}.",
  },
  "dashboard.privacy.label":       { en: "Privacy First",              es: "Privacidad primero" },
  "dashboard.privacy.body":        { en: "No data is ever saved or tracked.",
                                     es: "Nunca se guardan ni se rastrean datos." },
  "dashboard.section.label":       { en: "Command Control",            es: "Control de Comando" },

  "dashboard.tile.team.title":     { en: "Your Advocates",             es: "Tus Defensores" },
  "dashboard.tile.team.desc":      { en: "Direct lines to your judge, lawyer, and caseworker.",
                                     es: "Líneas directas a tu juez, abogado/a y trabajador/a de casos." },
  "dashboard.tile.team.cta":       { en: "Open Portal",                es: "Abrir Portal" },

  "dashboard.tile.case.title":     { en: "Legal Roadmap",              es: "Hoja de Ruta Legal" },
  "dashboard.tile.case.desc":      { en: "Timeline of your hearings and next legal maneuvers.",
                                     es: "Cronograma de tus audiencias y próximas acciones legales." },
  "dashboard.tile.case.cta":       { en: "View Timeline",              es: "Ver Cronograma" },

  "dashboard.tile.wellness.title": { en: "Mindful Hub",                es: "Centro de Bienestar" },
  "dashboard.tile.wellness.desc":  { en: "Daily grounding tools and mental health resources.",
                                     es: "Herramientas diarias de equilibrio y recursos de salud mental." },
  "dashboard.tile.wellness.cta":   { en: "Start Session",              es: "Iniciar Sesión" },

  "dashboard.tile.answers.title":  { en: "Knowledge Hub",              es: "Centro de Conocimiento" },
  "dashboard.tile.answers.desc":   { en: "Searchable database for rights, laws, and next steps.",
                                     es: "Base de datos de búsqueda para derechos, leyes y próximos pasos." },
  "dashboard.tile.answers.cta":    { en: "Search Portal",              es: "Portal de Búsqueda" },

  "dashboard.tip.heading":         { en: "Strategic Tip",              es: "Consejo Estratégico" },
  "dashboard.tip.cta":             { en: "Learn your rights",          es: "Conoce tus derechos" },
  "dashboard.tip.1315": {
    en: "Bring written questions to every meeting with your lawyer. They work for you — your questions shape what they fight for.",
    es: "Trae preguntas escritas a cada reunión con tu abogado/a. Trabajan para ti — tus preguntas determinan por qué luchan.",
  },
  "dashboard.tip.1617": {
    en: "Did you know you can request a private meeting with your judge before your next hearing?",
    es: "¿Sabías que puedes pedir una reunión privada con tu juez antes de tu próxima audiencia?",
  },
  "dashboard.tip.1821": {
    en: "Ask your caseworker about extended foster care. It's voluntary, you can still use it, and it comes with housing support.",
    es: "Pregúntale a tu trabajador/a de casos sobre el cuidado extendido. Es voluntario, aún puedes usarlo, e incluye apoyo de vivienda.",
  },

  "dashboard.crisis.title":        { en: "Crisis Support",             es: "Apoyo en Crisis" },
  "dashboard.crisis.body":         { en: "If you're feeling overwhelmed or need immediate help, 988 is available 24/7.",
                                     es: "Si te sientes abrumado/a o necesitas ayuda inmediata, el 988 está disponible 24/7." },
  "dashboard.crisis.cta":          { en: "Call or Text 988",           es: "Llama o envía mensaje al 988" },

  // ── Team page ───────────────────────────────────────────────────────────
  "team.hero.tag":       { en: "Your Advocates",               es: "Tus Defensores" },
  "team.hero.title":     { en: "Meet your team.",              es: "Conoce a tu equipo." },
  "team.hero.subtitle":  { en: "Every person listed here has a defined role in your case. Knowing who does what makes it easier to get answers.",
                           es: "Cada persona aquí tiene un rol definido en tu caso. Saber quién hace qué hace que sea más fácil obtener respuestas." },
  "team.label.aka":      { en: "Also called",                  es: "También conocido/a como" },
  "team.label.role":     { en: "Their role",                   es: "Su rol" },
  "team.label.what":     { en: "What they do",                 es: "Qué hacen" },
  "team.label.tip":      { en: "Pro tip",                      es: "Consejo clave" },
  "team.expand":         { en: "Expand",                       es: "Expandir" },
  "team.collapse":       { en: "Collapse",                     es: "Colapsar" },

  // ── Case page ───────────────────────────────────────────────────────────
  "case.hero.tag":        { en: "Legal Roadmap",                 es: "Hoja de Ruta Legal" },
  "case.hero.title":      { en: "How your case moves.",          es: "Cómo avanza tu caso." },
  "case.hero.subtitle":   { en: "Four main hearings shape most dependency cases. Here's what each one is for, and how to walk in prepared.",
                            es: "Cuatro audiencias principales estructuran la mayoría de los casos de dependencia. Aquí está para qué sirve cada una, y cómo entrar preparado/a." },
  "case.label.what":      { en: "What happens",                  es: "Qué pasa" },
  "case.label.teen":      { en: "For you specifically",          es: "Para ti específicamente" },
  "case.label.insight":   { en: "Pro tip",                       es: "Consejo clave" },
  "case.label.next":      { en: "What happens next",             es: "Qué pasa después" },
  "case.faqs.heading":    { en: "Common Questions",              es: "Preguntas Frecuentes" },

  // ── Wellness page ───────────────────────────────────────────────────────
  "wellness.hero.tag":           { en: "Mindful Hub",                      es: "Centro de Bienestar" },
  "wellness.hero.title":         { en: "One moment at a time.",            es: "Un momento a la vez." },
  "wellness.hero.subtitle":      { en: "Tools that actually help when a day gets heavy. Try one. See what shifts.",
                                   es: "Herramientas que realmente ayudan cuando un día se pone pesado. Prueba una. Mira qué cambia." },
  "wellness.grounding.heading":  { en: "5-4-3-2-1 Grounding",              es: "Conexión 5-4-3-2-1" },
  "wellness.grounding.intro":    { en: "When your thoughts race: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
                                   es: "Cuando tus pensamientos corren: nombra 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles, 1 que saboreas." },
  "wellness.grounding.1.noun":   { en: "things you can see",               es: "cosas que puedes ver" },
  "wellness.grounding.2.noun":   { en: "things you can touch",             es: "cosas que puedes tocar" },
  "wellness.grounding.3.noun":   { en: "things you can hear",              es: "cosas que puedes escuchar" },
  "wellness.grounding.4.noun":   { en: "things you can smell",             es: "cosas que puedes oler" },
  "wellness.grounding.5.noun":   { en: "thing you can taste",              es: "cosa que puedes saborear" },
  "wellness.tools.heading":      { en: "Coping Tools",                     es: "Herramientas de Afrontamiento" },
  "wellness.tool.breathe.title": { en: "Box Breathing",                    es: "Respiración en Caja" },
  "wellness.tool.breathe.desc":  { en: "Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 3 times to signal to your nervous system that you are safe.",
                                   es: "Inhala durante 4 cuentas, retén 4, exhala 4, retén 4. Repite 3 veces para indicarle a tu sistema nervioso que estás a salvo." },
  "wellness.tool.journal.title": { en: "3-Line Journaling",                es: "Diario de 3 Líneas" },
  "wellness.tool.journal.desc":  { en: "Write 3 lines: what happened, how you felt, and one thing you're grateful for. This helps move thoughts from your head to the page.",
                                   es: "Escribe 3 líneas: qué pasó, cómo te sentiste, y una cosa por la que estás agradecido/a. Esto ayuda a mover pensamientos de tu cabeza a la página." },
  "wellness.tool.move.title":    { en: "Change Your Scenery",              es: "Cambia Tu Escenario" },
  "wellness.tool.move.desc":     { en: "Even 5 minutes of walking or listening to one specific song can physically shift your brain away from a loop of stress.",
                                   es: "Incluso 5 minutos caminando o escuchando una canción específica pueden cambiar físicamente tu cerebro fuera de un bucle de estrés." },
  "wellness.support.heading":    { en: "Support Network",                  es: "Red de Apoyo" },
  "wellness.support.988.name":   { en: "988 Suicide & Crisis Lifeline",    es: "Línea 988 de Crisis y Suicidio" },
  "wellness.support.988.desc":   { en: "Call or text 988 for 24/7 confidential support. You don't have to be in 'crisis' to reach out — you just need someone to talk to.",
                                   es: "Llama o envía mensaje al 988 para apoyo confidencial 24/7. No tienes que estar en 'crisis' para llamar — solo necesitas alguien con quien hablar." },
  "wellness.support.988.label":  { en: "Call 988",                         es: "Llama al 988" },
  "wellness.support.text.name":  { en: "Crisis Text Line",                 es: "Línea de Texto de Crisis" },
  "wellness.support.text.desc":  { en: "Text HOME to 741741. Best for when you need to talk but aren't in a place where you can speak out loud.",
                                   es: "Envía HOME al 741741. Mejor cuando necesitas hablar pero no estás en un lugar donde puedas hacerlo en voz alta." },
  "wellness.support.text.label": { en: "Text 741741",                      es: "Envía al 741741" },
  "wellness.support.dcs.name":   { en: "AZ DCS SOS-CHILD",                 es: "AZ DCS SOS-CHILD" },
  "wellness.support.dcs.desc":   { en: "1-888-767-2445. Use this if you are currently feeling unsafe or if there is an emergency in your placement.",
                                   es: "1-888-767-2445. Úsalo si te sientes inseguro/a en este momento o hay una emergencia en tu colocación." },
  "wellness.support.dcs.label":  { en: "Contact SOS",                      es: "Contactar SOS" },

  // ── Ask / Search Portal ─────────────────────────────────────────────────
  "ask.hero.tag":          { en: "Search Portal",                es: "Portal de Búsqueda" },
  "ask.hero.title":        { en: "Find what you need.",          es: "Encuentra lo que necesitas." },
  "ask.hero.subtitle":     { en: "Searchable answers about your rights, your case, and what comes next. Start typing or pick a category.",
                             es: "Respuestas que puedes buscar sobre tus derechos, tu caso, y lo que sigue. Empieza a escribir o elige una categoría." },
  "ask.search.placeholder":{ en: "Search answers…",              es: "Buscar respuestas…" },
  "ask.chip.all":          { en: "All",                          es: "Todos" },
  "ask.no_results":        { en: "No answers match your search. Try a different word, or pick a category above.",
                             es: "Ningún resultado coincide. Prueba otra palabra o elige una categoría." },

  // ── Rights page ─────────────────────────────────────────────────────────
  "rights.hero.tag":        { en: "Legal Protections",       es: "Protecciones Legales" },
  "rights.hero.title":      { en: "Your rights under AZ law.",
                              es: "Tus derechos bajo la ley de AZ." },
  "rights.hero.subtitle":   { en: "Arizona statute A.R.S. §8-529 guarantees these rights to every foster youth. They're not favors — they're yours.",
                              es: "El estatuto de Arizona A.R.S. §8-529 garantiza estos derechos a cada joven en cuidado adoptivo. No son favores — son tuyos." },
  "rights.citation":        { en: "A.R.S. §8-529",            es: "A.R.S. §8-529" },
  "rights.label.what":      { en: "What it means",            es: "Qué significa" },
  "rights.label.example":   { en: "For example",              es: "Por ejemplo" },
  "rights.label.how":       { en: "How to use it",            es: "Cómo usarlo" },
  "rights.label.ignored":   { en: "If it's ignored",          es: "Si lo ignoran" },
  "rights.escalation.heading": { en: "If a right is being ignored",
                                 es: "Si un derecho está siendo ignorado" },
  "rights.escalation.intro":   { en: "Start with your caseworker. If that doesn't work, go up the ladder — it exists for a reason.",
                                 es: "Empieza con tu trabajador/a de casos. Si eso no funciona, sube la escalera — existe por una razón." },
} as const;

export type TeenStringKey = keyof typeof TEEN_STRINGS;

export function tt(key: TeenStringKey, lang: Lang, vars?: Record<string, string>): string {
  const template = TEEN_STRINGS[key][lang];
  return vars ? template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "") : template;
}

export function ttBand(keyBase: string, band: AgeBandKey, lang: Lang): string {
  const suffix = band.replace("-", "");
  return tt(`${keyBase}.${suffix}` as TeenStringKey, lang);
}
