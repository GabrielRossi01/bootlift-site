import { getTranslations } from "next-intl/server";
import { ArrowUpRight, ChevronDown, MessageCircleQuestion } from "lucide-react";
import { site } from "@/lib/site";
import { Section } from "./Section";

const ITEMS = [
  "fork",
  "noise",
  "monorepo",
  "falsePositive",
  "jdk",
  "cost",
] as const;

export async function Faq() {
  const [t, tRail] = await Promise.all([
    getTranslations("faq"),
    getTranslations("rail"),
  ]);

  return (
    <Section
      id="faq"
      icon={MessageCircleQuestion}
      event={tRail("faq")}
      size="md"
      title={t("title")}
    >
      <div className="mt-12 max-w-3xl border-t border-ink-700/70">
        {ITEMS.map((key) => (
          <details
            key={key}
            className="faq-item group border-b border-ink-700/70"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-lg font-bold text-fg">
              <h3>{t(`items.${key}.q`)}</h3>
              <ChevronDown
                aria-hidden="true"
                className="faq-chevron size-5 shrink-0 text-fg-muted transition-[rotate] duration-300 ease-lift"
              />
            </summary>
            <div className="pb-6 text-fg-muted">
              <p className="max-w-[62ch]">{t(`items.${key}.a`)}</p>
              {key === "falsePositive" && (
                <a
                  href={`${site.repo}/issues/new?template=1-falso-positivo.yml`}
                  className="group/link mt-3 inline-flex items-center gap-1 font-bold text-fg underline decoration-brand-400/60 hover:decoration-brand-400"
                >
                  {t("formLink")}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-brand-400"
                  />
                </a>
              )}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
