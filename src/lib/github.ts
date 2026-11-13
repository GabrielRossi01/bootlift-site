import { cacheLife } from "next/cache";
import { site } from "./site";

/** Star count, fetched at build and revalidated hourly. null when the API refuses. */
export async function getStarCount(): Promise<number | null> {
  "use cache";
  cacheLife("hours");

  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(site.repoApi, { headers });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: unknown };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}
