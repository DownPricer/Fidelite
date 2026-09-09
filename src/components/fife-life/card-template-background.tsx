"use client";

import { buildCardBackgroundImageStyle } from "@/lib/card-template-background-style";
import type { CardTemplateConfig } from "@/lib/card-template-schema";

export function CardTemplateBackground({
  backgroundUrl,
  background,
  className,
}: {
  backgroundUrl: string;
  background: CardTemplateConfig["background"];
  className?: string;
}) {
  const { wrapper, img } = buildCardBackgroundImageStyle({ ...background, url: backgroundUrl });

  return (
    <div style={wrapper} className={className} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={backgroundUrl} alt="" style={img} draggable={false} />
    </div>
  );
}
