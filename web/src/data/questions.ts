import type { AgeBandKey } from "../lib/prefs";

export type QACategory =
  | "rights"
  | "case"
  | "court"
  | "safety"
  | "corner"
  | "documents"
  | "housing"
  | "turning18"
  | "benefits"
  | "school";

export interface QAEntry {
  id: string;
  question:    { en: string; es: string };
  answer:      { en: string; es: string };
  /** Simplified answer for 10-12 age band (plain language, ~4th grade reading level) */
  answer1012?: { en: string; es: string };
  category:    QACategory;
  ageBands:    AgeBandKey[];
  citations?:  string[];
  relatedIds?: string[];
  /** Extra search words: how kids really type it, synonyms, common misspellings. Never shown on screen. */
  keywords?:   { en: string[]; es: string[] };
}

export interface TopicConfig {
  category: QACategory;
  label:    { en: string; es: string };
  bands:    AgeBandKey[];
}

export const TOPIC_CONFIG: TopicConfig[] = [
  { category: "rights",    label: { en: "Your Rights",         es: "Tus Derechos"          }, bands: ["10-12","13-15","16-17","18-21"] },
  { category: "case",      label: { en: "Your Case",           es: "Tu Caso"               }, bands: ["10-12","13-15","16-17"] },
  { category: "court",     label: { en: "Court & Hearings",    es: "Tribunal"              }, bands: ["13-15","16-17","18-21"] },
  { category: "safety",    label: { en: "Staying Safe",        es: "Mantenerse Seguro/a"   }, bands: ["10-12","13-15","16-17","18-21"] },
  { category: "corner",    label: { en: "Who's in My Corner",  es: "¿Quién Me Apoya?"      }, bands: ["10-12","13-15"] },
  { category: "documents", label: { en: "Documents",           es: "Documentos"            }, bands: ["16-17","18-21"] },
  { category: "housing",   label: { en: "Housing",             es: "Vivienda"              }, bands: ["16-17","18-21"] },
  { category: "turning18", label: { en: "Turning 18",          es: "Cumplir 18"            }, bands: ["16-17","18-21"] },
  { category: "benefits",  label: { en: "Money & Benefits",    es: "Dinero y Beneficios"   }, bands: ["18-21"] },
  { category: "school",    label: { en: "School & Work",       es: "Escuela y Trabajo"     }, bands: ["18-21"] },
];

// Categories that link to the Resources page from the answer panel CTA
export const RESOURCE_LINK_CATEGORIES = new Set<QACategory>(["housing","benefits","documents","school"]);

export const QUESTIONS: QAEntry[] = [

  // ── RIGHTS ──────────────────────────────────────────────────────────────────

  {
    id: "q-what-are-my-rights",
    question: {
      en: "What rights do I have in foster care?",
      es: "¿Qué derechos tengo en el cuidado de crianza?",
    },
    answer: {
      en: "Arizona law (A.R.S. §8-529) gives you specific legal rights in foster care. These aren't just rules on paper — they're guarantees that belong to you. Some of the most important ones: you have the right to be treated with respect, to know what's in your case plan, to see your siblings (unless a judge says otherwise), and to keep your personal belongings. If you ever feel like one of your rights is being ignored, you don't have to stay quiet. You can tell your caseworker, then their supervisor, and then the DCS ombudsman if needed.",
      es: "La ley de Arizona (A.R.S. §8-529) te otorga derechos legales específicos en el cuidado de crianza. Estos no son solo reglas en papel — son garantías que te pertenecen. Algunos de los más importantes: tienes derecho a ser tratado/a con respeto, a saber qué hay en tu plan de caso, a ver a tus hermanos (a menos que un juez diga lo contrario) y a conservar tus pertenencias. Si sientes que alguno de tus derechos está siendo ignorado, no tienes que quedarte callado/a.",
    },
    answer1012: {
      en: "You have special rights that protect you while you're in foster care. The law says you should be treated nicely, you can see your brothers and sisters, you can keep your stuff, and you get to know what's happening with your case. If something doesn't feel right, you can tell a grown-up you trust — like your caseworker, a teacher, or your lawyer.",
      es: "Tienes derechos especiales que te protegen mientras estás en cuidado de crianza. La ley dice que deben tratarte bien, puedes ver a tus hermanos y hermanas, puedes quedarte con tus cosas y puedes saber lo que está pasando con tu caso. Si algo no se siente bien, puedes decirle a un adulto de confianza — como tu trabajador/a de casos, un maestro/a o tu abogado/a.",
    },
    keywords: {
      en: ["my rights", "rights", "rules", "what am i allowed", "bill of rights", "is that allowed", "unfair", "fair", "rites", "rihgts"],
      es: ["mis derechos", "derechos", "reglas", "que me permiten", "es justo", "injusto", "derecos"],
    },
    category: "rights",
    ageBands: ["10-12","13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-rights-ignored","q-read-case-file"],
  },

  {
    id: "q-see-siblings",
    question: {
      en: "Can I see my brothers and sisters?",
      es: "¿Puedo ver a mis hermanos y hermanas?",
    },
    answer: {
      en: "Yes — you have the right to stay in contact with your siblings. DCS is supposed to place you with your brothers and sisters when possible, or make sure you can visit if you're in different homes. If you're not getting visits with your siblings, tell your caseworker or your attorney. A judge can also order sibling visits.",
      es: "Sí — tienes derecho a mantenerte en contacto con tus hermanos. DCS debe colocarte con tus hermanos cuando sea posible, o asegurarse de que puedas visitarlos si están en hogares diferentes. Si no estás teniendo visitas con tus hermanos, habla con tu trabajador/a de casos o tu abogado/a.",
    },
    answer1012: {
      en: "Yes! You have the right to see your brothers and sisters. The people in charge of your case are supposed to try to keep you together. If you live in different homes, they should help you visit each other. If you're not getting to see them, tell your caseworker or your lawyer.",
      es: "¡Sí! Tienes derecho a ver a tus hermanos y hermanas. Las personas a cargo de tu caso deben intentar mantenerlos juntos. Si viven en casas diferentes, deben ayudarlos a visitarse. Si no puedes verlos, dile a tu trabajador/a de casos o a tu abogado/a.",
    },
    keywords: {
      en: ["siblings", "sibling", "brother", "sister", "will i see my siblings", "see my brother", "see my sister", "miss my brother", "miss my sister", "split up", "separated", "sibling visits", "sibings", "siblngs", "sibblings", "bro", "sis"],
      es: ["hermanos", "hermanas", "hermano", "hermana", "ver a mis hermanos", "extraño a mi hermano", "extraño a mi hermana", "separados", "visitas con hermanos", "ermanos"],
    },
    category: "rights",
    ageBands: ["10-12","13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-are-my-rights","q-rights-ignored"],
  },

  {
    id: "q-contact-parents",
    question: {
      en: "Can I call or visit my parents?",
      es: "¿Puedo llamar o visitar a mis padres?",
    },
    answer: {
      en: "Usually, yes. Most kids in foster care get visits or calls with their parents. The judge and your case plan decide how often, where, and whether another adult needs to be there. Sometimes contact is limited for a while to keep you safe. If you want more time with your parents — or less — tell your caseworker and your lawyer. What you want matters, and they can ask the judge. If you don't know your visit plan, ask your caseworker to explain it.",
      es: "Por lo general, sí. La mayoría de los jóvenes en cuidado de crianza tienen visitas o llamadas con sus padres. El juez y tu plan de caso deciden qué tan seguido, dónde, y si otro adulto tiene que estar presente. A veces el contacto se limita por un tiempo para mantenerte seguro/a. Si quieres más tiempo con tus padres — o menos — dile a tu trabajador/a de casos y a tu abogado/a. Lo que tú quieres importa, y ellos pueden pedírselo al juez. Si no conoces tu plan de visitas, pídele a tu trabajador/a de casos que te lo explique.",
    },
    answer1012: {
      en: "Most of the time, yes. Most kids in foster care get to see or call their mom or dad. A judge and your caseworker make the plan for when and where. Sometimes another grown-up has to be there too. Sometimes visits have to wait for a while to keep you safe. If you miss your mom or dad, or if you don't want a visit, tell your caseworker or your lawyer. What you want matters.",
      es: "Casi siempre, sí. La mayoría de los niños en cuidado de crianza pueden ver o llamar a su mamá o a su papá. Un juez y tu trabajador/a de casos hacen el plan de cuándo y dónde. A veces otro adulto también tiene que estar ahí. A veces las visitas tienen que esperar un tiempo para mantenerte seguro/a. Si extrañas a tu mamá o a tu papá, o si no quieres una visita, dile a tu trabajador/a de casos o a tu abogado/a. Lo que tú quieres importa.",
    },
    keywords: {
      en: ["call my mom", "call my dad", "see my mom", "see my dad", "mom", "dad", "mommy", "daddy", "mother", "father", "parents", "family", "visit", "visits", "visitation", "phone call", "talk to my mom", "miss my mom", "miss my dad", "miss my family", "when can i see my mom", "go see my parents", "grandma", "grandpa", "parnets"],
      es: ["llamar a mi mama", "llamar a mi papa", "ver a mi mama", "ver a mi papa", "mama", "papa", "mami", "papi", "madre", "padre", "padres", "familia", "visita", "visitas", "llamada", "hablar con mi mama", "extraño a mi mama", "extraño a mi papa", "extraño a mi familia", "abuela", "abuelo"],
    },
    category: "rights",
    ageBands: ["10-12","13-15","16-17"],
    relatedIds: ["q-see-siblings","q-what-is-reunification","q-what-does-attorney-do"],
  },

  {
    id: "q-stay-at-my-school",
    question: {
      en: "Can I stay at my school?",
      es: "¿Puedo quedarme en mi escuela?",
    },
    answer: {
      en: "Usually, yes. When you move to a new home, the adults on your case are supposed to try to keep you at the same school, if that is what's best for you. They should also help you get a ride there. Sometimes a school change can't be avoided — for example, if your new home is very far away. If you want to stay at your school, tell your caseworker and your lawyer right away. If you do have to change schools, the new school should let you start quickly.",
      es: "Por lo general, sí. Cuando te mudas a un nuevo hogar, los adultos de tu caso deben tratar de que sigas en la misma escuela, si eso es lo mejor para ti. También deben ayudarte con el transporte para llegar. A veces no se puede evitar un cambio de escuela — por ejemplo, si tu nuevo hogar queda muy lejos. Si quieres quedarte en tu escuela, díselo a tu trabajador/a de casos y a tu abogado/a de inmediato. Si tienes que cambiar de escuela, la nueva escuela debe dejarte empezar pronto.",
    },
    answer1012: {
      en: "Most of the time, yes. When you move to a new home, the grown-ups on your case should try to keep you at the same school. They should help you get a ride there too. Sometimes you have to change schools, like when your new home is very far away. If you want to stay at your school, tell your caseworker or your lawyer. It's okay to say what you want.",
      es: "Casi siempre, sí. Cuando te mudas a una nueva casa, los adultos de tu caso deben tratar de que sigas en la misma escuela. También deben ayudarte a llegar. A veces tienes que cambiar de escuela, como cuando tu nueva casa queda muy lejos. Si quieres quedarte en tu escuela, dile a tu trabajador/a de casos o a tu abogado/a. Está bien decir lo que quieres.",
    },
    keywords: {
      en: ["school", "schools", "change schools", "switch schools", "new school", "same school", "stay at my school", "keep my school", "my friends", "my teacher", "bus", "ride to school", "transfer", "scool", "shcool"],
      es: ["escuela", "escuelas", "cambiar de escuela", "nueva escuela", "misma escuela", "quedarme en mi escuela", "mis amigos", "mi maestra", "mi maestro", "autobus", "transporte", "colegio", "escula"],
    },
    category: "rights",
    ageBands: ["10-12","13-15","16-17"],
    relatedIds: ["q-can-i-be-moved","q-what-are-my-rights"],
  },

  {
    id: "q-phone-taken-away",
    question: {
      en: "Can my phone or other stuff be taken away?",
      es: "¿Me pueden quitar el teléfono u otras cosas?",
    },
    answer: {
      en: "Your personal belongings are yours. In most cases, your phone and other things shouldn't be taken away from you as punishment. Your caregivers can set reasonable house rules about when or where you use your phone, but taking it away permanently isn't okay. If you feel like your things are being taken unfairly, you can talk to your caseworker or call the DCS ombudsman at 1-877-527-0765.",
      es: "Tus pertenencias personales son tuyas. En la mayoría de los casos, no deberían quitarte el teléfono u otras cosas como castigo. Tus cuidadores pueden establecer reglas razonables sobre cuándo usas tu teléfono, pero quitártelo permanentemente no está bien. Si sientes que te están quitando cosas injustamente, habla con tu trabajador/a de casos.",
    },
    keywords: {
      en: ["phone", "cell phone", "my stuff", "my things", "belongings", "took my phone", "take my stuff", "clothes", "toys", "tablet", "punishment", "grounded", "confiscate"],
      es: ["telefono", "celular", "mis cosas", "pertenencias", "me quitaron el telefono", "quitar mis cosas", "ropa", "juguetes", "castigo", "castigado"],
    },
    category: "rights",
    ageBands: ["13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-are-my-rights","q-rights-ignored"],
  },

  {
    id: "q-read-case-file",
    question: {
      en: "Can I read my own case file?",
      es: "¿Puedo leer mi propio expediente de caso?",
    },
    answer: {
      en: "Yes. You have the right to know what's in your case file. You can ask your caseworker to review your records. If you're 18 or older, you can request your records directly from DCS. Your attorney can also help you access your file — that's part of what they're there for.",
      es: "Sí. Tienes derecho a saber qué hay en tu expediente de caso. Puedes pedirle a tu trabajador/a de casos que te deje revisar tus registros. Si tienes 18 años o más, puedes solicitar tus registros directamente a DCS. Tu abogado/a también puede ayudarte a acceder a tu expediente.",
    },
    keywords: {
      en: ["case file", "my file", "records", "my records", "paperwork", "see my file", "what does my file say", "report", "documents about me"],
      es: ["expediente", "mi expediente", "registros", "papeles", "ver mi expediente", "que dice mi expediente", "informe"],
    },
    category: "rights",
    ageBands: ["13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-are-my-rights","q-rights-ignored"],
  },

  {
    id: "q-rights-ignored",
    question: {
      en: "What if my rights are being ignored?",
      es: "¿Qué hago si están ignorando mis derechos?",
    },
    answer: {
      en: "You have options — and you don't have to just accept it. Start by telling your caseworker directly. If that doesn't help, ask to speak to their supervisor. Still nothing? You can contact the DCS ombudsman at 1-877-527-0765 — their job is to help when DCS isn't doing right by you. You can also tell your attorney or your CASA volunteer. None of these people will get you in trouble for speaking up.",
      es: "Tienes opciones — y no tienes que aceptarlo. Empieza diciéndole a tu trabajador/a de casos directamente. Si eso no ayuda, pide hablar con su supervisor/a. ¿Sigue sin haber cambios? Puedes contactar al defensor del pueblo de DCS al 1-877-527-0765 — su trabajo es ayudar cuando DCS no está haciendo lo correcto por ti.",
    },
    keywords: {
      en: ["ignored", "nobody listens", "no one listens", "not listening", "complain", "complaint", "report a problem", "unfair", "treated badly", "not fair", "who do i tell", "file a complaint", "grievance"],
      es: ["ignorados", "nadie me escucha", "no me escuchan", "queja", "quejarme", "reportar un problema", "injusto", "me tratan mal", "no es justo", "a quien le digo"],
    },
    category: "rights",
    ageBands: ["13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-are-my-rights","q-what-is-ombudsman"],
  },

  {
    id: "q-right-to-lawyer",
    question: {
      en: "Do I get a lawyer?",
      es: "¿Tengo derecho a un abogado?",
    },
    answer: {
      en: "Yes — you have the right to an attorney in your dependency case. If you don't know who your attorney is, ask your caseworker. Your lawyer is there to represent what you want, not just what adults think is best for you. They can speak for you in court and help you understand what's happening.",
      es: "Sí — tienes derecho a un abogado/a en tu caso de dependencia. Si no sabes quién es tu abogado/a, pregúntale a tu trabajador/a de casos. Tu abogado/a está ahí para representar lo que tú quieres, no solo lo que los adultos creen que es mejor para ti.",
    },
    keywords: {
      en: ["lawyer", "attorney", "do i get a lawyer", "free lawyer", "who is my lawyer", "legal help", "laywer", "lawer", "atorney"],
      es: ["abogado", "abogada", "tengo abogado", "abogado gratis", "quien es mi abogado", "ayuda legal", "avogado"],
    },
    category: "rights",
    ageBands: ["13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-does-attorney-do","q-speak-at-hearing"],
  },

  {
    id: "q-mail-privacy",
    question: {
      en: "Can adults read my mail or messages?",
      es: "¿Pueden los adultos leer mi correo o mensajes?",
    },
    answer: {
      en: "You have a right to privacy in your personal communications. Your caregivers generally shouldn't be reading your private messages or mail. There may be exceptions in specific placements with court-ordered restrictions, but those should be explained to you. If you feel like your privacy is being violated, you can bring it up with your caseworker or attorney.",
      es: "Tienes derecho a la privacidad en tus comunicaciones personales. Tus cuidadores generalmente no deberían estar leyendo tus mensajes privados o correo. Si sientes que tu privacidad está siendo violada, puedes mencionárselo a tu trabajador/a de casos o abogado/a.",
    },
    keywords: {
      en: ["mail", "letters", "messages", "texts", "privacy", "private", "read my texts", "read my messages", "spy", "snoop", "diary", "journal", "social media"],
      es: ["correo", "cartas", "mensajes", "textos", "privacidad", "privado", "leer mis mensajes", "espiar", "diario", "redes sociales"],
    },
    category: "rights",
    ageBands: ["13-15","16-17"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-are-my-rights","q-phone-taken-away"],
  },

  // ── CASE ────────────────────────────────────────────────────────────────────

  {
    id: "q-why-was-i-taken",
    question: {
      en: "Why was I taken from my home? Is it my fault?",
      es: "¿Por qué me sacaron de mi casa? ¿Es mi culpa?",
    },
    answer: {
      en: "It is not your fault, and you are not in trouble. Kids come into foster care because the adults who were caring for them could not keep them safe or meet their needs right now. That is a grown-up problem. Nothing you said or did caused it. A judge decides what happens next, and many families work on a plan so kids can go home safely. It's okay to feel sad, mad, or confused. If you want to know more about why you are in care, ask your caseworker or your lawyer. You have a right to understand what is happening.",
      es: "No es tu culpa, y no estás en problemas. Los jóvenes llegan al cuidado de crianza porque los adultos que los cuidaban no podían mantenerlos seguros o darles lo que necesitaban en este momento. Ese es un problema de adultos. Nada de lo que dijiste o hiciste lo causó. Un juez decide lo que pasa después, y muchas familias trabajan en un plan para que los hijos puedan volver a casa de forma segura. Está bien sentirte triste, enojado/a o confundido/a. Si quieres saber más sobre por qué estás en cuidado de crianza, pregúntale a tu trabajador/a de casos o a tu abogado/a. Tienes derecho a entender lo que está pasando.",
    },
    answer1012: {
      en: "It is NOT your fault. You are NOT in trouble. You did not do anything wrong. Kids come into foster care when the grown-ups at home can't keep them safe right now. That is a grown-up problem, not a kid problem. Lots of people are working to help you and your family. It's okay to feel sad, mad, or mixed up. If you want to know more, ask your caseworker or your lawyer. You can ask as many times as you need.",
      es: "NO es tu culpa. NO estás en problemas. No hiciste nada malo. Los niños llegan al cuidado de crianza cuando los adultos de su casa no pueden mantenerlos seguros en este momento. Ese es un problema de adultos, no de niños. Muchas personas están trabajando para ayudarte a ti y a tu familia. Está bien sentirte triste, enojado/a o confundido/a. Si quieres saber más, pregúntale a tu trabajador/a de casos o a tu abogado/a. Puedes preguntar todas las veces que necesites.",
    },
    keywords: {
      en: ["why was i taken", "taken away", "taken from my home", "removed", "why am i here", "why am i in foster care", "why cant i go home", "my fault", "is it my fault", "did i do something wrong", "am i in trouble", "in trouble", "trouble", "am i bad", "punished", "blame", "why did they take me", "when can i go home", "go home", "taked", "falt"],
      es: ["por que me sacaron", "me sacaron de mi casa", "me quitaron", "me llevaron", "por que estoy aqui", "por que estoy en cuidado de crianza", "por que no puedo ir a casa", "mi culpa", "es mi culpa", "hice algo malo", "estoy en problemas", "problemas", "soy malo", "castigo", "cuando puedo ir a casa", "volver a casa", "regresar a casa"],
    },
    category: "case",
    ageBands: ["10-12","13-15","16-17"],
    relatedIds: ["q-what-is-dcs","q-contact-parents","q-what-is-reunification"],
  },

  {
    id: "q-what-is-dcs",
    question: {
      en: "What is DCS?",
      es: "¿Qué es DCS?",
    },
    answer: {
      en: "DCS stands for the Department of Child Safety. It's the Arizona government agency in charge of your foster care case. DCS workers — called caseworkers or case managers — are the people responsible for making sure you're safe and that your needs are being met. They're the ones who create your case plan and work with the court.",
      es: "DCS son las siglas del Departamento de Seguridad Infantil. Es la agencia del gobierno de Arizona a cargo de tu caso de cuidado de crianza. Los trabajadores de DCS — llamados trabajadores de casos — son las personas responsables de asegurarse de que estés seguro/a y que tus necesidades se estén cumpliendo.",
    },
    answer1012: {
      en: "DCS stands for the Department of Child Safety. They're a group of people in Arizona whose job is to make sure kids are safe. Your caseworker works for DCS. They check on you, make sure you have what you need, and help figure out what happens next.",
      es: "DCS significa el Departamento de Seguridad Infantil. Son un grupo de personas en Arizona cuyo trabajo es asegurarse de que los niños estén seguros. Tu trabajador/a de casos trabaja para DCS. Te visitan, se aseguran de que tengas lo que necesitas y ayudan a decidir qué pasa después.",
    },
    keywords: {
      en: ["dcs", "cps", "department of child safety", "child protective services", "social services", "who are these people", "the state", "dsc"],
      es: ["dcs", "cps", "departamento de seguridad infantil", "servicios sociales", "proteccion infantil", "quienes son", "el estado"],
    },
    category: "case",
    ageBands: ["10-12","13-15"],
    relatedIds: ["q-caseworker-role","q-what-is-case-plan"],
  },

  {
    id: "q-caseworker-role",
    question: {
      en: "What does my caseworker do?",
      es: "¿Qué hace mi trabajador/a de casos?",
    },
    answer: {
      en: "Your caseworker is the DCS employee assigned to your case. They're responsible for making sure you're safe, that your basic needs are met, and that your case plan is being followed. They should visit you regularly — at least once a month. You can bring your worries, questions, and requests to them. If you feel like they're not listening, you can ask to speak to their supervisor.",
      es: "Tu trabajador/a de casos es el empleado/a de DCS asignado a tu caso. Son responsables de asegurarse de que estés seguro/a, que tus necesidades básicas se cubran y que se siga tu plan de caso. Deben visitarte regularmente — al menos una vez al mes. Puedes llevarles tus preocupaciones, preguntas y solicitudes.",
    },
    answer1012: {
      en: "Your caseworker is the person from DCS who is in charge of helping you. They check on you, make sure you have what you need, and talk to the judge about your case. They should come see you at least once a month. If you have questions or something is bothering you, your caseworker is someone you can talk to.",
      es: "Tu trabajador/a de casos es la persona de DCS que está a cargo de ayudarte. Te visitan, se aseguran de que tengas lo que necesitas y hablan con el juez sobre tu caso. Deben venir a verte al menos una vez al mes. Si tienes preguntas o algo te molesta, puedes hablar con tu trabajador/a de casos.",
    },
    keywords: {
      en: ["caseworker", "case worker", "case manager", "social worker", "my worker", "dcs worker", "what does my worker do", "casworker"],
      es: ["trabajador de casos", "trabajadora de casos", "trabajador social", "trabajadora social", "mi trabajador", "que hace mi trabajador", "administrador de casos"],
    },
    category: "case",
    ageBands: ["10-12","13-15","16-17"],
    relatedIds: ["q-caseworker-visits","q-what-is-case-plan"],
  },

  {
    id: "q-what-is-case-plan",
    question: {
      en: "What is a case plan?",
      es: "¿Qué es un plan de caso?",
    },
    answer: {
      en: "A case plan is a written document that explains what the goal is for your situation — like returning home, staying with a relative, or being adopted — and what steps need to happen to get there. It also lists services and support you should be getting. You have the right to know what's in your case plan and to share your own thoughts about what you want.",
      es: "Un plan de caso es un documento escrito que explica cuál es el objetivo para tu situación — como regresar a casa, quedarte con un familiar o ser adoptado/a — y qué pasos deben ocurrir para llegar ahí. También incluye los servicios y apoyos que deberías estar recibiendo. Tienes derecho a saber qué hay en tu plan de caso.",
    },
    answer1012: {
      en: "A case plan is like a written plan for what's going to happen next. It talks about the goal — like going back home or living with a family member — and what needs to happen to get there. You can ask to hear about it, and you can share what YOU want. Your feelings matter.",
      es: "Un plan de caso es como un plan escrito de lo que va a pasar después. Habla sobre el objetivo — como regresar a casa o vivir con un familiar — y lo que tiene que pasar para lograrlo. Puedes pedir que te lo expliquen y puedes decir lo que TÚ quieres. Tus sentimientos importan.",
    },
    keywords: {
      en: ["case plan", "my plan", "plan", "goals", "what happens next", "whats going to happen to me", "what will happen"],
      es: ["plan de caso", "mi plan", "plan", "metas", "que pasa despues", "que va a pasar conmigo", "que pasara"],
    },
    category: "case",
    ageBands: ["10-12","13-15","16-17"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-case-plan-input","q-caseworker-role"],
  },

  {
    id: "q-caseworker-visits",
    question: {
      en: "How often should my caseworker visit me?",
      es: "¿Con qué frecuencia debe visitarme mi trabajador/a de casos?",
    },
    answer: {
      en: "Your caseworker is supposed to visit you in person at least once a month. Those visits should be private — meaning you can talk to them without your foster parent or caregiver listening in. If your caseworker isn't visiting regularly or you can't talk privately, that's worth bringing up with their supervisor or your attorney.",
      es: "Tu trabajador/a de casos debe visitarte en persona al menos una vez al mes. Esas visitas deben ser privadas — lo que significa que puedes hablar con ellos sin que tu familia de acogida o cuidador esté escuchando. Si tu trabajador/a no visita regularmente, vale la pena mencionárselo a su supervisor/a o a tu abogado/a.",
    },
    keywords: {
      en: ["visit", "how often", "never see my caseworker", "caseworker never comes", "wont call me back", "doesnt answer", "contact my caseworker", "monthly visit"],
      es: ["visita", "que tan seguido", "nunca veo a mi trabajador", "mi trabajador no viene", "no me contesta", "no me llama", "visita mensual"],
    },
    category: "case",
    ageBands: ["13-15","16-17"],
    relatedIds: ["q-caseworker-role","q-rights-ignored"],
  },

  {
    id: "q-dont-like-foster-home",
    question: {
      en: "What if I don't like my foster home?",
      es: "¿Qué pasa si no me gusta mi hogar de crianza?",
    },
    answer: {
      en: "It's okay to feel that way, and it's okay to say it. Start by telling your caseworker what isn't working — the rules, how you're treated, or just not feeling like you fit. You can ask to talk to them alone. Sometimes a talk or some extra support can fix things. If it still isn't working, tell your lawyer or your CASA, and ask if a different home is possible. It isn't always quick, but your voice counts. If you feel unsafe or someone is hurting you, that is different. Tell someone right away or call 1-888-767-2445. In an emergency, call 911.",
      es: "Está bien sentirte así, y está bien decirlo. Empieza por decirle a tu trabajador/a de casos qué no está funcionando — las reglas, cómo te tratan, o simplemente que no te sientes parte del hogar. Puedes pedir hablar a solas. A veces una conversación o un poco de apoyo extra puede arreglar las cosas. Si sigue sin funcionar, dile a tu abogado/a o a tu CASA, y pregunta si es posible otro hogar. No siempre es rápido, pero tu voz cuenta. Si no te sientes seguro/a o alguien te está lastimando, eso es diferente. Dile a alguien de inmediato o llama al 1-888-767-2445. En una emergencia, llama al 911.",
    },
    answer1012: {
      en: "It's okay to feel that way. You are allowed to say it. Tell your caseworker what is hard about your foster home. You can ask to talk to them alone. Sometimes talking about it helps fix things. If it still feels bad, tell your lawyer too. They can ask if another home is possible. If you don't feel safe, or someone is hurting you, tell a grown-up you trust right away or call 1-888-767-2445. If you're in danger right now, call 911.",
      es: "Está bien sentirte así. Puedes decirlo. Dile a tu trabajador/a de casos qué es difícil en tu hogar de crianza. Puedes pedir hablar a solas. A veces hablar ayuda a arreglar las cosas. Si todavía te sientes mal, dile también a tu abogado/a. Pueden preguntar si es posible otra casa. Si no te sientes seguro/a, o alguien te está lastimando, dile a un adulto de confianza de inmediato o llama al 1-888-767-2445. Si estás en peligro ahora mismo, llama al 911.",
    },
    keywords: {
      en: ["dont like my foster home", "dont like", "hate my foster home", "hate it here", "hate", "foster home", "foster parents", "foster mom", "foster dad", "group home", "placement", "mean", "unfair rules", "not happy", "unhappy", "want to leave", "want to move", "new home", "different home", "run away", "runaway", "dont fit in", "lonely", "they are mean to me"],
      es: ["no me gusta mi hogar", "no me gusta mi casa", "no me gusta", "odio mi hogar", "odio estar aqui", "odio", "hogar de crianza", "casa de crianza", "padres de crianza", "hogar grupal", "colocacion", "malos", "reglas injustas", "no estoy feliz", "quiero irme", "quiero mudarme", "otra casa", "otro hogar", "escaparme", "huir", "me siento solo", "me siento sola", "me tratan mal"],
    },
    category: "case",
    ageBands: ["10-12","13-15","16-17"],
    relatedIds: ["q-can-i-be-moved","q-feel-unsafe-placement","q-caseworker-role"],
  },

  {
    id: "q-can-i-be-moved",
    question: {
      en: "Can I be moved to a different home without warning?",
      es: "¿Me pueden mover a otro hogar sin aviso?",
    },
    answer: {
      en: "Placement changes are supposed to be planned when possible, and you should be told what's happening and why. Emergency moves can happen if there's an immediate safety concern. You have the right to know about placement changes that affect you, and your preferences should be considered. If you're being moved and no one is explaining why, ask your caseworker or attorney directly.",
      es: "Los cambios de colocación deben planificarse cuando sea posible, y se te debe informar qué está pasando y por qué. Pueden ocurrir mudanzas de emergencia si hay una preocupación de seguridad inmediata. Tienes derecho a saber sobre los cambios de colocación que te afectan.",
    },
    answer1012: {
      en: "Usually, someone should tell you before you move to a new home and explain why. Sometimes moves happen quickly if there's a safety problem, but you should still be told what's going on. If nobody is telling you why, ask your caseworker or your lawyer.",
      es: "Normalmente, alguien debe decirte antes de que te mudes a una nueva casa y explicarte por qué. A veces las mudanzas pasan rápido si hay un problema de seguridad, pero igual deben decirte lo que está pasando. Si nadie te dice por qué, pregúntale a tu trabajador/a de casos o a tu abogado/a.",
    },
    keywords: {
      en: ["move", "moved", "moving", "move me", "move me without telling me", "without telling me", "without warning", "new home", "new placement", "change homes", "switch homes", "do i have to move", "why am i moving", "pack my stuff", "moveing"],
      es: ["mudar", "mudarme", "mudanza", "moverme", "me pueden mudar", "sin avisarme", "sin decirme", "sin aviso", "nueva casa", "nuevo hogar", "cambiar de casa", "tengo que mudarme", "por que me mudan", "empacar"],
    },
    category: "case",
    ageBands: ["10-12","13-15","16-17"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-caseworker-role","q-rights-ignored"],
  },

  {
    id: "q-case-plan-input",
    question: {
      en: "Can I say what I want in my case plan?",
      es: "¿Puedo decir lo que quiero en mi plan de caso?",
    },
    answer: {
      en: "Yes — your voice matters in your case plan. You have the right to participate in case planning meetings and to share what you want. If you're 14 or older, DCS is required to involve you in creating your case plan. Don't be afraid to say what your goals are, what you're worried about, or what you need — that's exactly what these meetings are for.",
      es: "Sí — tu voz importa en tu plan de caso. Tienes derecho a participar en las reuniones de planificación de casos y a compartir lo que quieres. Si tienes 14 años o más, DCS está obligado a involucrarte en la creación de tu plan de caso.",
    },
    keywords: {
      en: ["my opinion", "have a say", "say what i want", "my choice", "do i get to decide", "nobody asks me", "what i want", "my voice"],
      es: ["mi opinion", "puedo opinar", "decir lo que quiero", "mi decision", "puedo decidir", "nadie me pregunta", "lo que quiero", "mi voz"],
    },
    category: "case",
    ageBands: ["13-15","16-17"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-is-case-plan","q-speak-at-hearing"],
  },

  // ── COURT ───────────────────────────────────────────────────────────────────

  {
    id: "q-what-is-dependency-hearing",
    question: {
      en: "What is a dependency hearing?",
      es: "¿Qué es una audiencia de dependencia?",
    },
    answer: {
      en: "A dependency hearing is a court meeting where a judge decides whether you need to be in foster care. It usually happens early in your case. The judge will hear from DCS and your family to figure out what's safest for you. You can attend, and your attorney will speak on your behalf. It can feel scary, but it's okay to ask your attorney to explain what's happening before you go.",
      es: "Una audiencia de dependencia es una reunión en el tribunal donde un juez decide si necesitas estar en el sistema de cuidado de crianza. Generalmente ocurre al principio de tu caso. El juez escuchará a DCS y a tu familia para determinar qué es más seguro para ti.",
    },
    keywords: {
      en: ["dependency", "hearing", "court", "judge", "court date", "what is court", "go to court", "dependancy"],
      es: ["dependencia", "audiencia", "tribunal", "corte", "juez", "fecha de corte", "que es la corte", "ir a la corte"],
    },
    category: "court",
    ageBands: ["13-15","16-17","18-21"],
    relatedIds: ["q-speak-at-hearing","q-what-does-attorney-do"],
  },

  {
    id: "q-what-is-permanency-hearing",
    question: {
      en: "What is a permanency hearing?",
      es: "¿Qué es una audiencia de permanencia?",
    },
    answer: {
      en: "A permanency hearing — sometimes called a permanency planning hearing — is a court meeting where the judge decides on the long-term plan for where you'll live and who will care for you. The options are usually reunification (going back home), adoption, legal guardianship, or long-term foster care. If you're 12 or older, the judge is supposed to ask what you want. You should absolutely speak up about your wishes.",
      es: "Una audiencia de permanencia es una reunión en el tribunal donde el juez decide el plan a largo plazo para dónde vivirás y quién te cuidará. Las opciones suelen ser reunificación (regresar a casa), adopción, tutela legal o cuidado de crianza a largo plazo. Si tienes 12 años o más, el juez debe preguntarte qué quieres.",
    },
    keywords: {
      en: ["permanency", "permanent", "hearing", "adoption", "adopted", "guardianship", "where will i live forever", "long term", "permanancy"],
      es: ["permanencia", "permanente", "audiencia", "adopcion", "adoptado", "tutela", "donde voy a vivir", "largo plazo"],
    },
    category: "court",
    ageBands: ["13-15","16-17","18-21"],
    relatedIds: ["q-speak-at-hearing","q-what-is-dependency-hearing"],
  },

  {
    id: "q-speak-at-hearing",
    question: {
      en: "Can I speak at my court hearing?",
      es: "¿Puedo hablar en mi audiencia?",
    },
    answer: {
      en: "Yes. You have the right to be heard at your court hearings. You can speak directly to the judge, or your attorney can speak on your behalf — or both. If you're nervous, it helps to write down what you want to say ahead of time and practice it with your attorney. Judges want to know what you think, especially about where you want to live and who you want to be with.",
      es: "Sí. Tienes derecho a ser escuchado/a en tus audiencias. Puedes hablarle directamente al juez, o tu abogado/a puede hablar en tu nombre — o ambos. Si estás nervioso/a, ayuda escribir lo que quieres decir con anticipación y practicarlo con tu abogado/a.",
    },
    keywords: {
      en: ["talk to the judge", "speak in court", "tell the judge", "go to court", "do i have to go to court", "scared of court", "testify", "letter to the judge"],
      es: ["hablar con el juez", "hablar en la corte", "decirle al juez", "ir a la corte", "tengo que ir a la corte", "miedo de la corte", "testificar", "carta al juez"],
    },
    category: "court",
    ageBands: ["13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-is-permanency-hearing","q-right-to-lawyer"],
  },

  {
    id: "q-what-is-reunification",
    question: {
      en: "What does reunification mean?",
      es: "¿Qué significa reunificación?",
    },
    answer: {
      en: "Reunification means going back to live with your parent or guardian. It's the goal DCS works toward when it's safe to do so. For reunification to happen, the court needs to see that the problems that led to you being placed in foster care have been addressed. Your caseworker and judge will talk about this at your hearings. You can share your feelings about it — your voice is part of this decision.",
      es: "La reunificación significa regresar a vivir con tu padre, madre o tutor/a. Es el objetivo hacia el que trabaja DCS cuando es seguro hacerlo. Para que ocurra, el tribunal necesita ver que los problemas que llevaron a tu colocación en cuidado de crianza han sido resueltos.",
    },
    keywords: {
      en: ["reunification", "go home", "going home", "back home", "back with my mom", "back with my parents", "when can i go home", "live with my mom again", "reunify"],
      es: ["reunificacion", "volver a casa", "regresar a casa", "volver con mi mama", "volver con mis padres", "cuando puedo volver a casa", "vivir con mi mama otra vez"],
    },
    category: "court",
    ageBands: ["13-15","16-17"],
    relatedIds: ["q-what-is-permanency-hearing","q-what-is-case-plan"],
  },

  {
    id: "q-what-is-icwa",
    question: {
      en: "What is ICWA and does it apply to me?",
      es: "¿Qué es ICWA y me aplica?",
    },
    answer: {
      en: "ICWA stands for the Indian Child Welfare Act. It's a federal law that gives extra protections to Native American children in foster care cases. If you're an enrolled member — or are eligible to enroll — in a federally recognized tribe, ICWA may apply to your case. It means your tribe has the right to be notified and involved, and there are stricter rules about where you can be placed. Talk to your attorney if you think ICWA might apply to you.",
      es: "ICWA son las siglas de la Ley de Bienestar del Niño Indio. Es una ley federal que otorga protecciones adicionales a los niños nativos americanos en casos de cuidado de crianza. Si eres miembro inscrito — o eres elegible para inscribirte — en una tribu reconocida federalmente, ICWA puede aplicarse a tu caso. Quiere decir que tu tribu tiene derecho a que le avisen y a participar, y que hay reglas más estrictas sobre dónde puedes vivir. Habla con tu abogado/a si crees que ICWA puede aplicarse a ti.",
    },
    keywords: {
      en: ["icwa", "tribe", "tribal", "native", "native american", "im native", "indian", "american indian", "indigenous", "navajo", "dine", "apache", "hopi", "tohono oodham", "reservation", "rez", "my tribe", "enrolled", "icwa law", "ikwa"],
      es: ["icwa", "tribu", "tribal", "nativo", "nativo americano", "indigena", "navajo", "reservacion", "mi tribu"],
    },
    category: "court",
    ageBands: ["13-15","16-17","18-21"],
    relatedIds: ["q-what-are-my-rights","q-what-does-attorney-do"],
  },

  // ── SAFETY ──────────────────────────────────────────────────────────────────

  {
    id: "q-feel-unsafe-placement",
    question: {
      en: "What do I do if I feel unsafe where I'm living?",
      es: "¿Qué hago si no me siento seguro/a donde vivo?",
    },
    answer: {
      en: "Your safety is the most important thing. If you are in danger right now, call 911. If it's not an emergency but you're worried, tell your caseworker, your lawyer, or another adult you trust — like a teacher or a counselor. If you're under 18, you can also call the DCS Child Abuse Hotline at 1-888-767-2445 any time, day or night. You can also call or text 988 any time to talk with someone. You deserve to feel safe where you live, and speaking up is the right thing to do.",
      es: "Tu seguridad es lo más importante. Si estás en peligro ahora mismo, llama al 911. Si no es una emergencia pero estás preocupado/a, dile a tu trabajador/a de casos, a tu abogado/a o a otro adulto de confianza — como un maestro/a o un consejero/a. Si tienes menos de 18 años, también puedes llamar a la línea de DCS para reportar abuso al 1-888-767-2445 a cualquier hora, de día o de noche. También puedes llamar o enviar un mensaje al 988 a cualquier hora para hablar con alguien. Mereces sentirte seguro/a donde vives, y hablar es lo correcto.",
    },
    answer1012: {
      en: "If you don't feel safe, that's really important. If you're in danger RIGHT NOW, call 911. If it's not an emergency but you're worried, tell a grown-up you trust — a teacher, a school counselor, or your caseworker. You can also call for help anytime, day or night: 1-888-767-2445. You deserve to feel safe, and asking for help is always the right thing to do.",
      es: "Si no te sientes seguro/a, eso es muy importante. Si estás en peligro AHORA MISMO, llama al 911. Si no es una emergencia pero estás preocupado/a, dile a un adulto de confianza — un maestro/a, un consejero/a de la escuela o tu trabajador/a de casos. También puedes llamar para pedir ayuda a cualquier hora: 1-888-767-2445. Mereces sentirte seguro/a, y pedir ayuda siempre está bien.",
    },
    keywords: {
      en: ["unsafe", "not safe", "dont feel safe", "feel unsafe", "unsafe at home", "scared", "afraid", "scary", "danger", "in danger", "frightened", "threatened", "bullied", "bully", "yelling", "they scare me", "i am scared", "help me", "unsaf"],
      es: ["inseguro", "insegura", "no me siento seguro", "no me siento segura", "no estoy seguro", "seguro", "segura", "miedo", "tengo miedo", "asustado", "asustada", "peligro", "en peligro", "amenaza", "me gritan", "me dan miedo", "ayudame"],
    },
    category: "safety",
    ageBands: ["10-12","13-15","16-17","18-21"],
    relatedIds: ["q-crisis-numbers","q-report-abuse"],
  },

  {
    id: "q-crisis-numbers",
    question: {
      en: "Who can I call if I need help right now?",
      es: "¿A quién puedo llamar si necesito ayuda ahora mismo?",
    },
    answer: {
      en: "You are not alone. Here are people who will pick up:\n\n• Emergency: Call 911\n• 988 Suicide & Crisis Lifeline: Call or text 988 (24/7)\n• Crisis Text Line: Text HOME to 741741\n• DCS Child Abuse Hotline: 1-888-767-2445 (24/7)\n• Teen Lifeline (Arizona): Call or text 602-248-8336, or call 1-800-248-8336 outside Maricopa County (teens helping teens)\n• 211 Arizona: Call 2-1-1 for local help with shelter, food, and more\n\nAny of these are safe to call. No one will get in trouble for reaching out.",
      es: "No estás solo/a. Aquí hay personas que te van a contestar:\n\n• Emergencia: Llama al 911\n• Línea 988 de Prevención del Suicidio y Crisis: Llama o envía un mensaje al 988 (24/7)\n• Crisis Text Line: Envía HOLA al 741741\n• Línea de DCS para reportar abuso: 1-888-767-2445 (24/7)\n• Teen Lifeline (Arizona): Llama o envía un mensaje al 602-248-8336, o llama al 1-800-248-8336 fuera del condado de Maricopa (jóvenes que ayudan a jóvenes)\n• 211 Arizona: Llama al 2-1-1 para ayuda local con refugio, comida y más\n\nEs seguro llamar a cualquiera de estos números. Nadie se meterá en problemas por pedir ayuda.",
    },
    answer1012: {
      en: "Here are people who will answer the phone and help you:\n\n• If it's an emergency: Call 911\n• If you feel very sad or scared and want to talk: Call or text 988\n• If you want to text someone: Text HOME to 741741\n• If someone is hurting you or you don't feel safe: Call 1-888-767-2445 (anytime, day or night)\n• If you need food, clothes, or other help: Call 2-1-1\n\nYou will NOT get in trouble for calling any of these numbers.",
      es: "Aquí hay personas que contestarán el teléfono y te ayudarán:\n\n• Si es una emergencia: Llama al 911\n• Si te sientes muy triste o con miedo y quieres hablar: Llama o envía un mensaje al 988\n• Si quieres enviar un mensaje: Envía HOLA al 741741\n• Si alguien te está lastimando o no te sientes seguro/a: Llama al 1-888-767-2445 (a cualquier hora)\n• Si necesitas comida, ropa u otra ayuda: Llama al 2-1-1\n\nNO te meterás en problemas por llamar a ninguno de estos números.",
    },
    keywords: {
      en: ["help", "need help", "help me", "phone numbers", "hotline", "crisis", "emergency", "911", "988", "211", "call", "text", "talk to someone", "someone to talk to", "sad", "lonely", "depressed", "suicide", "food", "hungry", "nothing to eat", "clothes", "shelter", "teen lifeline", "numbers"],
      es: ["ayuda", "necesito ayuda", "ayudame", "numeros de telefono", "linea de ayuda", "crisis", "emergencia", "911", "988", "211", "llamar", "mensaje", "hablar con alguien", "triste", "solo", "sola", "deprimido", "suicidio", "comida", "hambre", "tengo hambre", "nada que comer", "ropa", "refugio"],
    },
    category: "safety",
    ageBands: ["10-12","13-15","16-17","18-21"],
    relatedIds: ["q-feel-unsafe-placement","q-report-abuse"],
  },

  {
    id: "q-report-abuse",
    question: {
      en: "What if someone is hurting me?",
      es: "¿Qué hago si alguien me está lastimando?",
    },
    answer: {
      en: "What's happening to you is not okay, and it is not your fault. If you're in danger right now, call 911. You can report it. If you're under 18, call the DCS Child Abuse Hotline anytime at 1-888-767-2445. If you're 18 or older, call 911 or your local police, and tell your caseworker or your lawyer. You can also tell an adult you trust — a teacher, counselor, or coach. You won't be in trouble for speaking up. You deserve to be safe.",
      es: "Lo que te está pasando no está bien, y no es tu culpa. Si estás en peligro ahora mismo, llama al 911. Puedes reportarlo. Si tienes menos de 18 años, llama a la línea de DCS para reportar abuso a cualquier hora al 1-888-767-2445. Si tienes 18 años o más, llama al 911 o a la policía local, y dile a tu trabajador/a de casos o a tu abogado/a. También puedes decirle a un adulto de confianza — un maestro/a, consejero/a o entrenador/a. No te meterás en problemas por hablar. Mereces estar seguro/a.",
    },
    answer1012: {
      en: "If someone is hurting you, that is NOT okay and it is NOT your fault. Tell a grown-up you trust right away — a teacher, coach, school counselor, or your caseworker. You can also call for help at 1-888-767-2445 any time, day or night. If you're in danger right now, call 911. You will NOT get in trouble for telling someone. You deserve to be safe.",
      es: "Si alguien te está lastimando, eso NO está bien y NO es tu culpa. Dile a un adulto de confianza de inmediato — un maestro/a, entrenador/a, consejero/a de la escuela o tu trabajador/a de casos. También puedes llamar al 1-888-767-2445 a cualquier hora. Si estás en peligro ahora mismo, llama al 911. NO te meterás en problemas por decirle a alguien. Mereces estar seguro/a.",
    },
    keywords: {
      en: ["abuse", "abused", "abusing", "hurt", "hurting me", "hits me", "hit", "hitting", "beat", "beating", "touched", "touching me", "molested", "rape", "neglect", "mean to me", "hurts me", "someone hurt me", "report", "tell someone", "bruise", "yells at me", "abuze", "abusse"],
      es: ["abuso", "abusan", "abusaron", "maltrato", "me lastima", "me lastiman", "me pega", "me pegan", "golpes", "golpea", "me toco", "me tocan", "violacion", "negligencia", "me hacen daño", "alguien me lastimo", "reportar", "decirle a alguien", "moreton", "me gritan"],
    },
    category: "safety",
    ageBands: ["10-12","13-15","16-17","18-21"],
    relatedIds: ["q-crisis-numbers","q-feel-unsafe-placement"],
  },

  // ── CORNER (Who's in My Corner) ─────────────────────────────────────────────

  {
    id: "q-who-is-casa",
    question: {
      en: "What is a CASA or Guardian ad Litem?",
      es: "¿Qué es un CASA o un tutor ad litem?",
    },
    answer: {
      en: "A CASA (Court Appointed Special Advocate) is a trained volunteer who the judge assigns to speak up for you — just for you. They're not a DCS worker. They get to know you, find out what you need, and tell the judge what they think is best for your future. A Guardian ad Litem is similar — it's a lawyer the court appoints to represent your best interests. Both are on your side.",
      es: "Un CASA (Defensor Especial Designado por el Tribunal) es un voluntario capacitado que el juez asigna para hablar por ti — solo por ti. No es un trabajador/a de DCS. Te conocen, descubren lo que necesitas y le dicen al juez lo que creen que es mejor para tu futuro.",
    },
    answer1012: {
      en: "A CASA is a special helper that the judge picks just for you. CASA stands for Court Appointed Special Advocate — that means the judge asked this person to look out for you. They're a volunteer, not a DCS worker. Their job is to get to know you and tell the judge what they think you need. They're on YOUR side.",
      es: "Un CASA es un ayudante especial que el juez elige solo para ti. CASA significa Defensor Especial Designado por el Tribunal — eso quiere decir que el juez le pidió a esta persona que te cuide. Son un voluntario/a, no un trabajador/a de DCS. Su trabajo es conocerte y decirle al juez lo que creen que necesitas. Están de TU lado.",
    },
    keywords: {
      en: ["casa", "casa volunteer", "guardian ad litem", "gal", "advocate", "volunteer", "who is on my side", "my helper"],
      es: ["casa", "voluntario casa", "tutor ad litem", "gal", "defensor", "voluntario", "quien esta de mi lado", "mi ayudante"],
    },
    category: "corner",
    ageBands: ["10-12","13-15"],
    relatedIds: ["q-what-does-attorney-do","q-right-to-lawyer"],
  },

  {
    id: "q-what-does-attorney-do",
    question: {
      en: "What does my attorney do?",
      es: "¿Qué hace mi abogado/a?",
    },
    answer: {
      en: "Your attorney — sometimes called your lawyer or your counsel — is there to represent what you want. Not what your parents want. Not what DCS wants. What YOU want. They speak for you in court, help you understand what's happening in your case, and can push back on decisions you disagree with. If you don't know who your attorney is, ask your caseworker right away.",
      es: "Tu abogado/a está ahí para representar lo que tú quieres. No lo que quieren tus padres. No lo que quiere DCS. Lo que TÚ quieres. Habla por ti en el tribunal, te ayuda a entender lo que está pasando en tu caso y puede cuestionar decisiones con las que no estás de acuerdo.",
    },
    answer1012: {
      en: "Your attorney is YOUR lawyer. Their job is to listen to what YOU want and tell the judge. They're not there for your parents or for DCS — they're there for you. They can help you understand what's happening and speak up for you. If you don't know who your lawyer is, ask your caseworker.",
      es: "Tu abogado/a es TU abogado/a. Su trabajo es escuchar lo que TÚ quieres y decirle al juez. No están ahí para tus padres ni para DCS — están ahí para ti. Pueden ayudarte a entender lo que está pasando y hablar por ti. Si no sabes quién es tu abogado/a, pregúntale a tu trabajador/a de casos.",
    },
    keywords: {
      en: ["attorney", "lawyer", "my lawyer", "what does my lawyer do", "who is my lawyer", "talk to my lawyer", "legal", "laywer", "lawer"],
      es: ["abogado", "abogada", "mi abogado", "que hace mi abogado", "quien es mi abogado", "hablar con mi abogado", "legal"],
    },
    category: "corner",
    ageBands: ["10-12","13-15","16-17","18-21"],
    relatedIds: ["q-right-to-lawyer","q-who-is-casa"],
  },

  {
    id: "q-what-is-ombudsman",
    question: {
      en: "What is the DCS Ombudsman?",
      es: "¿Qué es el Ombudsman (defensor del pueblo) de DCS?",
    },
    answer: {
      en: "The DCS Office of the Ombudsman helps when you feel DCS isn't treating you fairly or following the rules. This office is part of DCS, but its job is to listen to complaints and try to fix them. If you've already talked to your caseworker and their supervisor and nothing has changed, this is your next step. Call 1-877-527-0765 (or 602-364-0777). The call is free. If that still doesn't help, there is an office that is not part of DCS: the Arizona Ombudsman-Citizens' Aide, at 602-277-7292. Your lawyer can help you too.",
      es: "La Oficina del Ombudsman (defensor del pueblo) de DCS ayuda cuando sientes que DCS no te trata de forma justa o no sigue las reglas. Esta oficina es parte de DCS, pero su trabajo es escuchar quejas y tratar de resolverlas. Si ya hablaste con tu trabajador/a de casos y su supervisor/a y nada cambió, este es tu siguiente paso. Llama al 1-877-527-0765 (o al 602-364-0777). La llamada es gratis. Si eso tampoco ayuda, hay una oficina que no es parte de DCS: el Ombudsman de Arizona (Arizona Ombudsman-Citizens' Aide), al 602-277-7292. Tu abogado/a también puede ayudarte.",
    },
    keywords: {
      en: ["ombudsman", "ombudsmen", "complaint", "complain about dcs", "report dcs", "report my caseworker", "citizens aide", "who do i complain to", "ombusman", "omnibudsman"],
      es: ["ombudsman", "defensor del pueblo", "queja", "quejarme de dcs", "reportar a dcs", "reportar a mi trabajador", "a quien me quejo"],
    },
    category: "corner",
    ageBands: ["13-15","16-17","18-21"],
    relatedIds: ["q-rights-ignored","q-what-are-my-rights"],
  },

  {
    id: "q-fostering-advocates",
    question: {
      en: "What is Fostering Advocates Arizona?",
      es: "¿Qué es Fostering Advocates Arizona?",
    },
    answer: {
      en: "Fostering Advocates Arizona is a nonprofit run by and for people who have been in foster care. They can help you know your rights, navigate the system, and connect with others who understand what you're going through. They also do policy work to make the system better for everyone. You can reach them at (602) 266-0707 or find them at fosteringadvocatesarizona.org.",
      es: "Fostering Advocates Arizona es una organización sin fines de lucro dirigida por y para personas que han estado en el cuidado de crianza. Pueden ayudarte a conocer tus derechos, navegar el sistema y conectarte con otros que entienden lo que estás pasando.",
    },
    keywords: {
      en: ["fostering advocates", "faaz", "youth group", "other foster kids", "foster youth group", "meet other foster youth", "advocacy", "speak up"],
      es: ["fostering advocates", "faaz", "grupo de jovenes", "otros jovenes de crianza", "conocer a otros jovenes", "defensa"],
    },
    category: "corner",
    ageBands: ["13-15"],
    relatedIds: ["q-rights-ignored","q-what-is-ombudsman"],
  },

  // ── DOCUMENTS ───────────────────────────────────────────────────────────────

  {
    id: "q-get-birth-certificate",
    question: {
      en: "How do I get my birth certificate?",
      es: "¿Cómo obtengo mi acta de nacimiento?",
    },
    answer: {
      en: "Your caseworker is legally required to make sure you have your birth certificate before you leave care. If you don't have it, ask them — they can request it from the Arizona Department of Health Services at no cost to you. If you're 18 or older and out of care, you can request it yourself from ADHS for a small fee. Don't leave care without this document.",
      es: "Tu trabajador/a de casos está legalmente obligado/a a asegurarse de que tengas tu acta de nacimiento antes de que salgas del sistema. Si no la tienes, pídela — puede solicitarla al Departamento de Salud de Arizona sin costo para ti.",
    },
    keywords: {
      en: ["birth certificate", "birth cert", "birth record", "vital records", "where was i born", "proof of birth", "birth certifcate"],
      es: ["acta de nacimiento", "certificado de nacimiento", "partida de nacimiento", "registro de nacimiento"],
    },
    category: "documents",
    ageBands: ["16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-docs-should-i-have","q-get-state-id"],
  },

  {
    id: "q-get-state-id",
    question: {
      en: "How do I get a state ID or driver's license?",
      es: "¿Cómo obtengo una identificación estatal o licencia de conducir?",
    },
    answer: {
      en: "Your caseworker should help you get a state ID before you leave care — it's one of their responsibilities. To get an Arizona ID, you'll need your birth certificate and Social Security card. DCS is supposed to cover the cost. If you're working toward a driver's license, you'll also need proof of address. Ask your caseworker to start this process — don't wait until the last minute.",
      es: "Tu trabajador/a de casos debe ayudarte a obtener una identificación estatal antes de que salgas del sistema — es una de sus responsabilidades. Para obtener una identificación de Arizona, necesitarás tu acta de nacimiento y tu tarjeta de Seguro Social. DCS debe cubrir el costo.",
    },
    keywords: {
      en: ["id", "state id", "id card", "drivers license", "driver license", "license", "permit", "learners permit", "dmv", "mvd", "driving", "learn to drive", "licence"],
      es: ["identificacion", "id estatal", "tarjeta de identificacion", "licencia de conducir", "licencia", "permiso", "dmv", "mvd", "manejar", "aprender a manejar"],
    },
    category: "documents",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-get-birth-certificate","q-what-docs-should-i-have"],
  },

  {
    id: "q-get-social-security-card",
    question: {
      en: "How do I get my Social Security card?",
      es: "¿Cómo obtengo mi tarjeta de Seguro Social?",
    },
    answer: {
      en: "DCS is required to obtain your Social Security card for you. If you don't have it, ask your caseworker right away. You'll need it to get a job, apply for benefits, and get other documents like a state ID. If you're 18 or older and out of care, you can apply for a replacement card at ssa.gov — it's free.",
      es: "DCS está obligado a obtener tu tarjeta de Seguro Social para ti. Si no la tienes, pídela a tu trabajador/a de casos de inmediato. La necesitarás para conseguir trabajo, solicitar beneficios y obtener otros documentos como una identificación estatal.",
    },
    keywords: {
      en: ["social security", "social security card", "ssn", "social security number", "ss card", "social"],
      es: ["seguro social", "tarjeta de seguro social", "numero de seguro social", "ssn"],
    },
    category: "documents",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-what-docs-should-i-have","q-get-state-id"],
  },

  {
    id: "q-what-docs-should-i-have",
    question: {
      en: "What documents should I have before I leave care?",
      es: "¿Qué documentos debo tener antes de salir del sistema?",
    },
    answer: {
      en: "Before you leave foster care, you should have all of these:\n\n• Birth certificate\n• Social Security card\n• State ID or driver's license\n• Health and immunization records\n• Any educational records (transcripts, IEP if applicable)\n• Insurance card (if you have Medicaid/AHCCCS)\n\nDCS is required to provide all of these to you. If any are missing, ask your caseworker now — don't wait until your last day.",
      es: "Antes de salir del cuidado de crianza, deberías tener todo esto:\n\n• Acta de nacimiento\n• Tarjeta de Seguro Social\n• Identificación estatal o licencia de conducir\n• Registros de salud e inmunización\n• Registros educativos\n• Tarjeta de seguro (si tienes Medicaid/AHCCCS)\n\nDCS está obligado a proveerte todos estos documentos.",
    },
    keywords: {
      en: ["documents", "papers", "paperwork", "what papers do i need", "important papers", "records", "medical records", "before i leave", "aging out checklist"],
      es: ["documentos", "papeles", "que papeles necesito", "papeles importantes", "registros", "historial medico", "antes de salir"],
    },
    category: "documents",
    ageBands: ["16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-get-birth-certificate","q-get-state-id","q-get-social-security-card"],
  },

  // ── HOUSING ─────────────────────────────────────────────────────────────────

  {
    id: "q-housing-options-at-18",
    question: {
      en: "What are my housing options when I turn 18?",
      es: "¿Cuáles son mis opciones de vivienda cuando cumpla 18?",
    },
    answer: {
      en: "You have more options than you might think. If you stay in Extended Foster Care (EFC), your housing is still covered. If you're transitioning out, options include: transitional living programs (short-term supported housing), independent living with rental assistance, staying with a former foster family, or college dorms if you're going to school. Organizations like UMOM and Tumbleweed Center in Phoenix also help young adults find housing. You don't have to figure this out alone — ask your caseworker to start planning this at least 6 months before you turn 18.",
      es: "Tienes más opciones de las que crees. Si te quedas en el Cuidado de Crianza Extendido (EFC), tu vivienda aún está cubierta. Si estás saliendo del sistema, las opciones incluyen: programas de vivienda transitoria, vida independiente con asistencia de alquiler, quedarte con una familia de acogida anterior, o dormitorios universitarios.",
    },
    keywords: {
      en: ["housing", "place to live", "where will i live", "apartment", "rent", "aging out", "age out", "turn 18", "move out", "live on my own", "roommate"],
      es: ["vivienda", "donde vivir", "donde voy a vivir", "apartamento", "renta", "alquiler", "cumplir 18", "mudarme solo", "vivir solo", "compañero de cuarto"],
    },
    category: "housing",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-what-is-efc","q-transitional-housing"],
  },

  {
    id: "q-transitional-housing",
    question: {
      en: "What is transitional housing?",
      es: "¿Qué es la vivienda transitoria?",
    },
    answer: {
      en: "Transitional housing is a short-term supported place to live — usually for young adults ages 18 to 24 — while you're getting on your feet. It's not permanent, but it gives you a safe place to stay and usually includes support like job training, life skills classes, and help finding your own apartment. Programs like Tumbleweed Center for Youth Development in Phoenix and UMOM New Day Centers offer this. Ask your caseworker or check the Resources section of this app.",
      es: "La vivienda transitoria es un lugar de vida temporal con apoyo — generalmente para adultos jóvenes de 18 a 24 años — mientras te estabilizas. No es permanente, pero te da un lugar seguro para vivir y generalmente incluye apoyo como capacitación laboral, clases de habilidades para la vida y ayuda para encontrar tu propio apartamento.",
    },
    keywords: {
      en: ["transitional housing", "transitional living", "tlp", "supported housing", "housing program", "independent living program"],
      es: ["vivienda transitoria", "vivienda de transicion", "programa de vivienda", "vida independiente"],
    },
    category: "housing",
    ageBands: ["18-21"],
    relatedIds: ["q-housing-options-at-18","q-nowhere-to-go-tonight"],
  },

  {
    id: "q-nowhere-to-go-tonight",
    question: {
      en: "I have nowhere to go tonight. What do I do?",
      es: "No tengo adónde ir esta noche. ¿Qué hago?",
    },
    answer: {
      en: "You don't have to sleep outside tonight. Call 211 (dial 2-1-1) — they can connect you to emergency shelter in your area right now, any time of day or night. In Phoenix, Tumbleweed Center's 24-hour line is (602) 271-9904. UMOM New Day Centers is at (602) 889-3597. If you're still in foster care and your placement broke down, call your caseworker's emergency line immediately — DCS is required to find you safe placement.",
      es: "No tienes que dormir en la calle esta noche. Llama al 211 — pueden conectarte con un refugio de emergencia en tu área ahora mismo. En Phoenix, la línea de 24 horas de Tumbleweed es (602) 271-9904. Si todavía estás en cuidado de crianza y tu colocación terminó, llama a la línea de emergencia de tu trabajador/a de casos de inmediato.",
    },
    keywords: {
      en: ["homeless", "nowhere to go", "no place to stay", "no place to sleep", "kicked out", "on the street", "shelter", "sleeping outside", "sleep in my car", "couch surfing", "need a bed", "tonight", "homless"],
      es: ["sin hogar", "no tengo a donde ir", "no tengo donde dormir", "no tengo donde quedarme", "me corrieron", "me echaron", "en la calle", "refugio", "albergue", "dormir afuera", "esta noche"],
    },
    category: "housing",
    ageBands: ["18-21"],
    relatedIds: ["q-transitional-housing","q-housing-options-at-18"],
  },

  {
    id: "q-stay-with-former-family",
    question: {
      en: "Can I stay with my former foster family?",
      es: "¿Puedo quedarme con mi familia de acogida anterior?",
    },
    answer: {
      en: "Yes — if your former foster family agrees and it's a safe situation, staying with them is a real option. You can reach back out to them directly. If you need help reconnecting with a former family through DCS, your caseworker can assist with that. Many foster alumni find that former foster families are willing to offer a room, a meal, or ongoing support even after care officially ends.",
      es: "Sí — si tu familia de acogida anterior está de acuerdo y es una situación segura, quedarte con ellos es una opción real. Puedes contactarlos directamente. Muchos jóvenes que salieron del sistema de cuidado de crianza encuentran que sus antiguas familias están dispuestas a ofrecer un cuarto, una comida o apoyo continuo.",
    },
    keywords: {
      en: ["former foster family", "foster family", "stay with my foster parents", "stay after 18", "keep living with", "foster mom", "foster dad", "stay where i am"],
      es: ["familia de crianza", "quedarme con mi familia de crianza", "quedarme despues de los 18", "seguir viviendo con", "quedarme donde estoy"],
    },
    category: "housing",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-housing-options-at-18","q-what-is-efc"],
  },

  // ── TURNING 18 ──────────────────────────────────────────────────────────────

  {
    id: "q-do-i-have-to-leave-at-18",
    question: {
      en: "Do I have to leave foster care when I turn 18?",
      es: "¿Tengo que salir del cuidado de crianza cuando cumpla 18?",
    },
    answer: {
      en: "No — you don't have to leave at 18. Arizona has a program called Extended Foster Care (EFC) that lets you stay in care until age 21. You can keep your housing, health coverage, and other supports. You just need to be doing one of the following: going to school, working, in a job training program, or have a medical condition that prevents work. Talk to your caseworker about signing up before you turn 18.",
      es: "No — no tienes que irte a los 18. Arizona tiene un programa llamado Cuidado de Crianza Extendido (EFC) que te permite quedarte en el sistema hasta los 21 años. Puedes conservar tu vivienda, cobertura de salud y otros apoyos.",
    },
    keywords: {
      en: ["turn 18", "turning 18", "18", "aging out", "age out", "kicked out at 18", "leave foster care", "do i have to leave", "what happens when i turn 18", "birthday"],
      es: ["cumplir 18", "18", "tengo que irme", "me sacan a los 18", "salir del cuidado de crianza", "que pasa cuando cumpla 18", "cumpleaños"],
    },
    category: "turning18",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-what-is-efc","q-efc-eligibility"],
  },

  {
    id: "q-what-is-efc",
    question: {
      en: "What is Extended Foster Care (EFC)?",
      es: "¿Qué es el Cuidado de Crianza Extendido (EFC)?",
    },
    answer: {
      en: "Extended Foster Care — often called EFC — lets you voluntarily stay in the foster care system after age 18, up to age 21. While you're in EFC, you keep your housing placement, Medicaid health coverage, your caseworker, and access to independent living services. You have to be doing at least one of: attending school, working, in a vocational program, or have a documented medical reason you can't do any of those. EFC is one of the most valuable things you can use — don't give it up without a plan.",
      es: "El Cuidado de Crianza Extendido — conocido como EFC — te permite quedarte voluntariamente en el sistema de cuidado de crianza después de los 18 años, hasta los 21. Mientras estás en EFC, mantienes tu colocación, cobertura médica Medicaid, tu trabajador/a de casos y acceso a servicios de vida independiente.",
    },
    keywords: {
      en: ["efc", "extended foster care", "stay in foster care", "stay until 21", "after 18", "extended care", "voluntary"],
      es: ["efc", "cuidado de crianza extendido", "quedarme en cuidado de crianza", "hasta los 21", "despues de los 18", "cuidado extendido", "voluntario"],
    },
    category: "turning18",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-do-i-have-to-leave-at-18","q-efc-eligibility"],
  },

  {
    id: "q-efc-eligibility",
    question: {
      en: "Am I eligible for Extended Foster Care?",
      es: "¿Soy elegible para el Cuidado de Crianza Extendido?",
    },
    answer: {
      en: "You're eligible for EFC if you were in foster care in Arizona when you turned 18 and you're doing at least one of these: enrolled in high school or college, working at least 80 hours a month, in a vocational or employment training program, or have a documented medical condition preventing work. The key is to sign up before you age out — talk to your caseworker about this at least 6 months ahead of your 18th birthday.",
      es: "Eres elegible para EFC si estabas en cuidado de crianza en Arizona cuando cumpliste 18 años y estás haciendo al menos uno de estos: inscrito/a en la escuela secundaria o universidad, trabajando al menos 80 horas al mes, en un programa de capacitación vocacional o laboral, o tienes una condición médica documentada que impide trabajar.",
    },
    keywords: {
      en: ["efc", "eligible", "qualify", "do i qualify", "requirements", "can i get extended foster care", "come back to foster care", "reenter", "re-enter"],
      es: ["efc", "elegible", "califico", "requisitos", "puedo recibir cuidado extendido", "regresar al cuidado de crianza", "volver a entrar"],
    },
    category: "turning18",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-what-is-efc","q-do-i-have-to-leave-at-18"],
  },

  {
    id: "q-what-is-etv",
    question: {
      en: "What is the Education and Training Voucher (ETV)?",
      es: "¿Qué es el Bono de Educación y Capacitación (ETV)?",
    },
    answer: {
      en: "The Education and Training Voucher (ETV) is money for school after high school — college, trade school, or job training. It can be up to about $5,000 a year, based on what you need. It is not a loan, so you don't pay it back. You may qualify if you were in foster care at age 16 or older. There are age limits, so ask early. You apply again each year. The money can run out and the due dates change every year, so apply as early as you can. Your caseworker can help you. You can also open the Arizona ETV listing in Find Resources.",
      es: "El Bono de Educación y Capacitación (ETV) es dinero para estudiar después de la preparatoria — universidad, escuela técnica o capacitación para un trabajo. Puede ser hasta unos $5,000 al año, según lo que necesites. No es un préstamo, así que no lo tienes que devolver. Puedes calificar si estuviste en cuidado de crianza a los 16 años o después. Hay límites de edad, así que pregunta pronto. Tienes que solicitarlo de nuevo cada año. El dinero se puede acabar y las fechas cambian cada año, así que solicítalo lo antes posible. Tu trabajador/a de casos te puede ayudar. También puedes abrir el ETV de Arizona en Encuentra Recursos.",
    },
    keywords: {
      en: ["etv", "education and training voucher", "voucher", "money for school", "money for college", "pay for college", "college money", "grant", "scholarship", "tuition"],
      es: ["etv", "vale de educacion", "bono de educacion", "dinero para la escuela", "dinero para la universidad", "pagar la universidad", "beca", "colegiatura"],
    },
    category: "turning18",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-etv-deadline","q-az-tuition-waiver"],
  },

  {
    id: "q-etv-deadline",
    question: {
      en: "When is the ETV deadline?",
      es: "¿Cuál es la fecha límite del ETV?",
    },
    answer: {
      en: "The due date for the Education and Training Voucher (ETV) changes every year, so we don't list a date here. The best plan is to apply early — as soon as you know you want to go to school or training. You have to apply again each year, and the money can run out. To find out this year's date, ask your caseworker, or open the Arizona ETV listing in Find Resources. If you think you missed it, call anyway. Ask what you can still do and when you can apply next.",
      es: "La fecha límite del Bono de Educación y Capacitación (ETV) cambia cada año, por eso aquí no ponemos una fecha. El mejor plan es solicitarlo temprano — en cuanto sepas que quieres estudiar o capacitarte. Tienes que solicitarlo de nuevo cada año, y el dinero se puede acabar. Para saber la fecha de este año, pregúntale a tu trabajador/a de casos, o abre el ETV de Arizona en Encuentra Recursos. Si crees que ya se te pasó la fecha, llama de todos modos. Pregunta qué puedes hacer todavía y cuándo puedes solicitarlo otra vez.",
    },
    keywords: {
      en: ["etv", "deadline", "due date", "when to apply", "apply", "application", "too late", "how to apply for etv"],
      es: ["etv", "fecha limite", "cuando solicitar", "solicitar", "solicitud", "demasiado tarde", "como solicitar etv"],
    },
    category: "turning18",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-what-is-etv","q-az-tuition-waiver"],
  },

  // ── BENEFITS ────────────────────────────────────────────────────────────────

  {
    id: "q-what-is-ahcccs-yati",
    question: {
      en: "What is YATI health coverage and do I qualify?",
      es: "¿Qué es la cobertura de salud YATI y califico?",
    },
    answer: {
      en: "YATI stands for Young Adults Transitional Insurance. It's a free full Medicaid health plan through AHCCCS for Arizona young adults who were in foster care at age 18. It covers doctor visits, dental, vision, mental health care, and prescriptions — at no cost to you — until age 26. To check eligibility or enroll, call AHCCCS at (602) 417-4000 or visit azahcccs.gov.",
      es: "YATI son las siglas de Seguro de Transición para Adultos Jóvenes. Es un plan de salud Medicaid completo y gratuito a través de AHCCCS para jóvenes adultos de Arizona que estaban en cuidado de crianza a los 18 años. Cubre visitas médicas, dental, visión, salud mental y medicamentos — sin costo para ti — hasta los 26 años.",
    },
    keywords: {
      en: ["yati", "ahcccs", "medicaid", "health insurance", "insurance", "doctor", "health care", "medical", "dentist", "therapy", "counseling", "medicine", "prescriptions", "sick", "acccs"],
      es: ["yati", "ahcccs", "medicaid", "seguro medico", "seguro de salud", "doctor", "medico", "atencion medica", "dentista", "terapia", "consejeria", "medicina", "recetas", "enfermo"],
    },
    category: "benefits",
    ageBands: ["18-21"],
    relatedIds: ["q-snap-food-stamps","q-what-is-efc"],
  },

  {
    id: "q-snap-food-stamps",
    question: {
      en: "Can I get food stamps (SNAP)?",
      es: "¿Puedo obtener cupones de alimentos (SNAP)?",
    },
    answer: {
      en: "Yes — if you're 18 or older and your income is low, you may qualify for SNAP (Supplemental Nutrition Assistance Program), sometimes called food stamps. Apply through the Arizona Department of Economic Security (DES) at des.az.gov or call 1-855-432-7587. The application is free. If you're still in foster care, ask your caseworker if you already have SNAP benefits set up.",
      es: "Sí — si tienes 18 años o más y tus ingresos son bajos, puedes calificar para SNAP (Programa de Asistencia Nutricional Suplementaria), conocido como cupones de alimentos. Solicita a través del Departamento de Servicios Económicos de Arizona (DES) en des.az.gov o llama al 1-855-432-7587.",
    },
    keywords: {
      en: ["snap", "food stamps", "ebt", "food", "hungry", "groceries", "money for food", "nothing to eat", "nutrition assistance", "food bank"],
      es: ["snap", "estampillas de comida", "cupones de alimentos", "ebt", "comida", "hambre", "tengo hambre", "despensa", "dinero para comida", "nada que comer", "banco de comida"],
    },
    category: "benefits",
    ageBands: ["18-21"],
    relatedIds: ["q-tanf-cash-assistance","q-what-is-ahcccs-yati"],
  },

  {
    id: "q-tanf-cash-assistance",
    question: {
      en: "Can I get cash assistance (TANF)?",
      es: "¿Puedo obtener asistencia en efectivo (TANF)?",
    },
    answer: {
      en: "TANF (Temporary Assistance for Needy Families) provides monthly cash assistance if you meet income and work requirements. In Arizona it's called TPEP (Transition to Employment Program). You can apply through DES at des.az.gov/ca or call 1-855-432-7587. If you have a child of your own, eligibility rules are different — the DES office can walk you through them.",
      es: "TANF (Asistencia Temporal para Familias Necesitadas) proporciona asistencia mensual en efectivo si cumples con los requisitos de ingresos y trabajo. En Arizona se llama TPEP. Puedes solicitar a través de DES en des.az.gov/ca o llamar al 1-855-432-7587.",
    },
    keywords: {
      en: ["tanf", "cash assistance", "cash", "money", "need money", "broke", "welfare", "financial help", "bills"],
      es: ["tanf", "asistencia en efectivo", "efectivo", "dinero", "necesito dinero", "sin dinero", "ayuda economica", "cuentas"],
    },
    category: "benefits",
    ageBands: ["18-21"],
    relatedIds: ["q-snap-food-stamps","q-what-is-ahcccs-yati"],
  },

  // ── SCHOOL ──────────────────────────────────────────────────────────────────

  {
    id: "q-az-tuition-waiver",
    question: {
      en: "Can I go to college for free in Arizona?",
      es: "¿Puedo ir a la universidad gratis en Arizona?",
    },
    answer: {
      en: "Maybe — Arizona has a tuition waiver for young people who were in foster care. A waiver means the school does not charge you tuition. It works at Arizona public universities and community colleges. You may qualify if you were in foster care in Arizona at age 14 or older. There is an age limit, and there are a few other rules, so ask early. You also need to fill out the FAFSA (the free form for school money) each year. Ask your school's financial aid office about the foster care tuition waiver. Your caseworker can help too.",
      es: "Tal vez — Arizona tiene una exención de matrícula para jóvenes que estuvieron en cuidado de crianza. Una exención quiere decir que la escuela no te cobra la matrícula. Sirve en las universidades públicas y colegios comunitarios de Arizona. Puedes calificar si estuviste en cuidado de crianza en Arizona a los 14 años o después. Hay un límite de edad y otras reglas, así que pregunta pronto. También tienes que llenar la FAFSA (el formulario gratis para pedir dinero para estudiar) cada año. Pregunta en la oficina de ayuda financiera de tu escuela por la exención de matrícula para jóvenes de cuidado de crianza. Tu trabajador/a de casos también te puede ayudar.",
    },
    keywords: {
      en: ["tuition waiver", "free college", "college", "university", "community college", "tuition", "pay for school", "free school", "scholarship", "degree"],
      es: ["exencion de matricula", "universidad gratis", "universidad", "colegio comunitario", "matricula", "colegiatura", "pagar la escuela", "beca", "carrera"],
    },
    category: "school",
    ageBands: ["18-21"],
    relatedIds: ["q-what-is-etv","q-asu-foster-youth"],
  },

  {
    id: "q-asu-foster-youth",
    question: {
      en: "What is the ASU Foster Youth Success Initiative?",
      es: "¿Qué es la Iniciativa de Éxito para Jóvenes de Cuidado de Crianza de ASU?",
    },
    answer: {
      en: "Arizona State University's Foster Youth Success Initiative gives foster alumni free tuition (through the tuition waiver), priority on-campus housing, a dedicated advisor, and peer support. If you're interested in ASU, reach out to the program before you apply — they can walk you through everything. Visit fosteryouth.asu.edu or call ASU's financial aid office to get started.",
      es: "La Iniciativa de Éxito para Jóvenes de Cuidado de Crianza de la Universidad Estatal de Arizona ofrece a los exfosterianos matrícula gratuita, prioridad en vivienda en el campus, un asesor dedicado y apoyo entre compañeros. Visita fosteryouth.asu.edu para comenzar.",
    },
    keywords: {
      en: ["asu", "arizona state", "arizona state university", "bridging success", "college support", "campus help", "sun devils"],
      es: ["asu", "universidad estatal de arizona", "apoyo universitario", "ayuda en el campus"],
    },
    category: "school",
    ageBands: ["18-21"],
    relatedIds: ["q-az-tuition-waiver","q-what-is-etv"],
  },

  {
    id: "q-etv-for-school",
    question: {
      en: "How can the ETV help me pay for school?",
      es: "¿Cómo puede el ETV ayudarme a pagar la escuela?",
    },
    answer: {
      en: "The Education and Training Voucher (ETV) can give you up to about $5,000 a year for school costs. You can use it along with other money for school, like grants and the Arizona tuition waiver. It can help with things like tuition, books, housing, rides, and school supplies. It is not a loan, so you don't pay it back. You apply again each year. Due dates change every year and the money can run out, so apply early. For help, ask your caseworker, or open the Arizona ETV listing in Find Resources.",
      es: "El Bono de Educación y Capacitación (ETV) te puede dar hasta unos $5,000 al año para gastos de la escuela. Lo puedes usar junto con otro dinero para estudiar, como becas y la exención de matrícula de Arizona. Puede ayudarte con cosas como matrícula, libros, vivienda, transporte y útiles. No es un préstamo, así que no lo tienes que devolver. Lo solicitas de nuevo cada año. Las fechas cambian cada año y el dinero se puede acabar, así que solicítalo temprano. Para recibir ayuda, pregúntale a tu trabajador/a de casos, o abre el ETV de Arizona en Encuentra Recursos.",
    },
    keywords: {
      en: ["etv", "pay for school", "money for books", "books", "tuition", "rent while in school", "college costs", "school supplies", "laptop"],
      es: ["etv", "pagar la escuela", "dinero para libros", "libros", "colegiatura", "renta mientras estudio", "gastos de universidad", "utiles escolares", "computadora"],
    },
    category: "school",
    ageBands: ["18-21"],
    relatedIds: ["q-what-is-etv","q-az-tuition-waiver"],
  },

  {
    id: "q-nau-foster-youth",
    question: {
      en: "What help does Northern Arizona University offer?",
      es: "¿Qué ayuda ofrece la Universidad del Norte de Arizona?",
    },
    answer: {
      en: "NAU participates in the Arizona Foster Care Tuition Waiver and has support services for foster alumni through their financial aid and student support offices. If you're interested in NAU, contact their financial aid office at nau.edu/financial-aid and ask specifically about foster youth support. They can help you stack the tuition waiver with the ETV and any other aid you qualify for.",
      es: "NAU participa en la exención de matrícula para jóvenes de cuidado de crianza y tiene servicios de apoyo para exfosterianos a través de sus oficinas de ayuda financiera. Si te interesa NAU, contacta su oficina de ayuda financiera en nau.edu/financial-aid y pregunta específicamente sobre el apoyo para jóvenes del sistema de cuidado de crianza.",
    },
    keywords: {
      en: ["nau", "northern arizona university", "flagstaff", "blavin scholars", "college support", "lumberjacks"],
      es: ["nau", "universidad del norte de arizona", "flagstaff", "apoyo universitario"],
    },
    category: "school",
    ageBands: ["18-21"],
    relatedIds: ["q-az-tuition-waiver","q-asu-foster-youth"],
  },

  // ── MORE TOPICS (running away, LGBTQ+, parenting, severance, two courts, complaints) ──

  {
    id: "q-ran-away",
    question: {
      en: "What happens if I run away or leave my placement?",
      es: "¿Qué pasa si me escapo o me voy de donde vivo?",
    },
    answer: {
      en: "Wanting to leave does not make you a bad person. It usually means something is wrong, and that matters. If you leave, the adults on your case have to report you as missing, and people will look for you, because they need to know you are safe. It can be very unsafe to be out on your own. If you already left, your safety comes first. If you are in danger, call 911. You can call your caseworker or your lawyer and tell them where you are and why you left. You can call or text 988 any time just to talk. You can also call the DCS (Department of Child Safety) hotline at 1-888-767-2445, day or night. If you are thinking about leaving, tell your lawyer or caseworker what is wrong first. You can ask to move to a different home.",
      es: "Querer irte no te hace una mala persona. Casi siempre quiere decir que algo anda mal, y eso importa. Si te vas, los adultos de tu caso tienen que reportar que no saben dónde estás, y habrá personas buscándote, porque necesitan saber que estás a salvo. Estar solo/a en la calle puede ser muy peligroso. Si ya te fuiste, tu seguridad es lo primero. Si estás en peligro, llama al 911. Puedes llamar a tu trabajador/a de casos o a tu abogado/a y decirles dónde estás y por qué te fuiste. Puedes llamar o enviar un mensaje al 988 a cualquier hora solo para hablar. También puedes llamar a la línea de DCS (Departamento de Seguridad Infantil) al 1-888-767-2445, de día o de noche. Si estás pensando en irte, primero dile a tu abogado/a o a tu trabajador/a de casos qué anda mal. Puedes pedir que te cambien a otro hogar.",
    },
    answer1012: {
      en: "Wanting to run away does not mean you are bad. It means something feels wrong, and that is important. Being out alone is not safe. Before you go anywhere, tell a grown-up you trust what is wrong — your caseworker, your lawyer, or a teacher. You can ask to live somewhere else. If you already left, call 911 if you are in danger. You can also call 1-888-767-2445 any time, day or night, and someone will help you get to a safe place. You can call or text 988 if you just want to talk.",
      es: "Querer escaparte no quiere decir que seas malo/a. Quiere decir que algo se siente mal, y eso es importante. Estar solo/a en la calle no es seguro. Antes de irte a algún lado, dile a un adulto de confianza qué está mal — tu trabajador/a de casos, tu abogado/a o un maestro/a. Puedes pedir vivir en otro lugar. Si ya te fuiste, llama al 911 si estás en peligro. También puedes llamar al 1-888-767-2445 a cualquier hora, de día o de noche, y alguien te ayudará a llegar a un lugar seguro. Puedes llamar o enviar un mensaje al 988 si solo quieres hablar.",
    },
    keywords: {
      en: ["run away", "runaway", "ran away", "running away", "run", "leave", "leaving", "left", "escape", "sneak out", "awol", "on the run", "i want to leave", "i want to go home", "walk out", "missing", "will i get in trouble", "go back", "runing away", "runaway"],
      es: ["escapar", "escaparme", "me escape", "huir", "hui", "irme", "me fui", "me quiero ir", "quiero irme a mi casa", "fugarme", "fuga", "salirme", "desaparecido", "me voy a meter en problemas", "regresar", "escapé"],
    },
    category: "safety",
    ageBands: ["10-12","13-15","16-17"],
    relatedIds: ["q-dont-like-foster-home","q-feel-unsafe-placement","q-crisis-numbers"],
  },

  {
    id: "q-lgbtq-respect",
    question: {
      en: "I'm LGBTQ+. Will I be safe and respected in foster care?",
      es: "Soy LGBTQ+. ¿Voy a estar seguro/a y me van a respetar en el cuidado de crianza?",
    },
    answer: {
      en: "You deserve to be safe and treated with respect, just as you are. Nothing is wrong with you. No one should hurt you, bully you, call you names, or punish you because of who you are or who you like. If that is happening, tell your lawyer or your caseworker. If your caseworker does not help, ask for their supervisor, or call the DCS Ombudsman at 1-877-527-0765. You choose who you tell about yourself and when. What you tell your lawyer is private, so your lawyer can be a safe person to start with. If you ever feel very down or alone, you can call or text 988 any time.",
      es: "Mereces estar seguro/a y que te traten con respeto, tal como eres. No hay nada malo en ti. Nadie debe lastimarte, molestarte, insultarte ni castigarte por ser quien eres o por quien te gusta. Si eso está pasando, dile a tu abogado/a o a tu trabajador/a de casos. Si tu trabajador/a de casos no te ayuda, pide hablar con su supervisor/a, o llama al Ombudsman (defensor del pueblo) de DCS al 1-877-527-0765. Tú decides a quién le cuentas sobre ti y cuándo. Lo que le dices a tu abogado/a es privado, así que tu abogado/a puede ser una persona segura para empezar. Si alguna vez te sientes muy triste o solo/a, puedes llamar o enviar un mensaje al 988 a cualquier hora.",
    },
    answer1012: {
      en: "You should be safe and treated kindly, just the way you are. Nothing is wrong with you. No one should be mean to you or hurt you because of who you are. If someone is, tell a grown-up you trust — your lawyer, your caseworker, or a teacher. You will not be in trouble for telling.",
      es: "Debes estar seguro/a y que te traten con cariño, tal como eres. No hay nada malo en ti. Nadie debe ser malo contigo ni lastimarte por ser quien eres. Si alguien lo hace, dile a un adulto de confianza — tu abogado/a, tu trabajador/a de casos o un maestro/a. No te vas a meter en problemas por decirlo.",
    },
    keywords: {
      en: ["lgbtq", "lgbt", "gay", "lesbian", "bi", "bisexual", "trans", "transgender", "queer", "nonbinary", "non binary", "pronouns", "my name", "coming out", "come out", "gender", "i like boys", "i like girls", "they make fun of me", "homophobic", "respect", "lgtbq", "lgbtq+"],
      es: ["lgbtq", "lgbt", "gay", "lesbiana", "bisexual", "trans", "transgenero", "queer", "no binario", "pronombres", "mi nombre", "salir del closet", "genero", "me gustan los chicos", "me gustan las chicas", "se burlan de mi", "respeto"],
    },
    category: "rights",
    ageBands: ["10-12","13-15","16-17","18-21"],
    relatedIds: ["q-what-are-my-rights","q-rights-ignored","q-feel-unsafe-placement"],
  },

  {
    id: "q-pregnant-or-parenting",
    question: {
      en: "I'm pregnant or I have a baby. What help can I get?",
      es: "Estoy embarazada o tengo un bebé. ¿Qué ayuda puedo recibir?",
    },
    answer: {
      en: "You are not in trouble, and you do not have to handle this alone. You can get health care for you and your baby. Tell your caseworker and your lawyer as soon as you feel ready, so they can help you see a doctor and plan. You have choices, and the adults on your case should explain them without pushing you. Being in foster care does not mean your baby is in foster care too. Ask your lawyer how this works for you, and ask your caseworker about a home where you and your baby can stay together, parenting classes, and help with things like diapers and child care. This is true if you are going to be a dad, too. Your lawyer can explain your rights as a parent.",
      es: "No estás en problemas, y no tienes que pasar por esto solo/a. Puedes recibir atención médica para ti y para tu bebé. Dile a tu trabajador/a de casos y a tu abogado/a en cuanto te sientas listo/a, para que te ayuden a ver a un doctor y a hacer un plan. Tienes opciones, y los adultos de tu caso deben explicártelas sin presionarte. Que tú estés en cuidado de crianza no quiere decir que tu bebé también lo esté. Pregúntale a tu abogado/a cómo funciona esto en tu caso, y pregúntale a tu trabajador/a de casos por un hogar donde tú y tu bebé puedan estar juntos, clases para padres y ayuda con cosas como pañales y cuidado de niños. Esto también aplica si vas a ser papá. Tu abogado/a puede explicarte tus derechos como mamá o papá.",
    },
    keywords: {
      en: ["pregnant", "pregnancy", "baby", "my baby", "having a baby", "im pregnant", "teen mom", "teen dad", "teen parent", "parenting", "i have a kid", "my child", "my son", "my daughter", "will they take my baby", "prenatal", "diapers", "daycare", "child care", "pregnet", "pregnate", "prego"],
      es: ["embarazada", "embarazo", "bebe", "mi bebe", "voy a tener un bebe", "estoy embarazada", "mama adolescente", "papa adolescente", "tengo un hijo", "tengo una hija", "mi hijo", "mi hija", "me van a quitar a mi bebe", "prenatal", "pañales", "guarderia", "cuidado de niños", "enbarazada"],
    },
    category: "rights",
    ageBands: ["13-15","16-17","18-21"],
    relatedIds: ["q-what-does-attorney-do","q-caseworker-role","q-what-is-ahcccs-yati"],
  },

  {
    id: "q-what-is-severance",
    question: {
      en: "What does it mean if my parents' rights are ended (severance)?",
      es: "¿Qué significa que terminen los derechos de mis padres (severance)?",
    },
    answer: {
      en: "Sometimes a judge decides that a child cannot safely go back home, even after the parents were given time and help. The judge can then end the parents' legal rights. Adults may call this \"termination of parental rights,\" \"TPR,\" or \"severance.\" It means your parents no longer make legal decisions for you, and you could be adopted or have a guardian. It is a big decision, and it does not happen fast. It is never your fault. It does not mean your parents do not love you, and it is okay to still love and miss them. You may have big feelings about it — sad, mad, relieved, or all of these. Tell your lawyer what you want. Ask if you can still see or talk to your parents, brothers, sisters, and other family. Ask your caseworker about someone to talk to about your feelings.",
      es: "A veces un juez decide que un niño o joven no puede volver a su casa de forma segura, aun después de darles tiempo y ayuda a los padres. Entonces el juez puede terminar los derechos legales de los padres. Los adultos le dicen \"terminación de la patria potestad,\" \"TPR\" o \"severance.\" Quiere decir que tus padres ya no toman decisiones legales por ti, y que podrías ser adoptado/a o tener un tutor. Es una decisión muy grande, y no pasa rápido. Nunca es tu culpa. No quiere decir que tus padres no te quieran, y está bien seguir queriéndolos y extrañándolos. Puedes sentir muchas cosas — tristeza, enojo, alivio, o todo junto. Dile a tu abogado/a lo que tú quieres. Pregunta si todavía puedes ver o hablar con tus padres, hermanos, hermanas y otros familiares. Pregúntale a tu trabajador/a de casos por alguien con quien hablar de lo que sientes.",
    },
    answer1012: {
      en: "Sometimes a judge decides that a kid cannot go back home, because it would not be safe. Then the judge says the parents are no longer in charge of that kid. Grown-ups call this \"severance.\" This is never your fault. It does not mean your mom or dad do not love you. It is okay to still love them and miss them. It is okay to feel sad, mad, or mixed up. Tell your lawyer or your caseworker how you feel and what you want. You can ask them, \"Can I still see my family?\"",
      es: "A veces un juez decide que un niño no puede volver a su casa, porque no sería seguro. Entonces el juez dice que los padres ya no están a cargo de ese niño. Los adultos le dicen \"severance.\" Esto nunca es tu culpa. No quiere decir que tu mamá o tu papá no te quieran. Está bien seguir queriéndolos y extrañarlos. Está bien sentirte triste, enojado/a o confundido/a. Dile a tu abogado/a o a tu trabajador/a de casos cómo te sientes y qué quieres. Puedes preguntarles: \"¿Todavía puedo ver a mi familia?\"",
    },
    keywords: {
      en: ["severance", "sever", "severed", "tpr", "termination", "terminate", "parental rights", "rights taken away", "lose their rights", "never go home", "cant go home", "adopted", "adoption", "will i be adopted", "guardian", "guardianship", "forever", "not my parents anymore", "severence", "terminaton"],
      es: ["severance", "terminacion", "terminar derechos", "patria potestad", "derechos de mis padres", "les quitaron sus derechos", "perder sus derechos", "nunca volver a casa", "no puedo volver a casa", "adoptado", "adoptada", "adopcion", "me van a adoptar", "tutor", "tutela", "para siempre", "ya no son mis padres"],
    },
    category: "case",
    ageBands: ["10-12","13-15","16-17"],
    relatedIds: ["q-what-is-reunification","q-what-is-permanency-hearing","q-contact-parents"],
  },

  {
    id: "q-juvenile-court-and-foster-care",
    question: {
      en: "I'm in foster care and I also got in trouble with the law. What now?",
      es: "Estoy en cuidado de crianza y también tengo un problema con la ley. ¿Qué pasa ahora?",
    },
    answer: {
      en: "Some young people have two court cases at the same time. One is the foster care case, which is about keeping you safe. The other is a juvenile court case, which is about something you are accused of doing. You have the right to a lawyer in each case. Sometimes it is the same lawyer, and often it is two different lawyers. Tell each lawyer about the other case, so they can work together and nothing surprises you. You may also have a probation officer as well as your caseworker. Before you answer questions from police or a probation officer about what happened, ask to talk to your lawyer first. Having two cases does not make you a bad person. Many young people in foster care go through this, and you still have all of your rights.",
      es: "Algunos jóvenes tienen dos casos en el tribunal al mismo tiempo. Uno es el caso de cuidado de crianza, que se trata de mantenerte seguro/a. El otro es un caso en el tribunal de menores, que se trata de algo que dicen que hiciste. Tienes derecho a un/a abogado/a en cada caso. A veces es la misma persona, y muchas veces son dos abogados diferentes. Cuéntale a cada abogado/a sobre el otro caso, para que trabajen juntos y nada te tome por sorpresa. También puedes tener un/a oficial de libertad condicional además de tu trabajador/a de casos. Antes de contestar preguntas de la policía o de un/a oficial de libertad condicional sobre lo que pasó, pide hablar primero con tu abogado/a. Tener dos casos no te hace una mala persona. Muchos jóvenes en cuidado de crianza pasan por esto, y sigues teniendo todos tus derechos.",
    },
    keywords: {
      en: ["juvenile", "juvie", "juvenile court", "delinquency", "probation", "probation officer", "po", "arrested", "got arrested", "police", "cops", "charges", "in trouble with the law", "detention", "locked up", "two cases", "two lawyers", "public defender", "crime", "ticket", "juvinile", "probashun"],
      es: ["tribunal de menores", "corte juvenil", "juvenil", "delincuencia", "libertad condicional", "probatoria", "oficial de probatoria", "arrestado", "arrestada", "me arrestaron", "policia", "cargos", "problemas con la ley", "detencion", "encerrado", "dos casos", "dos abogados", "defensor publico", "delito", "multa"],
    },
    category: "court",
    ageBands: ["13-15","16-17"],
    relatedIds: ["q-right-to-lawyer","q-what-does-attorney-do","q-what-is-dependency-hearing"],
  },

  {
    id: "q-make-a-complaint",
    question: {
      en: "How do I make a complaint?",
      es: "¿Cómo presento una queja?",
    },
    answer: {
      en: "You are allowed to complain when something is not right. You will not be in trouble for it. Here are the steps:\n\n1. Tell your caseworker what is wrong and what you want to change.\n2. If that does not fix it, ask to talk to your caseworker's supervisor.\n3. Still not fixed? Call the DCS (Department of Child Safety) Ombudsman at 1-877-527-0765. Their job is to listen to complaints about DCS.\n4. Tell your lawyer at any step. Your lawyer can bring the problem to the judge.\n\nIt helps to write down what happened and when. If you are not safe, do not wait — call 911, or the DCS hotline at 1-888-767-2445.",
      es: "Tienes permiso de quejarte cuando algo no está bien. No te vas a meter en problemas por eso. Estos son los pasos:\n\n1. Dile a tu trabajador/a de casos qué está mal y qué quieres que cambie.\n2. Si eso no lo arregla, pide hablar con el/la supervisor/a de tu trabajador/a de casos.\n3. ¿Todavía no se arregla? Llama al Ombudsman (defensor del pueblo) de DCS (Departamento de Seguridad Infantil) al 1-877-527-0765. Su trabajo es escuchar quejas sobre DCS.\n4. Dile a tu abogado/a en cualquier paso. Tu abogado/a puede llevar el problema ante el juez.\n\nAyuda escribir qué pasó y cuándo. Si no estás seguro/a, no esperes — llama al 911, o a la línea de DCS al 1-888-767-2445.",
    },
    answer1012: {
      en: "If something is not right, you can say so. You will not be in trouble. First, tell your caseworker. If that does not help, tell your lawyer or another grown-up you trust, like a teacher. They can help you tell the right people, even the judge. If you are not safe, call 911 or 1-888-767-2445 right away.",
      es: "Si algo no está bien, lo puedes decir. No te vas a meter en problemas. Primero, dile a tu trabajador/a de casos. Si eso no ayuda, dile a tu abogado/a o a otro adulto de confianza, como un maestro/a. Ellos te pueden ayudar a decírselo a las personas correctas, hasta al juez. Si no estás seguro/a, llama al 911 o al 1-888-767-2445 de inmediato.",
    },
    keywords: {
      en: ["complaint", "complain", "make a complaint", "file a complaint", "grievance", "report", "report my caseworker", "report my foster parent", "report group home", "report staff", "who do i tell", "tell on", "not fair", "unfair", "nobody listens", "complant", "complaint form"],
      es: ["queja", "quejarme", "presentar una queja", "poner una queja", "reportar", "reportar a mi trabajador", "reportar a mi padre de crianza", "reportar al hogar grupal", "reportar al personal", "a quien le digo", "no es justo", "injusto", "nadie me escucha"],
    },
    category: "rights",
    ageBands: ["10-12","13-15","16-17","18-21"],
    relatedIds: ["q-rights-ignored","q-what-is-ombudsman","q-what-does-attorney-do"],
  },

]; // end QUESTIONS
