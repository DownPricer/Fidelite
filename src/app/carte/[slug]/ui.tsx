"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { InstallPwa } from "@/components/install-pwa";
import { Button } from "@/components/ui";

type Props = {
  slug: string;
  merchant: {
    name: string;
    logoUrl: string | null;
    primaryColor: string;
    rewardLabel: string;
    visitsRequired: number;
    points: number;
  };
  preview?: boolean;
};

const PREVIEW_QR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="#fff" width="32" height="32"/><rect fill="#0F172A" x="2" y="2" width="8" height="8"/><rect fill="#0F172A" x="22" y="2" width="8" height="8"/><rect fill="#0F172A" x="2" y="22" width="8" height="8"/><rect fill="#0F172A" x="13" y="13" width="6" height="6"/></svg>`,
  );

export function LoyaltyCardScreen({ slug, merchant, preview = false }: Props) {
  const [points, setPoints] = useState(merchant.points);
  const [qr, setQr] = useState<string | null>(preview ? PREVIEW_QR : null);
  const [walletEnabled, setWalletEnabled] = useState(preview);
  const [walletBusy, setWalletBusy] = useState(false);
  const [android, setAndroid] = useState(preview);
  const [error, setError] = useState<string | null>(null);

  const refreshCard = useCallback(async () => {
    if (preview) return;
    const card = await fetch(`/api/customer/card?slug=${encodeURIComponent(slug)}`);
    if (card.ok) {
      const data = await card.json();
      setPoints(data.snapshot.points);
      setWalletEnabled(Boolean(data.walletEnabled));
    }
    const qrRes = await fetch("/api/customer/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (qrRes.ok) {
      const data = await qrRes.json();
      setQr(data.image);
      setError(null);
    } else {
      const data = await qrRes.json();
      setError(data.error ?? "QR indisponible.");
    }
  }, [preview, slug]);

  useEffect(() => {
    setAndroid(preview || /android/i.test(navigator.userAgent));
    void refreshCard();
  }, [preview, refreshCard]);

  async function addWallet() {
    if (preview) return;
    setWalletBusy(true);
    const response = await fetch("/api/customer/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const data = await response.json();
    setWalletBusy(false);
    if (!response.ok || !data.url) {
      setError("Google Wallet est temporairement indisponible.");
      return;
    }
    window.location.href = data.url;
  }

  const rewardAvailable = points >= merchant.visitsRequired;
  const remaining = Math.max(0, merchant.visitsRequired - points);

  return (
    <main className="flex h-dvh flex-col bg-[var(--page-bg)] text-[var(--body-text)]">
      <div className="mx-auto flex h-full w-full max-w-md flex-col px-[clamp(1rem,4vw,1.5rem)] pt-[clamp(0.35rem,1vh,0.65rem)] pb-[clamp(0.35rem,1vh,0.65rem)]">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {merchant.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={merchant.logoUrl}
                alt=""
                className="h-[clamp(1.75rem,4.2vh,2.25rem)] w-[clamp(1.75rem,4.2vh,2.25rem)] shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div
                className="grid h-[clamp(1.75rem,4.2vh,2.25rem)] w-[clamp(1.75rem,4.2vh,2.25rem)] shrink-0 place-items-center rounded-lg text-sm font-black text-white"
                style={{ backgroundColor: merchant.primaryColor }}
              >
                {merchant.name.slice(0, 1)}
              </div>
            )}
            <h1 className="truncate text-[clamp(1rem,2.4vh,1.15rem)] font-black text-[var(--panel-text)]">
              {merchant.name}
            </h1>
          </div>
          <Link
            href="/compte"
            className="shrink-0 text-xs font-semibold text-[var(--muted-text)]"
          >
            Mon compte
          </Link>
        </header>

        <div className="mt-[clamp(0.2rem,0.7vh,0.4rem)] shrink-0 text-center">
          <p className="font-black tabular-nums leading-none text-[var(--panel-text)] text-[clamp(2.6rem,8.2vh,3.6rem)]">
            {points}
            <span className="text-[clamp(1.05rem,2.4vh,1.35rem)] font-bold text-[var(--muted-text)]">
              {" "}
              / {merchant.visitsRequired}
            </span>
          </p>
        </div>

        <p
          className={`mt-[clamp(0.2rem,0.7vh,0.4rem)] shrink-0 text-center text-[clamp(0.75rem,1.55vh,0.875rem)] font-bold leading-snug ${
            rewardAvailable ? "text-emerald-800" : "text-[var(--muted-text)]"
          }`}
        >
          {rewardAvailable
            ? merchant.rewardLabel
            : `Encore ${remaining} passage${remaining > 1 ? "s" : ""} · ${merchant.rewardLabel}`}
        </p>

        <div className="mt-[clamp(0.2rem,0.65vh,0.4rem)] flex shrink-0 justify-center">
          <div className="w-[clamp(180px,48vw,200px)] rounded-xl border border-[var(--border)] bg-white p-2 sm:w-[220px] sm:max-w-[220px]">
            <div className="aspect-square">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qr} alt="QR de votre carte" className="h-full w-full" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--teal)] border-t-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>

        {error ? (
          <p className="mt-1 shrink-0 text-center text-xs font-bold text-[var(--danger)]">{error}</p>
        ) : null}

        <div className="mt-[clamp(0.4rem,1.2vh,0.7rem)] flex shrink-0 flex-col gap-[clamp(0.3rem,0.9vh,0.5rem)]">
          <Button
            className="w-full py-[clamp(0.45rem,1.3vh,0.65rem)] text-sm"
            variant="secondary"
            onClick={() => void refreshCard()}
          >
            Actualiser mes points
          </Button>

          {walletEnabled && android ? (
            <button
              type="button"
              onClick={() => void addWallet()}
              disabled={walletBusy}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#1f1f1f] px-3 text-sm font-bold text-white disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z" />
              </svg>
              Google Wallet
            </button>
          ) : null}

          <InstallPwa compact />
        </div>
      </div>
    </main>
  );
}
