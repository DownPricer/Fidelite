"use client";

import { useEffect, useRef, useState } from "react";
import { CoverCropEditor } from "@/components/cover-crop-editor";
import { loadImageElement, readFileAsDataUrl, type VisualVersion } from "@/components/ad-visual-parts";
import { AD_GOOGLE_WALLET_HERO_CROP_SPEC } from "@/lib/ad-visual-crop-specs";
import { WALLET_VISUAL_STATUS_LABELS } from "@/lib/ad-google-wallet-visual-labels";
import { centeredCropState, type CropState } from "@/lib/cover-crop";
import type { AdGoogleWalletVisualStatus } from "@prisma/client";
import s from "./fiche.module.css";

type WalletVersion = VisualVersion & { createdBy?: string | null; decidedBy?: string | null };

type Props = {
  id: string;
  googleWalletVisualStatus: AdGoogleWalletVisualStatus;
  googleWalletVisualComment: string | null;
  googleWalletHeroUrl: string | null;
  walletVisualVersions: WalletVersion[];
  canPropose: boolean;
  busy: boolean;
  people: Record<string, string>;
  onNotify: (msg: string, error?: boolean) => void;
  onReload: () => Promise<void>;
};

const post = (url: string, body: unknown) =>
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? "Action impossible.");
    return data as Record<string, unknown>;
  });

const VERSION_STATUS: Record<VisualVersion["status"], string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumise",
  PROPOSED: "Proposée au commerçant",
  APPROVED: "Version finale",
  CHANGES_REQUESTED: "Modification demandée",
  SUPERSEDED: "Remplacée",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function AdDetailWalletPanel({
  id,
  googleWalletVisualStatus,
  googleWalletVisualComment,
  googleWalletHeroUrl,
  walletVisualVersions,
  canPropose,
  busy,
  people,
  onNotify,
  onReload,
}: Props) {
  const [draft, setDraft] = useState<{ dataUrl: string; name: string; width: number; height: number } | null>(null);
  const [cropState, setCropState] = useState<CropState>(() => centeredCropState());
  const [stagedOriginalUrl, setStagedOriginalUrl] = useState<string | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [cropBusy, setCropBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const pending = walletVisualVersions.find((v) => v.status === "PROPOSED") ?? null;
  const approved = walletVisualVersions.find((v) => v.status === "APPROVED") ?? null;
  const shown = pending ?? approved ?? walletVisualVersions[0] ?? null;
  const displayUrl = googleWalletHeroUrl ?? shown?.url ?? null;

  useEffect(() => {
    setCropState(centeredCropState());
    setStagedOriginalUrl(null);
    setCroppedPreviewUrl(null);
  }, [draft?.dataUrl]);

  async function onFileChosen(file: File | null) {
    if (!file) return;
    try {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Choisissez une image PNG, JPG ou WebP.");
      if (file.size > 10 * 1024 * 1024) throw new Error("Ce fichier dépasse la limite de 10 Mo.");
      const dataUrl = await readFileAsDataUrl(file);
      const img = await loadImageElement(dataUrl);
      setDraft({ dataUrl, name: file.name, width: img.naturalWidth, height: img.naturalHeight });
    } catch (e) {
      onNotify(e instanceof Error ? e.message : "Fichier invalide.", true);
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const isExactWallet = draft?.width === 1032 && draft?.height === 812;
  const cropChanged = cropState.x !== 0.5 || cropState.y !== 0.5 || cropState.zoom !== 1;

  async function confirmCrop(crop: CropState) {
    if (!draft) return;
    setCropState(crop);
    setCropBusy(true);
    try {
      const original =
        stagedOriginalUrl ??
        ((await post(`/api/super-admin/visuels/${id}/fichier`, { dataUrl: draft.dataUrl, kind: "original" })).url as string);
      setStagedOriginalUrl(original);
      const cropped = await post(`/api/super-admin/visuels/${id}/recadrer`, {
        originalUrl: original,
        target: "google-wallet-hero",
        crop,
      });
      setCroppedPreviewUrl(cropped.url as string);
    } catch (e) {
      onNotify(e instanceof Error ? e.message : "Recadrage impossible.", true);
    } finally {
      setCropBusy(false);
    }
  }

  async function sendWalletProposal() {
    if (!draft) return;
    try {
      if (isExactWallet && !cropChanged && !croppedPreviewUrl) {
        const staged = await post(`/api/super-admin/visuels/${id}/fichier`, { dataUrl: draft.dataUrl, kind: "original" });
        await post(`/api/super-admin/visuels/${id}/wallet/proposition`, {
          url: staged.url,
          originalUrl: staged.url,
          reframed: false,
          width: 1032,
          height: 812,
        });
      } else {
        const original =
          stagedOriginalUrl ??
          ((await post(`/api/super-admin/visuels/${id}/fichier`, { dataUrl: draft.dataUrl, kind: "original" })).url as string);
        const cropped = croppedPreviewUrl
          ? { url: croppedPreviewUrl, originalUrl: original, width: 1032, height: 812, reframed: true }
          : await post(`/api/super-admin/visuels/${id}/recadrer`, {
              originalUrl: original,
              target: "google-wallet-hero",
              crop: cropState,
            });
        await post(`/api/super-admin/visuels/${id}/wallet/proposition`, {
          url: cropped.url,
          originalUrl: cropped.originalUrl ?? original,
          reframed: cropped.reframed ?? true,
          width: cropped.width ?? 1032,
          height: cropped.height ?? 812,
        });
      }
      setDraft(null);
      onNotify("Visuel Google Wallet envoyé au commerçant.");
      await onReload();
    } catch (e) {
      onNotify(e instanceof Error ? e.message : "Envoi impossible.", true);
    }
  }

  const dl = (url: string) => `${url}?telecharger=1`;

  return (
    <section className={`${s.card} ${s.pad}`} aria-label="Visuel Google Wallet" data-testid="wallet-visual-section">
      <div className={s.sectionTitle}>
        <div>
          <div className={s.eyebrow}>GOOGLE WALLET</div>
          <h2 className={s.h2}>Visuel hero (1032 × 812)</h2>
          <p className={s.sub}>
            Affiché sur les cartes Google Wallet globales après validation. Indépendant du bandeau in-app.
          </p>
        </div>
        <span className={s.pill}>{WALLET_VISUAL_STATUS_LABELS[googleWalletVisualStatus]}</span>
      </div>

      {googleWalletVisualComment ? (
        <div className={s.reasonBox} data-testid="wallet-visual-comment">
          Demande du commerçant : « {googleWalletVisualComment} »
        </div>
      ) : null}

      {displayUrl ? (
        <div className={s.walletHeroPreview} data-testid="wallet-hero-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayUrl} alt="Visuel Google Wallet validé ou proposé" />
          <a className={s.textAction} href={dl(displayUrl)} download>
            Télécharger ↓
          </a>
        </div>
      ) : (
        <p className={s.note}>Aucun visuel Google Wallet préparé pour cette campagne.</p>
      )}

      {shown ? (
        <div className={s.metaLine}>
          <span>Dernière version</span>
          <b>
            n°{shown.number} · {VERSION_STATUS[shown.status]}
            {shown.createdBy ? ` · ${people[shown.createdBy] ?? "Fideto"}` : ""}
          </b>
        </div>
      ) : null}

      {canPropose ? (
        <>
          <hr className={s.rule} />
          <div className={s.sectionTitle}>
            <div>
              <div className={s.eyebrow}>NOUVELLE VERSION WALLET</div>
              <h2 className={s.h2Small}>Importer un visuel</h2>
              <p className={s.sub}>Recadrez au format 1032 × 812 px avant envoi au commerçant.</p>
            </div>
          </div>
          <label className={s.uploadZone} htmlFor="wallet-upload">
            <span className={s.uploadIcon}>↥</span>
            <strong>{draft ? "Remplacer le fichier" : "Déposez votre visuel Wallet"}</strong>
            <small>PNG, JPG ou WebP · 10 Mo maximum</small>
            <span className={s.button}>Choisir un fichier</span>
            <input
              id="wallet-upload"
              ref={fileInput}
              className={s.srOnly}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              data-testid="wallet-import-file"
              onChange={(e) => void onFileChosen(e.target.files?.[0] ?? null)}
            />
          </label>

          {draft ? (
            <div className={s.crop} data-testid="wallet-crop">
              <header>
                <b>{isExactWallet ? "Recadrage (facultatif)" : "Recadrage"}</b>
                <small>
                  {draft.name} · {draft.width}×{draft.height}
                </small>
              </header>
              <CoverCropEditor
                previewSrc={draft.dataUrl}
                spec={{
                  width: AD_GOOGLE_WALLET_HERO_CROP_SPEC.width,
                  height: AD_GOOGLE_WALLET_HERO_CROP_SPEC.height,
                  label: AD_GOOGLE_WALLET_HERO_CROP_SPEC.label,
                }}
                busy={cropBusy || busy}
                confirmLabel="Générer l'aperçu serveur"
                onCancel={() => setDraft(null)}
                onConfirm={(crop) => void confirmCrop(crop)}
              />
              {croppedPreviewUrl ? (
                <div className={s.cropPreview} data-testid="wallet-cropped-preview">
                  <p className={s.note}>Aperçu généré (fichier qui sera proposé) :</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={croppedPreviewUrl} alt="Aperçu du visuel Google Wallet recadré" />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className={s.uploadActions}>
            <span>{draft ? "Prêt à proposer au commerçant." : "Choisissez un fichier pour commencer."}</span>
            <button
              className={`${s.button} ${s.primary}`}
              type="button"
              disabled={!draft || busy || cropBusy}
              onClick={() => void sendWalletProposal()}
              data-testid="send-wallet-proposal"
            >
              Envoyer le visuel Wallet →
            </button>
          </div>
        </>
      ) : null}

      {walletVisualVersions.length > 0 ? (
        <>
          <hr className={s.rule} />
          <div className={s.eyebrow}>HISTORIQUE WALLET</div>
          {walletVisualVersions.map((v) => (
            <div key={v.id} className={s.versionRow} data-testid="wallet-version-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.url} alt={`Version Wallet ${v.number}`} />
              <div>
                <strong>
                  Version {v.number} · {VERSION_STATUS[v.status]}
                </strong>
                <small>
                  {formatDateTime(v.createdAt)}
                  {v.comment ? ` · « ${v.comment} »` : ""}
                </small>
              </div>
              <a className={s.textAction} href={dl(v.originalUrl)} download>
                ↓
              </a>
            </div>
          ))}
        </>
      ) : null}
    </section>
  );
}
