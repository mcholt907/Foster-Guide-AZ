/* FosterHub AZ service worker — hand-written, no build step, no third-party requests.
 *
 * Goal: after ONE online visit, Home, Your Rights, Wellness (crisis numbers) and
 * Find Answers open with the network off, in English and Spanish.
 *
 * - Pages (navigations): network-first, so phone numbers stay fresh. If the network
 *   fails or is very slow, serve the saved copy, else /offline.html.
 * - /_next/static/*: cache-first (file names are content-hashed, so never stale).
 * - Images + fonts: stale-while-revalidate.
 * - RSC / prefetch / everything else: not handled. Offline, Next.js falls back to a
 *   full-document navigation, which the page cache answers.
 *
 * Only generic site HTML/JS/CSS is stored — nothing from localStorage, no personal data.
 * Bump VERSION to throw away every old cache on the next visit. */
const VERSION = "v1";
const PAGES = `fhaz-pages-${VERSION}`;
const ASSETS = `fhaz-assets-${VERSION}`; // hashed JS/CSS/fonts from /_next/static
const MEDIA = `fhaz-media-${VERSION}`; // images + public files
const OFFLINE_URL = "/offline.html";
const CORE = [OFFLINE_URL, "/manifest.webmanifest", "/favicon.svg", "/icons/icon-192.png", "/icons/icon-512.png"];
// The offline shell: language picker, then Home, Your Rights, Wellness and Find Answers in both languages.
const SHELL = ["/", ...["en", "es"].flatMap((l) => ["", "/rights", "/wellness", "/ask"].map((r) => `/${l}${r}`))];
const NAV_TIMEOUT_MS = 5000; // slow network + saved copy => show the saved copy
const WARM_EVERY_MS = 24 * 60 * 60 * 1000;
const MAX_ASSETS = 250; // old hashed chunks pile up across deploys; trim oldest
const MAX_MEDIA = 80;

/** Only keep complete, same-origin, successful, non-redirected responses. */
const cacheable = (res) => res && res.status === 200 && res.type === "basic" && !res.redirected;

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys(); // insertion order: oldest first
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((k) => cache.delete(k)));
}

/** Fetch each page, save it, then save every /_next/static file its HTML names. */
async function warm(paths) {
  const pages = await caches.open(PAGES);
  const assets = await caches.open(ASSETS);
  const wanted = new Set();
  await Promise.all(
    paths.map(async (path) => {
      try {
        const res = await fetch(path, { credentials: "same-origin" });
        if (!cacheable(res)) return;
        const html = await res.clone().text();
        await pages.put(path, res);
        for (const m of html.matchAll(/\/_next\/static\/[^"'\\\s)<>]+/g)) wanted.add(m[0]);
      } catch { /* offline or flaky: keep whatever we already have */ }
    }),
  );
  await Promise.all(
    [...wanted].map(async (url) => {
      try {
        if (await assets.match(url)) return; // hashed => already final
        const res = await fetch(url);
        if (cacheable(res)) await assets.put(url, res);
      } catch { /* skip */ }
    }),
  );
  await trim(ASSETS, MAX_ASSETS);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(MEDIA)
      .then((c) => c.addAll(CORE)) // small and required: install fails without it
      .then(() => warm(SHELL)) // best effort: never rejects
      .then(() => caches.open(PAGES)).then((c) => c.put("/__warmed", new Response(String(Date.now()))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const keep = [PAGES, ASSETS, MEDIA];
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n.startsWith("fhaz-") && !keep.includes(n)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

/** Sent by ServiceWorkerRegister on each visit. Saves the page the youth is on right now
 *  (the very first page loads before this worker is in control, so it would be missed),
 *  and refreshes the shell at most once a day. */
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type !== "warm") return;
  event.waitUntil((async () => {
    const pages = await caches.open(PAGES);
    const path = typeof data.path === "string" && data.path.startsWith("/") ? data.path : null;
    if (path && !(await pages.match(path))) await warm([path]);
    const stamp = await pages.match("/__warmed");
    if (stamp && Date.now() - Number(await stamp.text()) < WARM_EVERY_MS) return;
    await warm(SHELL);
    await pages.put("/__warmed", new Response(String(Date.now())));
  })());
});

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES);
  const key = new URL(request.url).pathname; // ignore ?query so one copy per page
  const saved = await cache.match(key);
  const fresh = fetch(request).then((res) => {
    if (cacheable(res)) cache.put(key, res.clone());
    return res;
  });
  try {
    if (!saved) return await fresh;
    fresh.catch(() => {}); // may lose the race below; don't leave it unhandled
    const slow = new Promise((resolve) => setTimeout(() => resolve(saved.clone()), NAV_TIMEOUT_MS));
    return await Promise.race([fresh, slow]);
  } catch {
    return saved || (await caches.match(OFFLINE_URL)) || Response.error();
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (cacheable(res)) cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(event, cacheName, max) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(event.request);
  const fresh = fetch(event.request).then(async (res) => {
    if (cacheable(res)) {
      await cache.put(event.request, res.clone());
      await trim(cacheName, max);
    }
    return res;
  });
  if (!hit) return fresh;
  event.waitUntil(fresh.catch(() => {}));
  return hit;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch other sites
  if (request.headers.has("range")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, ASSETS));
  } else if (request.destination === "image" || request.destination === "font" || request.destination === "manifest") {
    event.respondWith(staleWhileRevalidate(event, MEDIA, MAX_MEDIA));
  }
  // Everything else (RSC payloads, prefetches, /sw.js) goes straight to the network.
});
