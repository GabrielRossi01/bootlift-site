// Dev-only visual check. Usage: node scripts/screenshots.mjs [baseUrl] [outDir] [prefix]
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3123";
const out = process.argv[3] ?? ".impeccable/review";
const prefix = process.argv[4] ?? "shot";
const browser = await chromium.launch({ channel: "chrome" });

async function open(locale, width, height, opts = {}) {
  const page = await browser.newPage({ viewport: { width, height }, ...opts });
  await page.goto(`${base}/${locale}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

// Viewports: first viewport + full page.
for (const [loc, w, h] of [["en", 1536, 864], ["en", 1280, 800], ["pt", 768, 1024], ["en", 375, 812], ["pt", 375, 812]]) {
  const page = await open(loc, w, h);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/${prefix}-${loc}-${w}.png` });
  await page.screenshot({ path: `${out}/${prefix}-${loc}-${w}-full.png`, fullPage: true });
  const info = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    refract: document.documentElement.hasAttribute("data-refract"),
  }));
  console.log(loc, w, JSON.stringify(info));
  await page.close();
}

// Loop phases on desktop.
{
  const page = await open("en", 1440, 900);
  const marks = [[1300, "main"], [3600, "drop"], [6400, "suggest"], [7700, "commit"], [10200, "pass"]];
  let elapsed = 0;
  for (const [at, name] of marks) {
    await page.waitForTimeout(at - elapsed);
    elapsed = at;
    await page.screenshot({ path: `${out}/${prefix}-phase-${name}.png` });
  }
  await page.close();
}

// Reduced motion still frame.
{
  const page = await open("en", 1440, 900, { reducedMotion: "reduce" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${prefix}-reduced.png` });
  await page.close();
}

await browser.close();
