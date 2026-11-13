"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { GlassSurface } from "@/components/glass/GlassSurface";

/**
 * The playground carries the rule engine and Motion. It sits far below the fold,
 * so its code loads only when the section approaches the viewport, keeping it
 * off the critical path of the hero.
 */
const PlaygroundPanel = dynamic(
  () => import("./PlaygroundPanel").then((m) => m.PlaygroundPanel),
  { ssr: false, loading: () => <Placeholder /> },
);

export function PlaygroundLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{near ? <PlaygroundPanel /> : <Placeholder />}</div>;
}

/** Same footprint as the loaded panel, so swapping it in moves nothing. */
function Placeholder() {
  return (
    <div aria-hidden="true">
      <GlassSurface
        variant="float"
        specular={false}
        className="mt-12 p-2 sm:p-3"
      >
        <div className="grid gap-3 lg:h-[42.5rem] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="h-[33rem] rounded-[0.875rem] bg-ink-1000/80 sm:h-[41.5rem] lg:h-auto" />
          <div className="h-[36rem] rounded-[0.875rem] bg-ink-1000/60 lg:h-auto" />
        </div>
      </GlassSurface>
      <div className="mt-5 h-6" />
    </div>
  );
}
