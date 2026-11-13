"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";

type CopyButtonProps = {
  value: string;
  /** What is being copied, for the accessible name ("Copy {what}"). */
  what: string;
  className?: string;
};

export function CopyButton({ value, what, className = "" }: CopyButtonProps) {
  const t = useTranslations("copy");
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API refused (insecure context or permissions): select-and-copy fallback.
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={t("copyLabel", { what })}
      className={`relative inline-flex size-9 shrink-0 items-center justify-center rounded-pill text-fg-muted transition-[color,background-color] duration-200 ease-out-quart hover:bg-white/[0.08] hover:text-fg ${className}`}
    >
      <Copy
        aria-hidden="true"
        className={`size-4 transition-[opacity,scale] duration-300 ease-lift ${copied ? "scale-50 opacity-0" : "opacity-100"}`}
      />
      <Check
        aria-hidden="true"
        strokeWidth={2.5}
        className={`absolute size-4 text-brand-400 transition-[opacity,scale] duration-300 ease-lift ${copied ? "opacity-100" : "scale-50 opacity-0"}`}
      />
      <span role="status" className="sr-only">
        {copied ? t("copied") : ""}
      </span>
    </button>
  );
}
