import { getTranslations } from "next-intl/server";
import { FlaskConical } from "lucide-react";
import { Section } from "./Section";
import { PlaygroundLazy } from "./PlaygroundLazy";

export async function Playground() {
  const [t, tRail] = await Promise.all([
    getTranslations("playground"),
    getTranslations("rail"),
  ]);

  return (
    <Section
      id="playground"
      icon={FlaskConical}
      event={tRail("playground")}
      title={t("title")}
      intro={t("intro")}
      className="bg-ink-950/60"
    >
      <PlaygroundLazy />
    </Section>
  );
}
