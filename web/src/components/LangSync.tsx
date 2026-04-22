"use client";

import { useEffect } from "react";

export function LangSync({ lang }: { lang: "en" | "es" }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
