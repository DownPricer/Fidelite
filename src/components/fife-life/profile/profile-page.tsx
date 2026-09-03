"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AvatarFileInput,
  AvatarPreviewEditor,
  useAvatarEditor,
} from "./avatar-editor";
import { GlassBottomSheet, SheetAction } from "./glass-bottom-sheet";
import {
  MerchantLogo,
  ProfileShell,
  demoQuery,
  profileInitials,
  toneClass,
} from "./profile-shared";
import type { ProfilePayload } from "@/lib/customer-profile";
import { displayFullName } from "@/lib/customer-profile";
import type { BenefitEntry, HistoryEntry } from "@/lib/customer-history";

type HistoryFilter = "all" | "earned" | "used" | "expired" | "correction";

export function ProfilePage({
  initialProfile,
  preview = false,
  initialHistory = [],
  initialBenefits = [],
}: {
  initialProfile: ProfilePayload;
  preview?: boolean;
  initialHistory?: HistoryEntry[];
  initialBenefits?: BenefitEntry[];
}) {
  const demo = demoQuery(preview);
  const [profile, setProfile] = useState(initialProfile);
  const [history, setHistory] = useState<HistoryEntry[]>(preview ? initialHistory : []);
  const [benefits, setBenefits] = useState<BenefitEntry[]>(preview ? initialBenefits : []);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [historyLoading, setHistoryLoading] = useState(!preview);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyFull, setHistoryFull] = useState(false);
  const [benefitsFull, setBenefitsFull] = useState(false);
  const [avatarSheet, setAvatarSheet] = useState(false);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [nameEditOpen, setNameEditOpen] = useState(false);
  const [nameFirst, setNameFirst] = useState(profile.firstName);
  const [nameLast, setNameLast] = useState(profile.lastName ?? "");
  const [nameSaving, setNameSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fullName = displayFullName(profile);

  const saveAvatar = useCallback(
    async (dataUrl: string) => {
      if (preview) {
        setProfile((p) => ({ ...p, avatarUrl: dataUrl }));
        setAvatarSheet(false);
        return;
      }
      const res = await fetch("/api/customer/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Enregistrement impossible.");
      setProfile(data.profile);
      setAvatarSheet(false);
      setEditSuccess("Photo mise à jour.");
    },
    [preview],
  );

  const avatar = useAvatarEditor(saveAvatar);

  const loadHistory = useCallback(async () => {
    if (preview) {
      const filtered =
        historyFilter === "all"
          ? initialHistory
          : initialHistory.filter((h) => h.category === historyFilter);
      setHistory(filtered);
      setHistoryLoading(false);
      return;
    }
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetch(`/api/customer/history?filter=${historyFilter}&limit=50`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chargement impossible.");
      setHistory(data.items ?? []);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setHistoryLoading(false);
    }
  }, [historyFilter, preview, initialHistory]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (preview) return;
    void fetch("/api/customer/benefits?limit=50")
      .then((r) => r.json())
      .then((d) => setBenefits(d.items ?? []))
      .catch(() => undefined);
  }, [preview]);

  const visibleHistory = historyFull ? history : history.slice(0, 5);
  const visibleBenefits = benefitsFull ? benefits : benefits.slice(0, 3);

  const filteredHistory = useMemo(() => visibleHistory, [visibleHistory]);

  async function patchProfile(body: Record<string, unknown>) {
    const res = await fetch("/api/customer/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Enregistrement impossible.");
    setProfile(data.profile);
  }

  async function saveNameEdit() {
    setNameSaving(true);
    setEditError(null);
    try {
      if (preview) {
        setProfile((p) => ({ ...p, firstName: nameFirst, lastName: nameLast || null }));
        setNameEditOpen(false);
        return;
      }
      await patchProfile({ firstName: nameFirst, lastName: nameLast });
      setNameEditOpen(false);
      setEditSuccess("Nom mis à jour.");
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setNameSaving(false);
    }
  }

  async function removeAvatar() {
    if (preview) {
      setProfile((p) => ({ ...p, avatarUrl: null }));
      setAvatarSheet(false);
      return;
    }
    const res = await fetch("/api/customer/profile/avatar", { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setEditError(data.error ?? "Suppression impossible.");
      return;
    }
    setProfile(data.profile);
    setAvatarSheet(false);
  }

  return (
    <ProfileShell
      title="Mon profil"
      backHref={`/carte${demo}`}
      settingsHref={`/compte/parametres${demo}`}
      toast={editSuccess}
    >
      <section className="profile-header fife-profile-hero mt-6 text-center">
        <button
          type="button"
          className="profile-avatar-btn relative mx-auto"
          onClick={() => setAvatarSheet(true)}
          aria-label="Modifier la photo de profil"
        >
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="profile-avatar-img" />
          ) : (
            <span className="profile-avatar-fallback">{profileInitials(profile)}</span>
          )}
        </button>
        <div className="mt-4 flex items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-[var(--ink)]">{fullName}</h2>
          <button
            type="button"
            className="profile-edit-icon"
            aria-label="Modifier le nom"
            onClick={() => {
              setNameFirst(profile.firstName);
              setNameLast(profile.lastName ?? "");
              setNameEditOpen(true);
            }}
          >
            ✎
          </button>
        </div>
        <p className="mt-1 text-sm text-[var(--muted-strong)]">{profile.email}</p>
        {profile.pendingEmail ? (
          <p className="mt-1 text-xs text-[#f0b86a]">Nouvelle adresse à vérifier : {profile.pendingEmail}</p>
        ) : null}
      </section>

      <div className="fife-profile-panels mt-8">
      <section className="glass-panel profile-panel p-4">
        <div className="relative z-[1]">
          <h3 className="section-title">Historique général</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["all", "Tout"],
                ["earned", "Gagnés"],
                ["used", "Utilisés"],
                ["expired", "Expirés"],
                ["correction", "Corrections"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`sheet-filter rounded-full px-3 py-1 text-[11px] font-semibold ${historyFilter === key ? "is-active" : ""}`}
                onClick={() => setHistoryFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {historyLoading ? (
            <p className="mt-4 text-sm text-[var(--muted)]">Chargement…</p>
          ) : historyError ? (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-[var(--danger)]">{historyError}</p>
              <button type="button" className="profile-btn-secondary text-xs" onClick={() => void loadHistory()}>
                Réessayer
              </button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">Aucun mouvement pour le moment.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {filteredHistory.map((row) => (
                <li key={row.id} className="profile-history-row">
                  <MerchantLogo name={row.merchantName} logoUrl={row.merchantLogoUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--ink)]">{row.merchantName}</p>
                    <p className="text-[11px] text-[var(--muted)]">
                      {new Date(row.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {row.reason ? ` · ${row.reason}` : ""}
                    </p>
                    <p className="text-[11px] text-[var(--muted-strong)]">{row.operationType}</p>
                  </div>
                  <span className={`shrink-0 text-sm font-bold tabular-nums ${toneClass(row.tone)}`}>
                    {row.operationLabel}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {history.length > 5 ? (
            <button type="button" className="profile-link-btn mt-4 w-full" onClick={() => setHistoryFull((v) => !v)}>
              {historyFull ? "Réduire" : "Voir tout"}
            </button>
          ) : null}
        </div>
      </section>

      <section className="glass-panel profile-panel mt-4 p-4">
        <div className="relative z-[1]">
          <h3 className="section-title">Avantages utilisés</h3>
          {benefits.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">Vous n&apos;avez encore utilisé aucun avantage.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {visibleBenefits.map((row) => (
                <li key={row.id} className="profile-benefit-row">
                  <MerchantLogo name={row.merchantName} logoUrl={row.merchantLogoUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--ink)]">{row.merchantName}</p>
                    <p className="text-sm text-[var(--ink-soft)]">{row.benefitName}</p>
                    <p className="text-[11px] text-[var(--muted)]">
                      Utilisé le{" "}
                      {new Date(row.usedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-[11px] text-[var(--muted-strong)]">Coût : {row.costLabel}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {benefits.length > 3 ? (
            <button type="button" className="profile-link-btn mt-4 w-full" onClick={() => setBenefitsFull((v) => !v)}>
              {benefitsFull ? "Réduire" : "Voir tout"}
            </button>
            ) : null}
          </div>
        </section>
      </div>

      <Link href={`/compte/parametres${demo}`} className="profile-link-btn mt-6 block w-full text-center text-sm">
        Paramètres du compte
      </Link>

      <GlassBottomSheet open={avatarSheet} title="Photo de profil" onClose={() => setAvatarSheet(false)}>
        <AvatarFileInput inputRef={avatar.inputRef} onFile={avatar.onFile} />
        {avatar.preview ? (
          <AvatarPreviewEditor
            preview={avatar.preview}
            rotation={avatar.rotation}
            loading={avatar.loading}
            error={avatar.error}
            onRotate={avatar.rotate}
            onSave={() => void avatar.save()}
            onCancel={avatar.cancelPreview}
          />
        ) : (
          <div className="space-y-1">
            <SheetAction label="Prendre une photo" onClick={() => avatar.openPicker(true)} />
            <SheetAction label="Choisir dans la galerie" onClick={() => avatar.openPicker(false)} />
            {profile.avatarUrl ? (
              <SheetAction label="Supprimer la photo actuelle" tone="danger" onClick={() => void removeAvatar()} />
            ) : null}
            <SheetAction label="Annuler" onClick={() => setAvatarSheet(false)} />
          </div>
        )}
      </GlassBottomSheet>

      <GlassBottomSheet open={nameEditOpen} title="Modifier le nom" onClose={() => setNameEditOpen(false)}>
        {editError ? <p className="mb-3 text-xs text-[var(--danger)]">{editError}</p> : null}
        <label className="profile-field">
          Prénom
          <input className="profile-input" value={nameFirst} onChange={(e) => setNameFirst(e.target.value)} />
        </label>
        <label className="profile-field mt-3">
          Nom
          <input className="profile-input" value={nameLast} onChange={(e) => setNameLast(e.target.value)} />
        </label>
        <div className="mt-4 flex gap-2">
          <button type="button" className="profile-btn-secondary flex-1" onClick={() => setNameEditOpen(false)}>
            Annuler
          </button>
          <button type="button" className="profile-btn-primary flex-1" disabled={nameSaving} onClick={() => void saveNameEdit()}>
            {nameSaving ? "…" : "Enregistrer"}
          </button>
        </div>
      </GlassBottomSheet>
    </ProfileShell>
  );
}
