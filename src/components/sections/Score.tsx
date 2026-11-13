import { getTranslations } from "next-intl/server";
import { Gauge } from "lucide-react";
import { Section } from "./Section";
import { ScoreCalc } from "./ScoreCalc";

const WEIGHTS = [
  { severity: "error", value: 15, dot: "bg-error", text: "text-error" },
  { severity: "warning", value: 5, dot: "bg-warning", text: "text-warning" },
  { severity: "info", value: 1, dot: "bg-info", text: "text-info" },
] as const;

export async function Score() {
  const [t, tRail] = await Promise.all([
    getTranslations("score"),
    getTranslations("rail"),
  ]);

  return (
    <Section
      id="score"
      icon={Gauge}
      event={tRail("score")}
      tone="pass"
      size="md"
      title={t("title")}
      intro={t("intro")}
    >
      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <h3 className="text-sm font-bold text-fg">{t("weights")}</h3>
          <dl className="mt-4 grid grid-cols-3 border-y border-ink-700/60">
            {WEIGHTS.map((w, i) => (
              <div
                key={w.severity}
                className={`flex flex-col-reverse gap-2 py-5 ${i > 0 ? "border-l border-ink-700/60 pl-5" : ""}`}
              >
                <dt
                  className={`inline-flex items-center gap-1.5 font-mono text-xs ${w.text}`}
                >
                  <span className={`size-1.5 rounded-full ${w.dot}`} />
                  {w.severity}
                </dt>
                <dd className="type-display text-[2.75rem] leading-none text-fg tabular">
                  −{w.value}
                </dd>
              </div>
            ))}
          </dl>
          <dl className="mt-6 grid gap-3 text-[0.9375rem]">
            <div className="flex items-baseline justify-between gap-4 border-b border-ink-700/40 pb-3">
              <dt className="text-fg-muted">{t("extra")}</dt>
              <dd className="font-mono text-fg">{t("extraValue")}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-fg-muted">{t("cap")}</dt>
              <dd className="font-mono text-fg">{t("capValue")}</dd>
            </div>
          </dl>
          <p className="mt-8 max-w-[40ch] text-fg">{t("note")}</p>
        </div>

        <ScoreCalc />
      </div>
    </Section>
  );
}
