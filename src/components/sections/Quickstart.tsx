import { getTranslations } from "next-intl/server";
import { FileCode2, Workflow } from "lucide-react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CopyButton } from "@/components/ui/CopyButton";
import { INPUTS, OUTPUTS, WORKFLOW } from "@/content/workflow";
import { Section } from "./Section";

export async function Quickstart() {
  const [t, tRail] = await Promise.all([
    getTranslations("quickstart"),
    getTranslations("rail"),
  ]);

  return (
    <Section
      id="quickstart"
      icon={Workflow}
      event={tRail("quickstart")}
      tone="pass"
      title={t("title")}
      intro={t("intro")}
      className="bg-ink-950/60"
    >
      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div className="min-w-0 overflow-hidden rounded-2xl bg-ink-900/80 ring-1 ring-ink-700/70">
          <div className="flex items-center justify-between gap-3 border-b border-ink-700/60 py-1.5 pr-1.5 pl-5">
            <p className="flex min-w-0 items-center gap-2 font-mono text-xs text-fg-muted">
              <FileCode2 aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">.github/workflows/bootlift.yml</span>
            </p>
            <CopyButton
              value={WORKFLOW}
              what={t("copyWhat")}
              className="size-10"
            />
          </div>
          <CodeBlock code={WORKFLOW.trimEnd()} />
        </div>

        <div className="grid gap-8">
          <div>
            <h3 className="text-sm font-bold text-fg">{t("permissions")}</h3>
            <dl className="mt-3 grid gap-3 text-[0.9375rem]">
              <div>
                <dt className="font-mono text-sm text-fg">contents: read</dt>
                <dd className="mt-0.5 text-fg-muted">
                  {t("permDesc.contents")}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-sm text-fg">
                  pull-requests: write
                </dt>
                <dd className="mt-0.5 text-fg-muted">{t("permDesc.pr")}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-ink-900/70 p-5 ring-1 ring-ink-700/70">
            <h3 className="font-mono text-sm font-bold text-fg">
              {t("versionsTitle")}
            </h3>
            <dl className="mt-3 grid gap-3 text-[0.9375rem]">
              <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-3">
                <dt className="font-mono text-sm text-fg">@v1</dt>
                <dd className="text-fg-muted">{t("v1")}</dd>
              </div>
              <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-3">
                <dt className="font-mono text-sm text-fg">@v1.0.1</dt>
                <dd className="text-fg-muted">{t("vExact")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-fg">{t("inputs")}</h3>
          <div
            role="region"
            aria-label={t("inputs")}
            tabIndex={0}
            className="mt-3 overflow-x-auto"
          >
            <table className="w-full min-w-[34rem] text-left text-[0.9375rem]">
              <thead>
                <tr className="border-b border-ink-700/70 text-xs text-fg-muted">
                  <th scope="col" className="py-2 pr-4 font-bold">
                    {t("colName")}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-bold">
                    {t("colDefault")}
                  </th>
                  <th scope="col" className="py-2 font-bold">
                    {t("colDescription")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700/50">
                {INPUTS.map((input) => (
                  <tr key={input.name} className="align-top">
                    <th
                      scope="row"
                      className="py-3 pr-4 font-mono text-sm font-normal whitespace-nowrap text-fg"
                    >
                      {input.name}
                    </th>
                    <td className="py-3 pr-4 font-mono text-sm whitespace-nowrap text-fg-muted">
                      {input.default ?? (
                        <em className="font-sans">{t("defaultEmpty")}</em>
                      )}
                    </td>
                    <td className="py-3 text-fg-muted">
                      {t(`inputDesc.${input.name}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-fg">{t("outputs")}</h3>
          <dl className="mt-3 divide-y divide-ink-700/50 border-t border-ink-700/70 text-[0.9375rem]">
            {OUTPUTS.map((name) => (
              <div
                key={name}
                className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-3"
              >
                <dt className="font-mono text-sm text-fg">{name}</dt>
                <dd className="text-fg-muted">{t(`outputDesc.${name}`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
