"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/components/ui";

type PrismCardProps = {
  /**
   * Visual material of the card.
   * - "bronze" | "silver" | "gold" | "diamond" for Fife Life tiers
   * - "merchant" for individual merchant cards
   */
  material?: "bronze" | "silver" | "gold" | "diamond" | "merchant";
  /**
   * Base hue for merchant cards (their primary color).
   */
  hue?: string | null;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
} & (
  | ({ as?: "article" } & React.HTMLAttributes<HTMLElement>)
  | ({ as: "div" } & React.HTMLAttributes<HTMLDivElement>)
  | ({ as: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

export function PrismCard(props: PrismCardProps) {
  const { as = "article", material = "merchant", hue, className, style, children, ...rest } = props as PrismCardProps & {
    as: PrismCardProps["as"];
  };

  const Element: "article" | "div" | "button" = as ?? "article";

  const cssVars: Record<string, string> = {};

  if (material === "merchant" && hue) {
    cssVars["--prism-from"] = `color-mix(in srgb, ${hue} 26%, #05050a 74%)`;
    cssVars["--prism-to"] = `color-mix(in srgb, ${hue} 72%, #090911 28%)`;
    cssVars["--prism-halo"] = `${hue}70`;
  }

  if (material === "bronze") {
    cssVars["--prism-from"] = "#2b1a10";
    cssVars["--prism-to"] = "#8a5a32";
    cssVars["--prism-halo"] = "rgba(196,148,86,0.45)";
  }

  if (material === "silver") {
    cssVars["--prism-from"] = "#11131b";
    cssVars["--prism-to"] = "#aeb5cd";
    cssVars["--prism-halo"] = "rgba(194,206,238,0.55)";
  }

  if (material === "gold") {
    cssVars["--prism-from"] = "#251807";
    cssVars["--prism-to"] = "#c79b35";
    cssVars["--prism-halo"] = "rgba(232,196,96,0.5)";
  }

  if (material === "diamond") {
    cssVars["--prism-from"] = "#140f2a";
    cssVars["--prism-to"] = "#6a46c4";
    cssVars["--prism-halo"] = "rgba(184,108,255,0.6)";
  }

  return (
    <Element
      data-material={material}
      className={cn(
        "prism-card card-shine card-shine-once relative isolate overflow-hidden rounded-[26px]",
        material === "silver" && "prism-card--metal",
        className,
      )}
      style={{ ...(cssVars as CSSProperties), ...style }}
      {...(rest as Record<string, unknown>)}
    >
      <div className="prism-card-halo" aria-hidden />
      <div className="prism-card-noise" aria-hidden />
      {material === "silver" ? (
        <>
          <div className="prism-metal-brush" aria-hidden />
          <div className="prism-metal-sheen" aria-hidden />
        </>
      ) : null}
      <div className="relative z-10 h-full w-full">{children}</div>
    </Element>
  );
}
