import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { getStarCount } from "@/lib/github";
import { site } from "@/lib/site";
import { GitHubMark } from "@/components/ui/GitHubMark";

export async function GitHubButton({ className = "" }: { className?: string }) {
  const [t, stars] = await Promise.all([
    getTranslations("nav"),
    getStarCount(),
  ]);
  const showCount = stars !== null && stars > 0;

  return (
    <a
      href={site.repo}
      aria-label={
        showCount ? t("githubStars", { count: stars }) : t("githubNoCount")
      }
      className={`group inline-flex h-9 items-center gap-2 rounded-pill px-3 text-sm text-fg-muted ring-1 ring-white/10 transition-[color,background-color,box-shadow] duration-200 ease-out-quart hover:bg-white/[0.06] hover:text-fg hover:ring-white/20 ${className}`}
    >
      <GitHubMark className="size-4" />
      <span>{t("github")}</span>
      {showCount && (
        <span className="inline-flex items-center gap-1 border-l border-white/10 pl-2 font-mono text-xs text-fg tabular">
          <Star
            className="size-3 text-brand-400"
            aria-hidden="true"
            strokeWidth={2.25}
          />
          {stars}
        </span>
      )}
    </a>
  );
}
