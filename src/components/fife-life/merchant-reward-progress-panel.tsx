"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { GlassBottomSheet } from "./profile/glass-bottom-sheet";
import { ExpandableQrCode } from "./expandable-qr-code";
import type {
  CustomerMerchantRewardProgress,
  MerchantRewardProgressTarget,
} from "@/lib/customer-reward-progress-types";
import { formatUnitCount } from "@/lib/loyalty-labels";
import type { EvaluatedReward } from "@/lib/loyalty-rewards";

export function MerchantRewardProgressPanel({
  slug,
  merchantName,
  initialProgress,
  qrSrc,
  clientNumber,
  preview = false,
  onRefresh,
}: {
  slug: string;
  merchantName: string;
  initialProgress: CustomerMerchantRewardProgress | null;
  qrSrc: string | null;
  clientNumber?: string | null;
  preview?: boolean;
  onRefresh?: () => void;
}) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(initialProgress);
  const [loading, setLoading] = useState(false);
  const [sheetReward, setSheetReward] = useState<EvaluatedReward | null>(null);
  const [confirmPulse, setConfirmPulse] = useState(false);

  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  const refreshProgress = useCallback(async () => {
    if (preview) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/customer/loyalty/rewards?merchantSlug=${encodeURIComponent(slug)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("rewards");
      const data = (await response.json()) as CustomerMerchantRewardProgress;
      setProgress(data);
      onRefresh?.();
    } catch {
      // conserve l'état actuel
    } finally {
      setLoading(false);
    }
  }, [preview, slug, onRefresh]);

  useEffect(() => {
    if (!confirmPulse) return;
    const timer = window.setTimeout(() => setConfirmPulse(false), 1800);
    return () => window.clearTimeout(timer);
  }, [confirmPulse]);

  useEffect(() => {
    const handler = () => {
      setConfirmPulse(true);
      void refreshProgress();
    };
    window.addEventListener("merchant-reward-progress:refresh", handler);
    return () => window.removeEventListener("merchant-reward-progress:refresh", handler);
  }, [refreshProgress]);

  const target = progress?.nextTarget ?? null;
  const available = progress?.availableRewards ?? [];
  const conserved = progress?.conservedRewards ?? [];
  const upcoming = progress?.upcomingRewards ?? [];
  const later = progress?.laterRewards ?? [];

  return (
    <>
      <section className="merchant-reward-progress glass-panel mt-5 p-5" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <h2 className="section-title">Prochain avantage</h2>
          {loading ? (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">Mise à jour…</span>
          ) : null}
        </div>

        {!progress || (!target && available.length === 0) ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Aucun prochain avantage configuré chez {merchantName}.
          </p>
        ) : target ? (
          <TargetBlock target={target} reduced={Boolean(reduced)} pulse={confirmPulse} />
        ) : null}

        {available.length > 0 ? (
          <div className="mt-5 border-t border-white/8 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Disponible maintenant
            </h3>
            <ul className="mt-3 space-y-3">
              {available.map((reward) => (
                <li key={reward.id} className="reward-available-row rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--ink)]">{reward.name}</p>
                      {reward.description ? (
                        <p className="mt-1 text-xs text-[var(--muted-strong)]">{reward.description}</p>
                      ) : null}
                      <p className="mt-1 text-[11px] text-[var(--muted)]">{reward.costLabel}</p>
                      {reward.expiresLabel ? (
                        <p className="mt-0.5 text-[11px] text-[var(--muted)]">{reward.expiresLabel}</p>
                      ) : null}
                      {reward.conditions.length ? (
                        <ul className="mt-2 space-y-0.5 text-[10px] text-[var(--muted)]">
                          {reward.conditions.map((line) => (
                            <li key={line}>• {line}</li>
                          ))}
                        </ul>
                      ) : null}
                      <p className="mt-2 text-xs font-semibold text-[var(--positive)]">{reward.status}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="reward-use-btn mt-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-[var(--ink)]"
                    onClick={() => setSheetReward(reward)}
                  >
                    Utiliser cet avantage
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {(upcoming.length > 0 || later.length > 0) && target ? (
          <div className="mt-4 space-y-2 border-t border-white/8 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Avantages suivants</p>
            <ul className="space-y-2">
              {[...upcoming, ...later]
                .filter((reward) => reward.id !== target.id)
                .slice(0, 4)
                .map((reward) => (
                  <li key={reward.id} className="flex items-center justify-between gap-3 text-xs text-[var(--muted-strong)]">
                    <span className="truncate">{reward.name}</span>
                    <span className="shrink-0 tabular-nums">{reward.costLabel}</span>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        {conserved.length > 0 ? (
          <div className="mt-4 border-t border-white/8 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Ancien avantage conservé
            </h3>
            <ul className="mt-3 space-y-3">
              {conserved.map((reward) => (
                <li key={reward.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Avantage conservé de votre ancien programme
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{reward.name}</p>
                  {reward.description ? (
                    <p className="mt-1 text-xs text-[var(--muted-strong)]">{reward.description}</p>
                  ) : null}
                  <p className="mt-1 text-[11px] text-[var(--muted)]">{reward.costLabel}</p>
                  {reward.expiresLabel ? (
                    <p className="mt-0.5 text-[11px] text-[var(--muted)]">{reward.expiresLabel}</p>
                  ) : null}
                  <button
                    type="button"
                    className="reward-use-btn mt-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-[var(--ink)]"
                    onClick={() => setSheetReward(reward)}
                  >
                    Utiliser cet avantage
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <GlassBottomSheet
        open={sheetReward != null}
        title="Utiliser votre avantage"
        onClose={() => setSheetReward(null)}
      >
        {sheetReward ? (
          <div className="space-y-4 pb-2">
            <div>
              <p className="text-lg font-bold text-[var(--ink)]">{sheetReward.name}</p>
              <p className="mt-1 text-sm text-[var(--muted-strong)]">{merchantName}</p>
            </div>
            {sheetReward.description ? (
              <p className="text-sm text-[var(--ink-soft)]">{sheetReward.description}</p>
            ) : null}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-[var(--ink-soft)]">
              <p>Seuil : {sheetReward.costLabel}</p>
              {progress ? (
                <p className="mt-1">Solde actuel : {formatUnitCount(progress.balance, progress.unit)}</p>
              ) : null}
              {sheetReward.conditions.map((line) => (
                <p key={line} className="mt-1 text-xs text-[var(--muted)]">
                  {line}
                </p>
              ))}
            </div>
            <div className="mx-auto max-w-[220px]">
              <ExpandableQrCode
                qrSrc={qrSrc}
                clientNumber={clientNumber}
                merchantName={merchantName}
                shellClassName="rounded-2xl bg-white p-3"
              />
            </div>
            <p className="text-center text-sm font-medium text-[var(--ink-soft)]">
              Présentez ce QR au commerçant pour utiliser votre avantage.
            </p>
          </div>
        ) : null}
      </GlassBottomSheet>
    </>
  );
}

function TargetBlock({
  target,
  reduced,
  pulse,
}: {
  target: MerchantRewardProgressTarget;
  reduced: boolean;
  pulse: boolean;
}) {
  const unlocked = target.visualState === "unlocked";

  return (
    <div className="merchant-progress-block mt-3">
      <div className="merchant-progress-top">
        <span className={`merchant-progress-icon${unlocked ? " is-unlocked" : ""}`} aria-hidden>
          {unlocked ? (
            <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 12v9H4v-9M2 7h20v5H2V7zm10 0v14M12 7a2.5 2.5 0 010-5C13.5 2 15 3.5 15 5a2.5 2.5 0 01-2.5 2h-.5zm0 0a2.5 2.5 0 000-5C10.5 2 9 3.5 9 5a2.5 2.5 0 002.5 2h.5z" />
            </svg>
          )}
        </span>
        <div className="merchant-progress-copy">
          <p className="merchant-progress-kicker">{target.statusHeadline}</p>
          <h3 className="merchant-progress-title">{target.name}</h3>
          <p className="merchant-progress-desc">{target.statusText}</p>
        </div>
        <span className="merchant-progress-count">
          {target.current}/{target.threshold}
        </span>
      </div>

      <div className="merchant-progress-meter">
        <motion.div
          className={`merchant-progress-meter-fill${unlocked ? " is-unlocked" : ""}`}
          initial={false}
          animate={{ width: `${target.percent}%` }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
          data-pulse={pulse ? "1" : "0"}
        />
      </div>
      <div className="merchant-progress-meter-labels">
        <span>{formatUnitCount(target.current, target.unit)}</span>
        <span>Objectif : {target.threshold}</span>
      </div>
    </div>
  );
}

export function notifyMerchantRewardProgressRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("merchant-reward-progress:refresh"));
}
