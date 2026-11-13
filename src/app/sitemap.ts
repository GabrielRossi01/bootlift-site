import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: `${site.url}/en`, "pt-BR": `${site.url}/pt` };
  return [
    { url: `${site.url}/en`, alternates: { languages }, priority: 1 },
    { url: `${site.url}/pt`, alternates: { languages }, priority: 0.9 },
  ];
}
