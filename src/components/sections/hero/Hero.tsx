import { getTranslations } from "next-intl/server";
import { ArrowDown, ArrowRight, GitPullRequest } from "lucide-react";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { CopyButton } from "@/components/ui/CopyButton";
import { site } from "@/lib/site";
import { PrCard } from "./PrCard";

const STEP = `- uses: ${site.uses}`;

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-x-clip pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28"
    >
      <HeroLight />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:pl-16">
        {/* The PR timeline rail starts here: the page is the pull request. */}
        <div aria-hidden="true" className="pr-rail hidden lg:block">
          <span className="pr-rail__node">
            <GitPullRequest className="size-3.5" strokeWidth={2.25} />
          </span>
        </div>

        <h1
          id="hero-title"
          className="relative max-w-[15ch] type-display text-display-1"
        >
          {t("title")}
        </h1>

        <div className="mt-7 grid grid-cols-[minmax(0,1fr)] items-start gap-10 sm:mt-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-10">
          <div className="max-w-xl">
            <p className="text-lede text-fg-muted">{t("subtitle")}</p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <a
                href="#quickstart"
                className="group inline-flex h-12 items-center gap-2 rounded-pill bg-brand-400 pr-4.5 pl-5.5 font-bold text-ink-1000 shadow-[inset_0_1px_0_oklch(1_0_0/0.35),0_10px_24px_-12px_oklch(0_0_0/0.7)] transition-[background-color,translate] duration-200 ease-out-quart hover:bg-brand-300 active:translate-y-px"
              >
                {t("ctaPrimary")}
                <ArrowDown
                  aria-hidden="true"
                  strokeWidth={2.5}
                  className="size-4 transition-transform duration-300 ease-lift group-hover:translate-y-0.5"
                />
              </a>
              <GlassSurface
                as="a"
                variant="chip"
                href="#playground"
                className="group inline-flex h-12 items-center gap-2 pr-4.5 pl-5 font-bold text-fg transition-colors duration-200 hover:text-brand-300"
              >
                {t("ctaSecondary")}
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={2.5}
                  className="size-4 transition-transform duration-300 ease-lift group-hover:translate-x-0.5"
                />
              </GlassSurface>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
              <GlassSurface
                variant="chip"
                className="inline-flex max-w-full items-center gap-1 py-1 pr-1 pl-4"
              >
                <code className="min-w-0 truncate text-[0.8125rem] sm:text-sm">
                  <span className="text-fg-muted">- uses: </span>
                  <span className="text-fg">GabrielRossi01/bootlift</span>
                  <span className="text-brand-300">@v1</span>
                </code>
                <CopyButton
                  value={STEP}
                  what={t("usesWhat")}
                  className="size-10"
                />
              </GlassSurface>
              <p className="text-sm text-fg-muted">
                {t("meta", { version: site.version })}
              </p>
            </div>
          </div>

          <div className="hero-card-slot relative w-full max-w-xl lg:max-w-none">
            <PrCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Volumetric green light behind the card; drifts with scroll (CSS scroll timeline). */
function HeroLight() {
  return (
    <div
      aria-hidden="true"
      className="hero-light pointer-events-none absolute inset-0 -z-10"
    >
      <div className="hero-light__ambient" />
      <div className="hero-light__shaft" />
      <div className="hero-light__core" />
    </div>
  );
}
