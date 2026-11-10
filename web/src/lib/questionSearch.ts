import Fuse from "fuse.js";
import { QUESTIONS, type QAEntry, type QACategory } from "../data/questions";
import type { AgeBandKey } from "./prefs";

/**
 * Shared search for the Find Answers pages (teen + 10-12).
 *
 * Kids type whole worried sentences ("can i call my mom"), not keywords, and
 * they often type in a different language than the page. So we:
 *  - lowercase and strip accents / apostrophes on both the query and the data
 *  - drop filler words and search each remaining word on its own (OR)
 *  - search English AND Spanish fields no matter the page language
 *  - rank questions that match more (and rarer) words higher
 */

/** Lowercase, strip accents and apostrophes, turn other punctuation into spaces. */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’`´]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const STOPWORDS = new Set(
  (
    // English
    "a an the i im me my mine we you your they them their it its this that these those " +
    "is am are was were be been do does did can could will would should may might " +
    "to of in on at for with and or but if so as by from about into than then there here " +
    "what why how when where who which have has had get got not no without just really very " +
    // Spanish
    "yo mi mis me tu tus te el la los las un una unos unas lo le les se su sus " +
    "de del al en y o u a con sin por para que como cuando donde quien cual " +
    "es son soy estoy esta estan ser estar hay puedo puede pueden si ya muy mas pero"
  ).split(" ")
);

/** Split a query into meaningful words. Falls back to all words if every word is filler. */
export function tokenizeQuery(query: string): string[] {
  const all = normalizeText(query).split(" ").filter(Boolean);
  const kept = all.filter((t) => !STOPWORDS.has(t) && t.length >= 2);
  const tokens = kept.length > 0 ? kept : all.filter((t) => t.length >= 2);
  return Array.from(new Set(tokens));
}

// Self-harm / immediate-danger wording. Matched against normalizeText() output,
// so no accents or apostrophes here ("don't" -> "dont", "daño" -> "dano").
const CRISIS_PATTERNS: RegExp[] = [
  /\b(die|dying|dead)\b/,
  /\bkill(ing)? (my ?self|me)\b/,
  /\bsuicid/,
  /\b(hurt|hurting|harm|harming|cut|cutting) my ?self\b/,
  /\bself ?harm/,
  /\bcutting\b/,
  /\bend (it|my life|it all|everything)\b/,
  /\b(dont|do not|doesnt) (want|wanna) to (live|be alive|be here)\b/,
  /\bno reason to live\b/,
  /\boverdos/,
  // Spanish
  /\b(morir|morirme|morire)\b/,
  /\bmatar(me|se)\b/,
  /\bme (quiero|voy a) matar\b/,
  /\bhacerme dano\b/,
  /\blastimarme\b/,
  /\bcortarme\b/,
  /\bme corto\b/,
  /\bno quiero (vivir|seguir viviendo|estar aqui)\b/,
  /\bquitarme la vida\b/,
];

/** True when the query sounds like self-harm or immediate danger. Show crisis help first. */
export function isCrisisQuery(query: string): boolean {
  const q = normalizeText(query);
  if (!q) return false;
  return CRISIS_PATTERNS.some((re) => re.test(q));
}

export interface QuestionSearchOptions {
  /** Only return questions for this age band. Omit to search all bands. */
  band?: AgeBandKey;
  /** Only return questions in this topic. */
  category?: QACategory | "all";
  /** Max results (default 12). */
  limit?: number;
}

type FuseQA = Fuse<QAEntry>;

// Normalize indexed text the same way as the query so accents, capitals and
// apostrophes never block a match.
function getNormalized(obj: QAEntry, path: string | string[]): string | string[] {
  const parts = Array.isArray(path) ? path : path.split(".");
  let value: unknown = obj;
  for (const part of parts) {
    if (value === null || typeof value !== "object") return "";
    value = (value as Record<string, unknown>)[part];
  }
  if (Array.isArray(value)) return value.map((v) => normalizeText(String(v)));
  return typeof value === "string" ? normalizeText(value) : "";
}

interface Index {
  list: QAEntry[];
  /** Question text + keywords: typo-tolerant. */
  primary: FuseQA;
  /** Answer text: exact words only, counts for less. */
  secondary: FuseQA;
}

const indexCache = new Map<string, Index>();

function getIndex(band: AgeBandKey | undefined): Index {
  const key = band ?? "all";
  const cached = indexCache.get(key);
  if (cached) return cached;

  const list = band ? QUESTIONS.filter((q) => q.ageBands.includes(band)) : QUESTIONS;
  const shared = {
    includeScore: true,
    ignoreLocation: true,
    ignoreFieldNorm: true,
    useExtendedSearch: true,
    minMatchCharLength: 2,
    getFn: getNormalized,
  };
  const index: Index = {
    list,
    primary: new Fuse(list, {
      ...shared,
      threshold: 0.25,
      keys: ["question.en", "question.es", "keywords.en", "keywords.es"],
    }),
    secondary: new Fuse(list, {
      ...shared,
      threshold: 0,
      keys: ["answer.en", "answer.es", "answer1012.en", "answer1012.es"],
    }),
  };
  indexCache.set(key, index);
  return index;
}

/** How much an answer-text-only match counts next to a question/keyword match. */
const ANSWER_MATCH_WEIGHT = 0.3;
/** Drop results scoring below this share of the best result. */
const RELATIVE_CUTOFF = 0.4;

/**
 * Search the Q&A list. Returns the best matches first, or [] when nothing fits.
 * An empty query returns every question for the band/category in its normal order.
 */
export function searchQuestions(query: string, opts: QuestionSearchOptions = {}): QAEntry[] {
  const { band, category = "all", limit = 12 } = opts;
  const { list, primary, secondary } = getIndex(band);
  const inCategory = (q: QAEntry) => category === "all" || q.category === category;

  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return list.filter(inCategory);

  const totals = new Map<string, { item: QAEntry; score: number; order: number }>();

  for (const token of tokens) {
    // Short words must match exactly ('word = "include" in Fuse extended
    // search); longer words allow a typo or two.
    const exact = `'${token}`;
    const perItem = new Map<string, { item: QAEntry; rel: number; order: number }>();

    for (const r of primary.search(token.length <= 4 ? exact : token)) {
      perItem.set(r.item.id, { item: r.item, rel: 1 - (r.score ?? 0), order: r.refIndex });
    }
    for (const r of secondary.search(exact)) {
      const prev = perItem.get(r.item.id);
      if (!prev || prev.rel < ANSWER_MATCH_WEIGHT) {
        perItem.set(r.item.id, { item: r.item, rel: ANSWER_MATCH_WEIGHT, order: r.refIndex });
      }
    }
    if (perItem.size === 0) continue;

    // Rarer words say more about what the person means.
    const rarity = Math.log(1 + list.length / perItem.size);
    for (const [id, m] of perItem) {
      const prev = totals.get(id);
      if (prev) prev.score += rarity * m.rel;
      else totals.set(id, { item: m.item, score: rarity * m.rel, order: m.order });
    }
  }

  const ranked = Array.from(totals.values()).sort((a, b) => b.score - a.score || a.order - b.order);
  if (ranked.length === 0) return [];
  const floor = ranked[0].score * RELATIVE_CUTOFF;

  return ranked
    .filter((r) => r.score >= floor && inCategory(r.item))
    .slice(0, limit)
    .map((r) => r.item);
}
