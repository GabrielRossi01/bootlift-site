import { getTranslations } from "next-intl/server";
import { ArrowUpRight, CircleCheck, GitMerge } from "lucide-react";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { CopyButton } from "@/components/ui/CopyButton";
import { GitHubMark } from "@/components/ui/GitHubMark";
import { site } from "@/lib/site";
import { Section } from "./Section";

/** The page ends where the hero card ends: 94, green, ready to merge. */
export async function FinalCta() {
  const [t, tHero, tRail] = await Promise.all([
    getTranslations("finalCta"),
    getTranslations("hero"),
    getTranslations("rail"),
  ]);

  const checks = [
    { label: t("checkScore"), value: "94/100" },
    { label: t("checkSuggestions") },
    { label: t("checkDebt") },
  ];

  return (
    <Section
      id="get-started"
      icon={GitMerge}
      event={tRail("final")}
      tone="merged"
      size="xl"
      last
      title={t("title")}
      intro={t("body")}
      className="final-cta isolate overflow-x-clip"
      headerClassName="max-w-4xl"
    >
      <div aria-hidden="true" className="final-cta__light" />

      <GlassSurface
        variant="float"
        state="pass"
        className="relative mt-12 max-w-2xl p-5 sm:p-7"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="flex items-center gap-2.5 font-bold text-fg">
            <CircleCheck aria-hidden="true" className="size-5 text-brand-400" />
            {t("checksTitle")}
          </p>
          <p className="type-display text-3xl leading-none text-brand-400 tabular">
            94
          </p>
        </div>
        <div aria-hidden="true" className="mt-4 grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className={`h-2 rounded-[3px] ${i < 9 ? "bg-brand-400" : "bg-ink-700/70"}`}
            />
          ))}
        </div>

        <ul className="mt-5 grid gap-2.5 border-t border-white/[0.08] pt-5 text-[0.9375rem]">
          {checks.map((check) => (
            <li key={check.label} className="flex items-center gap-2.5">
              <CircleCheck
                aria-hidden="true"
                className="size-4 shrink-0 text-brand-400"
              />
              <span className="min-w-0 flex-1 text-fg-muted">
                {check.label}
              </span>
              {check.value && (
                <span className="font-mono text-sm text-fg">{check.value}</span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-6">
          <a
            href={site.marketplace}
            className="group inline-flex h-12 items-center gap-2 rounded-pill bg-brand-400 pr-5 pl-6 font-bold text-ink-1000 shadow-[inset_0_1px_0_oklch(1_0_0/0.35),0_10px_24px_-12px_oklch(0_0_0/0.7)] transition-[background-color,translate] duration-200 ease-out-quart hover:bg-brand-300 active:translate-y-px"
          >
            {t("primary")}
            <ArrowUpRight
              aria-hidden="true"
              strokeWidth={2.5}
              className="size-4 transition-transform duration-300 ease-lift group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <span className="inline-flex max-w-full items-center gap-1 rounded-pill py-1 pr-1 pl-4 ring-1 ring-white/12">
            <code className="min-w-0 truncate text-[0.8125rem] sm:text-sm">
              <span className="text-fg-muted">- uses: </span>
              <span className="text-fg">GabrielRossi01/bootlift</span>
              <span className="text-brand-300">@v1</span>
            </code>
            <CopyButton
              value={`- uses: ${site.uses}`}
              what={tHero("usesWhat")}
              className="size-10"
            />
          </span>
        </div>
      </GlassSurface>

      <a
        href={site.repo}
        className="mt-6 inline-flex h-11 items-center gap-2 font-bold text-fg-muted transition-colors duration-200 hover:text-fg"
      >
        <GitHubMark className="size-4" />
        {t("secondary")}
      </a>
    </Section>
  );
}
