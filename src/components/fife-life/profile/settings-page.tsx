"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassBottomSheet } from "./glass-bottom-sheet";
import {
  APP_VERSION,
  PasswordStrength,
  ProfileShell,
  SettingsRow,
  ToggleRow,
  demoQuery,
  fieldLabels,
  type EditField,
} from "./profile-shared";
import type { PreferencesPayload, ProfilePayload } from "@/lib/customer-profile";

export function SettingsPage({
  initialProfile,
  initialPreferences,
  preview = false,
}: {
  initialProfile: ProfilePayload;
  initialPreferences: PreferencesPayload;
  preview?: boolean;
}) {
  const demo = demoQuery(preview);
  const [profile, setProfile] = useState(initialProfile);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [editField, setEditField] = useState<EditField | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editExtra, setEditExtra] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePhrase, setDeletePhrase] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<{ id: string; device: string; current: boolean }[]>([]);

  useEffect(() => {
    if (preview) return;
    void fetch("/api/customer/sessions")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []))
      .catch(() => undefined);
  }, [preview]);

  async function patchProfile(body: Record<string, unknown>) {
    if (preview) {
      setProfile((p) => ({ ...p, ...body } as ProfilePayload));
      return;
    }
    const res = await fetch("/api/customer/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Enregistrement impossible.");
    setProfile(data.profile);
  }

  async function patchPreferences(body: Partial<PreferencesPayload>) {
    if (preview) {
      setPreferences((p) => ({ ...p, ...body }));
      return;
    }
    const res = await fetch("/api/customer/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Enregistrement impossible.");
    setPreferences(data.preferences);
  }

  async function saveFieldEdit() {
    if (!editField) return;
    setEditLoading(true);
    setEditError(null);
    try {
      if (editField === "password") {
        if (preview) {
          setEditField(null);
          setEditSuccess("Mot de passe mis à jour (démo).");
          return;
        }
        const res = await fetch("/api/auth/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword: editPassword, nextPassword: editValue }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Modification impossible.");
        setEditField(null);
        setEditSuccess("Mot de passe mis à jour.");
        return;
      }
      if (editField === "email") {
        if (preview) {
          setEditField(null);
          setEditSuccess("Demande enregistrée (démo).");
          return;
        }
        const res = await fetch("/api/customer/profile/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newEmail: editValue, password: editPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Modification impossible.");
        setProfile(data.profile);
        setEditField(null);
        setEditSuccess(data.message ?? "Demande enregistrée.");
        return;
      }
      const body: Record<string, string> = { [editField]: editValue };
      if (editField === "phone") body.phoneCountryCode = editExtra || "+33";
      await patchProfile(body);
      setEditField(null);
      setEditSuccess("Enregistré.");
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setEditLoading(false);
    }
  }

  function openEdit(field: EditField, value = "", extra = "") {
    setEditField(field);
    setEditValue(value);
    setEditExtra(extra);
    setEditPassword("");
    setEditError(null);
  }

  async function logout() {
    if (!preview) await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/connexion";
  }

  async function confirmDelete() {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      if (preview) {
        window.location.href = "/compte/supprime";
        return;
      }
      const res = await fetch("/api/customer/deletion/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword, confirmationPhrase: deletePhrase }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Suppression impossible.");
      window.location.href = data.redirectTo ?? "/compte/supprime";
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <ProfileShell title="Paramètres" backHref={`/carte${demo}`} toast={editSuccess}>
      <div className="fife-settings-stack mt-6">
      <section className="glass-panel profile-panel p-4">
        <div className="relative z-[1]">
          <h3 className="section-title mb-3">Informations personnelles</h3>
          <div className="space-y-1">
            <SettingsRow icon="👤" label="Prénom" value={profile.firstName} onClick={() => openEdit("firstName", profile.firstName)} />
            <SettingsRow icon="👤" label="Nom" value={profile.lastName ?? ""} onClick={() => openEdit("lastName", profile.lastName ?? "")} />
            <SettingsRow icon="✨" label="Nom d'affichage" value={profile.displayName ?? ""} onClick={() => openEdit("displayName", profile.displayName ?? "")} />
            <SettingsRow
              icon="📱"
              label="Téléphone"
              value={profile.phone ? `${profile.phoneCountryCode ?? "+33"} ${profile.phone}` : ""}
              hint={profile.phone && !profile.phoneVerified ? "Non vérifié" : undefined}
              onClick={() => openEdit("phone", profile.phone ?? "", profile.phoneCountryCode ?? "+33")}
            />
            <SettingsRow
              icon="✉️"
              label="E-mail"
              value={profile.email}
              hint={profile.pendingEmail ? "Modification en attente" : undefined}
              onClick={() => openEdit("email", profile.pendingEmail ?? profile.email)}
            />
            <SettingsRow icon="🏠" label="Adresse" value={profile.addressLine1 ?? ""} onClick={() => openEdit("addressLine1", profile.addressLine1 ?? "")} />
            <SettingsRow icon="🏢" label="Complément" value={profile.addressLine2 ?? ""} onClick={() => openEdit("addressLine2", profile.addressLine2 ?? "")} />
            <SettingsRow icon="📮" label="Code postal" value={profile.postalCode ?? ""} onClick={() => openEdit("postalCode", profile.postalCode ?? "")} />
            <SettingsRow icon="🌆" label="Ville" value={profile.city ?? ""} onClick={() => openEdit("city", profile.city ?? "")} />
            <SettingsRow icon="🌍" label="Pays" value={profile.country ?? ""} onClick={() => openEdit("country", profile.country ?? "FR")} />
          </div>
        </div>
      </section>

      <section className="glass-panel profile-panel mt-4 p-4">
        <div className="relative z-[1]">
          <h3 className="section-title mb-3">Sécurité</h3>
          <div className="space-y-1">
            <SettingsRow icon="🔒" label="Modifier le mot de passe" value="••••••••" onClick={() => openEdit("password")} />
            <SettingsRow
              icon="📲"
              label="Appareils connectés"
              value={`${sessions.length || 1} appareil${sessions.length > 1 ? "s" : ""}`}
              onClick={() => undefined}
            />
            {sessions.length > 1 && !preview ? (
              <button
                type="button"
                className="profile-link-btn mt-2 w-full text-xs"
                onClick={async () => {
                  await fetch("/api/customer/sessions", { method: "DELETE" });
                  setEditSuccess("Autres appareils déconnectés.");
                }}
              >
                Déconnecter les autres appareils
              </button>
            ) : null}
          </div>
          <p className="mt-3 text-[11px] text-[var(--muted)]">
            Connexion par e-mail et mot de passe. Authentification à deux facteurs : non disponible pour le moment.
          </p>
        </div>
      </section>

      <section className="glass-panel profile-panel mt-4 p-4">
        <div className="relative z-[1]">
          <h3 className="section-title mb-3">Notifications</h3>
          <div className="space-y-2">
            <ToggleRow label="Mouvements de points ou passages" checked={preferences.notifyPointsMovements} onChange={(v) => void patchPreferences({ notifyPointsMovements: v })} />
            <ToggleRow label="Nouvel avantage débloqué" checked={preferences.notifyNewBenefit} onChange={(v) => void patchPreferences({ notifyNewBenefit: v })} />
            <ToggleRow label="Avantage bientôt expiré" checked={preferences.notifyBenefitExpiring} onChange={(v) => void patchPreferences({ notifyBenefitExpiring: v })} />
            <ToggleRow label="Nouvelle carte ajoutée" checked={preferences.notifyNewCard} onChange={(v) => void patchPreferences({ notifyNewCard: v })} />
            <ToggleRow label="Offres des commerçants" checked={preferences.notifyMerchantOffers} onChange={(v) => void patchPreferences({ notifyMerchantOffers: v })} />
            <ToggleRow label="Actualités Fife Life" checked={preferences.notifyFifeLifeNews} onChange={(v) => void patchPreferences({ notifyFifeLifeNews: v })} />
            <ToggleRow label="Notifications de sécurité" checked={preferences.notifySecurity} disabled onChange={() => undefined} />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Canaux</p>
          <div className="mt-2 space-y-2">
            <ToggleRow label="Push" checked={preferences.notifyChannelPush} onChange={(v) => void patchPreferences({ notifyChannelPush: v })} />
            <ToggleRow label="E-mail" checked={preferences.notifyChannelEmail} onChange={(v) => void patchPreferences({ notifyChannelEmail: v })} />
            <ToggleRow label="SMS" checked={preferences.notifyChannelSms} onChange={(v) => void patchPreferences({ notifyChannelSms: v })} />
          </div>
        </div>
      </section>

      <section className="glass-panel profile-panel mt-4 p-4">
        <div className="relative z-[1]">
          <h3 className="section-title mb-3">Confidentialité et préférences</h3>
          <div className="space-y-2">
            <ToggleRow label="Offres personnalisées" checked={preferences.consentPersonalizedOffers} onChange={(v) => void patchPreferences({ consentPersonalizedOffers: v })} />
            <ToggleRow label="Marketing" checked={preferences.consentMarketing} onChange={(v) => void patchPreferences({ consentMarketing: v })} />
            <ToggleRow label="Analyse des données" checked={preferences.consentAnalytics} onChange={(v) => void patchPreferences({ consentAnalytics: v })} />
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Link href="/confidentialite" className="profile-inline-link block">
              Politique de confidentialité
            </Link>
            <p className="text-[11px] text-[var(--muted)]">
              Export des données : contactez le support (fonctionnalité à venir).
            </p>
            <label className="mt-2 block text-xs text-[var(--muted)]">
              Langue
              <select
                className="profile-select mt-1 w-full"
                value={preferences.language}
                onChange={(e) => void patchPreferences({ language: e.target.value as "fr" | "en" })}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="glass-panel profile-panel mt-4 p-4">
        <div className="relative z-[1]">
          <h3 className="section-title mb-3">Aide</h3>
          <div className="space-y-2 text-sm">
            <a href="mailto:support@fifelife.app" className="profile-inline-link block">
              Contacter le support
            </a>
            <Link href="/confidentialite" className="profile-inline-link block">
              Politique de confidentialité
            </Link>
            <p className="text-[11px] text-[var(--muted)]">Version {APP_VERSION}</p>
          </div>
        </div>
      </section>

      <button type="button" className="profile-logout-btn mt-6 w-full" onClick={() => void logout()}>
        Se déconnecter
      </button>

      <section className="delete-zone profile-danger-zone mt-8 p-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--danger)]">Zone dangereuse</h3>
        <p className="mt-2 text-xs text-[var(--muted-strong)]">
          La suppression est définitive : accès au compte, cartes, points et avantages non utilisés seront perdus.
        </p>
        <button type="button" className="delete-btn mt-4 w-full px-4 py-3 text-sm font-semibold" onClick={() => setDeleteOpen(true)}>
          Supprimer mon compte
        </button>
      </section>

      </div>

      <GlassBottomSheet
        open={editField !== null && editField !== "password"}
        title={editField ? fieldLabels[editField] : undefined}
        onClose={() => setEditField(null)}
      >
        {editError ? <p className="mb-3 text-xs text-[var(--danger)]">{editError}</p> : null}
        {editField === "phone" ? (
          <label className="profile-field">
            Indicatif
            <select className="profile-select" value={editExtra} onChange={(e) => setEditExtra(e.target.value)}>
              <option value="+33">+33 (FR)</option>
              <option value="+32">+32 (BE)</option>
              <option value="+41">+41 (CH)</option>
              <option value="+1">+1</option>
            </select>
          </label>
        ) : null}
        {editField && editField !== "password" ? (
          <label className="profile-field mt-3">
            {fieldLabels[editField]}
            <input
              className="profile-input"
              type={editField === "email" ? "email" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          </label>
        ) : null}
        {editField === "email" ? (
          <>
            <label className="profile-field mt-3">
              Mot de passe actuel
              <input className="profile-input" type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
            </label>
            <p className="mt-2 text-[11px] text-[var(--muted)]">
              La nouvelle adresse devra être vérifiée. L&apos;ancienne reste active en attendant.
            </p>
          </>
        ) : null}
        <div className="mt-4 flex gap-2">
          <button type="button" className="profile-btn-secondary flex-1" onClick={() => setEditField(null)}>
            Annuler
          </button>
          <button type="button" className="profile-btn-primary flex-1" disabled={editLoading} onClick={() => void saveFieldEdit()}>
            {editLoading ? "…" : "Enregistrer"}
          </button>
        </div>
      </GlassBottomSheet>

      <GlassBottomSheet open={editField === "password"} title="Modifier le mot de passe" onClose={() => setEditField(null)}>
        {editError ? <p className="mb-3 text-xs text-[var(--danger)]">{editError}</p> : null}
        <label className="profile-field">
          Mot de passe actuel
          <input className="profile-input" type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
        </label>
        <label className="profile-field mt-3">
          Nouveau mot de passe
          <input className="profile-input" type="password" value={editValue} onChange={(e) => setEditValue(e.target.value)} minLength={8} />
        </label>
        <PasswordStrength password={editValue} />
        <div className="mt-4 flex gap-2">
          <button type="button" className="profile-btn-secondary flex-1" onClick={() => setEditField(null)}>
            Annuler
          </button>
          <button type="button" className="profile-btn-primary flex-1" disabled={editLoading} onClick={() => void saveFieldEdit()}>
            {editLoading ? "…" : "Enregistrer"}
          </button>
        </div>
      </GlassBottomSheet>

      <GlassBottomSheet open={deleteOpen} title="Supprimer mon compte" onClose={() => setDeleteOpen(false)}>
        <p className="text-sm text-[var(--ink-soft)]">
          Cette action désactive votre compte et supprime l&apos;accès à vos cartes, points et avantages. Vous disposez
          de 14 jours pour contacter le support et annuler.
        </p>
        {deleteError ? <p className="mt-3 text-xs text-[var(--danger)]">{deleteError}</p> : null}
        <label className="profile-field mt-4">
          Mot de passe
          <input className="profile-input" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
        </label>
        <label className="profile-field mt-3">
          Saisissez SUPPRIMER
          <input className="profile-input" value={deletePhrase} onChange={(e) => setDeletePhrase(e.target.value)} />
        </label>
        <div className="mt-4 flex gap-2">
          <button type="button" className="profile-btn-secondary flex-1" onClick={() => setDeleteOpen(false)}>
            Annuler
          </button>
          <button
            type="button"
            className="delete-btn flex-1 px-4 py-3 text-sm font-semibold disabled:opacity-40"
            disabled={deleteLoading || deletePhrase !== "SUPPRIMER" || (!preview && !deletePassword)}
            onClick={() => void confirmDelete()}
          >
            {deleteLoading ? "…" : "Supprimer définitivement"}
          </button>
        </div>
      </GlassBottomSheet>
    </ProfileShell>
  );
}
