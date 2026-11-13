import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { archivo, atkinson, jetbrains } from "@/lib/fonts";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import { GlassFilters } from "@/components/glass/GlassFilters";
import { Nav } from "@/components/layout/Nav";
import { GitHubButton } from "@/components/layout/GitHubButton";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "../globals.css";

const CLIENT_NAMESPACES = [
  "a11y",
  "nav",
  "locale",
  "copy",
  "prCard",
  "demo",
  "rules",
  "score",
  "playground",
  "engine",
] as const;

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
  const [t, messages] = await Promise.all([
    getTranslations("a11y"),
    getMessages(),
  ]);
  // Only what client components read goes to the browser; the rest stays on the server.
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]),
  );

  return (
    <html
      lang={htmlLang[locale]}
      className={`${archivo.variable} ${atkinson.variable} ${jetbrains.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <a
            href="#content"
            className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-pill bg-brand-400 px-4 py-2 font-bold text-ink-1000 transition-transform duration-200 focus-visible:translate-y-0"
          >
            {t("skip")}
          </a>
          <GlassFilters />
          <SmoothScroll />
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
