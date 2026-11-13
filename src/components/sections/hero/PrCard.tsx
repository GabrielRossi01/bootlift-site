"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslations } from "next-intl";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  GitPullRequest,
  MousePointer2,
  Pause,
  Play,
} from "lucide-react";
import { GlassSurface } from "@/components/glass/GlassSurface";

/**
 * The demo story, from bootlift-demo PR #1:
 * main scores 94 → the PR pushes javax imports, drops to 60 and fails with
 * 6 suggestions → a suggestion is committed → all 6 in, back to 94 and green.
 */
type Phase = "main" | "drop" | "suggest" | "commit" | "pass";

const SEQUENCE: { phase: Phase; ms: number }[] = [
  { phase: "main", ms: 1800 },
  { phase: "drop", ms: 2300 },
  { phase: "suggest", ms: 3000 },
  { phase: "commit", ms: 1200 },
  { phase: "pass", ms: 3600 },
];

const SCORE: Record<Phase, number> = {
  main: 94,
  drop: 60,
  suggest: 60,
  commit: 60,
  pass: 94,
};

const SUGGESTIONS = 6;
const EASE = [0.16, 1, 0.3, 1] as const;

const isFailing = (phase: Phase) =>
  phase === "drop" || phase === "suggest" || phase === "commit";
const showsSuggestion = (phase: Phase) =>
  phase === "suggest" || phase === "commit";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(REDUCED);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/**
 * Same answer on the server and during hydration (motion on), then the real
 * preference: avoids the text mismatch a client-only read would cause.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

type T = (key: string, values?: Record<string, string | number>) => string;

export function PrCard() {
  const t = useTranslations("prCard") as unknown as T;
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  // Reduced motion: one still frame of the resolved story (60 → 94, all committed).
  const phase: Phase = reduced ? "pass" : SEQUENCE[index].phase;
  const running = !reduced && !paused && visible;

  // Time left in the current beat, so pausing resumes where it stopped.
  const remaining = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const ms = remaining.current ?? SEQUENCE[index].ms;
    const started = performance.now();
    const id = window.setTimeout(() => {
      remaining.current = null;
      setIndex((i) => (i + 1) % SEQUENCE.length);
    }, ms);
    return () => {
      window.clearTimeout(id);
      if (remaining.current !== null || performance.now() - started < ms) {
        remaining.current = Math.max(0, ms - (performance.now() - started));
      }
    };
  }, [index, running]);

  // Stop the loop off screen and in background tabs.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let onScreen = true;
    const sync = () => setVisible(onScreen && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <GlassSurface
        variant="hero"
        refract
        state={phase === "pass" ? "pass" : undefined}
        className="hero-card p-4 sm:p-6"
      >
        <div role="img" aria-label={t("label")}>
          <div aria-hidden="true">
            <AnimatedBody phase={phase} t={t} still={!!reduced} />
          </div>
        </div>

        {!reduced && (
          <button
            type="button"
            onClick={togglePause}
            aria-pressed={paused}
            aria-label={paused ? t("play") : t("pause")}
            className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-pill text-fg-muted ring-1 ring-white/10 transition-colors duration-200 hover:bg-white/[0.08] hover:text-fg sm:top-4 sm:right-4"
          >
            {paused ? (
              <Play aria-hidden="true" className="size-4" />
            ) : (
              <Pause aria-hidden="true" className="size-4" />
            )}
          </button>
        )}

        {/* Where the visitor is in the story: one segment per beat. */}
        {!reduced && (
          <div
            aria-hidden="true"
            className="absolute inset-x-5 bottom-2 grid grid-cols-5 gap-1 sm:inset-x-7"
          >
            {SEQUENCE.map((step, i) => (
              <span
                key={step.phase}
                className="h-0.5 overflow-hidden rounded-full bg-white/[0.08]"
              >
                {i < index && <span className="block h-full bg-white/40" />}
                {i === index && (
                  <span
                    key={index}
                    className="block h-full loop-progress bg-white/40"
                    style={{
                      animationDuration: `${step.ms}ms`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                )}
              </span>
            ))}
          </div>
        )}
      </GlassSurface>
    </div>
  );
}

function AnimatedBody({
  phase,
  t,
  still,
}: {
  phase: Phase;
  t: T;
  still: boolean;
}) {
  const value = useMotionValue(SCORE[phase]);
  const [score, setScore] = useState(SCORE[phase]);
  useMotionValueEvent(value, "change", (v) => setScore(Math.round(v)));

  useEffect(() => {
    if (still) {
      value.set(SCORE[phase]);
      return;
    }
    const controls = animate(value, SCORE[phase], {
      duration: phase === "pass" ? 1.4 : 1.1,
      ease: EASE,
    });
    return () => controls.stop();
  }, [phase, still, value]);

  return <CardBody phase={phase} score={score} t={t} still={still} />;
}

function CardBody({
  phase,
  score,
  t,
  still,
}: {
  phase: Phase;
  score: number;
  t: T;
  still: boolean;
}) {
  const failing = isFailing(phase);
  const filled = Math.round(score / 10);
  // Colour follows the state, never the tween: no amber ("warning") in between.
  const tone = failing ? "text-error" : "text-brand-400";
  const fill = failing ? "bg-error" : "bg-brand-400";

  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-3 pr-12">
        <GitPullRequest
          aria-hidden="true"
          className="mt-0.5 size-[18px] shrink-0 text-brand-400"
        />
        <div className="min-w-0">
          <p className="text-[0.9375rem] leading-snug font-bold text-fg">
            {t("title")}
          </p>
          <p className="mt-1.5 hidden items-center gap-1.5 font-mono text-[0.6875rem] text-fg-muted sm:flex">
            <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-info">
              main
            </span>
            <ArrowLeft aria-hidden="true" className="size-3 shrink-0" />
            <span className="truncate rounded-md bg-white/[0.06] px-1.5 py-0.5 text-info">
              feat/request-timing
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 sm:mt-6">
        <div className="min-w-0">
          <p className="text-[0.8125rem] text-fg-muted">{t("readiness")}</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`type-display text-[clamp(3.25rem,2.6rem+3vw,4.5rem)] leading-[0.85] tabular ${tone}`}
            >
              {score}
            </span>
            <span className="font-mono text-sm text-fg-muted">/100</span>
          </p>
          <p className="mt-2 font-mono text-[0.6875rem] text-fg-muted">
            {phase === "main" ? t("onMain") : t("inPr")}
            {still && ` · ${t("wasScore", { score: 60 })}`}
          </p>
        </div>
        <div className="flex min-w-[8.5rem] flex-col items-end gap-1.5 pb-1 text-right">
          <span
            className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-bold ${
              failing
                ? "bg-error/15 text-error"
                : "bg-brand-400/15 text-brand-300"
            }`}
          >
            {failing ? (
              <CircleX aria-hidden="true" className="size-3.5" />
            ) : (
              <CircleCheck aria-hidden="true" className="size-3.5" />
            )}
            {failing ? t("failing") : t("passing")}
          </span>
          <span className="text-[0.75rem] text-fg-muted">
            {failing ? t("blocks") : t("noDebt")}
          </span>
        </div>
      </div>

      {/* ▰▱ bar, ten segments like the PR report; segments switch, never blend. */}
      <div className="mt-4 grid grid-cols-10 gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`h-2 rounded-[3px] ${i < filled ? fill : "bg-ink-700/70"}`}
          />
        ))}
      </div>

      <DiffPanel phase={phase} t={t} still={still} />
    </div>
  );
}

type Row = {
  sign: "+" | "−";
  line: number;
  pkg: "javax" | "jakarta";
  cls: string;
};

const ADDED: Row[] = [
  { sign: "+", line: 4, pkg: "javax", cls: "FilterChain" },
  { sign: "+", line: 5, pkg: "javax", cls: "ServletException" },
];
const SUGGESTED: Row[] = [
  { sign: "−", line: 4, pkg: "javax", cls: "FilterChain" },
  { sign: "+", line: 4, pkg: "jakarta", cls: "FilterChain" },
];
const FIXED: Row[] = [
  { sign: "+", line: 4, pkg: "jakarta", cls: "FilterChain" },
  { sign: "+", line: 5, pkg: "jakarta", cls: "ServletException" },
];

const ROWS: Record<Phase, Row[]> = {
  main: [],
  drop: ADDED,
  suggest: SUGGESTED,
  commit: SUGGESTED,
  pass: FIXED,
};

/**
 * One fixed-height panel whose rows change state, so the loop never resizes the
 * card or shifts the page: empty base → flagged push → suggestion → committed → fixed.
 */
function DiffPanel({
  phase,
  t,
  still,
}: {
  phase: Phase;
  t: T;
  still: boolean;
}) {
  const flagged = isFailing(phase);
  const suggesting = showsSuggestion(phase);
  const committed = phase === "commit";
  const fade = still
    ? {}
    : {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: EASE },
      };

  const footer =
    phase === "main"
      ? t("footerMain")
      : phase === "pass"
        ? t("footerPass", { n: SUGGESTIONS, total: SUGGESTIONS })
        : t("ruleMessage");

  return (
    <div className="mt-5 overflow-hidden rounded-xl bg-ink-1000/55 ring-1 ring-white/[0.07]">
      <div className="mt-3 flex h-6 items-center justify-between gap-3 px-3.5">
        <span className="truncate text-xs font-bold text-fg">
          {suggesting
            ? t("suggestedOf", { n: 1, total: SUGGESTIONS })
            : t("changes")}
        </span>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 font-mono text-[0.6875rem] text-fg-muted ${flagged ? "opacity-100" : "opacity-0"}`}
        >
          <span className="size-1.5 rounded-full bg-error" />
          JAKARTA_NAMESPACE
        </span>
      </div>
      <p className="truncate px-3.5 font-mono text-[0.6875rem] text-fg-muted">
        web/RequestTimingFilter.java
      </p>

      <div className="mt-2.5 h-12 font-mono text-[0.6875rem] leading-6 sm:text-[0.75rem]">
        {phase === "main" ? (
          <motion.p
            key="empty"
            {...fade}
            className="flex h-full items-center px-3.5 text-fg-muted"
          >
            {t("emptyMain")}
          </motion.p>
        ) : (
          ROWS[phase].map((row, i) => {
            const removed = row.sign === "−";
            const bad = row.pkg === "javax" && flagged && !suggesting;
            const rowBg =
              removed || bad ? "bg-error/[0.09]" : "bg-brand-400/[0.07]";
            const mark =
              row.pkg === "jakarta"
                ? suggesting
                  ? "bg-brand-400/20"
                  : "bg-transparent"
                : removed || bad
                  ? "bg-error/25"
                  : "bg-transparent";
            return (
              <motion.div
                key={`${phase === "commit" ? "suggest" : phase}-${i}`}
                {...fade}
                className={`grid grid-cols-[1.75rem_0.875rem_minmax(0,1fr)] sm:grid-cols-[2.25rem_1rem_minmax(0,1fr)] ${rowBg}`}
              >
                <span className="pr-2 text-right text-fg-muted tabular">
                  {row.line}
                </span>
                <span
                  className={removed || bad ? "text-error" : "text-brand-400"}
                >
                  {row.sign}
                </span>
                <span className="truncate text-fg-muted">
                  import{" "}
                  <mark className={`rounded-sm px-0.5 text-fg ${mark}`}>
                    {row.pkg}
                  </mark>
                  .servlet.{row.cls};
                </span>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="flex h-14 items-center justify-between gap-3 px-3.5">
        <p className="line-clamp-2 min-w-0 text-[0.75rem] leading-snug text-fg-muted">
          {footer}
        </p>
        <span
          className={`relative shrink-0 transition-opacity duration-300 ${suggesting ? "opacity-100" : "opacity-0"}`}
        >
          <span
            className={`inline-flex h-8 min-w-[9.25rem] items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-[background-color,color,scale] duration-200 ${
              committed
                ? "scale-[0.97] bg-brand-400 text-ink-1000"
                : "bg-white/[0.08] text-fg ring-1 ring-white/10"
            }`}
          >
            {committed && (
              <CircleCheck aria-hidden="true" className="size-3.5" />
            )}
            {committed ? t("committed") : t("commit")}
          </span>
          {!still && suggesting && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 text-fg drop-shadow-[0_2px_4px_oklch(0_0_0/0.6)]"
              initial={{ x: 52, y: 38, opacity: 0 }}
              animate={
                committed
                  ? { x: 6, y: 2, opacity: [1, 1, 0], scale: [1, 0.82, 1] }
                  : { x: 6, y: 2, opacity: 1 }
              }
              transition={
                committed
                  ? { duration: 1, ease: EASE, times: [0, 0.3, 1] }
                  : { duration: 1, delay: 1.2, ease: EASE }
              }
            >
              <MousePointer2 className="size-4 fill-fg" strokeWidth={1.5} />
            </motion.span>
          )}
        </span>
      </div>
    </div>
  );
}
