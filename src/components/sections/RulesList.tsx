"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MousePointerClick } from "lucide-react";
import { RULES, type Severity } from "@/content/rules";
import { breakable } from "@/lib/breakable";

type Filter = "all" | Severity;
const FILTERS: Filter[] = ["all", "error", "warning", "info"];

const DOT: Record<Severity, string> = {
  error: "bg-error",
  warning: "bg-warning",
  info: "bg-info",
};
const TEXT: Record<Severity, string> = {
  error: "text-error",
  warning: "text-warning",
  info: "text-info",
};

export function RulesList() {
  const t = useTranslations("rules");
  const [filter, setFilter] = useState<Filter>("all");
  const shown = RULES.filter(
    (r) => filter === "all" || r.severities.includes(filter),
  );

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label={t("filterLabel")}
          className="inline-flex flex-wrap gap-1 rounded-pill bg-ink-900/70 p-1 ring-1 ring-ink-700/70"
        >
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`inline-flex h-10 items-center gap-2 rounded-pill px-3 text-sm font-bold transition-colors duration-200 sm:px-4 ${
                  active
                    ? "bg-white/[0.1] text-fg shadow-[inset_0_1px_0_oklch(1_0_0/0.1)]"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {f !== "all" && (
                  <span className={`size-2 rounded-full ${DOT[f]}`} />
                )}
                {t(`filters.${f}`)}
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="text-sm text-fg-muted">
          {t("count", { count: shown.length })}
        </p>
      </div>

      <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-ink-700/60 ring-1 ring-ink-700/70 lg:grid-cols-2">
        {shown.map((rule) => (
          <li
            key={rule.id}
            className="flex flex-col gap-5 bg-ink-900 px-5 py-6 sm:px-6 lg:odd:last:col-span-2"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="font-mono text-[0.9375rem] font-bold break-all text-fg">
                  {rule.id}
                </h3>
                {rule.severities.map((s) => (
                  <span
                    key={s}
                    className={`inline-flex items-center gap-1.5 font-mono text-xs ${TEXT[s]}`}
                  >
                    <span className={`size-1.5 rounded-full ${DOT[s]}`} />
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[0.9375rem] text-fg-muted">
                {t(`items.${rule.id}`)}
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-fg-muted">
                  {t(`scopes.${rule.scope}`)}
                </span>
                {rule.oneClick && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-0.5 font-bold text-fg">
                    <MousePointerClick
                      aria-hidden="true"
                      className="size-3.5"
                    />
                    {t("oneClick")}
                  </span>
                )}
              </p>
            </div>

            <dl className="mt-auto min-w-0 overflow-hidden rounded-xl bg-ink-1000/60 font-mono text-[0.8125rem] leading-7 ring-1 ring-white/[0.06]">
              <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] bg-error/[0.07] pr-3">
                <dt className="text-center text-error">
                  <span aria-hidden="true">−</span>
                  <span className="sr-only">{t("before")}</span>
                </dt>
                <dd className="min-w-0 py-0.5 leading-6 text-fg-muted">
                  {breakable(rule.before)}
                </dd>
              </div>
              <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] bg-brand-400/[0.06] pr-3">
                <dt className="text-center text-brand-400">
                  <span aria-hidden="true">+</span>
                  <span className="sr-only">{t("after")}</span>
                </dt>
                <dd className="min-w-0 py-0.5 leading-6 text-fg">
                  {rule.after ? (
                    breakable(rule.after)
                  ) : (
                    <span className="font-sans text-fg-muted">
                      {t(`afterNotes.${rule.id}`)}
                    </span>
                  )}
                  {rule.after && rule.id === "BOOT_VERSION" && (
                    <span className="font-sans text-fg-muted">
                      {" "}
                      · {t("afterNotes.BOOT_VERSION")}
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
