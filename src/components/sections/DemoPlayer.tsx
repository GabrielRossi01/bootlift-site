"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown, Lock, Pause, Play } from "lucide-react";
import { GlassSurface } from "@/components/glass/GlassSurface";

const VIDEOS = {
  short: {
    webm: "/media/demo-short.webm",
    mp4: "/media/demo-short.mp4",
    poster: "/media/demo-short-poster.jpg",
    width: 1280,
    height: 796,
  },
  full: {
    webm: "/media/demo-full.webm",
    mp4: "/media/demo-full.mp4",
    poster: "/media/demo-full-poster.jpg",
    width: 1100,
    height: 768,
  },
} as const;

export function DemoPlayer() {
  const t = useTranslations("demo");
  const [which, setWhich] = useState<"short" | "full">("short");
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = VIDEOS[which];

  // The short loop plays only while on screen, and never under reduced motion.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || which !== "short") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || userPaused) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [which, userPaused]);

  function toggle() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      setUserPaused(false);
      el.play().catch(() => {});
    } else {
      setUserPaused(true);
      el.pause();
    }
  }

  function switchTo(next: "short" | "full") {
    setWhich(next);
    setUserPaused(false);
  }

  // Full walkthrough: user asked for it, so start it once its source is in.
  useEffect(() => {
    if (which === "full") videoRef.current?.play().catch(() => {});
  }, [which]);

  return (
    <div>
      <GlassSurface variant="float" className="overflow-hidden p-1.5 sm:p-2">
        <div className="flex items-center gap-2 px-3 pt-1.5 pb-2.5 sm:px-4">
          <Lock
            aria-hidden="true"
            className="size-3.5 shrink-0 text-fg-muted"
          />
          <p className="min-w-0 truncate font-mono text-xs text-fg-muted">
            github.com/GabrielRossi01/bootlift-demo/pull/1
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[0.875rem] bg-ink-1000">
          <video
            key={which}
            ref={videoRef}
            width={video.width}
            height={video.height}
            poster={video.poster}
            muted={which === "short"}
            loop={which === "short"}
            controls={which === "full"}
            playsInline
            preload={which === "short" ? "none" : "metadata"}
            aria-label={which === "short" ? t("videoLabel") : t("fullLabel")}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="block h-auto w-full"
          >
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
            {/* Last resort for browsers without <video>. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/demo-short.gif"
              width={1280}
              height={796}
              alt={t("videoLabel")}
              loading="lazy"
            />
          </video>

          {which === "short" && (
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? t("pause") : t("play")}
              className="absolute right-3 bottom-3 inline-flex size-11 items-center justify-center rounded-pill bg-ink-1000/80 text-fg ring-1 ring-white/15 backdrop-blur-sm transition-colors duration-200 hover:bg-ink-900"
            >
              {playing ? (
                <Pause aria-hidden="true" className="size-4" />
              ) : (
                <Play aria-hidden="true" className="size-4" />
              )}
            </button>
          )}
        </div>
      </GlassSurface>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={() => switchTo(which === "short" ? "full" : "short")}
          className="inline-flex h-11 items-center gap-2 rounded-pill px-5 text-[0.9375rem] font-bold text-fg ring-1 ring-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
        >
          <Play aria-hidden="true" className="size-4 text-brand-400" />
          {which === "short" ? t("full") : t("short")}
        </button>
        <a
          href="#quickstart"
          className="group inline-flex h-11 items-center gap-2 font-bold text-fg underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:decoration-fg"
        >
          {t("toQuickstart")}
          <ArrowDown
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-lift group-hover:translate-y-0.5"
          />
        </a>
      </div>
    </div>
  );
}
