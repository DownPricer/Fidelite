"use client";

import { useCallback, useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Button, Card } from "@/components/ui";

type RejectTarget = { id: string; kind: "campaign" | "ad" };

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
  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approveAdId, setApproveAdId] = useState<string | null>(null);
  const [finalImageUrl, setFinalImageUrl] = useState("");

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

  async function approveCampaign(id: string) {
    setBusyId(id);
    await fetch(`/api/super-admin/campaigns/${id}/moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    }).catch(() => {});
    setBusyId(null);
    void load();
  }

  async function submitReject() {
    if (!rejectTarget) return;
    setBusyId(rejectTarget.id);
    const path =
      rejectTarget.kind === "campaign"
        ? `/api/super-admin/campaigns/${rejectTarget.id}/moderate`
        : `/api/super-admin/ads/${rejectTarget.id}`;
    const method = rejectTarget.kind === "campaign" ? "POST" : "PATCH";
    await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", rejectionReason: rejectReason }),
    }).catch(() => {});
    setBusyId(null);
    setRejectTarget(null);
    setRejectReason("");
    void load();
  }

  async function submitApproveAd() {
    if (!approveAdId || !finalImageUrl.trim()) return;
    setBusyId(approveAdId);
    await fetch(`/api/super-admin/ads/${approveAdId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", finalImageUrl: finalImageUrl.trim() }),
    }).catch(() => {});
    setBusyId(null);
    setApproveAdId(null);
    setFinalImageUrl("");
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
                      <Button disabled={busyId === c.id} onClick={() => void approveCampaign(c.id)}>
                        Approuver
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={busyId === c.id}
                        onClick={() => {
                          setRejectTarget({ id: c.id, kind: "campaign" });
                          setRejectReason("");
                        }}
                      >
                        Refuser
                      </Button>
                    </div>
                  </div>
                  {rejectTarget?.id === c.id ? (
                    <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
                      <label className="block text-xs text-[var(--muted-text)]">
                        Motif du refus (visible par le commerçant)
                        <textarea
                          className="profile-select mt-1 w-full"
                          rows={2}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                      </label>
                      <div className="flex gap-2">
                        <Button disabled={busyId === c.id} onClick={() => void submitReject()}>
                          Confirmer le refus
                        </Button>
                        <Button variant="secondary" onClick={() => setRejectTarget(null)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : null}
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
                    <Button
                      disabled={busyId === ad.id}
                      onClick={() => {
                        setApproveAdId(ad.id);
                        setFinalImageUrl(ad.finalImageUrl ?? "");
                      }}
                    >
                      Ajouter le visuel et approuver
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={busyId === ad.id}
                      onClick={() => {
                        setRejectTarget({ id: ad.id, kind: "ad" });
                        setRejectReason("");
                      }}
                    >
                      Refuser
                    </Button>
                  </div>
                </div>
                {approveAdId === ad.id ? (
                  <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
                    <label className="block text-xs text-[var(--muted-text)]">
                      URL du visuel final (hébergé par Fideto)
                      <input
                        className="profile-select mt-1 w-full"
                        value={finalImageUrl}
                        onChange={(e) => setFinalImageUrl(e.target.value)}
                        placeholder="https://…"
                      />
                    </label>
                    <div className="flex gap-2">
                      <Button disabled={busyId === ad.id || !finalImageUrl.trim()} onClick={() => void submitApproveAd()}>
                        Confirmer l&apos;approbation
                      </Button>
                      <Button variant="secondary" onClick={() => setApproveAdId(null)}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : null}
                {rejectTarget?.id === ad.id ? (
                  <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
                    <label className="block text-xs text-[var(--muted-text)]">
                      Motif du refus
                      <textarea
                        className="profile-select mt-1 w-full"
                        rows={2}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                    </label>
                    <div className="flex gap-2">
                      <Button disabled={busyId === ad.id} onClick={() => void submitReject()}>
                        Confirmer le refus
                      </Button>
                      <Button variant="secondary" onClick={() => setRejectTarget(null)}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </div>
    </SuperAdminShell>
  );
}
