"use client";

import {
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { useSpecular } from "./useSpecular";

type Variant = "hero" | "float" | "chip";

type GlassSurfaceProps = {
  as?: ElementType;
  /** hero: PR card and hero chip. float: nav, demo frame, playground. chip: small controls. */
  variant?: Variant;
  /** Pointer-following sheen. Defaults on for hero and float. */
  specular?: boolean;
  /** SVG refraction. Only honoured on the hero tier, in Chromium. */
  refract?: boolean;
  /** "pass" lights the green rim for the success state. */
  state?: "pass";
  className?: string;
  children?: ReactNode;
  /** When rendered as a link. */
  href?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

export function GlassSurface({
  as: Tag = "div",
  variant = "float",
  specular,
  refract = false,
  state,
  className,
  children,
  ...rest
}: GlassSurfaceProps) {
  const ref = useRef<HTMLElement>(null);
  useSpecular(ref, specular ?? variant !== "chip");

  return (
    <Tag
      ref={ref}
      data-glass={variant}
      data-refract={refract && variant === "hero" ? "" : undefined}
      data-state={state}
      className={className ? `glass ${className}` : "glass"}
      {...rest}
    >
      {children}
    </Tag>
  );
}
