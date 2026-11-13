import { getTranslations } from "next-intl/server";
import { ListChecks } from "lucide-react";
import { Section } from "./Section";
import { RulesList } from "./RulesList";

export async function Rules() {
  const [t, tRail] = await Promise.all([
    getTranslations("rules"),
    getTranslations("rail"),
  ]);

  return (
    <Section
      id="rules"
      icon={ListChecks}
      event={tRail("rules")}
      title={t("title")}
      intro={t("intro")}
    >
      <RulesList />
    </Section>
  );
}
