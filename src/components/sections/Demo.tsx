import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Play } from "lucide-react";
import { site } from "@/lib/site";
import { Section } from "./Section";
import { DemoPlayer } from "./DemoPlayer";

export async function Demo() {
  const [t, tRail] = await Promise.all([
    getTranslations("demo"),
    getTranslations("rail"),
  ]);

  return (
    <Section
      id="demo"
      icon={Play}
      event={tRail("demo")}
      tone="fail"
      title={t("title")}
      intro={
        <>
          {t("intro")}{" "}
          <a
            href={site.demoPulls}
            className="group inline-flex items-center gap-1 font-bold whitespace-nowrap text-fg underline decoration-brand-400/60 hover:decoration-brand-400"
          >
            {t("openPrs")}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-brand-400 transition-transform duration-300 ease-lift group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </>
      }
    >
      <div className="mt-12">
        <DemoPlayer />
      </div>
    </Section>
  );
}
