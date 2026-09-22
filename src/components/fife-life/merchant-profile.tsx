"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MerchantCardPublicPreview } from "./merchant-card-public-preview";
import type { MerchantCardData } from "./types";
import type { LoyaltyMode } from "@prisma/client";
import { modeTitle, programEarnDescription, programMinimumPurchaseLabel } from "@/lib/loyalty-labels";
import type { ProgramRules, RewardConfig } from "@/lib/loyalty-program";

type MerchantProfileData = {
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  category: string | null;
  shortDescription: string | null;
  description: string | null;
  website: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  postalCode: string | null;
  city: string | null;
  cardTemplate?: MerchantCardData["cardTemplate"];
};

/** N'ouvre que des liens http(s) valides — jamais de schéma dangereux (javascript:, data:…). */
function safeExternalUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function formatAddress(m: MerchantProfileData): string | null {
  const parts = [m.addressLine1, m.addressLine2, [m.postalCode, m.city].filter(Boolean).join(" ")].filter(
    (part) => part && part.trim().length > 0,
  );
  return parts.length ? parts.join(", ") : null;
}

export function MerchantProfile({
  merchant,
  mode,
  rules,
  rewards,
  signedIn,
}: {
  merchant: MerchantProfileData;
  mode: LoyaltyMode;
  rules: ProgramRules;
  rewards: RewardConfig[];
  signedIn: boolean;
}) {
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewCard: MerchantCardData = {
    id: "public-preview",
    merchantId: merchant.slug,
    slug: merchant.slug,
    name: merchant.name,
    logoUrl: merchant.logoUrl,
    primaryColor: merchant.primaryColor,
    points: 0,
    visitsRequired: rewards[0]?.threshold ?? 10,
    rewardLabel: rewards[0]?.name ?? "Récompense",
    cardTemplate: merchant.cardTemplate,
  };

  const website = safeExternalUrl(merchant.website);
  const address = formatAddress(merchant);
  const mapQuery = address ? encodeURIComponent(`${merchant.name}, ${address}`) : null;

  function closeProfile() {
    const cameFromApp =
      typeof window !== "undefined" &&
      window.history.length > 1 &&
      document.referrer.startsWith(window.location.origin);
    if (cameFromApp) router.back();
    else router.push("/decouvrir");
  }

  async function join() {
    setJoining(true);
    setError(null);
    try {
      const response = await fetch("/api/customer/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: merchant.slug }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Impossible d'ajouter cette carte pour le moment.");
        setJoining(false);
        return;
      }
      window.location.href = `/carte/${merchant.slug}`;
    } catch {
      setError("Impossible d'ajouter cette carte pour le moment.");
      setJoining(false);
    }
  }

  return (
    <main className="merchant-detail-scene min-h-dvh">
      <div className="merchant-detail-container fife-page-shell mx-auto w-full max-w-md px-5 pb-16 pt-3 lg:max-w-lg">
        <header className="flex shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={closeProfile}
            aria-label="Fermer la fiche commerce"
            className="back-btn-glassy grid h-10 w-10 place-items-center rounded-full text-[var(--ink)]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="merchant-name-pill flex-1 mx-4 py-2.5 px-4">
            <h1 className="truncate text-center text-base font-bold tracking-tight text-[var(--ink)]">{merchant.name}</h1>
          </div>
          <div className="w-10" aria-hidden />
        </header>

        <section className="mt-6 flex flex-col items-center text-center">
          {merchant.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={merchant.logoUrl} alt="" className="h-16 w-16 rounded-2xl border border-white/10 object-cover" />
          ) : (
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-[var(--ink)]"
              style={{ backgroundColor: merchant.primaryColor }}
            >
              {merchant.name.slice(0, 1)}
            </div>
          )}
          <h2 className="mt-3 text-xl font-black text-[var(--ink)]">{merchant.name}</h2>
          {merchant.category ? <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{merchant.category}</p> : null}
          {merchant.shortDescription || merchant.description ? (
            <p className="mt-2 text-sm text-[var(--muted-strong)]">{merchant.shortDescription ?? merchant.description}</p>
          ) : null}
        </section>

        <section className="mt-6">
          <MerchantCardPublicPreview
            card={previewCard}
            merchant={{ name: merchant.name, logoUrl: merchant.logoUrl, primaryColor: merchant.primaryColor }}
            className="mx-auto w-full max-w-sm shadow-xl"
          />
        </section>

        <section className="glass-panel mt-5 p-5">
          <h2 className="section-title">Programme de fidélité</h2>
          <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{modeTitle(mode)}</p>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{programEarnDescription(mode, rules)}</p>
          {programMinimumPurchaseLabel(rules) ? (
            <p className="mt-1 text-xs text-[var(--muted)]">{programMinimumPurchaseLabel(rules)}</p>
          ) : null}
        </section>

        <section className="glass-panel mt-4 p-5">
          <h2 className="section-title">Avantages disponibles</h2>
          {rewards.length ? (
            <ul className="mt-4 divide-y divide-white/8">
              {rewards.map((reward) => (
                <li key={reward.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="text-sm font-semibold text-[var(--positive)]">
                    {reward.threshold} {reward.thresholdUnit === "points" ? "points" : "passages"}
                  </span>
                  <span className="text-sm text-[var(--ink-soft)]">=</span>
                  <span className="text-sm font-medium text-[var(--ink)]">{reward.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">Aucun avantage actif publié pour le moment.</p>
          )}
        </section>

        {address ? (
          <section className="glass-panel mt-4 p-5">
            <h2 className="section-title">Adresse</h2>
            <p className="mt-3 text-sm text-[var(--ink-soft)]">{address}</p>
            {mapQuery ? (
              <>
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                  <iframe
                    title={`Carte — ${merchant.name}`}
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                    className="h-48 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn-glassy mt-4 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--ink)]"
                >
                  Itinéraire
                </a>
              </>
            ) : null}
          </section>
        ) : null}

        {website ? (
          <section className="glass-panel mt-4 p-5">
            <h2 className="section-title">Site internet</h2>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block truncate text-sm font-semibold text-[var(--violet-bright)] hover:underline"
            >
              {website}
            </a>
          </section>
        ) : null}

        {error ? <p className="mt-4 text-center text-xs font-semibold text-[var(--danger)]">{error}</p> : null}

        <div className="mt-6">
          {signedIn ? (
            <button
              type="button"
              onClick={() => void join()}
              disabled={joining}
              className="w-full rounded-xl bg-[var(--violet)] py-4 text-center text-sm font-bold text-[var(--ink)] disabled:opacity-60"
            >
              {joining ? "Ajout en cours…" : "Ajouter cette carte"}
            </button>
          ) : (
            <Link
              href={`/rejoindre/${merchant.slug}`}
              className="block w-full rounded-xl bg-[var(--violet)] py-4 text-center text-sm font-bold text-[var(--ink)]"
            >
              Rejoindre ce commerce
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
