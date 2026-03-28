"use client";

import { useState, useEffect } from "react";

export type AgeBandKey = "10-12" | "13-15" | "16-17" | "18-21";

export type Prefs = {
  ageBand: AgeBandKey | null;
  county: string | null;
  tribal: boolean;
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

function readFromStorage(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
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
  useEffect(() => {
    setPrefs(readFromStorage());
    setLoaded(true);

    function handleSync() { setPrefs(readFromStorage()); }
    window.addEventListener(SYNC_EVENT, handleSync);
    return () => window.removeEventListener(SYNC_EVENT, handleSync);
  }, []);

  function patch(update: Partial<Prefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...update };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent(SYNC_EVENT));
      } catch { /* ignore */ }
      return next;
    });
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
