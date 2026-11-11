"use client";

import { useState, useEffect } from "react";

export type AgeBandKey = "10-12" | "13-15" | "16-17" | "18-21";

/**
 * Answer to "Are you part of a tribal nation?"
 *   "yes"     — said yes
 *   "no"      — said no (new 3-choice question)
 *   "unsure"  — said "Not sure"
 *   "unknown" — never asked (10-12 skip the question) or answered the old
 *               2-choice question, where "No / Not sure" was one button
 */
export type TribalStatus = "yes" | "no" | "unsure" | "unknown";

export type Prefs = {
  ageBand: AgeBandKey | null;
  county: string | null;
  /** True only for a clear "yes". Kept as a boolean for older saved prefs. */
  tribal: boolean;
  /**
   * Added with the 3-choice tribal question. `true` = "Not sure",
   * `false` = a clear yes or no, missing = never asked / old saved prefs.
   */
  tribalUnsure?: boolean;
  onboardingDone: boolean;
};

const DEFAULT_PREFS: Prefs = {
  ageBand: null,
  county: null,
  tribal: false,
  onboardingDone: false,
};

const KEY = "fgaz_prefs_v2";
const SYNC_EVENT = "fgaz-prefs-updated";

/** Build the two stored tribal fields from a single answer. */
export function tribalPatch(status: Exclude<TribalStatus, "unknown">): Pick<Prefs, "tribal" | "tribalUnsure"> {
  return { tribal: status === "yes", tribalUnsure: status === "unsure" };
}

/** Read the tribal answer back as one value. Safe for old saved prefs. */
export function getTribalStatus(prefs: Pick<Prefs, "tribal" | "tribalUnsure">): TribalStatus {
  if (prefs.tribal === true) return "yes";
  if (prefs.tribalUnsure === true) return "unsure";
  if (prefs.tribalUnsure === false) return "no";
  return "unknown";
}

// Old saved prefs only have `tribal: boolean`. Also accept a string status
// ("yes" | "no" | "unsure") in case a later version stores it that way.
function normalize(raw: unknown): Prefs {
  if (!raw || typeof raw !== "object") return DEFAULT_PREFS;
  const stored = raw as Record<string, unknown>;
  const next: Prefs = { ...DEFAULT_PREFS, ...(stored as Partial<Prefs>) };

  const t = stored.tribal;
  if (t === "yes" || t === "no" || t === "unsure") {
    Object.assign(next, tribalPatch(t));
  } else {
    next.tribal = t === true;
    if (typeof stored.tribalUnsure === "boolean") next.tribalUnsure = stored.tribalUnsure;
    else delete next.tribalUnsure;
  }
  return next;
}

function readFromStorage(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch { /* ignore */ }
  return DEFAULT_PREFS;
}

// Returns [prefs, loaded, patch, reset]
// `loaded` is false until localStorage has been read — gate any redirects on it.
export function usePrefs(): [Prefs, boolean, (patch: Partial<Prefs>) => void, () => void] {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  // Hydrate from localStorage on mount, and re-sync when any other
  // usePrefs instance calls patch() or reset() (e.g. SideNav vs. setup page).
  // The setState-in-effect is intentional: this is the standard React pattern
  // for syncing client-only state (localStorage) after hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(readFromStorage());
    setLoaded(true);

    function handleSync() {
      setPrefs(readFromStorage());
    }
    window.addEventListener(SYNC_EVENT, handleSync);
    return () => window.removeEventListener(SYNC_EVENT, handleSync);
  }, []);

  function patch(update: Partial<Prefs>) {
    const next = { ...prefs, ...update };
    setPrefs(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(SYNC_EVENT));
    } catch { /* ignore */ }
  }

  function reset() {
    try {
      localStorage.removeItem(KEY);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT));
    } catch { /* ignore */ }
    setPrefs(DEFAULT_PREFS);
  }

  return [prefs, loaded, patch, reset];
}
