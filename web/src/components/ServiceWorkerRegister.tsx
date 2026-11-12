"use client";

import { useEffect } from "react";

/**
 * Registers the offline service worker (/sw.js). Renders nothing.
 *
 * - Production only, so `next dev` never serves stale cached pages.
 * - Waits for the page to finish loading so it never competes with first paint
 *   on a slow phone.
 * - Tells the worker which page is open (path only, e.g. "/en/case") so it can
 *   save it, and asks it to refresh its saved pages (at most once a day).
 *   Nothing from localStorage is ever sent to or stored by the worker.
 * - Never throws: offline support is a bonus, not a requirement.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const register = () => {
      try {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then(() => navigator.serviceWorker.ready)
          .then((reg) => reg.active?.postMessage({ type: "warm", path: window.location.pathname }))
          .catch(() => {});
      } catch {
        // Private mode / blocked storage: the site still works online.
      }
    };

    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
