"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("locale");
  const active = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`relative inline-flex h-9 items-center rounded-pill p-1 ring-1 ring-white/10 ${className}`}
    >
      {routing.locales.map((locale) => {
        const current = locale === active;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale === "pt" ? "pt-BR" : "en"}
            lang={locale === "pt" ? "pt-BR" : "en"}
            aria-current={current ? "true" : undefined}
            aria-label={t(locale)}
            className={`relative inline-flex h-7 min-w-9 items-center justify-center rounded-pill px-2 font-mono text-xs tracking-wide uppercase transition-colors duration-200 ease-out-quart ${
              current
                ? "bg-white/[0.1] text-fg shadow-[inset_0_1px_0_oklch(1_0_0/0.12)]"
                : "text-fg-subtle hover:text-fg"
            }`}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
