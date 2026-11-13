import { getTranslations } from "next-intl/server";
import {
  FileCode2,
  FileCog,
  GitCommitHorizontal,
  MessageSquareText,
  PanelTop,
  Tag,
} from "lucide-react";
import { Section } from "./Section";
import { breakable } from "@/lib/breakable";

const FILES = [
  { path: "pom.xml", icon: FileCog },
  { path: "build.gradle.kts", icon: FileCog },
  { path: "gradle/libs.versions.toml", icon: FileCog },
  { path: "gradle/wrapper/gradle-wrapper.properties", icon: FileCog },
  { path: "src/main/resources/application.yml", icon: FileCog },
  { path: "src/main/java/…/*.java · *.kt", icon: FileCode2 },
];

export async function HowItWorks() {
  const [t, tRail] = await Promise.all([
    getTranslations("how"),
    getTranslations("rail"),
  ]);

  return (
    <Section
      id="how-it-works"
      icon={GitCommitHorizontal}
      event={tRail("how")}
      title={t("title")}
      intro={t("intro")}
      className="bg-ink-950/60"
    >
      <ol className="mt-16 grid gap-16 lg:gap-20">
        <Step n={1} title={t("scan.title")} body={t("scan.body")}>
          <div className="rounded-2xl bg-ink-900/70 p-5 ring-1 ring-ink-700/70 sm:p-6">
            <p className="text-xs font-bold text-fg-muted">{t("reads")}</p>
            <ul className="mt-3 grid gap-2 font-mono text-[0.8125rem]">
              {FILES.map(({ path, icon: Icon }) => (
                <li
                  key={path}
                  className="flex min-w-0 items-center gap-2.5 text-fg"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-fg-muted"
                  />
                  <span className="min-w-0">{breakable(path)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 inline-flex items-center gap-2 rounded-pill bg-white/[0.06] px-3 py-1 text-xs font-bold text-fg">
              {t("noJdk")}
            </p>
          </div>
        </Step>

        <Step n={2} title={t("score.title")} body={t("score.body")}>
          <div className="rounded-2xl bg-ink-900/70 p-5 ring-1 ring-ink-700/70 sm:p-6">
            <p className="text-[0.9375rem] font-bold text-fg">
              Bootlift · Spring Boot 4 Readiness:{" "}
              <span className="text-brand-400">94/100</span>
            </p>
            <p
              aria-hidden="true"
              className="mt-2 font-mono text-lg tracking-[0.12em] text-brand-400"
            >
              ▰▰▰▰▰▰▰▰▰<span className="text-ink-600">▱</span>
            </p>
            <ul className="mt-5 grid gap-2.5 border-t border-ink-700/60 pt-4 text-sm text-fg-muted sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <MessageSquareText
                  aria-hidden="true"
                  className="size-4 text-fg"
                />
                {t("outComment")}
              </li>
              <li className="flex items-center gap-2">
                <PanelTop aria-hidden="true" className="size-4 text-fg" />
                {t("outSummary")}
              </li>
              <li className="flex items-center gap-2">
                <Tag aria-hidden="true" className="size-4 text-fg" />
                {t("outAnnotations")}
              </li>
            </ul>
          </div>
        </Step>

        <Step n={3} title={t("guard.title")} body={t("guard.body")}>
          <div className="overflow-hidden rounded-2xl bg-ink-900/70 ring-1 ring-ink-700/70">
            <p className="border-b border-ink-700/60 px-5 py-3 font-mono text-xs text-fg-muted sm:px-6">
              src/main/java/…/OrderController.java
            </p>
            <div className="font-mono text-[0.8125rem] leading-7">
              <DiffLine n={12} sign=" " tone="context">
                import <b className="font-normal text-fg">javax</b>
                .persistence.Entity;
              </DiffLine>
              <Note tone="context" title={t("legacy")} body={t("legacyNote")} />
              <DiffLine n={13} sign="+" tone="bad">
                import{" "}
                <mark className="rounded-sm bg-error/25 px-0.5 text-fg">
                  javax
                </mark>
                .validation.Valid;
              </DiffLine>
              <Note tone="bad" title={t("added")} body={t("addedNote")} />
              <DiffLine n={13} sign="+" tone="good">
                import{" "}
                <mark className="rounded-sm bg-brand-400/20 px-0.5 text-fg">
                  jakarta
                </mark>
                .validation.Valid;
              </DiffLine>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-700/60 px-5 py-3 font-sans sm:px-6">
                <span className="text-xs font-bold text-fg">
                  {t("suggestion")}
                </span>
                <span className="inline-flex h-8 items-center rounded-lg bg-white/[0.08] px-3 text-xs font-bold text-fg ring-1 ring-white/10">
                  {t("commit")}
                </span>
              </div>
            </div>
          </div>
        </Step>
      </ol>
    </Section>
  );
}

function Step({
  n,
  title,
  body,
  children,
}: {
  n: number;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <li className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      <div className="lg:pt-2">
        <p className="flex items-baseline gap-4">
          <span className="type-display text-[2.5rem] leading-none text-fg-subtle tabular">
            {n}
          </span>
          <span className="type-display text-[1.75rem] leading-tight text-fg">
            {title}
          </span>
        </p>
        <p className="mt-4 max-w-[46ch] text-fg-muted">{body}</p>
      </div>
      {children}
    </li>
  );
}

const TONES = {
  context: { row: "", sign: "text-fg-subtle", note: "text-fg-muted" },
  bad: { row: "bg-error/[0.09]", sign: "text-error", note: "text-error" },
  good: {
    row: "bg-brand-400/[0.07]",
    sign: "text-brand-400",
    note: "text-brand-300",
  },
} as const;

function DiffLine({
  n,
  sign,
  tone,
  children,
}: {
  n: number;
  sign: string;
  tone: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`grid grid-cols-[3rem_1.25rem_minmax(0,1fr)] pr-4 ${TONES[tone].row}`}
    >
      <span className="pr-3 text-right text-fg-subtle tabular">{n}</span>
      <span aria-hidden="true" className={TONES[tone].sign}>
        {sign}
      </span>
      <span className="min-w-0 break-words text-fg-muted">{children}</span>
    </p>
  );
}

function Note({
  tone,
  title,
  body,
}: {
  tone: keyof typeof TONES;
  title: string;
  body: string;
}) {
  return (
    <p className="py-2.5 pr-4 pl-[4.25rem] font-sans text-[0.8125rem] leading-snug">
      <span className={`font-bold ${TONES[tone].note}`}>{title}.</span>{" "}
      <span className="text-fg-muted">{body}</span>
    </p>
  );
}
