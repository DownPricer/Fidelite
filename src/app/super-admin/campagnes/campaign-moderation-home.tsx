"use client";

import { useCallback, useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Button, Card } from "@/components/ui";

type NetworkCampaign = {
  id: string;
  channel: string;
  title: string;
  body: string;
  estimatedRecipients: number | null;
  priceCents: number | null;
  merchant: { id: string; name: string; slug: string; city: string | null };
  payment: { status: string; amountCents: number } | null;
  createdAt: string;
};

type AdRequest = {
  id: string;
  requestedText: string;
  requestedImageUrl: string | null;
  finalImageUrl: string | null;
  objective: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  startDate: string;
  endDate: string;
  merchant: { id: string; name: string; slug: string };
  campaign: { id: string; priceCents: number | null } | null;
};

function formatCents(cents: number | null) {
  if (cents === null) return "—";
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

/** Modération des campagnes réseau et des demandes de bandeaux (Partie 13) — espace super-admin exclusivement. */
export function CampaignModerationHome({ firstName }: { firstName: string }) {
  const [tab, setTab] = useState<"campaigns" | "ads">("campaigns");
  const [campaigns, setCampaigns] = useState<NetworkCampaign[]>([]);
  const [ads, setAds] = useState<AdRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [campaignsRes, adsRes] = await Promise.all([
        fetch("/api/super-admin/campaigns?status=PENDING_REVIEW"),
        fetch("/api/super-admin/ads?status=PENDING_REVIEW"),
      ]);
      const campaignsData = campaignsRes.ok ? await campaignsRes.json() : { campaigns: [] };
      const adsData = adsRes.ok ? await adsRes.json() : { ads: [] };
      setCampaigns(campaignsData.campaigns ?? []);
      setAds(adsData.ads ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function moderateCampaign(id: string, action: "approve" | "reject") {
    setBusyId(id);
    const rejectionReason = action === "reject" ? window.prompt("Motif du refus (visible par le commerçant) :") ?? "" : undefined;
    await fetch(`/api/super-admin/campaigns/${id}/moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, rejectionReason }),
    }).catch(() => {});
    setBusyId(null);
    void load();
  }

  async function moderateAd(id: string, action: "approve" | "reject") {
    setBusyId(id);
    if (action === "approve") {
      const finalImageUrl = window.prompt("URL du visuel final (hébergé par Fidelo) :");
      if (!finalImageUrl) {
        setBusyId(null);
        return;
      }
      await fetch(`/api/super-admin/ads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", finalImageUrl }),
      }).catch(() => {});
    } else {
      const rejectionReason = window.prompt("Motif du refus :") ?? "";
      await fetch(`/api/super-admin/ads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", rejectionReason }),
      }).catch(() => {});
    }
    setBusyId(null);
    void load();
  }

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--ink)]">Campagnes</h1>
          <p className="text-sm text-[var(--muted-text)]">
            Modération des campagnes réseau et des demandes de bandeaux sponsorisés — espace super-admin, séparé de
            l&apos;espace commerçant.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant={tab === "campaigns" ? "primary" : "secondary"} onClick={() => setTab("campaigns")}>
            Campagnes réseau ({campaigns.length})
          </Button>
          <Button variant={tab === "ads" ? "primary" : "secondary"} onClick={() => setTab("ads")}>
            Demandes de bandeaux ({ads.length})
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--muted-text)]">Chargement…</p>
        ) : tab === "campaigns" ? (
          campaigns.length === 0 ? (
            <Card className="p-6 text-center text-sm text-[var(--muted-text)]">Aucune campagne en attente.</Card>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <Card key={c.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">
                        {c.merchant.name} {c.merchant.city ? `· ${c.merchant.city}` : ""} · {c.channel}
                      </p>
                      <p className="mt-1 text-sm font-bold text-[var(--ink)]">{c.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted-text)]">{c.body}</p>
                      <p className="mt-2 text-xs text-[var(--muted-text)]">
                        ~{c.estimatedRecipients ?? "?"} destinataires · {formatCents(c.priceCents)} ·{" "}
                        {c.payment?.status === "PAID" ? "Payée" : "Paiement en attente"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <Button disabled={busyId === c.id} onClick={() => void moderateCampaign(c.id, "approve")}>
                        Approuver
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={busyId === c.id}
                        onClick={() => void moderateCampaign(c.id, "reject")}
                      >
                        Refuser
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : ads.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[var(--muted-text)]">Aucune demande de bandeau en attente.</Card>
        ) : (
          <div className="space-y-3">
            {ads.map((ad) => (
              <Card key={ad.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]">
                      {ad.merchant.name} · {new Date(ad.startDate).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(ad.endDate).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[var(--ink)]">{ad.requestedText}</p>
                    {ad.objective ? <p className="mt-1 text-xs text-[var(--muted-text)]">Objectif : {ad.objective}</p> : null}
                    {ad.ctaLabel ? (
                      <p className="mt-1 text-xs text-[var(--muted-text)]">
                        Bouton : {ad.ctaLabel} → {ad.ctaUrl}
                      </p>
                    ) : null}
                    {ad.requestedImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ad.requestedImageUrl} alt="" className="mt-2 h-20 w-auto rounded-lg object-cover" />
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <Button disabled={busyId === ad.id} onClick={() => void moderateAd(ad.id, "approve")}>
                      Ajouter le visuel et approuver
                    </Button>
                    <Button variant="secondary" disabled={busyId === ad.id} onClick={() => void moderateAd(ad.id, "reject")}>
                      Refuser
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SuperAdminShell>
  );
}
