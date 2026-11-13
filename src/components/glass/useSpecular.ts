"use client";

import { useEffect, type RefObject } from "react";

const QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Drives the glass specular sheen: writes --mx / --my / --spec-o on the element.
 * Desktop pointers only; disabled under reduced motion.
 */
export function useSpecular(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const media = window.matchMedia(QUERY);
    let frame = 0;
    let x = 0;
    let y = 0;

    const write = () => {
      frame = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onEnter = () => el.style.setProperty("--spec-o", "1");
    const onLeave = () => el.style.setProperty("--spec-o", "0");

    const attach = () => {
      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
    };
    const detach = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.style.setProperty("--spec-o", "0");
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    const sync = () => (media.matches ? attach() : detach());

    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      detach();
    };
  }, [ref, enabled]);
}
