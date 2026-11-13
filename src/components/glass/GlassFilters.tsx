"use client";

import { useEffect } from "react";

type UAData = { brands?: { brand: string }[] };

/**
 * SVG filter defs for hero refraction. Refraction through backdrop-filter: url()
 * only renders in Chromium, so <html data-refract> is set there and nowhere else;
 * every other engine keeps the plain blur.
 */
export function GlassFilters() {
  useEffect(() => {
    const data = (navigator as Navigator & { userAgentData?: UAData })
      .userAgentData;
    const chromium = data?.brands?.some((b) => b.brand === "Chromium") ?? false;
    const supported =
      chromium &&
      CSS.supports("backdrop-filter", "url(#glass-refract) blur(1px)");
    if (supported) document.documentElement.setAttribute("data-refract", "");
  }, []);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="absolute"
    >
      <filter
        id="glass-refract"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.014"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="soft"
          scale="22"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
