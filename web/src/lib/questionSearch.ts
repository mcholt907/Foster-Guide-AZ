import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type Fuse from "fuse.js";
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
 *
 * Fuse.js is NOT in the page's first-load JavaScript. It is fetched the first
 * time someone focuses or types in the search box (see useQuestionSearch), so
 * a kid who only reads the list never pays for it. The question list itself
 * and the crisis check are plain synchronous code and work without it.
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
type FuseCtor = typeof Fuse;

// ── Lazy Fuse.js loader ──────────────────────────────────────────────────────

type EngineStatus = "idle" | "loading" | "ready" | "failed";

let FuseClass: FuseCtor | null = null;
let enginePromise: Promise<void> | null = null;
let engineStatus: EngineStatus = "idle";
/** A download has failed before: use the backup search while retrying. */
let engineFailedOnce = false;
const statusListeners = new Set<() => void>();

function setEngineStatus(next: EngineStatus) {
  engineStatus = next;
  statusListeners.forEach((fn) => fn());
}

/**
 * Start downloading the search engine (Fuse.js). Safe to call many times.
 * Resolves when search is ready; rejects if the download failed (for example
 * the phone lost signal). A later call tries again.
 */
export function preloadQuestionSearch(): Promise<void> {
  if (FuseClass) return Promise.resolve();
  if (!enginePromise) {
    setEngineStatus("loading");
    enginePromise = import("fuse.js").then(
      (mod) => {
        FuseClass = mod.default;
        setEngineStatus("ready");
      },
      (err: unknown) => {
        enginePromise = null;
        engineFailedOnce = true;
        setEngineStatus("failed");
        throw err;
      }
    );
  }
  return enginePromise;
}

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

function listForBand(band: AgeBandKey | undefined): QAEntry[] {
  return band ? QUESTIONS.filter((q) => q.ageBands.includes(band)) : QUESTIONS;
}

interface Index {
  list: QAEntry[];
  /** Question text + keywords: typo-tolerant. */
  primary: FuseQA;
  /** Answer text: exact words only, counts for less. */
  secondary: FuseQA;
}

const indexCache = new Map<string, Index>();

function getIndex(FuseImpl: FuseCtor, band: AgeBandKey | undefined): Index {
  const key = band ?? "all";
  const cached = indexCache.get(key);
  if (cached) return cached;

  const list = listForBand(band);
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
    primary: new FuseImpl(list, {
      ...shared,
      threshold: 0.25,
      keys: ["question.en", "question.es", "keywords.en", "keywords.es"],
    }),
    secondary: new FuseImpl(list, {
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
 * Every question for the band/category in its normal order. No search engine
 * needed, so this is what renders in the server HTML and before any typing.
 */
export function listQuestions(opts: QuestionSearchOptions = {}): QAEntry[] {
  const { band, category = "all" } = opts;
  const list = listForBand(band);
  return category === "all" ? list : list.filter((q) => q.category === category);
}

/** The real search. Only call once Fuse has loaded. */
function searchWithFuse(FuseImpl: FuseCtor, tokens: string[], opts: QuestionSearchOptions): QAEntry[] {
  const { band, category = "all", limit = 12 } = opts;
  const { list, primary, secondary } = getIndex(FuseImpl, band);
  const inCategory = (q: QAEntry) => category === "all" || q.category === category;

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

/**
 * Backup search for when Fuse.js could not be downloaded (no signal). Plain
 * word matching, no typo help: question/keyword hits count more than answer
 * hits. Much better than a search box that silently does nothing.
 */
function searchBasic(tokens: string[], opts: QuestionSearchOptions): QAEntry[] {
  const { limit = 12 } = opts;
  const scored: { item: QAEntry; score: number; order: number }[] = [];
  listQuestions(opts).forEach((q, order) => {
    const main = normalizeText(
      [q.question.en, q.question.es, ...(q.keywords?.en ?? []), ...(q.keywords?.es ?? [])].join(" ")
    );
    const rest = normalizeText(
      [q.answer.en, q.answer.es, q.answer1012?.en ?? "", q.answer1012?.es ?? ""].join(" ")
    );
    let score = 0;
    for (const token of tokens) {
      if (main.includes(token)) score += 1;
      else if (rest.split(" ").includes(token)) score += ANSWER_MATCH_WEIGHT;
    }
    if (score > 0) scored.push({ item: q, score, order });
  });
  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  if (scored.length === 0) return [];
  const floor = scored[0].score * RELATIVE_CUTOFF;
  return scored.filter((r) => r.score >= floor).slice(0, limit).map((r) => r.item);
}

/**
 * Search the Q&A list. Returns the best matches first, or [] when nothing fits.
 * An empty query returns every question for the band/category in its normal order.
 *
 * Async because Fuse.js is downloaded on first use. In components, prefer
 * useQuestionSearch(), which keeps the list on screen while that happens.
 */
export async function searchQuestions(query: string, opts: QuestionSearchOptions = {}): Promise<QAEntry[]> {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return listQuestions(opts);
  try {
    await preloadQuestionSearch();
  } catch {
    return searchBasic(tokens, opts);
  }
  return searchWithFuse(FuseClass!, tokens, opts);
}

function subscribeEngine(listener: () => void): () => void {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}
const getEngineStatus = (): EngineStatus => engineStatus;
const getServerEngineStatus = (): EngineStatus => "idle";

export interface QuestionSearchState {
  /** Questions to show right now. */
  results: QAEntry[];
  /**
   * True while a typed search is waiting for the search engine to download.
   * `results` is the full list for the band/topic until it arrives, so the
   * screen never flashes "nothing found".
   */
  pending: boolean;
  /** Call on focus/touch of the search box to start the download early. */
  preload: () => void;
}

/**
 * Search hook for the Find Answers pages. Renders the full question list right
 * away (server HTML included), loads Fuse.js the first time it is needed, and
 * re-renders with real results as soon as it is ready — so a search typed
 * before the download finishes is never lost.
 */
export function useQuestionSearch(query: string, opts: QuestionSearchOptions = {}): QuestionSearchState {
  const { band, category = "all", limit } = opts;
  const status = useSyncExternalStore(subscribeEngine, getEngineStatus, getServerEngineStatus);
  const hasQuery = useMemo(() => tokenizeQuery(query).length > 0, [query]);

  // A search is waiting: fetch the engine. After a failed download (no
  // signal) try again once per new keystroke, not in a loop.
  const retriedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!hasQuery) return;
    if (status === "idle") {
      preloadQuestionSearch().catch(() => {});
    } else if (status === "failed" && retriedFor.current !== query) {
      retriedFor.current = query;
      preloadQuestionSearch().catch(() => {});
    }
  }, [hasQuery, status, query]);

  return useMemo(() => {
    const o: QuestionSearchOptions = { band, category, limit };
    const tokens = tokenizeQuery(query);
    const preload = () => {
      preloadQuestionSearch().catch(() => {});
    };
    if (tokens.length === 0) return { results: listQuestions(o), pending: false, preload };
    if (status === "ready" && FuseClass) {
      return { results: searchWithFuse(FuseClass, tokens, o), pending: false, preload };
    }
    if (status === "failed" || engineFailedOnce) {
      return { results: searchBasic(tokens, o), pending: false, preload };
    }
    return { results: listQuestions(o), pending: true, preload };
  }, [query, band, category, limit, status]);
}
