"use client";

import { useEffect, useState } from "react";
import { getCachedQr, loadUniversalQr } from "./qr-cache";
import { TIER_STYLE, resolveTier } from "./tier";
import { PrismCard } from "./prism-card";

type GlobalCardMode = "detail" | "wallet";

export function GlobalCard({
  points,
  large = false,
  mode = "detail",
}: {
  points: number;
  large?: boolean;
  mode?: GlobalCardMode;
}) {
  const tier = resolveTier(points);
  const style = TIER_STYLE[tier.name];
  const showQrOnCard = mode === "wallet" && large;

  const [qr, setQr] = useState<string | null>(() => (showQrOnCard ? getCachedQr() : null));
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    if (!showQrOnCard) return;
    if (qr) return;

    let cancelled = false;
    void loadUniversalQr("fife-life").then((next) => {
      if (cancelled) return;
      if (next) setQr(next);
      else setQrError("QR indisponible.");
    });
    return () => {
      cancelled = true;
    };
  }, [showQrOnCard, qr]);

  return (
    <PrismCard
      material={tier.name.toLowerCase() as "bronze" | "silver" | "gold" | "diamond"}
      className={large ? "min-h-[210px] px-6 py-5" : "px-5 py-4"}
      style={{
        ["--prism-from" as never]: style.from,
        ["--prism-to" as never]: style.to,
        ["--prism-halo" as never]: style.glow,
      }}
    >
      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">Fife Life</p>
            <h2 className={`mt-1 font-black leading-none tracking-tight text-[var(--ink)] ${large ? "text-2xl" : "text-xl"}`}>
              {tier.name}
            </h2>
          </div>
          <div
            className="grid h-11 w-11 place-items-center rounded-full text-[11px] font-black uppercase tracking-wider"
            style={{
              background: "rgba(0,0,0,0.4)",
              color: style.metal,
              boxShadow: `0 0 0 1px ${style.metal}55, 0 0 18px ${style.glow}`,
            }}
          >
            {tier.name.slice(0, 2)}
          </div>
        </div>

        {showQrOnCard ? (
          <div className="mt-3 flex items-center gap-4">
            <div className="rounded-[18px] border border-white/20 bg-[#faf9ff] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_14px_32px_rgba(0,0,0,0.55)]">
              <div className="aspect-square w-[88px]">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt="QR Fife Life" className="h-full w-full rounded-[10px]" />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <div className="h-6 w-6 rounded-full border-2 border-[var(--violet)] border-t-transparent" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-[var(--ink)]">Marie Terese</p>
              <p className="text-[11px] font-medium text-white/70">
                Vers Gold · {tier.remaining.toLocaleString("fr-FR")} pts restants
              </p>
              <p className="text-lg font-black tabular-nums text-[var(--ink)]">
                {points.toLocaleString("fr-FR")}
                <span className="ml-1 text-xs font-semibold text-white/70">pts</span>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p
              className={`font-black tabular-nums tracking-tight text-[var(--ink)] ${
                large ? "text-[1.85rem]" : "text-2xl"
              }`}
            >
              {points.toLocaleString("fr-FR")}
              <span className="ml-1 text-sm font-semibold text-white/70">pts</span>
            </p>
            <p className="mt-2 text-[11px] font-medium text-white/75">
              {tier.nextName == null
                ? "Niveau maximum atteint"
                : `Vers ${tier.nextName} · ${tier.remaining.toLocaleString("fr-FR")} pts restants`}
            </p>
          </div>
        )}

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-black/30">
          <div className="tier-progress h-full rounded-full" style={{ width: `${Math.round(tier.progress * 100)}%` }} />
        </div>
        {qrError && showQrOnCard ? (
          <p className="mt-1 text-[10px] font-bold text-[var(--danger)]">{qrError}</p>
        ) : null}
      </div>
    </PrismCard>
  );
}
