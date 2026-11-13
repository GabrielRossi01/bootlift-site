import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import en from "../../../messages/en.json";
import pt from "../../../messages/pt.json";

export const alt = "Bootlift: Spring Boot 4 readiness check for pull requests";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

const COPY = { en, pt } as const;

/** Logo, headline and the brand's dark ground with the green "lift" of light. */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = COPY[locale === "pt" ? "pt" : "en"];

  const [archivo, atkinson, mono, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/archivo-118-760.woff")),
    readFile(join(process.cwd(), "src/assets/fonts/atkinson-next-400.woff")),
    readFile(join(process.cwd(), "src/assets/fonts/jetbrains-mono-500.woff")),
    readFile(join(process.cwd(), "public/brand/bootlift-logo-dark.svg")),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: "#05080f",
        backgroundImage:
          "radial-gradient(60% 80% at 82% 110%, rgba(34,197,94,0.32), rgba(34,197,94,0) 70%), radial-gradient(70% 60% at 10% -10%, rgba(30,41,64,0.9), rgba(5,8,15,0) 70%)",
        color: "#f0f4f7",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoSrc} width={356} height={88} alt="" />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            fontFamily: "Archivo",
            fontSize: 76,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            maxWidth: 980,
          }}
        >
          {copy.hero.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontSize: 26,
              padding: "12px 22px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              backgroundColor: "rgba(15,23,42,0.7)",
            }}
          >
            <span style={{ color: "#a8b2bf" }}>uses:&nbsp;</span>
            <span>GabrielRossi01/bootlift</span>
            <span style={{ color: "#86efac" }}>@v1</span>
          </div>
          <div
            style={{ fontFamily: "Atkinson", fontSize: 26, color: "#a8b2bf" }}
          >
            {copy.hero.meta.replace("{version}", "v1.0.1")}
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Archivo", data: archivo, weight: 700, style: "normal" },
        { name: "Atkinson", data: atkinson, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
