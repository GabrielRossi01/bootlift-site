import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type SectionProps = {
  id: string;
  title: string;
  intro?: ReactNode;
  /** The event icon on the PR rail. */
  icon: LucideIcon;
  /** What happened at this point of the review, written along the rail. */
  event: string;
  /** Node state: the review fails at the demo and passes from the quickstart on. */
  tone?: "fail" | "pass" | "merged";
  /** Heading weight: sections that carry the story are larger than reference ones. */
  size?: "xl" | "lg" | "md";
  /** Last event: the rail stops at this node. */
  last?: boolean;
  className?: string;
  headerClassName?: string;
  children?: ReactNode;
};

const TITLE = {
  xl: "text-display-1",
  lg: "text-display-2",
  md: "text-display-3",
} as const;

/** A section is an event on the PR timeline rail. */
export function Section({
  id,
  title,
  intro,
  icon: Icon,
  event,
  tone,
  size = "lg",
  last,
  className = "",
  headerClassName = "max-w-3xl",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-last={last ? "" : undefined}
      data-tone={tone}
      className={`rail-section relative ${className}`}
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:pl-16">
        <div
          aria-hidden="true"
          className="rail-section__line hidden lg:block"
        />
        <div
          aria-hidden="true"
          data-tone={tone}
          className="rail-section__anchor hidden lg:block"
        >
          <span className="pr-rail__node">
            <Icon className="size-3.5" strokeWidth={2.25} />
          </span>
          <span className="rail-section__event">{event}</span>
        </div>

        <header className={headerClassName}>
          <h2 id={`${id}-title`} className={`type-display ${TITLE[size]}`}>
            {title}
          </h2>
          {intro && (
            <p className="mt-5 max-w-[60ch] text-lede text-fg-muted">{intro}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
