import type { Metadata } from "next";
import Link from "next/link";
import { archivo, atkinson } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 · Bootlift",
  robots: { index: false },
};

/**
 * Any URL that matches no route. It renders outside the [locale] layout, so it
 * cannot know the visitor's language: it speaks both, briefly.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${archivo.variable} ${atkinson.variable}`}>
      <body>
        <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-24">
          <p className="type-display text-[clamp(5rem,3rem+10vw,9rem)] leading-none text-error tabular">
            404
          </p>
          <h1 className="mt-6 type-display text-display-2">
            This line isn&apos;t in the diff.
          </h1>
          <p className="mt-4 text-lede text-fg-muted" lang="pt-BR">
            Esta linha não está no diff.
          </p>
          <ul className="mt-10 flex flex-wrap gap-3">
            <li>
              <Link
                href="/en"
                hrefLang="en"
                className="inline-flex h-12 items-center rounded-pill bg-brand-400 px-6 font-bold text-ink-1000 transition-colors hover:bg-brand-300"
              >
                Back to Bootlift
              </Link>
            </li>
            <li>
              <Link
                href="/pt"
                hrefLang="pt-BR"
                lang="pt-BR"
                className="inline-flex h-12 items-center rounded-pill px-6 font-bold text-fg ring-1 ring-white/15 transition-colors hover:bg-white/[0.06]"
              >
                Voltar ao Bootlift
              </Link>
            </li>
          </ul>
        </main>
      </body>
    </html>
  );
}
