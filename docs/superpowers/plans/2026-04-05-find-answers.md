# Find Answers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the live AI chat page at `/[lang]/ask` with a fully static, offline-capable "Find Answers" page — topic-chip browse + fuzzy search over ~45 pre-written, age-band-tailored Q&A entries.

**Architecture:** A new `questions.ts` data file holds all Q&A entries typed as `QAEntry[]`. The page imports Fuse.js to run client-side search. The page has two mutually exclusive display modes (browse/search) driven by a single `query` state value; the answer modal uses the existing `Modal` component from `ui.tsx`.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, Fuse.js, lucide-react, existing `Modal`/`ScreenHero`/`SafeNotice` from `ui.tsx`.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `web/src/data/questions.ts` | **Create** | `QAEntry` type, `QACategory` type, `TOPIC_CONFIG` array, all 45 Q&A entries |
| `web/src/app/[lang]/ask/page.tsx` | **Rewrite** | Find Answers UI — Compass card, search bar, topic chips, question list, answer modal |
| `web/src/app/[lang]/ask/layout.tsx` | **Edit** | Updated SEO title + description (EN + ES) |
| `web/src/lib/i18n.ts` | **Edit** | Replace ask/chat strings with find-answers strings; update `nav_ask` |
| `web/package.json` | **Edit** | Add `fuse.js` dependency |

---

## Task 1: Install Fuse.js

**Files:**
- Modify: `web/package.json`

- [ ] **Step 1: Install the package**

```bash
cd web && npm install fuse.js
```

Expected: `fuse.js` appears under `dependencies` in `web/package.json`.

- [ ] **Step 2: Verify TypeScript types are included**

Fuse.js ships its own types. Confirm:

```bash
ls web/node_modules/fuse.js/dist/fuse.d.ts
```

Expected: file exists (no `@types/fuse.js` needed).

- [ ] **Step 3: Commit**

```bash
cd web && git add package.json package-lock.json && git commit -m "chore: add fuse.js for client-side search"
```

---

## Task 2: Create `questions.ts` — types, topic config, and rights + case entries

**Files:**
- Create: `web/src/data/questions.ts`

- [ ] **Step 1: Create the file with types, TOPIC_CONFIG, and first two categories**

Create `web/src/data/questions.ts`:

```ts
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
  category:    QACategory;
  ageBands:    AgeBandKey[];
  citations?:  string[];
  relatedIds?: string[];
}

export interface TopicConfig {
  category: QACategory;
  label:    { en: string; es: string };
  bands:    AgeBandKey[];
}

export const TOPIC_CONFIG: TopicConfig[] = [
  { category: "rights",    label: { en: "My Rights",           es: "Mis Derechos"          }, bands: ["10-12","13-15","16-17","18-21"] },
  { category: "case",      label: { en: "My Case",             es: "Mi Caso"               }, bands: ["10-12","13-15","16-17","18-21"] },
  { category: "court",     label: { en: "Court & Hearings",    es: "Tribunal"              }, bands: ["13-15","16-17","18-21"] },
  { category: "safety",    label: { en: "Staying Safe",        es: "Mantenerse Seguro/a"   }, bands: ["10-12","13-15"] },
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
      es: "¿Qué derechos tengo en el cuidado adoptivo?",
    },
    answer: {
      en: "Arizona law (A.R.S. §8-529) gives you specific legal rights in foster care. These aren't just rules on paper — they're guarantees that belong to you. Some of the most important ones: you have the right to be treated with respect, to know what's in your case plan, to see your siblings (unless a judge says otherwise), and to keep your personal belongings. If you ever feel like one of your rights is being ignored, you don't have to stay quiet. You can tell your caseworker, then their supervisor, and then the DCS ombudsman if needed.",
      es: "La ley de Arizona (A.R.S. §8-529) te otorga derechos legales específicos en el cuidado adoptivo. Estos no son solo reglas en papel — son garantías que te pertenecen. Algunos de los más importantes: tienes derecho a ser tratado/a con respeto, a saber qué hay en tu plan de caso, a ver a tus hermanos (a menos que un juez diga lo contrario) y a conservar tus pertenencias. Si sientes que alguno de tus derechos está siendo ignorado, no tienes que quedarte callado/a.",
    },
    category: "rights",
    ageBands: ["10-12","13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-rights-ignored","q-case-plan-input"],
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
    category: "rights",
    ageBands: ["10-12","13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-are-my-rights","q-rights-ignored"],
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
    category: "rights",
    ageBands: ["13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-are-my-rights","q-caseworker-role"],
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
    category: "rights",
    ageBands: ["13-15","16-17"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-are-my-rights","q-phone-taken-away"],
  },

  // ── CASE ────────────────────────────────────────────────────────────────────

  {
    id: "q-what-is-dcs",
    question: {
      en: "What is DCS?",
      es: "¿Qué es DCS?",
    },
    answer: {
      en: "DCS stands for the Department of Child Safety. It's the Arizona government agency in charge of your foster care case. DCS workers — called caseworkers or case managers — are the people responsible for making sure you're safe and that your needs are being met. They're the ones who create your case plan and work with the court.",
      es: "DCS son las siglas del Departamento de Seguridad Infantil. Es la agencia del gobierno de Arizona a cargo de tu caso de cuidado adoptivo. Los trabajadores de DCS — llamados trabajadores de casos — son las personas responsables de asegurarse de que estés seguro/a y que tus necesidades se estén cumpliendo.",
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
    category: "case",
    ageBands: ["10-12","13-15","16-17","18-21"],
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
    category: "case",
    ageBands: ["10-12","13-15","16-17","18-21"],
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
    category: "case",
    ageBands: ["13-15","16-17","18-21"],
    relatedIds: ["q-caseworker-role","q-rights-ignored"],
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
    category: "case",
    ageBands: ["10-12","13-15","16-17","18-21"],
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
    category: "case",
    ageBands: ["13-15","16-17","18-21"],
    citations: ["A.R.S. §8-529"],
    relatedIds: ["q-what-is-case-plan","q-speak-at-hearing"],
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd web && git add src/data/questions.ts && git commit -m "feat(data): add questions.ts with types, topic config, rights + case entries"
```

---

## Task 3: Add court, safety, corner entries to `questions.ts`

**Files:**
- Modify: `web/src/data/questions.ts`

- [ ] **Step 1: Append court, safety, and corner entries to the `QUESTIONS` array**

Add after the last case entry:

```ts
  // ── COURT ───────────────────────────────────────────────────────────────────

  {
    id: "q-what-is-dependency-hearing",
    question: {
      en: "What is a dependency hearing?",
      es: "¿Qué es una audiencia de dependencia?",
    },
    answer: {
      en: "A dependency hearing is a court meeting where a judge decides whether you need to be in foster care. It usually happens early in your case. The judge will hear from DCS and your family to figure out what's safest for you. You can attend, and your attorney will speak on your behalf. It can feel scary, but it's okay to ask your attorney to explain what's happening before you go.",
      es: "Una audiencia de dependencia es una reunión en el tribunal donde un juez decide si necesitas estar en el sistema de cuidado adoptivo. Generalmente ocurre al principio de tu caso. El juez escuchará a DCS y a tu familia para determinar qué es más seguro para ti.",
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
      es: "Una audiencia de permanencia es una reunión en el tribunal donde el juez decide el plan a largo plazo para dónde vivirás y quién te cuidará. Las opciones suelen ser reunificación (regresar a casa), adopción, tutela legal o cuidado adoptivo a largo plazo. Si tienes 12 años o más, el juez debe preguntarte qué quieres.",
    },
    category: "court",
    ageBands: ["13-15","16-17","18-21"],
    relatedIds: ["q-speak-at-hearing","q-what-is-reunification"],
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
      es: "La reunificación significa regresar a vivir con tu padre, madre o tutor/a. Es el objetivo hacia el que trabaja DCS cuando es seguro hacerlo. Para que ocurra, el tribunal necesita ver que los problemas que llevaron a tu colocación en cuidado adoptivo han sido resueltos.",
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
      es: "ICWA son las siglas de la Ley de Bienestar del Niño Indio. Es una ley federal que otorga protecciones adicionales a los niños nativos americanos en casos de cuidado adoptivo. Si eres miembro inscrito — o eres elegible para inscribirte — en una tribu reconocida federalmente, ICWA puede aplicarse a tu caso.",
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
      en: "Your safety is the most important thing. If you feel unsafe right now, you can call 911. If it's not an emergency but you're worried, call the DCS Child Abuse Hotline at 1-888-767-2445 — you can call any time, day or night. You can also tell your caseworker, teacher, school counselor, or any trusted adult. You deserve to feel safe where you live, and speaking up is the right thing to do.",
      es: "Tu seguridad es lo más importante. Si no te sientes seguro/a ahora mismo, puedes llamar al 911. Si no es una emergencia pero estás preocupado/a, llama a la línea directa de DCS al 1-888-767-2445 — puedes llamar en cualquier momento, de día o de noche.",
    },
    category: "safety",
    ageBands: ["10-12","13-15"],
    relatedIds: ["q-crisis-numbers","q-report-abuse"],
  },

  {
    id: "q-crisis-numbers",
    question: {
      en: "Who can I call if I need help right now?",
      es: "¿A quién puedo llamar si necesito ayuda ahora mismo?",
    },
    answer: {
      en: "You are not alone. Here are people who will pick up:\n\n• **Emergency:** Call 911\n• **Crisis Text Line:** Text HOME to 741741\n• **DCS Child Abuse Hotline:** 1-888-767-2445 (24/7)\n• **211 Arizona:** Call or text 2-1-1 for local help with shelter, food, and more\n• **Teen Line:** 1-800-852-8336 (evenings, teens helping teens)\n\nAny of these are safe to call. No one will get in trouble for reaching out.",
      es: "No estás solo/a. Aquí hay personas que atenderán:\n\n• **Emergencia:** Llama al 911\n• **Crisis Text Line:** Envía HOLA al 741741\n• **Línea directa de DCS:** 1-888-767-2445 (24/7)\n• **211 Arizona:** Llama o envía mensaje al 2-1-1 para ayuda local",
    },
    category: "safety",
    ageBands: ["10-12","13-15"],
    relatedIds: ["q-feel-unsafe-placement","q-report-abuse"],
  },

  {
    id: "q-report-abuse",
    question: {
      en: "What if someone is hurting me?",
      es: "¿Qué hago si alguien me está lastimando?",
    },
    answer: {
      en: "What's happening to you is not okay, and it is not your fault. You can report it — and you should. Call the DCS Child Abuse Hotline anytime at 1-888-767-2445. You can also call 911 if you're in danger right now. Tell a trusted adult — a teacher, counselor, or coach. You won't be in trouble for speaking up. You deserve to be safe.",
      es: "Lo que te está pasando no está bien, y no es tu culpa. Puedes reportarlo — y deberías hacerlo. Llama a la línea directa de DCS en cualquier momento al 1-888-767-2445. También puedes llamar al 911 si estás en peligro ahora mismo. Mereces estar seguro/a.",
    },
    category: "safety",
    ageBands: ["10-12","13-15"],
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
    category: "corner",
    ageBands: ["10-12","13-15"],
    relatedIds: ["q-right-to-lawyer","q-who-is-casa"],
  },

  {
    id: "q-what-is-ombudsman",
    question: {
      en: "What is a foster care ombudsman?",
      es: "¿Qué es el defensor del pueblo de cuidado adoptivo?",
    },
    answer: {
      en: "The DCS ombudsman is an independent person whose job is to help when DCS isn't treating you fairly or following the rules. They're not part of DCS — they're separate. If you've already talked to your caseworker and their supervisor and nothing has changed, the ombudsman is your next step. You can reach them at 1-877-527-0765. Calling is free and confidential.",
      es: "El defensor del pueblo de DCS es una persona independiente cuyo trabajo es ayudar cuando DCS no te está tratando justamente. No forma parte de DCS — es independiente. Si ya hablaste con tu trabajador/a de casos y su supervisor/a y nada cambió, el defensor del pueblo es tu siguiente paso. Puedes contactarlos al 1-877-527-0765.",
    },
    category: "corner",
    ageBands: ["13-15"],
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
      es: "Fostering Advocates Arizona es una organización sin fines de lucro dirigida por y para personas que han estado en el cuidado adoptivo. Pueden ayudarte a conocer tus derechos, navegar el sistema y conectarte con otros que entienden lo que estás pasando.",
    },
    category: "corner",
    ageBands: ["13-15"],
    relatedIds: ["q-rights-ignored","q-what-is-ombudsman"],
  },
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd web && git add src/data/questions.ts && git commit -m "feat(data): add court, safety, and corner Q&A entries"
```

---

## Task 4: Add documents, housing, turning18, benefits, school entries to `questions.ts`

**Files:**
- Modify: `web/src/data/questions.ts`

- [ ] **Step 1: Append the remaining four category groups to the `QUESTIONS` array**

Add after the last corner entry:

```ts
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
      es: "Antes de salir del cuidado adoptivo, deberías tener todo esto:\n\n• Acta de nacimiento\n• Tarjeta de Seguro Social\n• Identificación estatal o licencia de conducir\n• Registros de salud e inmunización\n• Registros educativos\n• Tarjeta de seguro (si tienes Medicaid/AHCCCS)\n\nDCS está obligado a proveerte todos estos documentos.",
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
      es: "Tienes más opciones de las que crees. Si te quedas en el Cuidado Adoptivo Extendido (EFC), tu vivienda aún está cubierta. Si estás saliendo del sistema, las opciones incluyen: programas de vivienda transitoria, vida independiente con asistencia de alquiler, quedarte con una familia de acogida anterior, o dormitorios universitarios.",
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
      es: "No tienes que dormir en la calle esta noche. Llama al 211 — pueden conectarte con un refugio de emergencia en tu área ahora mismo. En Phoenix, la línea de 24 horas de Tumbleweed es (602) 271-9904. Si todavía estás en cuidado adoptivo y tu colocación terminó, llama a la línea de emergencia de tu trabajador/a de casos de inmediato.",
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
      es: "Sí — si tu familia de acogida anterior está de acuerdo y es una situación segura, quedarte con ellos es una opción real. Puedes contactarlos directamente. Muchos jóvenes que salieron del sistema de cuidado adoptivo encuentran que sus antiguas familias están dispuestas a ofrecer un cuarto, una comida o apoyo continuo.",
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
      es: "¿Tengo que salir del cuidado adoptivo cuando cumpla 18?",
    },
    answer: {
      en: "No — you don't have to leave at 18. Arizona has a program called Extended Foster Care (EFC) that lets you stay in care until age 21. You can keep your housing, health coverage, and other supports. You just need to be doing one of the following: going to school, working, in a job training program, or have a medical condition that prevents work. Talk to your caseworker about signing up before you turn 18.",
      es: "No — no tienes que irte a los 18. Arizona tiene un programa llamado Cuidado Adoptivo Extendido (EFC) que te permite quedarte en el sistema hasta los 21 años. Puedes conservar tu vivienda, cobertura de salud y otros apoyos.",
    },
    category: "turning18",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-what-is-efc","q-efc-eligibility"],
  },

  {
    id: "q-what-is-efc",
    question: {
      en: "What is Extended Foster Care (EFC)?",
      es: "¿Qué es el Cuidado Adoptivo Extendido (EFC)?",
    },
    answer: {
      en: "Extended Foster Care — often called EFC — lets you voluntarily stay in the foster care system after age 18, up to age 21. While you're in EFC, you keep your housing placement, Medicaid health coverage, your caseworker, and access to independent living services. You have to be doing at least one of: attending school, working, in a vocational program, or have a documented medical reason you can't do any of those. EFC is one of the most valuable things you can use — don't give it up without a plan.",
      es: "El Cuidado Adoptivo Extendido — conocido como EFC — te permite quedarte voluntariamente en el sistema de cuidado adoptivo después de los 18 años, hasta los 21. Mientras estás en EFC, mantienes tu colocación, cobertura médica Medicaid, tu trabajador/a de casos y acceso a servicios de vida independiente.",
    },
    category: "turning18",
    ageBands: ["16-17","18-21"],
    relatedIds: ["q-do-i-have-to-leave-at-18","q-efc-eligibility"],
  },

  {
    id: "q-efc-eligibility",
    question: {
      en: "Am I eligible for Extended Foster Care?",
      es: "¿Soy elegible para el Cuidado Adoptivo Extendido?",
    },
    answer: {
      en: "You're eligible for EFC if you were in foster care in Arizona when you turned 18 and you're doing at least one of these: enrolled in high school or college, working at least 80 hours a month, in a vocational or employment training program, or have a documented medical condition preventing work. The key is to sign up before you age out — talk to your caseworker about this at least 6 months ahead of your 18th birthday.",
      es: "Eres elegible para EFC si estabas en cuidado adoptivo en Arizona cuando cumpliste 18 años y estás haciendo al menos uno de estos: inscrito/a en la escuela secundaria o universidad, trabajando al menos 80 horas al mes, en un programa de capacitación vocacional o laboral, o tienes una condición médica documentada que impide trabajar.",
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
      en: "The ETV is money — up to $5,000 per year — that you can use for college, vocational school, or job training. You apply through Arizona's Children Association (AzCA). You're eligible if you were in foster care at age 16 or older, or if you aged out of care. There's an annual deadline to apply — for the 2025–2026 cycle, it's July 31, 2026. Don't miss it. Call AzCA at 480-651-3348 for help applying.",
      es: "El ETV es dinero — hasta $5,000 por año — que puedes usar para la universidad, escuela vocacional o capacitación laboral. Solicitas a través de Arizona's Children Association (AzCA). Eres elegible si estabas en cuidado adoptivo a los 16 años o más, o si saliste del sistema. Hay una fecha límite anual para solicitar — para el ciclo 2025-2026, es el 31 de julio de 2026. No te lo pierdas.",
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
      en: "For the 2025–2026 cycle, the ETV application deadline is July 31, 2026. Applications open each year and the money runs out — so apply as early as possible, not at the last minute. Contact Arizona's Children Association (AzCA) at 480-651-3348 to start your application or ask questions. If you miss the deadline, you may have to wait until the next cycle.",
      es: "Para el ciclo 2025-2026, la fecha límite de solicitud del ETV es el 31 de julio de 2026. Las solicitudes abren cada año y el dinero se acaba — así que solicita lo antes posible. Contacta a Arizona's Children Association (AzCA) al 480-651-3348 para comenzar tu solicitud.",
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
      es: "YATI son las siglas de Seguro de Transición para Adultos Jóvenes. Es un plan de salud Medicaid completo y gratuito a través de AHCCCS para jóvenes adultos de Arizona que estaban en cuidado adoptivo a los 18 años. Cubre visitas médicas, dental, visión, salud mental y medicamentos — sin costo para ti — hasta los 26 años.",
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
      en: "Yes — Arizona has a Foster Care Tuition Waiver that covers tuition and fees at any Arizona public university or community college. To use it, you need to have been in foster care in Arizona at some point after age 13. You also have to apply for federal financial aid (FAFSA) first. Ask your school's financial aid office about the waiver, or call 2-1-1 Arizona to get connected with help applying.",
      es: "Sí — Arizona tiene una exención de matrícula para jóvenes del sistema de cuidado adoptivo que cubre matrícula y tarifas en cualquier universidad pública o colegio comunitario de Arizona. Para usarla, debes haber estado en cuidado adoptivo en Arizona en algún momento después de los 13 años.",
    },
    category: "school",
    ageBands: ["18-21"],
    relatedIds: ["q-what-is-etv","q-asu-foster-youth"],
  },

  {
    id: "q-asu-foster-youth",
    question: {
      en: "What is the ASU Foster Youth Success Initiative?",
      es: "¿Qué es la Iniciativa de Éxito para Jóvenes de Cuidado Adoptivo de ASU?",
    },
    answer: {
      en: "Arizona State University's Foster Youth Success Initiative gives foster alumni free tuition (through the tuition waiver), priority on-campus housing, a dedicated advisor, and peer support. If you're interested in ASU, reach out to the program before you apply — they can walk you through everything. Visit fosteryouth.asu.edu or call ASU's financial aid office to get started.",
      es: "La Iniciativa de Éxito para Jóvenes de Cuidado Adoptivo de la Universidad Estatal de Arizona ofrece a los exfosterianos matrícula gratuita, prioridad en vivienda en el campus, un asesor dedicado y apoyo entre compañeros. Visita fosteryouth.asu.edu para comenzar.",
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
      en: "The Education and Training Voucher (ETV) gives you up to $5,000 per year that you can use on top of other financial aid — tuition, books, housing, transportation, even a laptop. It's not a loan, so you don't have to pay it back. You apply through Arizona's Children Association (AzCA) each year. The 2025–2026 deadline is July 31, 2026. Call AzCA at 480-651-3348 to get help with your application.",
      es: "El Bono de Educación y Capacitación (ETV) te da hasta $5,000 por año que puedes usar además de otra ayuda financiera — matrícula, libros, vivienda, transporte, incluso una computadora. No es un préstamo, así que no tienes que devolverlo. Solicitas a través de AzCA cada año. La fecha límite 2025-2026 es el 31 de julio de 2026.",
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
      es: "NAU participa en la exención de matrícula para jóvenes de cuidado adoptivo y tiene servicios de apoyo para exfosterianos a través de sus oficinas de ayuda financiera. Si te interesa NAU, contacta su oficina de ayuda financiera en nau.edu/financial-aid y pregunta específicamente sobre el apoyo para jóvenes del sistema de cuidado adoptivo.",
    },
    category: "school",
    ageBands: ["18-21"],
    relatedIds: ["q-az-tuition-waiver","q-asu-foster-youth"],
  },

]; // end QUESTIONS
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify all `relatedIds` reference valid entry IDs**

Run this quick check in the terminal to catch any typos in `relatedIds`:

```bash
cd web && node -e "
const { QUESTIONS } = require('./src/data/questions.ts');
const ids = new Set(QUESTIONS.map(q => q.id));
QUESTIONS.forEach(q => (q.relatedIds || []).forEach(rid => {
  if (!ids.has(rid)) console.error('BROKEN relatedId:', rid, 'in', q.id);
}));
console.log('check complete');
"
```

> Note: if `require` fails on `.ts`, use `npx tsx -e "..."` instead. Expected output: `check complete` with no `BROKEN` lines.

- [ ] **Step 4: Commit**

```bash
cd web && git add src/data/questions.ts && git commit -m "feat(data): add documents, housing, turning18, benefits, school Q&A entries"
```

---

## Task 5: Update `i18n.ts` — replace chat strings, update nav label

**Files:**
- Modify: `web/src/lib/i18n.ts`

- [ ] **Step 1: Replace the ask/chat block and update `nav_ask`**

In `web/src/lib/i18n.ts`, find and replace the `nav_ask` line and the `// Ask/Chat` block:

Old `nav_ask` line:
```ts
  nav_ask:                      { en: "Ask",                                      es: "Preguntar" },
```

New:
```ts
  nav_ask:                      { en: "Find Answers",                             es: "Encontrar Respuestas" },
```

Old `// Ask/Chat` block (lines 55–60):
```ts
  // Ask/Chat
  ask_title:                    { en: "Ask Compass",                              es: "Pregúntale a Compass" },
  ask_placeholder:              { en: "Type your question…",                      es: "Escribe tu pregunta…" },
  ask_send:                     { en: "Send",                                     es: "Enviar" },
  ask_thinking:                 { en: "Thinking…",                                es: "Pensando…" },
  ask_crisis_header:            { en: "Here are people who can help you right now:", es: "Aquí hay personas que pueden ayudarte ahora mismo:" },
```

New block:
```ts
  // Find Answers
  ask_title:                    { en: "Find Answers",                             es: "Encuentra Respuestas" },
  ask_search_placeholder:       { en: "Search for anything…",                    es: "Busca lo que quieras…" },
  ask_search_clear:             { en: "Clear search",                             es: "Borrar búsqueda" },
  ask_results_label:            { en: "results",                                  es: "resultados" },
  ask_no_results_pre:           { en: "No results for",                           es: "Sin resultados para" },
  ask_no_results_post:          { en: "— try a different word, or browse topics below.", es: "— prueba otra palabra, o navega los temas abajo." },
  ask_browse_label:             { en: "Browse by topic",                          es: "Explorar por tema" },
  ask_related_label:            { en: "Related questions",                        es: "Preguntas relacionadas" },
  ask_resources_cta:            { en: "Find resources near you",                  es: "Encuentra recursos cerca de ti" },
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors. (Any pages that still reference the removed string keys like `ask_placeholder`, `ask_send`, `ask_thinking`, `ask_crisis_header` will throw a type error — that's expected and will be fixed in Task 7.)

- [ ] **Step 3: Commit**

```bash
cd web && git add src/lib/i18n.ts && git commit -m "feat(i18n): replace ask/chat strings with find-answers strings"
```

---

## Task 6: Update `ask/layout.tsx` — SEO metadata

**Files:**
- Modify: `web/src/app/[lang]/ask/layout.tsx`

- [ ] **Step 1: Replace the metadata with youth-voice SEO copy**

Replace the full content of `web/src/app/[lang]/ask/layout.tsx` with:

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "Encuentra Respuestas Sobre Tu Caso y Tus Derechos",
      description: "Explora temas o busca cualquier pregunta sobre tus derechos, el tribunal, la vivienda y más — respuestas reales en palabras simples, sin registro.",
      alternates: {
        canonical: "https://www.fosterhubaz.com/es/ask",
        languages: { en: "https://www.fosterhubaz.com/en/ask", es: "https://www.fosterhubaz.com/es/ask" },
      },
    };
  }
  return {
    title: "Find Answers About Your Rights and Foster Care Case",
    description: "Browse topics or search any question about your rights, court, housing, and more — real answers in plain language, no sign-up needed.",
    alternates: {
      canonical: "https://www.fosterhubaz.com/en/ask",
      languages: { en: "https://www.fosterhubaz.com/en/ask", es: "https://www.fosterhubaz.com/es/ask" },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd web && git add src/app/[lang]/ask/layout.tsx && git commit -m "feat(seo): update Ask page title and description for Find Answers"
```

---

## Task 7: Rewrite `ask/page.tsx` — Find Answers UI

**Files:**
- Modify: `web/src/app/[lang]/ask/page.tsx`

- [ ] **Step 1: Replace the full file content**

Replace the full content of `web/src/app/[lang]/ask/page.tsx` with:

```tsx
"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Search, X, ChevronRight, BookOpen } from "lucide-react";
import Fuse from "fuse.js";
import type { Lang } from "../../../lib/i18n";
import { t } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import { ScreenHero, Modal, SafeNotice } from "../../../components/ui";
import {
  QUESTIONS,
  TOPIC_CONFIG,
  RESOURCE_LINK_CATEGORIES,
  type QAEntry,
  type QACategory,
} from "../../../data/questions";
// Note: usePrefs is called inside useOnboardingGate — do NOT call it separately.

// ── Age-band-specific copy ────────────────────────────────────────────────────

const HERO_SUBTITLE: Record<string, { en: string; es: string }> = {
  "10-12": {
    en: "You have rights. Here's what they mean for you.",
    es: "Tienes derechos. Aquí está lo que significan para ti.",
  },
  "13-15": {
    en: "Your rights, your case, your voice — find real answers.",
    es: "Tus derechos, tu caso, tu voz — encuentra respuestas reales.",
  },
  "16-17": {
    en: "Get answers about your rights, your case, and what comes next.",
    es: "Encuentra respuestas sobre tus derechos, tu caso y lo que viene.",
  },
  "18-21": {
    en: "You've got questions about life after care. Here are real answers.",
    es: "Tienes preguntas sobre la vida después del cuidado. Aquí hay respuestas reales.",
  },
};

const COMPASS_GREETING: Record<string, { en: string; es: string }> = {
  "10-12": {
    en: "Being in foster care can feel really confusing. I'm here to explain things in plain language — just tap a topic or search for what's on your mind.",
    es: "El cuidado adoptivo puede sentirse muy confuso. Estoy aquí para explicarte las cosas en palabras simples — solo toca un tema o busca lo que tienes en mente.",
  },
  "13-15": {
    en: "You deserve to know what's happening in your case and what rights you have. Pick a topic or search for anything — I'll give you straight answers.",
    es: "Mereces saber qué está pasando en tu caso y qué derechos tienes. Elige un tema o busca lo que quieras — te daré respuestas claras.",
  },
  "16-17": {
    en: "There's a lot happening right now — court, turning 18, figuring out what's next. Pick a topic below or search for what's on your mind.",
    es: "Hay mucho pasando ahora mismo — el tribunal, cumplir 18, descubrir qué sigue. Elige un tema o busca lo que tienes en mente.",
  },
  "18-21": {
    en: "You're navigating a lot right now. Whether it's housing, benefits, or just figuring out your options — you're not alone. Search or browse below.",
    es: "Estás manejando mucho ahora mismo. Ya sea vivienda, beneficios, o simplemente descubrir tus opciones — no estás solo/a. Busca o navega abajo.",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function FindAnswersPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);  // also calls usePrefs() internally

  const ageBand = prefs?.ageBand ?? "13-15";

  // Visible topics for this age band
  const visibleTopics = useMemo(
    () => TOPIC_CONFIG.filter((tc) => tc.bands.includes(ageBand)),
    [ageBand]
  );

  // State
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<QACategory | null>(
    () => visibleTopics[0]?.category ?? null
  );
  const [selectedEntry, setSelectedEntry] = useState<QAEntry | null>(null);

  const isSearching = query.trim().length > 0;

  // Band-filtered entry pool
  const bandEntries = useMemo(
    () => QUESTIONS.filter((q) => q.ageBands.includes(ageBand)),
    [ageBand]
  );

  // Fuse search index (rebuilt when band or lang changes)
  const fuse = useMemo(
    () =>
      new Fuse(bandEntries, {
        keys: [
          { name: `question.${lang}`, weight: 2 },
          { name: `answer.${lang}`, weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [bandEntries, lang]
  );

  // Displayed entries: search results OR topic-filtered browse
  const displayedEntries = useMemo(() => {
    if (isSearching) {
      return fuse.search(query.trim(), { limit: 8 }).map((r) => r.item);
    }
    if (activeTopic) {
      return bandEntries.filter((q) => q.category === activeTopic);
    }
    return [];
  }, [isSearching, query, fuse, activeTopic, bandEntries]);

  // Related entries for answer modal
  const relatedEntries = useMemo(() => {
    if (!selectedEntry?.relatedIds) return [];
    return selectedEntry.relatedIds
      .map((id) => bandEntries.find((q) => q.id === id))
      .filter((q): q is QAEntry => q !== undefined)
      .slice(0, 3);
  }, [selectedEntry, bandEntries]);

  function handleClearSearch() {
    setQuery("");
  }

  function handleTopicSelect(category: QACategory) {
    setActiveTopic(category);
    setQuery("");
  }

  const heroSubtitle =
    HERO_SUBTITLE[ageBand]?.[lang] ?? HERO_SUBTITLE["13-15"][lang];
  const compassGreeting =
    COMPASS_GREETING[ageBand]?.[lang] ?? COMPASS_GREETING["13-15"][lang];

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Hero */}
      <ScreenHero
        icon={BookOpen}
        title={t("ask_title", lang)}
        subtitle={heroSubtitle}
        gradient="from-[#2A7F8E] via-[#1a5f7e] to-[#1B3A5C]"
        lang={lang}
      />

      {/* Compass intro card */}
      <div className="rounded-3xl bg-white/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="flex items-center gap-3 mb-3">
          <img
            src="/icons/icon-192.svg"
            className="h-11 w-11 shrink-0 rounded-2xl shadow-md"
            alt=""
            aria-hidden="true"
          />
          <div>
            <div className="text-sm font-semibold text-[#1B3A5C]">
              {lang === "es" ? "Hola, soy Compass" : "Hi, I'm Compass"}
            </div>
            <div className="text-xs text-slate-500">
              {lang === "es"
                ? "Aquí para ayudarte a encontrar respuestas"
                : "Here to help you find real answers"}
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {compassGreeting}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("ask_search_placeholder", lang)}
          className="w-full rounded-2xl bg-white/95 py-3 pl-10 pr-10 text-sm ring-1 ring-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A7F8E] placeholder:text-slate-400"
        />
        {isSearching && (
          <button
            onClick={handleClearSearch}
            aria-label={t("ask_search_clear", lang)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Topic chips — hidden while searching */}
      {!isSearching && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            {t("ask_browse_label", lang)}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {visibleTopics.map((tc) => {
              const isActive = tc.category === activeTopic;
              return (
                <button
                  key={tc.category}
                  onClick={() => handleTopicSelect(tc.category)}
                  className={
                    "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all " +
                    (isActive
                      ? "bg-[#2A7F8E] text-white shadow-md"
                      : "bg-white/95 text-[#1B3A5C] ring-1 ring-black/10 hover:ring-[#2A7F8E]/40")
                  }
                >
                  {tc.label[lang]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results / question list */}
      <div className="flex flex-col gap-2">
        {isSearching && (
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
            {displayedEntries.length} {t("ask_results_label", lang)}
          </div>
        )}

        {isSearching && displayedEntries.length === 0 && (
          <div className="rounded-2xl bg-white/80 px-4 py-5 text-center text-sm text-slate-500 ring-1 ring-slate-200/80">
            {t("ask_no_results_pre", lang)} &ldquo;{query}&rdquo;{" "}
            {t("ask_no_results_post", lang)}
          </div>
        )}

        {displayedEntries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="flex w-full items-center justify-between rounded-2xl bg-white/95 px-4 py-3.5 text-left shadow-[0_2px_8px_rgb(0,0,0,0.05)] ring-1 ring-black/5 hover:ring-[#2A7F8E]/30 hover:shadow-md active:scale-[0.99] transition-all"
          >
            <span className="text-sm font-medium text-[#1B3A5C] pr-3 leading-snug">
              {entry.question[lang]}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#2A7F8E]" />
          </button>
        ))}
      </div>

      {/* Safe notice */}
      <SafeNotice lang={lang} />

      {/* Answer modal */}
      <Modal
        open={selectedEntry !== null}
        onClose={() => setSelectedEntry(null)}
        title={selectedEntry?.question[lang] ?? ""}
      >
        {selectedEntry && (
          <div className="flex flex-col gap-4">
            {/* Answer text */}
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedEntry.answer[lang]}
            </p>

            {/* Citation chips */}
            {selectedEntry.citations && selectedEntry.citations.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedEntry.citations.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full bg-[#2A7F8E]/10 px-2.5 py-1 text-[10px] font-medium text-[#1B3A5C]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Resources CTA */}
            {RESOURCE_LINK_CATEGORIES.has(selectedEntry.category) && (
              <a
                href={`/${lang}/resources`}
                className="block rounded-2xl bg-[#2A7F8E] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#236d7a] transition-colors"
              >
                {t("ask_resources_cta", lang)}
              </a>
            )}

            {/* Related questions */}
            {relatedEntries.length > 0 && (
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  {t("ask_related_label", lang)}
                </div>
                <div className="flex flex-col gap-2">
                  {relatedEntries.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => setSelectedEntry(rel)}
                      className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-left ring-1 ring-slate-200/80 hover:ring-[#2A7F8E]/30 transition-all"
                    >
                      <span className="text-sm text-[#1B3A5C] pr-2 leading-snug">
                        {rel.question[lang]}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#2A7F8E]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd web && git add src/app/[lang]/ask/page.tsx && git commit -m "feat: rewrite Ask page as Find Answers — static browse + fuzzy search"
```

---

## Task 8: Full build verification + smoke test

**Files:** none — verification only

- [ ] **Step 1: Run a clean production build**

```bash
cd web && npm run build
```

Expected: Build completes with `✓ Compiled successfully`. Zero TypeScript errors, zero import errors.

- [ ] **Step 2: Content accuracy review — REQUIRED before launch**

The Q&A entries in `questions.ts` were drafted from project context and existing data files. Before any user sees this page, every entry must be reviewed against authoritative primary sources:

| Claim type | Verify against |
| :--------- | :------------- |
| A.R.S. §8-529 rights language | `server/src/data/rights.ts` (our verified chunks) |
| Phone numbers | `web/src/data/resources.ts` (post-ingestion verified values) |
| ETV amount / deadline | `web/src/data/resources.ts` → ETV — AzCA entry |
| YATI eligibility / age limit | `web/src/data/resources.ts` → AHCCCS — YATI entry |
| Tuition waiver eligibility | Arizona Board of Regents official policy |
| TANF/SNAP program names & URLs | `web/src/data/resources.ts` entries |
| DCS ombudsman phone | Verify at azombudsman.gov or DCS.az.gov |
| Caseworker visit frequency | A.R.S. §8-818 or DCS policy manual |

Do not launch the Find Answers page until this review is complete. Inaccurate legal or benefits information causes real harm to the youth this app serves.

- [ ] **Step 3: Start dev server and smoke test**

```bash
cd web && npm run dev
```

Open `http://localhost:3000/en` and complete onboarding. Then navigate to **Find Answers** and verify:

1. Compass card shows the correct greeting for your age band
2. Topic chips appear and the first chip is active by default
3. Tapping a chip changes the question list
4. Typing in the search bar hides chips and shows fuzzy results
5. Clearing the search (✕ button) restores browse mode with the last chip still selected
6. Tapping a question opens the answer modal
7. Citation chips appear on entries that have them
8. "Find resources near you" button appears on housing/benefits/documents/school entries and navigates to `/en/resources`
9. Related questions in the modal are tappable and navigate to the new entry
10. Try `http://localhost:3000/es` — confirm Spanish strings display throughout

- [ ] **Step 3: Final commit**

```bash
cd web && git add -A && git commit -m "feat: Find Answers page — complete implementation

Replaces live AI chat with static browse + Fuse.js search.
45 Q&A entries across 10 categories, fully age-band tailored,
bilingual EN/ES, zero backend dependency.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

*Plan generated from approved spec: `docs/superpowers/specs/2026-04-05-find-answers-design.md`*
