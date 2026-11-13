import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import {
  Archivo,
  Atkinson_Hyperlegible_Next,
  JetBrains_Mono,
} from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import { GlassFilters } from "@/components/glass/GlassFilters";
import { Nav } from "@/components/layout/Nav";
import { GitHubButton } from "@/components/layout/GitHubButton";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  variable: "--font-atkinson",
  adjustFontFallback: false,
  fallback: [
    "ui-sans-serif",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const htmlLang = { en: "en", pt: "pt-BR" } as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#05080f",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations("meta");

  return {
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", "pt-BR": "/pt", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: "Bootlift",
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      locale: locale === "pt" ? "pt_BR" : "en_US",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("a11y");

  return (
    <html
      lang={htmlLang[locale]}
      className={`${archivo.variable} ${atkinson.variable} ${jetbrains.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <a
            href="#content"
            className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-pill bg-brand-400 px-4 py-2 font-bold text-ink-1000 transition-transform duration-200 focus-visible:translate-y-0"
          >
            {t("skip")}
          </a>
          <GlassFilters />
          <Nav github={<GitHubButton />} />
          <main id="content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
