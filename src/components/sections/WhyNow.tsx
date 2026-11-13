import { getTranslations } from "next-intl/server";
import { GitBranch } from "lucide-react";
import { Section } from "./Section";

const CHANGES = [
  { key: "jakarta", from: "javax.servlet.*", to: "jakarta.servlet.*" },
  { key: "jackson", from: "com.fasterxml.jackson.*", to: "tools.jackson.*" },
  { key: "testing", from: "@MockBean", to: "@MockitoBean" },
  { key: "config", from: "spring.data.mongodb.uri", to: "spring.mongodb.uri" },
] as const;

export async function WhyNow() {
  const [t, tRail] = await Promise.all([
    getTranslations("whyNow"),
    getTranslations("rail"),
  ]);

  const stats = [
    { value: "12", label: t("stats.rules") },
    { value: "96", label: t("stats.properties") },
    { value: "0", label: t("stats.config") },
    { value: t("stats.seconds"), label: t("stats.secondsLabel"), word: true },
  ];

  return (
    <Section
      id="why-now"
      icon={GitBranch}
      event={tRail("whyNow")}
      title={t("title")}
      intro={t("intro")}
    >
      <div className="mt-14 overflow-hidden rounded-2xl bg-ink-900/70 ring-1 ring-ink-700/70">
        <h3 className="sr-only">{t("changesLabel")}</h3>
        <ul className="divide-y divide-ink-700/60">
          {CHANGES.map((change) => (
            <li
              key={change.key}
              className="grid gap-x-8 gap-y-2 px-5 py-4 sm:px-6 md:grid-cols-[11rem_minmax(0,1fr)] md:items-center"
            >
              <p className="text-[0.9375rem] font-bold text-fg">
                {t(`changes.${change.key}`)}
              </p>
              <div className="grid gap-1 font-mono text-[0.8125rem] sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-8">
                <p className="min-w-0 truncate">
                  <span aria-hidden="true" className="mr-2 text-error">
                    −
                  </span>
                  <span className="text-fg-muted line-through decoration-error/50">
                    {change.from}
                  </span>
                </p>
                <p className="min-w-0 truncate">
                  <span aria-hidden="true" className="mr-2 text-brand-400">
                    +
                  </span>
                  <span className="text-fg">{change.to}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <h3 className="sr-only">{t("statsLabel")}</h3>
      <dl className="mt-14 grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex min-w-0 flex-col-reverse gap-2 pr-4 ${i % 2 === 1 ? "border-l border-ink-700/60 pl-5" : ""} ${i > 0 ? "md:border-l md:border-ink-700/60 md:pl-6" : ""}`}
          >
            <dt className="text-sm text-fg-muted">{stat.label}</dt>
            <dd
              className={`type-display leading-none text-fg tabular ${stat.word ? "pt-[0.35em] text-[clamp(1.375rem,0.9rem+1.9vw,2.5rem)] break-words" : "text-[clamp(3rem,2rem+4vw,5rem)]"}`}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
