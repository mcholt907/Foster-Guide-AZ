import type { AgeBandKey } from "../lib/prefs";

/**
 * Band-specific content for the Future Plan page.
 *
 * Voice: plain language, 6th-grade reading level, speak to "you".
 * Program facts are kept soft on purpose ("ask your caseworker about…")
 * wherever rules, amounts, or dates can change. No dates that go stale.
 */

type L = { en: string; es: string };

export type FutureIcon =
  | "school"
  | "star"
  | "plan"
  | "skills"
  | "later"
  | "meeting"
  | "id"
  | "health"
  | "home"
  | "return"
  | "tuition"
  | "papers";

export interface FutureCard {
  id: string;
  icon: FutureIcon;
  title: L;
  body: L;
  /** A short "what to say / what to do" line, shown in a highlighted box. */
  tryThis?: L;
}

export interface FutureBandContent {
  /** Replaces the generic hero subtitle. */
  subtitle: L;
  cardsHeading: L;
  cardsIntro: L;
  cards: FutureCard[];
  /** Show the Extended Foster Care + Education and Training Voucher sections. */
  showPrograms: boolean;
  /** Show the full "how to get it" documents grid. */
  showDocs: boolean;
  /** Shown instead of the documents grid when showDocs is false. */
  docsNote?: L;
  askHeading: L;
  askIntro: L;
  ask: { who: L; why: L }[];
}

export type TeenBand = Exclude<AgeBandKey, "10-12">;

export const FUTURE_LABELS = {
  tryThis:   { en: "Try this",                   es: "Prueba esto" },
  ifApplies: { en: "If this applies to you",     es: "Si esto aplica para ti" },
  docsLater: { en: "Your papers",                es: "Tus papeles" },
} satisfies Record<string, L>;

export const FUTURE_BANDS: Record<TeenBand, FutureBandContent> = {
  // ── 13-15: light and hopeful ──────────────────────────────────────────────
  "13-15": {
    subtitle: {
      en: "You don't have to have it all figured out. This page is about small things you can do now, and who can help.",
      es: "No tienes que tenerlo todo resuelto. Esta página habla de cosas pequeñas que puedes hacer ahora, y de quién te puede ayudar.",
    },
    cardsHeading: { en: "Good things to do now", es: "Cosas buenas para hacer ahora" },
    cardsIntro: {
      en: "There is no rush and no test. Pick one thing that sounds good to you.",
      es: "No hay prisa ni examen. Escoge una cosa que te suene bien.",
    },
    cards: [
      {
        id: "school",
        icon: "school",
        title: { en: "Keep going at school", es: "Sigue adelante en la escuela" },
        body: {
          en: "School opens doors later. If you moved and fell behind, that is not your fault. You can ask for a tutor or extra help to catch up.",
          es: "La escuela te abre puertas más adelante. Si te cambiaste de casa y te atrasaste, no es tu culpa. Puedes pedir un tutor o ayuda extra para ponerte al día.",
        },
        tryThis: {
          en: "Tell your caseworker or school counselor: \"I need help with a class.\"",
          es: "Dile a tu trabajador/a de casos o a tu consejero/a escolar: \"Necesito ayuda con una clase.\"",
        },
      },
      {
        id: "likes",
        icon: "star",
        title: { en: "Find what you like", es: "Descubre lo que te gusta" },
        body: {
          en: "Sports, art, music, clubs, cooking, fixing things — it all counts. Trying things helps you learn what you are good at. You can ask to join activities like other kids your age.",
          es: "Deportes, arte, música, clubes, cocinar, arreglar cosas — todo cuenta. Probar cosas te ayuda a saber en qué eres bueno/a. Puedes pedir participar en actividades como otros jóvenes de tu edad.",
        },
      },
      {
        id: "plan-at-14",
        icon: "plan",
        title: { en: "At 14, you help write your plan", es: "A los 14, ayudas a escribir tu plan" },
        body: {
          en: "Your case plan is the plan for your life in foster care. Starting at 14, you should get to help make it. You can say what you want for school, where you live, and your future.",
          es: "Tu plan de caso es el plan para tu vida en el cuidado de crianza. Desde los 14 años, debes poder ayudar a hacerlo. Puedes decir lo que quieres para la escuela, dónde vives y tu futuro.",
        },
        tryThis: {
          en: "Ask your caseworker: \"When is my next case plan meeting? I want to be there.\"",
          es: "Pregúntale a tu trabajador/a de casos: \"¿Cuándo es mi próxima reunión del plan de caso? Quiero estar ahí.\"",
        },
      },
      {
        id: "skills",
        icon: "skills",
        title: { en: "Learn everyday skills", es: "Aprende cosas de la vida diaria" },
        body: {
          en: "Cooking a meal, doing laundry, saving a little money, riding the bus. Nobody is born knowing these. Ask the adults you live with to show you, or ask your caseworker about life skills classes.",
          es: "Cocinar algo, lavar tu ropa, ahorrar un poco de dinero, usar el autobús. Nadie nace sabiendo estas cosas. Pídeles a los adultos con quienes vives que te enseñen, o pregúntale a tu trabajador/a de casos por clases de habilidades para la vida.",
        },
      },
      {
        id: "later",
        icon: "later",
        title: { en: "Good to know for later", es: "Bueno saberlo para después" },
        body: {
          en: "Help does not stop when you turn 18. Arizona has help with housing, health care, and money for school for young adults who were in foster care. You do not need to do anything about it yet. This page will show you more when you are 16.",
          es: "La ayuda no se acaba cuando cumples 18. Arizona tiene ayuda con vivienda, atención médica y dinero para estudiar para jóvenes adultos que estuvieron en cuidado de crianza. Todavía no tienes que hacer nada. Esta página te mostrará más cuando tengas 16.",
        },
      },
    ],
    showPrograms: false,
    showDocs: false,
    docsNote: {
      en: "Papers like your birth certificate and Social Security card matter later. For now, your caseworker keeps them safe for you. You can ask to see them any time.",
      es: "Papeles como tu acta de nacimiento y tu tarjeta de Seguro Social son importantes más adelante. Por ahora, tu trabajador/a de casos los guarda por ti. Puedes pedir verlos cuando quieras.",
    },
    askHeading: { en: "Who you can ask", es: "A quién le puedes preguntar" },
    askIntro: {
      en: "You are not supposed to do this alone. These people can help.",
      es: "No tienes que hacer esto solo/a. Estas personas te pueden ayudar.",
    },
    ask: [
      {
        who: { en: "Your caseworker", es: "Tu trabajador/a de casos" },
        why: { en: "For your case plan, activities, tutoring, and life skills classes.", es: "Para tu plan de caso, actividades, tutorías y clases de habilidades para la vida." },
      },
      {
        who: { en: "Your lawyer", es: "Tu abogado/a" },
        why: { en: "To make sure the judge hears what you want.", es: "Para que el juez escuche lo que tú quieres." },
      },
      {
        who: { en: "Your school counselor or a teacher", es: "Tu consejero/a escolar o un maestro/a" },
        why: { en: "For classes, credits, and clubs.", es: "Para clases, créditos y clubes." },
      },
      {
        who: { en: "The adults you live with", es: "Los adultos con quienes vives" },
        why: { en: "To teach you everyday skills and get you to activities.", es: "Para enseñarte cosas de la vida diaria y llevarte a tus actividades." },
      },
    ],
  },

  // ── 16-17: getting ready ──────────────────────────────────────────────────
  "16-17": {
    subtitle: {
      en: "Turning 18 is a big step, and you do not take it alone. Here is what to ask for, and when.",
      es: "Cumplir 18 es un paso grande, y no lo das solo/a. Aquí está qué pedir, y cuándo.",
    },
    cardsHeading: { en: "Your get-ready list", es: "Tu lista para prepararte" },
    cardsIntro: {
      en: "You do not have to do these all at once. Start with one, and ask for help.",
      es: "No tienes que hacer todo de una vez. Empieza con una cosa y pide ayuda.",
    },
    cards: [
      {
        id: "transition-meeting",
        icon: "meeting",
        title: { en: "Ask for a meeting about your plan for 18", es: "Pide una reunión sobre tu plan para los 18" },
        body: {
          en: "You should have your own plan for where you will live, your health coverage, school, work, and who supports you. It is called a transition plan. It is your plan, so you help write it. It should be finished in the 90 days before you turn 18. Do not wait until then to start.",
          es: "Debes tener tu propio plan sobre dónde vas a vivir, tu seguro médico, la escuela, el trabajo y quién te apoya. Se llama plan de transición. Es tu plan, así que tú ayudas a escribirlo. Debe estar listo en los 90 días antes de que cumplas 18. No esperes hasta entonces para empezar.",
        },
        tryThis: {
          en: "Ask your caseworker: \"Can we set up a meeting about my transition plan?\"",
          es: "Pregúntale a tu trabajador/a de casos: \"¿Podemos hacer una reunión sobre mi plan de transición?\"",
        },
      },
      {
        id: "efc-choice",
        icon: "home",
        title: { en: "Staying in foster care after 18 is your choice", es: "Quedarte en cuidado de crianza después de los 18 es tu decisión" },
        body: {
          en: "Extended Foster Care means you can choose to stay in foster care after 18, until you turn 21. It does not happen by itself. You sign an agreement to join. Start asking about it at 16, not at 17½, so there is time to plan where you will live.",
          es: "El Cuidado de Crianza Extendido quiere decir que puedes escoger quedarte en cuidado de crianza después de los 18, hasta cumplir 21. No pasa solo. Firmas un acuerdo para entrar. Empieza a preguntar a los 16, no a los 17 años y medio, para que haya tiempo de planear dónde vas a vivir.",
        },
        tryThis: {
          en: "Ask your caseworker and your lawyer: \"What do I need to do to sign up for Extended Foster Care?\"",
          es: "Pregúntales a tu trabajador/a de casos y a tu abogado/a: \"¿Qué tengo que hacer para inscribirme en el Cuidado de Crianza Extendido?\"",
        },
      },
      {
        id: "id-license",
        icon: "id",
        title: { en: "Get your ID or driver's license", es: "Consigue tu identificación o licencia de conducir" },
        body: {
          en: "You need a photo ID for jobs, school, and a bank account. Your caseworker should help you get one. If you want to learn to drive, ask your caseworker about driver's ed, a permit, and help with the cost.",
          es: "Necesitas una identificación con foto para trabajar, estudiar y abrir una cuenta de banco. Tu trabajador/a de casos debe ayudarte a conseguirla. Si quieres aprender a manejar, pregúntale a tu trabajador/a de casos por clases de manejo, el permiso y ayuda con el costo.",
        },
      },
      {
        id: "health-16",
        icon: "health",
        title: { en: "Your health coverage can keep going", es: "Tu seguro médico puede continuar" },
        body: {
          en: "If you are in foster care when you turn 18, you can keep free health coverage until age 26. It comes from AHCCCS, Arizona's Medicaid health plan. Ask your caseworker to make sure it is set up before your birthday.",
          es: "Si estás en cuidado de crianza cuando cumples 18, puedes seguir con seguro médico gratis hasta los 26 años. Viene de AHCCCS, el plan de salud Medicaid de Arizona. Pídele a tu trabajador/a de casos que lo deje listo antes de tu cumpleaños.",
        },
      },
      {
        id: "school-money-16",
        icon: "tuition",
        title: { en: "Thinking about college or job training?", es: "¿Piensas en la universidad o en capacitarte para un trabajo?" },
        body: {
          en: "There is money to help you, and you do not pay it back. Arizona has a tuition waiver for foster youth, which means public colleges may not charge you tuition. There is also the Education and Training Voucher, explained below. Tell your school counselor you are in foster care and ask what you can apply for.",
          es: "Hay dinero para ayudarte, y no lo tienes que devolver. Arizona tiene una exención de matrícula para jóvenes de cuidado de crianza, que quiere decir que las universidades públicas tal vez no te cobren la matrícula. También está el Bono de Educación y Capacitación, que se explica abajo. Dile a tu consejero/a escolar que estás en cuidado de crianza y pregunta qué puedes solicitar.",
        },
      },
    ],
    showPrograms: true,
    showDocs: true,
    askHeading: { en: "Who you can ask", es: "A quién le puedes preguntar" },
    askIntro: {
      en: "It is their job to help you get ready. You are not bothering them.",
      es: "Su trabajo es ayudarte a prepararte. No los estás molestando.",
    },
    ask: [
      {
        who: { en: "Your caseworker", es: "Tu trabajador/a de casos" },
        why: { en: "For your transition plan, your papers, Extended Foster Care, and life skills classes.", es: "Para tu plan de transición, tus papeles, el Cuidado de Crianza Extendido y clases de habilidades para la vida." },
      },
      {
        who: { en: "Your lawyer", es: "Tu abogado/a" },
        why: { en: "If your plan is not getting done, your lawyer can tell the judge.", es: "Si tu plan no avanza, tu abogado/a se lo puede decir al juez." },
      },
      {
        who: { en: "Your school counselor", es: "Tu consejero/a escolar" },
        why: { en: "For credits, graduation, and money for college or training.", es: "Para créditos, graduación y dinero para la universidad o capacitación." },
      },
      {
        who: { en: "The judge", es: "El juez" },
        why: { en: "You can speak at your hearing and say what you need before you turn 18.", es: "Puedes hablar en tu audiencia y decir lo que necesitas antes de cumplir 18." },
      },
    ],
  },

  // ── 18-21: what you can use right now ─────────────────────────────────────
  "18-21": {
    subtitle: {
      en: "You are an adult now, and you still have help. Here is what you can use, and who to ask.",
      es: "Ya eres adulto/a, y todavía tienes ayuda. Aquí está lo que puedes usar, y a quién preguntarle.",
    },
    cardsHeading: { en: "Help you can use now", es: "Ayuda que puedes usar ahora" },
    cardsIntro: {
      en: "Rules and amounts can change, so always ask. Asking costs nothing.",
      es: "Las reglas y las cantidades pueden cambiar, así que siempre pregunta. Preguntar no cuesta nada.",
    },
    cards: [
      {
        id: "efc-basics",
        icon: "home",
        title: { en: "Extended Foster Care, until you turn 21", es: "Cuidado de Crianza Extendido, hasta cumplir 21" },
        body: {
          en: "If you were in foster care when you turned 18, you can choose to stay in Extended Foster Care. You sign an agreement and make a plan with a worker or coach. You live in a place the Department of Child Safety (DCS) approves, which can be more on your own than before. You may hear it called the Young Adult Program. Ask what you need to be doing, like school or work, to stay in it.",
          es: "Si estabas en cuidado de crianza cuando cumpliste 18, puedes escoger quedarte en el Cuidado de Crianza Extendido. Firmas un acuerdo y haces un plan con un/a trabajador/a o guía. Vives en un lugar que el Departamento de Seguridad Infantil (DCS) aprueba, que puede ser más independiente que antes. A veces le dicen Programa para Adultos Jóvenes (Young Adult Program). Pregunta qué tienes que estar haciendo, como estudiar o trabajar, para seguir en el programa.",
        },
      },
      {
        id: "come-back",
        icon: "return",
        title: { en: "Left foster care? You can ask to come back", es: "¿Saliste del cuidado de crianza? Puedes pedir regresar" },
        body: {
          en: "If you left at 18 or later and things got hard, that is not a failure. You can ask to come back into Extended Foster Care any time before you turn 21. You have to live in Arizona.",
          es: "Si saliste a los 18 o después y las cosas se pusieron difíciles, no es un fracaso. Puedes pedir regresar al Cuidado de Crianza Extendido en cualquier momento antes de cumplir 21. Tienes que vivir en Arizona.",
        },
        tryThis: {
          en: "Call your old caseworker or your lawyer and say: \"I want to ask about coming back to Extended Foster Care.\" No number for them? Call 2-1-1 and ask how to reach the DCS Young Adult Program.",
          es: "Llama a tu antiguo/a trabajador/a de casos o a tu abogado/a y di: \"Quiero preguntar cómo regresar al Cuidado de Crianza Extendido.\" ¿No tienes su número? Llama al 2-1-1 y pregunta cómo comunicarte con el Programa para Adultos Jóvenes de DCS.",
        },
      },
      {
        id: "health-26",
        icon: "health",
        title: { en: "Free health coverage until 26", es: "Seguro médico gratis hasta los 26" },
        body: {
          en: "If you were in foster care when you turned 18, you can get free health coverage until age 26. It is called Young Adult Transitional Insurance. It comes from AHCCCS, Arizona's Medicaid health plan. It does not depend on how much money you make. If your coverage stopped, you can sign up again.",
          es: "Si estabas en cuidado de crianza cuando cumpliste 18, puedes tener seguro médico gratis hasta los 26 años. Se llama Seguro de Transición para Adultos Jóvenes (Young Adult Transitional Insurance). Viene de AHCCCS, el plan de salud Medicaid de Arizona. No depende de cuánto dinero ganes. Si tu seguro se detuvo, te puedes inscribir otra vez.",
        },
        tryThis: {
          en: "Ask your caseworker, or apply at healthearizonaplus.gov and say you were in foster care at 18.",
          es: "Pregúntale a tu trabajador/a de casos, o solicita en healthearizonaplus.gov y di que estabas en cuidado de crianza a los 18.",
        },
      },
      {
        id: "tuition-waiver",
        icon: "tuition",
        title: { en: "Arizona tuition waiver", es: "Exención de matrícula de Arizona" },
        body: {
          en: "A waiver means the school does not charge you tuition. Arizona has one for young people who were in foster care at 14 or older. It works at Arizona public universities and community colleges. There is an age limit and a few rules, like filling out the FAFSA (the free form for school money) each year.",
          es: "Una exención quiere decir que la escuela no te cobra la matrícula. Arizona tiene una para jóvenes que estuvieron en cuidado de crianza a los 14 años o después. Sirve en las universidades públicas y colegios comunitarios de Arizona. Hay un límite de edad y algunas reglas, como llenar la FAFSA (el formulario gratis para pedir dinero para estudiar) cada año.",
        },
        tryThis: {
          en: "Ask your school's financial aid office: \"How do I get the foster care tuition waiver?\"",
          es: "Pregunta en la oficina de ayuda financiera de tu escuela: \"¿Cómo consigo la exención de matrícula para jóvenes de cuidado de crianza?\"",
        },
      },
      {
        id: "housing-help",
        icon: "home",
        title: { en: "Help paying for a place to live", es: "Ayuda para pagar un lugar donde vivir" },
        body: {
          en: "There are housing programs just for young adults who were in foster care. One is the Foster Youth to Independence voucher, which can help pay rent for a while. You cannot apply for it by yourself. DCS has to send your name to the housing office. Not every area has them, so ask.",
          es: "Hay programas de vivienda solo para jóvenes adultos que estuvieron en cuidado de crianza. Uno es el vale Foster Youth to Independence, que puede ayudarte a pagar la renta por un tiempo. No lo puedes solicitar tú solo/a. DCS tiene que mandar tu nombre a la oficina de vivienda. No hay en todas las zonas, así que pregunta.",
        },
        tryThis: {
          en: "Ask your caseworker, or call 2-1-1: \"Can I be referred for a Foster Youth to Independence housing voucher?\"",
          es: "Pregúntale a tu trabajador/a de casos, o llama al 2-1-1: \"¿Me pueden referir para un vale de vivienda Foster Youth to Independence?\"",
        },
      },
      {
        id: "leaving-papers",
        icon: "papers",
        title: { en: "Leaving care? Get your papers first", es: "¿Vas a salir? Primero consigue tus papeles" },
        body: {
          en: "Before you leave foster care, ask for your own copies of the papers listed below. Check that your health coverage is set up, and that you know where you will live. If something is missing, tell your caseworker and your lawyer before your case closes.",
          es: "Antes de salir del cuidado de crianza, pide tus propias copias de los papeles de la lista de abajo. Revisa que tu seguro médico esté listo y que sepas dónde vas a vivir. Si falta algo, dile a tu trabajador/a de casos y a tu abogado/a antes de que cierren tu caso.",
        },
      },
    ],
    showPrograms: true,
    showDocs: true,
    askHeading: { en: "Who you can ask", es: "A quién le puedes preguntar" },
    askIntro: {
      en: "You do not have to know everything. You just have to ask.",
      es: "No tienes que saberlo todo. Solo tienes que preguntar.",
    },
    ask: [
      {
        who: { en: "Your caseworker or coach", es: "Tu trabajador/a de casos o guía" },
        why: { en: "For Extended Foster Care, housing, health coverage, and your papers.", es: "Para el Cuidado de Crianza Extendido, vivienda, seguro médico y tus papeles." },
      },
      {
        who: { en: "Your lawyer", es: "Tu abogado/a" },
        why: { en: "If you are told no and do not think it is right.", es: "Si te dicen que no y no te parece correcto." },
      },
      {
        who: { en: "2-1-1 Arizona (call 2-1-1)", es: "2-1-1 Arizona (llama al 2-1-1)" },
        why: { en: "For housing, food, and other help near you, any time.", es: "Para vivienda, comida y otra ayuda cerca de ti, a cualquier hora." },
      },
      {
        who: { en: "Your school's financial aid office", es: "La oficina de ayuda financiera de tu escuela" },
        why: { en: "For the tuition waiver and other money for school.", es: "Para la exención de matrícula y otro dinero para estudiar." },
      },
    ],
  },
};

// ── 10-12: reassuring, no deadlines ─────────────────────────────────────────

export const FUTURE_1012 = {
  title:    { en: "Your Future", es: "Tu futuro" },
  subtitle: {
    en: "Your future is yours. You have lots of time, and grown-ups to help.",
    es: "Tu futuro es tuyo. Tienes mucho tiempo, y adultos que te ayudan.",
  },
  intro: {
    en: "You do not have to plan your whole life right now. That is not your job. Your job is to be a kid, learn, and find out what you like.",
    es: "No tienes que planear toda tu vida ahora. Ese no es tu trabajo. Tu trabajo es ser niño/a, aprender y descubrir lo que te gusta.",
  },
  cards: [
    {
      id: "school",
      icon: "school" as FutureIcon,
      title: { en: "School", es: "La escuela" },
      body: {
        en: "School helps you get ready for what you want to do later. If school is hard, or you changed schools, you can ask for help. Lots of kids do.",
        es: "La escuela te ayuda a prepararte para lo que quieras hacer después. Si la escuela es difícil, o cambiaste de escuela, puedes pedir ayuda. Muchos niños lo hacen.",
      },
    },
    {
      id: "likes",
      icon: "star" as FutureIcon,
      title: { en: "Things you like and are good at", es: "Cosas que te gustan y que haces bien" },
      body: {
        en: "Drawing, sports, music, animals, building things, helping people. What do you like? What are you good at? Try new things. You can ask to join a team, a club, or a class.",
        es: "Dibujar, deportes, música, animales, construir cosas, ayudar a la gente. ¿Qué te gusta? ¿Qué haces bien? Prueba cosas nuevas. Puedes pedir entrar a un equipo, un club o una clase.",
      },
    },
    {
      id: "grown-ups",
      icon: "meeting" as FutureIcon,
      title: { en: "Grown-ups you can ask", es: "Adultos a quienes les puedes preguntar" },
      body: {
        en: "You can ask your caseworker, your lawyer, your teacher, or the grown-ups you live with. You can ask, \"What will happen next?\" or \"Can I try this?\" It is okay to ask more than once.",
        es: "Puedes preguntarle a tu trabajador/a de casos, a tu abogado/a, a tu maestro/a o a los adultos con quienes vives. Puedes preguntar: \"¿Qué va a pasar después?\" o \"¿Puedo probar esto?\" Está bien preguntar más de una vez.",
      },
    },
  ] as FutureCard[],
  closing: {
    en: "When you are older, this page will show you more. For now, there is nothing you have to do.",
    es: "Cuando seas más grande, esta página te mostrará más. Por ahora, no hay nada que tengas que hacer.",
  },
};
