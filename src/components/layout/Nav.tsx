"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { LocaleSwitch } from "./LocaleSwitch";
import { site } from "@/lib/site";

const LINKS = [
  { key: "howItWorks", href: "#how-it-works" },
  { key: "playground", href: "#playground" },
  { key: "rules", href: "#rules" },
  { key: "docs", href: `${site.repo}#readme` },
  { key: "contribute", href: "#contribute" },
] as const;

export function Nav({ github }: { github: ReactNode }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 64rem)").matches) setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <GlassSurface
        as="nav"
        aria-label={t("nav.label")}
        className="pointer-events-auto mx-auto max-w-6xl rounded-[1.75rem] px-2 py-2 sm:pl-4"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label={t("a11y.home")}
            className="flex shrink-0 items-center rounded-lg py-1 pr-1 pl-1 sm:pl-0"
          >
            <Image
              src="/brand/bootlift-mark.svg"
              alt=""
              width={32}
              height={32}
              loading="eager"
              className="size-8 sm:hidden"
            />
            <Image
              src="/brand/bootlift-logo-nav.svg"
              alt=""
              width={113}
              height={28}
              loading="eager"
              className="hidden h-7 w-auto sm:block"
            />
          </Link>

          <ul className="ml-4 hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="inline-flex h-9 items-center rounded-pill px-3 text-[0.9375rem] text-fg-muted transition-colors duration-200 ease-out-quart hover:text-fg"
                >
                  {t(`nav.${link.key}`)}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden lg:block">
              <LocaleSwitch />
            </div>
            <div className="hidden lg:block">{github}</div>
            <a
              href={site.marketplace}
              className="group inline-flex h-9 items-center gap-1.5 rounded-pill bg-white/[0.04] pr-3 pl-4 text-sm font-bold text-fg ring-1 ring-white/15 transition-[background-color,box-shadow] duration-200 ease-out-quart hover:bg-white/[0.08] hover:ring-white/25"
            >
              {t("nav.marketplace")}
              <ArrowUpRight
                aria-hidden="true"
                strokeWidth={2.5}
                className="size-4 text-brand-400 transition-transform duration-300 ease-lift group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? t("nav.menuClose") : t("nav.menuOpen")}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex size-9 items-center justify-center rounded-pill text-fg ring-1 ring-white/10 transition-colors duration-200 hover:bg-white/[0.06] lg:hidden"
            >
              {open ? (
                <X aria-hidden="true" className="size-[18px]" />
              ) : (
                <Menu aria-hidden="true" className="size-[18px]" />
              )}
            </button>
          </div>
        </div>

        <div
          id={panelId}
          hidden={!open}
          className="border-t border-white/[0.08] px-2 pt-3 pb-2 lg:hidden"
          style={{ marginTop: open ? "0.5rem" : undefined }}
        >
          <ul className="grid gap-0.5">
            {LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center rounded-xl px-3 text-base text-fg-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
                >
                  {t(`nav.${link.key}`)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] px-1 pt-3">
            <LocaleSwitch />
            {github}
          </div>
        </div>
      </GlassSurface>
    </header>
  );
}
