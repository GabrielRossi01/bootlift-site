"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";

const WEIGHT = 15; // JAKARTA_NAMESPACE is an error
const CAP = 10;
const MAX = 40;

/** One rule, live: how occurrences turn into a penalty, and where the cap kicks in. */
export function ScoreCalc() {
  const t = useTranslations("score");
  const id = useId();
  const [count, setCount] = useState(30);

  const extra = Math.min(count - 1, CAP);
  const penalty = WEIGHT + extra;
  const score = Math.max(0, 100 - penalty);
  const capped = count - 1 > CAP;
  const filled = Math.round(score / 10);

  return (
    <div className="rounded-2xl bg-ink-900/70 p-5 ring-1 ring-ink-700/70 sm:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-mono text-sm text-fg">
          {t("tryLabel")}
        </label>
        <output
          htmlFor={id}
          className="type-display text-3xl leading-none text-fg tabular"
        >
          {count}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={MAX}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        style={
          {
            "--fill": `${((count - 1) / (MAX - 1)) * 100}%`,
          } as React.CSSProperties
        }
        className="score-range mt-4 w-full"
      />

      <div className="mt-6 grid gap-6 border-t border-ink-700/60 pt-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-fg-muted">{t("resultLabel")}</p>
          <p className="mt-2 font-mono text-lg text-fg">
            <span className="text-error">{WEIGHT}</span>
            <span className="text-fg-muted"> + </span>
            <span
              className={
                capped
                  ? "text-fg underline decoration-fg-muted underline-offset-4"
                  : "text-fg"
              }
            >
              {extra}
            </span>
            <span className="text-fg-muted"> = </span>
            <span className="font-bold">−{penalty}</span>
          </p>
          <p className="mt-1 text-xs text-fg-muted">
            {capped
              ? `${t("cap")} ${t("capValue")}`
              : `${t("extra")} ${t("extraValue")}`}
          </p>
        </div>
        <div>
          <p className="text-sm text-fg-muted">{t("scoreLabel")}</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="type-display text-5xl leading-none text-fg tabular">
              {score}
            </span>
            <span className="font-mono text-sm text-fg-muted">/100</span>
          </p>
          <div aria-hidden="true" className="mt-3 grid grid-cols-10 gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-[2px] ${i < filled ? "bg-error" : "bg-ink-700/70"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
