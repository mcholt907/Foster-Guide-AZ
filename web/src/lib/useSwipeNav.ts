"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "./i18n";

interface SwipeNavItem {
  id: string;
  href: string;
}

interface UseSwipeNavOptions<T extends SwipeNavItem> {
  items: readonly T[];
  currentId: T["id"];
  lang: Lang;
}

const HORIZONTAL_THRESHOLD = 60;
const VERTICAL_TOLERANCE_RATIO = 0.7;
const EDGE_IGNORE = 20;

export function useSwipeNav<T extends SwipeNavItem>({
  items,
  currentId,
  lang,
}: UseSwipeNavOptions<T>) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const idx = items.findIndex((it) => it.id === currentId);
    if (idx === -1) return;
    for (const i of [idx - 1, idx + 1]) {
      if (i >= 0 && i < items.length) {
        router.prefetch(`/${lang}${items[i].href}`);
      }
    }
  }, [items, currentId, lang, router]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) {
        startRef.current = null;
        return;
      }
      const t = e.touches[0];
      if (
        t.clientX < EDGE_IGNORE ||
        t.clientX > window.innerWidth - EDGE_IGNORE
      ) {
        startRef.current = null;
        return;
      }
      startRef.current = { x: t.clientX, y: t.clientY };
    }

    function handleTouchEnd(e: TouchEvent) {
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;
      const t = e.changedTouches[0];
      if (!t) return;

      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dx) < HORIZONTAL_THRESHOLD) return;
      if (Math.abs(dy) > Math.abs(dx) * VERTICAL_TOLERANCE_RATIO) return;

      const idx = items.findIndex((it) => it.id === currentId);
      if (idx === -1) return;
      const direction = dx < 0 ? 1 : -1;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= items.length) return;
      router.push(`/${lang}${items[targetIdx].href}`);
    }

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [items, currentId, lang, router]);

  return ref;
}
