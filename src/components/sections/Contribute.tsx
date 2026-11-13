import { getTranslations } from "next-intl/server";
import {
  ArrowUpRight,
  Bug,
  BookOpen,
  Code2,
  GitFork,
  Lightbulb,
} from "lucide-react";
import { site } from "@/lib/site";
import { Section } from "./Section";

const PATHS = [
  {
    key: "falsePositive",
    icon: Bug,
    href: `${site.repo}/issues/new?template=1-falso-positivo.yml`,
  },
  {
    key: "newRule",
    icon: Lightbulb,
    href: `${site.repo}/issues/new?template=2-regra-nova.yml`,
  },
  { key: "docs", icon: BookOpen, href: site.contributing },
  {
    key: "code",
    icon: Code2,
    href: `${site.repo}/labels/good%20first%20issue`,
  },
] as const;

const STEPS = [
  { key: "fork", code: null },
  { key: "test", code: "npm ci && npm test" },
  { key: "rule", code: "src/rules/catalog.ts\n__tests__/rules.test.ts" },
  { key: "pr", code: "npm run bundle" },
] as const;

export async function Contribute() {
  const [t, tRail] = await Promise.all([
    getTranslations("contribute"),
    getTranslations("rail"),
  ]);

  return (
    <Section
      id="contribute"
      icon={GitFork}
      event={tRail("contribute")}
      size="md"
      title={t("title")}
      intro={t("intro")}
      className="bg-ink-950/60"
    >
      <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-ink-700/60 ring-1 ring-ink-700/70 sm:grid-cols-2">
        {PATHS.map(({ key, icon: Icon, href }) => (
          <li key={key} className="bg-ink-900">
            <a
              href={href}
              className="group flex h-full items-start gap-4 p-6 transition-colors duration-200 hover:bg-ink-850 focus-visible:outline-offset-[-4px] sm:p-7"
            >
              <Icon
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-brand-400"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3 text-lg font-bold text-fg">
                  {t(`paths.${key}.title`)}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-fg-muted transition-[color,translate] duration-300 ease-lift group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-400"
                  />
                </span>
                <span className="mt-1.5 block text-fg-muted">
                  {t(`paths.${key}.body`)}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <h3 className="mt-16 text-sm font-bold text-fg">{t("stepsTitle")}</h3>
      <ol className="mt-6 grid gap-8 md:grid-cols-4 md:gap-6">
        {STEPS.map((step, i) => (
          <li
            key={step.key}
            className="relative border-t border-ink-700/70 pt-5"
          >
            <span
              aria-hidden="true"
              className="absolute -top-[5px] left-0 size-[9px] rounded-full bg-ink-1000 ring-1 ring-fg-muted"
            />
            <p className="flex items-baseline gap-3">
              <span className="font-mono text-sm text-fg-muted tabular">
                {i + 1}
              </span>
              <span className="font-bold text-fg">
                {t(`steps.${step.key}`)}
              </span>
            </p>
            {step.code && (
              <code className="mt-3 block font-mono text-[0.8125rem] whitespace-pre-line text-fg">
                {step.code}
              </code>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
