"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

// Lenis already honours html { scroll-padding-top }, which clears the fixed nav.
const NAV_OFFSET = 0;

/**
 * Inertial smooth scrolling (Lenis) for mouse and trackpad.
 *
 * - Loaded after the page is idle, so it never competes with the first paint.
 * - Off under prefers-reduced-motion and on touch screens, where native
 *   scrolling is already smooth and momentum belongs to the OS.
 * - Nested scrollers (editor, findings, code, tables) keep native scrolling.
 * - In-page anchors glide to their section and still move keyboard focus.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (reduced || !finePointer) return;

    let lenis: Lenis | undefined;
    let cancelled = false;

    const onClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const hash = link?.getAttribute("href");
      if (!link || !hash || hash === "#") return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      history.pushState(null, "", hash);
      lenis.scrollTo(target, {
        offset: NAV_OFFSET,
        onComplete: () => {
          // Keep keyboard and screen-reader users where the page now is.
          if (!target.hasAttribute("tabindex"))
            target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        },
      });
    };

    const start = () =>
      import("lenis").then(({ default: LenisClass }) => {
        if (cancelled) return;
        lenis = new LenisClass({
          autoRaf: true,
          lerp: 0.1,
          allowNestedScroll: true,
          prevent: (node) =>
            node.closest(
              "textarea, pre, ol, [role='region'], [data-lenis-prevent]",
            ) !== null,
        });
        document.addEventListener("click", onClick);
      });

    // Wait for an idle moment; fall back to a timer where idle callbacks don't exist.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : undefined;
    const timer = hasIdle ? undefined : globalThis.setTimeout(start, 1500);

    return () => {
      cancelled = true;
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) globalThis.clearTimeout(timer);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
