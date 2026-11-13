import localFont from "next/font/local";
import { Atkinson_Hyperlegible_Next, JetBrains_Mono } from "next/font/google";

/**
 * Display face: a single static instance of Archivo (width 118, weight 760),
 * the only one the design uses. ~19 KB instead of the ~90 KB variable font,
 * which keeps the hero headline (the LCP element) off the slow path.
 */
export const archivo = localFont({
  src: "../assets/fonts/archivo-118-760.woff",
  weight: "760",
  style: "normal",
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "118%" }],
  fallback: ["Arial Black", "Arial", "sans-serif"],
});

export const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
  adjustFontFallback: false,
  fallback: [
    "ui-sans-serif",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

/** Code only, never above the fold on first paint: not preloaded. */
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});
