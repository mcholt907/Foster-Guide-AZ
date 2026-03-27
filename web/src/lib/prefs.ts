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

// Returns [prefs, loaded, patch, reset]
// `loaded` is false until localStorage has been read — gate any redirects on it.
export function usePrefs(): [Prefs, boolean, (patch: Partial<Prefs>) => void, () => void] {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  function patch(update: Partial<Prefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...update };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    setPrefs(DEFAULT_PREFS);
  }

  return [prefs, loaded, patch, reset];
}
