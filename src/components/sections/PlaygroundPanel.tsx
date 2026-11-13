"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import {
  ArrowDown,
  CircleCheck,
  CircleX,
  FileWarning,
  Lock,
  RotateCcw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { EXAMPLES } from "@/content/examples.generated";
import { analyze, type Analysis } from "@/lib/engine/analyze";
import { shouldFail } from "@/lib/engine/rules/engine";
import type { Finding, Severity } from "@/lib/engine/types";
import { classify } from "@/lib/classify";
import { sniffFileName } from "@/lib/sniff";
import { translateFinding } from "@/lib/translate-finding";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const DEBOUNCE_MS = 250;
const LINE_HEIGHT = 22; // px, shared by the gutter and the textarea
const PAD_TOP = 12; // px, py-3 on gutter and textarea

const DOT: Record<Severity, string> = {
  error: "bg-error",
  warning: "bg-warning",
  info: "bg-info",
};
const TEXT: Record<Severity, string> = {
  error: "text-error",
  warning: "text-warning",
  info: "text-info",
};

type Input = { name: string; content: string };
type Translate = (f: Finding) => { message: string; fix: string };

function countLines(text: string) {
  let n = 1;
  for (let i = text.indexOf("\n"); i !== -1; i = text.indexOf("\n", i + 1)) n++;
  return n;
}

const baseName = (path: string) => path.split(/[\\/]/).pop() ?? "";

/**
 * What the engine actually tells apart: Java and Kotlin share one rule set, but
 * pom.xml vs build.gradle and .yml vs .properties are parsed differently.
 */
function kindOf(name: string) {
  const scope = classify(name);
  if (!scope || scope === "java") return scope;
  const base = baseName(name);
  if (scope === "config") {
    return /\.ya?ml$/.test(base) ? "config:yaml" : "config:properties";
  }
  return base.endsWith(".versions.toml") ? "build:toml" : `build:${base}`;
}

export function PlaygroundPanel() {
  const t = useTranslations("playground");
  const tScope = useTranslations("rules.scopes");
  const tEngine = useTranslations("engine");
  const locale = useLocale();

  const [exampleId, setExampleId] = useState(EXAMPLES[0].id);
  const [input, setInput] = useState<Input>({
    name: EXAMPLES[0].path,
    content: EXAMPLES[0].content,
  });
  // Analysis runs on a debounced copy; the first render (server included) is
  // already analyzed, so the page ships with real results and no JS required.
  const [settled, setSettled] = useState<Input>(input);
  useEffect(() => {
    if (input === settled) return;
    const id = window.setTimeout(() => setSettled(input), DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [input, settled]);

  const scope = classify(settled.name);
  const result = useMemo(() => {
    if (!scope || !settled.content.trim()) return null;
    return analyze([{ scope, path: settled.name, content: settled.content }]);
  }, [scope, settled]);
  const lines = useMemo(() => settled.content.split("\n"), [settled.content]);

  const example = EXAMPLES.find((e) => e.id === exampleId);
  const edited =
    !example ||
    input.content !== example.content ||
    input.name !== example.path;

  // Content says one thing, the name says another: offer the better name.
  const guess = useMemo(
    () => sniffFileName(settled.content),
    [settled.content],
  );
  const mismatch =
    guess && kindOf(guess) !== kindOf(settled.name) ? guess : undefined;

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // The gutter only re-renders when the line count changes, not per keystroke.
  const lineCount = countLines(input.content);
  const gutterText = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1).join("\n"),
    [lineCount],
  );

  function commit(value: Input) {
    setInput(value);
    setSettled(value);
  }

  function pickExample(id: string) {
    const next = EXAMPLES.find((e) => e.id === id)!;
    setExampleId(id);
    commit({ name: next.path, content: next.content });
    if (editorRef.current) editorRef.current.scrollTop = 0;
    if (gutterRef.current) gutterRef.current.scrollTop = 0;
  }

  function onContentChange(content: string) {
    setInput((current) => {
      // Pasting over an untouched example: follow the pasted file's type.
      const untouched =
        example !== undefined && current.content === example.content;
      const sniffed = untouched ? sniffFileName(content) : undefined;
      const name =
        sniffed && kindOf(sniffed) !== kindOf(current.name)
          ? sniffed
          : current.name;
      return { name, content };
    });
  }

  const goToLine = useCallback((n: number) => {
    const el = editorRef.current;
    if (!el) return;
    const all = el.value.split("\n");
    const line = all[n - 1] ?? "";
    const indent = line.length - line.trimStart().length;
    const start = all.slice(0, n - 1).reduce((sum, l) => sum + l.length + 1, 0);
    el.focus();
    el.setSelectionRange(start + indent, start + line.length);
    el.scrollTop = Math.max(0, (n - 4) * LINE_HEIGHT);
  }, []);

  const apply = useCallback(
    (findings: Finding[]) => {
      const next = settled.content.split("\n");
      for (const f of findings) {
        if (f.suggestion !== undefined) next[f.line - 1] = f.suggestion;
      }
      const value = { name: settled.name, content: next.join("\n") };
      setInput(value);
      setSettled(value);
    },
    [settled],
  );

  const translate = useCallback<Translate>(
    (f) => translateFinding(f, locale, (key, values) => tEngine(key, values)),
    [locale, tEngine],
  );

  const failing = result ? shouldFail(result.findings, "error") : false;
  const status = !settled.name.trim()
    ? t("emptyName")
    : !scope
      ? t("unsupported", { name: baseName(settled.name) })
      : !result
        ? t("emptyEditor")
        : t("status", {
            score: result.score,
            verdict: failing ? t("guardFail") : t("guardPass"),
            counts: t("counts", {
              errors: result.counts.error,
              warnings: result.counts.warning,
              info: result.counts.info,
            }),
          });

  return (
    <>
      {/* One persistent live region, so changes are announced once and reliably. */}
      <p role="status" className="sr-only">
        {status}
      </p>

      <GlassSurface
        variant="float"
        specular={false}
        className="mt-12 p-2 sm:p-3"
      >
        <div className="grid gap-3 lg:h-[42.5rem] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/* Editor */}
          <div className="flex min-w-0 flex-col overflow-hidden rounded-[0.875rem] bg-ink-1000/80">
            <div className="border-b border-white/[0.06] p-3 sm:p-4">
              <div
                role="group"
                aria-label={t("examplesLabel")}
                className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap"
              >
                {EXAMPLES.map((e) => {
                  const active = e.id === exampleId && !edited;
                  return (
                    <button
                      key={e.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => pickExample(e.id)}
                      className={`inline-flex h-10 min-w-0 items-center justify-center rounded-lg px-3 font-mono text-xs transition-[background-color,color] duration-200 sm:justify-start ${
                        active
                          ? "bg-white/[0.1] text-fg ring-1 ring-white/15"
                          : "text-fg-muted hover:bg-white/[0.05] hover:text-fg"
                      }`}
                    >
                      <span className="truncate">{e.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white/[0.04] px-3 ring-1 ring-white/[0.08] focus-within:ring-2 focus-within:ring-brand-400">
                  <span className="shrink-0 text-xs text-fg-muted">
                    {t("fileName")}
                  </span>
                  <input
                    value={input.name}
                    onChange={(e) =>
                      setInput((v) => ({ ...v, name: e.target.value }))
                    }
                    spellCheck={false}
                    autoComplete="off"
                    className="h-10 min-w-0 flex-1 bg-transparent font-mono text-[0.8125rem] text-fg outline-none"
                  />
                  {scope && (
                    <span className="shrink-0 rounded-md bg-white/[0.08] px-2 py-0.5 text-xs font-bold text-fg">
                      {tScope(scope)}
                    </span>
                  )}
                </label>
                {edited && example && (
                  <button
                    type="button"
                    onClick={() => pickExample(example.id)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-fg-muted transition-[background-color,color] hover:bg-white/[0.05] hover:text-fg"
                  >
                    <RotateCcw aria-hidden="true" className="size-3.5" />
                    {t("reset")}
                  </button>
                )}
              </div>

              {mismatch && (
                <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-fg-muted">
                  <Sparkles aria-hidden="true" className="size-3.5 text-info" />
                  {t("sniffHint", { name: mismatch })}
                  <button
                    type="button"
                    onClick={() =>
                      commit({ name: mismatch, content: input.content })
                    }
                    className="inline-flex min-h-6 items-center font-bold text-fg underline decoration-white/30 underline-offset-2 hover:decoration-fg"
                  >
                    {t("sniffAction", { name: mismatch })}
                  </button>
                </p>
              )}
            </div>

            <div className="relative grid h-[22rem] min-h-0 grid-cols-[2.75rem_minmax(0,1fr)] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-brand-400 sm:h-[30rem] lg:h-auto lg:flex-1">
              <div
                ref={gutterRef}
                aria-hidden="true"
                className="relative overflow-hidden border-r border-white/[0.05] select-none"
              >
                <pre
                  className="py-3 pr-2.5 text-right font-mono text-xs text-fg-subtle tabular"
                  style={{ lineHeight: `${LINE_HEIGHT}px` }}
                >
                  {gutterText}
                </pre>
                {result?.findings.map((f, i) => (
                  <span
                    key={`${f.line}-${i}`}
                    className={`absolute left-1.5 size-1.5 rounded-full ${DOT[f.severity]}`}
                    style={{
                      top:
                        PAD_TOP +
                        (f.line - 1) * LINE_HEIGHT +
                        LINE_HEIGHT / 2 -
                        3,
                    }}
                  />
                ))}
              </div>
              <textarea
                ref={editorRef}
                aria-label={t("editorLabel")}
                value={input.content}
                onChange={(e) => onContentChange(e.target.value)}
                onScroll={(e) => {
                  if (gutterRef.current)
                    gutterRef.current.scrollTop = e.currentTarget.scrollTop;
                }}
                placeholder={t("emptyEditor")}
                wrap="off"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="h-full resize-none bg-transparent px-3 py-3 font-mono text-[0.8125rem] text-fg caret-brand-400 outline-none placeholder:text-fg-subtle focus-visible:outline-none"
                style={{ lineHeight: `${LINE_HEIGHT}px`, tabSize: 2 }}
              />
            </div>

            <p className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-2.5 text-xs text-fg-muted">
              <Lock aria-hidden="true" className="size-3.5" />
              {t("privacy")}
            </p>
          </div>

          {/* Results: fixed height on every screen, so updates never move the page. */}
          <div className="flex h-[36rem] min-w-0 flex-col rounded-[0.875rem] bg-ink-1000/60 p-4 sm:p-5 lg:h-auto lg:min-h-0">
            {!settled.name.trim() || !scope ? (
              <p className="flex items-start gap-2.5 text-[0.9375rem] text-fg-muted">
                <FileWarning
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-warning"
                />
                {status}
              </p>
            ) : !result ? (
              <p className="text-[0.9375rem] text-fg-muted">{status}</p>
            ) : (
              <Results
                result={result}
                lines={lines}
                failing={failing}
                translate={translate}
                goToLine={goToLine}
                apply={apply}
              />
            )}
          </div>
        </div>
      </GlassSurface>

      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem] text-fg-muted">
        {t("exit")}
        <a
          href="#quickstart"
          className="group inline-flex min-h-6 items-center gap-1.5 font-bold text-fg underline decoration-white/25 underline-offset-4 hover:decoration-fg"
        >
          {t("exitLink")}
          <ArrowDown
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-lift group-hover:translate-y-0.5"
          />
        </a>
      </p>
    </>
  );
}

const Results = memo(function Results({
  result,
  lines,
  failing,
  translate,
  goToLine,
  apply,
}: {
  result: Analysis;
  lines: string[];
  failing: boolean;
  translate: Translate;
  goToLine: (n: number) => void;
  apply: (findings: Finding[]) => void;
}) {
  const t = useTranslations("playground");
  const { project, findings, counts } = result;
  const filled = Math.floor(result.score / 10);
  const withSuggestion = findings.filter((f) => f.suggestion !== undefined);

  const detected = [
    { label: t("boot"), value: project.boot[0]?.value },
    { label: t("java"), value: project.java[0]?.value },
    { label: t("gradle"), value: project.gradle[0]?.value },
    {
      label: t("buildTool"),
      value: project.buildTools.join(", ") || undefined,
    },
  ].filter((d) => d.value);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <p className="text-[0.8125rem] text-fg-muted">{t("score")}</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <AnimatedScore
              value={result.score}
              className={`type-display text-[3.5rem] leading-[0.85] tabular ${failing ? "text-error" : "text-brand-400"}`}
            />
            <span className="font-mono text-sm text-fg-muted">/100</span>
          </p>
        </div>
        <p
          className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-bold ${
            failing
              ? "bg-error/15 text-error"
              : "bg-brand-400/15 text-brand-300"
          }`}
        >
          {failing ? (
            <CircleX aria-hidden="true" className="size-3.5 shrink-0" />
          ) : (
            <CircleCheck aria-hidden="true" className="size-3.5 shrink-0" />
          )}
          {failing ? t("guardFail") : t("guardPass")}
        </p>
      </div>
      <div aria-hidden="true" className="mt-4 grid grid-cols-10 gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`h-2 rounded-[3px] ${i < filled ? (failing ? "bg-error" : "bg-brand-400") : "bg-ink-700/70"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-fg-muted">
        {t("counts", {
          errors: counts.error,
          warnings: counts.warning,
          info: counts.info,
        })}
        {failing && <span className="mt-1 block">{t("guardNote")}</span>}
      </p>

      {detected.length > 0 && (
        <>
          <h3 className="mt-5 text-xs font-bold text-fg">{t("detected")}</h3>
          <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem]">
            {detected.map((d) => (
              <div key={d.label} className="flex items-baseline gap-2">
                <dt className="text-fg-muted">{d.label}</dt>
                <dd className="font-mono text-fg">{d.value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <div className="mt-5 flex min-h-8 items-center justify-between gap-3">
        <h3 className="text-xs font-bold text-fg">{t("findings")}</h3>
        {withSuggestion.length > 1 && (
          <button
            type="button"
            onClick={() => apply(withSuggestion)}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-fg ring-1 ring-white/15 transition-[background-color] hover:bg-white/[0.06]"
          >
            <Wand2 aria-hidden="true" className="size-3.5 text-brand-400" />
            {t("applyAll", { n: withSuggestion.length })}
          </button>
        )}
      </div>

      {findings.length === 0 ? (
        <p className="mt-3 flex items-center gap-2 text-[0.9375rem] text-fg-muted">
          <CircleCheck aria-hidden="true" className="size-4 text-brand-400" />
          {t("empty")}
        </p>
      ) : (
        <ol className="-mx-1 mt-1 min-h-0 min-w-0 flex-1 divide-y divide-white/[0.06] overflow-y-auto px-1">
          {findings.map((f, i) => (
            <FindingItem
              key={`${f.ruleId}-${f.line}-${i}`}
              finding={f}
              before={lines[f.line - 1]}
              translate={translate}
              goToLine={goToLine}
              apply={apply}
            />
          ))}
        </ol>
      )}
    </>
  );
});

function FindingItem({
  finding: f,
  before,
  translate,
  goToLine,
  apply,
}: {
  finding: Finding;
  before: string | undefined;
  translate: Translate;
  goToLine: (n: number) => void;
  apply: (findings: Finding[]) => void;
}) {
  const t = useTranslations("playground");
  const { message, fix } = translate(f);

  return (
    <li className="min-w-0 py-3.5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-xs ${TEXT[f.severity]}`}
        >
          <span className={`size-1.5 rounded-full ${DOT[f.severity]}`} />
          {f.severity}
        </span>
        <a
          href={`#rule-${f.ruleId}`}
          className="font-mono text-xs font-bold break-all text-fg underline decoration-transparent underline-offset-2 hover:decoration-fg-muted"
        >
          {f.ruleId}
        </a>
        <button
          type="button"
          onClick={() => goToLine(f.line)}
          aria-label={t("goToLine", { n: f.line })}
          className="ml-auto inline-flex min-h-6 shrink-0 items-center rounded-md px-1.5 font-mono text-xs text-fg-muted underline decoration-white/20 underline-offset-2 transition-colors hover:text-fg hover:decoration-fg"
        >
          {t("line", { n: f.line })}
        </button>
      </div>
      <p className="mt-1.5 text-[0.875rem] [overflow-wrap:anywhere] text-fg">
        {message}
      </p>
      <p className="mt-1 text-[0.8125rem] [overflow-wrap:anywhere] text-fg-muted">
        <span className="font-bold">{t("fix")}:</span> {fix}
      </p>

      {f.suggestion !== undefined && before !== undefined && (
        <div className="mt-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-fg-muted">{t("suggestion")}</p>
            <button
              type="button"
              onClick={() => apply([f])}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-white/[0.08] px-2.5 text-xs font-bold text-fg ring-1 ring-white/10 transition-[background-color] hover:bg-white/[0.12]"
            >
              {t("apply")}
            </button>
          </div>
          <div className="mt-1.5 overflow-x-auto rounded-lg font-mono text-xs leading-5">
            <p className="flex min-w-max bg-error/[0.09] px-1.5 py-0.5">
              <span aria-hidden="true" className="w-4 shrink-0 text-error">
                −
              </span>
              <span className="sr-only">{t("before")}: </span>
              <span className="whitespace-pre text-fg-muted">
                {before.trim()}
              </span>
            </p>
            <p className="flex min-w-max bg-brand-400/[0.07] px-1.5 py-0.5">
              <span aria-hidden="true" className="w-4 shrink-0 text-brand-400">
                +
              </span>
              <span className="sr-only">{t("after")}: </span>
              <span className="whitespace-pre text-fg">
                {f.suggestion.trim()}
              </span>
            </p>
          </div>
        </div>
      )}
    </li>
  );
}

/** Counts to the new score; jumps straight there under reduced motion. */
function AnimatedScore({
  value,
  className,
}: {
  value: number;
  className: string;
}) {
  const reduced = usePrefersReducedMotion();
  const motionValue = useMotionValue(value);
  const [shown, setShown] = useState(value);
  useMotionValueEvent(motionValue, "change", (v) => setShown(Math.round(v)));

  useEffect(() => {
    if (reduced) {
      motionValue.jump(value); // fires "change", which updates the text
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, reduced, motionValue]);

  return <span className={className}>{shown}</span>;
}
