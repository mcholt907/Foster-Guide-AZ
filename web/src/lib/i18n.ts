export type Lang = "en" | "es";

export const UI_STRINGS = {
  // Onboarding
  onboarding_step_language:     { en: "What language do you prefer?",             es: "¿Qué idioma prefieres?" },
  onboarding_step_age:          { en: "How old are you?",                         es: "¿Cuántos años tienes?" },
  onboarding_step_county:       { en: "What county do you live in?",              es: "¿En qué condado vives?" },
  onboarding_step_tribal:       { en: "Are you part of a tribal nation?",         es: "¿Eres parte de una nación tribal?" },
  onboarding_btn_next:          { en: "Next",                                     es: "Siguiente" },
  onboarding_btn_start:         { en: "Let's go",                                 es: "Comenzar" },
  onboarding_btn_skip:          { en: "Skip",                                     es: "Omitir" },
  onboarding_btn_back:          { en: "Back",                                     es: "Atrás" },
  onboarding_tribal_yes:        { en: "Yes",                                      es: "Sí" },
  onboarding_tribal_no:         { en: "No",                                       es: "No" },
  onboarding_tribal_not_sure:   { en: "Not sure",                                 es: "No estoy seguro" },
  onboarding_county_hint:       { en: "This helps us show resources near you.",   es: "Esto nos ayuda a mostrarte recursos cerca de ti." },
  onboarding_county_unknown:    { en: "I don't know",                             es: "No sé" },
  onboarding_welcome_lead:      { en: "This place is for you.",                     es: "Este lugar es para ti." },
  onboarding_welcome_subtitle:  { en: "Foster care can be confusing and overwhelming. This is a calm, safe space to find real answers, learn your rights, and figure out your next steps.", es: "El cuidado adoptivo puede ser confuso y abrumador. Este es un espacio tranquilo y seguro para encontrar respuestas reales, conocer tus derechos y descubrir tus próximos pasos." },
  onboarding_welcome_privacy:   { en: "No sign-up · Nothing is saved",             es: "Sin registro · Nada se guarda" },
  onboarding_tribal_hint:       { en: "This helps us show you extra info that may apply. It stays on your device only — nothing is shared.", es: "Esto nos ayuda a mostrarte información extra que puede aplicar. Solo se guarda en tu dispositivo — no se comparte nada." },
  age_band_10_12_desc:          { en: "Learn the basics",                         es: "Aprende lo básico" },
  age_band_13_15_desc:          { en: "Your rights + court",                      es: "Tus derechos + tribunal" },
  age_band_16_17_desc:          { en: "Planning ahead",                           es: "Planifica el futuro" },
  age_band_18_21_desc:          { en: "Staying in care past 18 + what's next",    es: "Quedarte en el cuidado después de los 18" },
  // Nav
  nav_home:                     { en: "Home",                                     es: "Inicio" },
  nav_case:                     { en: "My Case",                                  es: "Mi Caso" },
  nav_ask:                      { en: "Ask",                                      es: "Preguntar" },
  nav_rights:                   { en: "My Rights",                                es: "Mis Derechos" },
  nav_future:                   { en: "My Future",                                es: "Mi Futuro" },
  nav_resources:                { en: "Resources",                                es: "Recursos" },
  nav_wellness:                 { en: "Wellness",                                 es: "Bienestar" },
  // Home
  home_crisis_title:            { en: "Crisis & Safety Lines",                    es: "Líneas de Crisis y Seguridad" },
  home_crisis_always_open:      { en: "Always open",                              es: "Siempre disponibles" },
  home_what_today:              { en: "What do you need today?",                  es: "¿Qué necesitas hoy?" },
  home_start_over:              { en: "Start over",                               es: "Empezar de nuevo" },
  home_ask_compass_btn:         { en: "Ask Compass",                              es: "Pregúntale a Compass" },
  // Feature card titles
  feature_case_title:           { en: "My case explained",                        es: "Mi caso explicado" },
  feature_rights_title:         { en: "Know your rights",                         es: "Conoce tus derechos" },
  feature_future_title:         { en: "My future plan",                           es: "Mi plan de futuro" },
  feature_resources_title:      { en: "Find resources",                           es: "Encuentra recursos" },
  feature_wellness_title:       { en: "Wellness check-in",                        es: "Chequeo de bienestar" },
  feature_case_badge:           { en: "Timeline + hearing prep",                  es: "Línea de tiempo + preparación" },
  // Rights
  rights_tab_what:              { en: "What it means",                            es: "Qué significa" },
  rights_tab_how:               { en: "How to ask for it",                        es: "Cómo pedirlo" },
  rights_tab_ignored:           { en: "If it's being ignored",                    es: "Si lo están ignorando" },
  rights_escalation_title:      { en: "If Your Rights Are Being Ignored",         es: "Si Están Ignorando Tus Derechos" },
  // Resources
  resources_search_placeholder: { en: "Search resources…",                        es: "Buscar recursos…" },
  resources_spanish_label:      { en: "Spanish-speaking staff",                   es: "Personal que habla español" },
  // Ask/Chat
  ask_title:                    { en: "Ask Compass",                              es: "Pregúntale a Compass" },
  ask_placeholder:              { en: "Type your question…",                      es: "Escribe tu pregunta…" },
  ask_send:                     { en: "Send",                                     es: "Enviar" },
  ask_thinking:                 { en: "Thinking…",                                es: "Pensando…" },
  ask_crisis_header:            { en: "Here are people who can help you right now:", es: "Aquí hay personas que pueden ayudarte ahora mismo:" },
  // Common
  common_call:                  { en: "Call",                                     es: "Llamar" },
  common_text_msg:              { en: "Text",                                     es: "Mensaje" },
  common_website:               { en: "Website",                                  es: "Sitio web" },
} as const;

export type StringKey = keyof typeof UI_STRINGS;

export function t(key: StringKey, lang: Lang | null | undefined): string {
  return UI_STRINGS[key][lang === "es" ? "es" : "en"];
}
