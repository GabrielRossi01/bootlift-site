import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex min-h-6 items-center gap-1 py-1 text-fg-muted transition-colors duration-200 hover:text-fg"
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 opacity-50 transition-[opacity,transform] duration-300 ease-lift group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
      />
    </a>
  );
}

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="relative border-t border-ink-700/60 bg-ink-1000">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-xs">
          <Image
            src="/brand/bootlift-logo-dark.svg"
            alt="Bootlift"
            width={178}
            height={44}
            className="h-11 w-auto"
          />
          <p className="mt-5 text-fg-muted">{t("tagline")}</p>
          <p className="mt-4 font-mono text-xs text-fg-subtle">
            {t("version", { version: site.version })}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-fg">{t("product")}</h2>
          <ul className="mt-4 grid gap-3 text-[0.9375rem]">
            <li>
              <FooterLink href={site.marketplace}>
                {t("marketplace")}
              </FooterLink>
            </li>
            <li>
              <FooterLink href={site.repo}>{t("github")}</FooterLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-fg">{t("project")}</h2>
          <ul className="mt-4 grid gap-3 text-[0.9375rem]">
            <li>
              <FooterLink href={site.license}>{t("license")}</FooterLink>
            </li>
            <li>
              <FooterLink href={site.contributing}>
                {t("contributing")}
              </FooterLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-700/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-6 text-sm sm:px-8">
          <p className="text-fg-subtle">
            {t("madeBy")} <span className="text-fg">{site.author.name}</span>
          </p>
          <span
            aria-hidden="true"
            className="hidden h-3 w-px bg-ink-700 sm:block"
          />
          <FooterLink href={site.author.portfolio}>{t("portfolio")}</FooterLink>
          <FooterLink href={site.author.linkedin}>{t("linkedin")}</FooterLink>
        </div>
      </div>
    </footer>
  );
}
