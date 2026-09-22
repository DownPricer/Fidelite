"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Field, Input, cn } from "@/components/ui";
import { ConfirmDialog } from "@/components/merchant/merchant-ui";
import type { RewardConfig } from "@/lib/loyalty-program";

type RewardTypeOption = { id: string; label: string; hint: string };

const REWARD_TYPES: RewardTypeOption[] = [
  { id: "FREE_PRODUCT", label: "Produit offert", hint: "Ex : un café offert" },
  { id: "FREE_SERVICE", label: "Service offert", hint: "Ex : une prestation offerte" },
  { id: "PERCENT_DISCOUNT", label: "Réduction en %", hint: "Ex : 10 % sur l'addition" },
  { id: "FIXED_DISCOUNT", label: "Réduction fixe", hint: "Ex : 5 € de réduction" },
  { id: "GIFT", label: "Cadeau", hint: "Un objet ou un bon cadeau" },
  { id: "UPGRADE", label: "Surclassement", hint: "Ex : formule supérieure offerte" },
  { id: "CUSTOM", label: "Personnalisé", hint: "Décrivez librement l'avantage" },
];

export function rewardTypeLabel(id: string): string {
  return REWARD_TYPES.find((t) => t.id === id)?.label ?? "Personnalisé";
}

function unitWord(unit: "visits" | "points", count: number): string {
  if (unit === "points") return count <= 1 ? "point" : "points";
  return count <= 1 ? "passage" : "passages";
}

function emptyReward(unit: "visits" | "points"): RewardConfig {
  return {
    id: `new-${Date.now()}`,
    name: "",
    description: "",
    rewardType: "CUSTOM",
    threshold: 10,
    thresholdUnit: unit,
    value: null,
    minPurchase: null,
    maxDiscount: null,
    isActive: true,
    sortOrder: 0,
    validFrom: null,
    validUntil: null,
    maxUsesPerCustomer: null,
    reuseDelayDays: null,
    globalLimit: null,
    archivedAt: null,
    conditions: null,
  };
}

function toNullableNumber(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

type FieldErrors = Partial<Record<
  "name" | "description" | "threshold" | "value" | "maxDiscount" | "validity" | "minPurchase" | "globalLimit" | "maxUsesPerCustomer" | "reuseDelayDays",
  string
>>;

function validateReward(values: RewardConfig): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  if (name.length < 2) errors.name = "Le nom doit contenir au moins 2 caractères.";
  else if (name.length > 80) errors.name = "80 caractères maximum.";

  if ((values.description ?? "").length > 300) errors.description = "300 caractères maximum.";

  if (!Number.isInteger(values.threshold) || values.threshold < 1) {
    errors.threshold = "Indiquez un nombre entier d'au moins 1.";
  } else if (values.threshold > 1_000_000) {
    errors.threshold = "1 000 000 maximum.";
  }

  if (values.rewardType === "PERCENT_DISCOUNT") {
    if (values.value === null || values.value === undefined) {
      errors.value = "Indiquez un pourcentage de réduction.";
    } else if (values.value < 0 || values.value > 100) {
      errors.value = "Le pourcentage doit être entre 0 et 100.";
    }
    if (values.maxDiscount !== null && values.maxDiscount !== undefined && values.maxDiscount < 0) {
      errors.maxDiscount = "Ne peut pas être négatif.";
    }
  }
  if (values.rewardType === "FIXED_DISCOUNT") {
    if (values.value === null || values.value === undefined) {
      errors.value = "Indiquez un montant de réduction.";
    } else if (values.value < 0) {
      errors.value = "Ne peut pas être négatif.";
    }
  }

  if (values.validFrom && values.validUntil && values.validUntil < values.validFrom) {
    errors.validity = "La date de fin doit être postérieure à la date de début.";
  }

  if (values.minPurchase !== null && values.minPurchase !== undefined && values.minPurchase < 0) {
    errors.minPurchase = "Ne peut pas être négatif.";
  }
  if (values.globalLimit !== null && values.globalLimit !== undefined && values.globalLimit < 0) {
    errors.globalLimit = "Ne peut pas être négatif.";
  }
  if (values.maxUsesPerCustomer !== null && values.maxUsesPerCustomer !== undefined && values.maxUsesPerCustomer < 0) {
    errors.maxUsesPerCustomer = "Ne peut pas être négatif.";
  }
  if (values.reuseDelayDays !== null && values.reuseDelayDays !== undefined && values.reuseDelayDays < 0) {
    errors.reuseDelayDays = "Ne peut pas être négatif.";
  }

  return errors;
}

function previewLine(values: RewardConfig, unit: "visits" | "points"): string {
  const qty = `${values.threshold || 0} ${unitWord(unit, values.threshold || 0)}`;
  const name = values.name.trim() || "cet avantage";
  let reward = name;
  if (values.rewardType === "PERCENT_DISCOUNT" && values.value) {
    reward = `${name} (−${values.value}%${values.maxDiscount ? `, plafonné à ${values.maxDiscount} €` : ""})`;
  } else if (values.rewardType === "FIXED_DISCOUNT" && values.value) {
    reward = `${name} (−${values.value} €)`;
  }
  return `Après ${qty}, le client reçoit ${reward}.`;
}

export function RewardFormDialog({
  open,
  reward,
  unit,
  onCancel,
  onSave,
}: {
  open: boolean;
  reward: RewardConfig | null;
  unit: "visits" | "points";
  onCancel: () => void;
  onSave: (values: RewardConfig) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<RewardConfig>(() => reward ?? emptyReward(unit));
  const [initialSnapshot, setInitialSnapshot] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [showLimits, setShowLimits] = useState(false);
  const isEdit = reward !== null;

  useEffect(() => {
    if (!open) return;
    const initial = reward ?? emptyReward(unit);
    setValues(initial);
    setInitialSnapshot(JSON.stringify(initial));
    setErrors({});
    setSubmitting(false);
    setDiscardConfirmOpen(false);
    setShowLimits(Boolean(initial.minPurchase || initial.globalLimit || initial.maxUsesPerCustomer || initial.reuseDelayDays));
  }, [open, reward, unit]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const dirty = open && JSON.stringify(values) !== initialSnapshot;

  function requestClose() {
    if (dirty) {
      setDiscardConfirmOpen(true);
      return;
    }
    onCancel();
  }

  function patch(next: Partial<RewardConfig>) {
    setValues((v) => ({ ...v, ...next }));
  }

  function handleSubmit() {
    setSubmitting(true);
    const nextErrors = validateReward(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitting(false);
      return;
    }
    onSave({
      ...values,
      name: values.name.trim(),
      description: values.description?.trim() || null,
    });
  }

  const showDiscountFields = values.rewardType === "PERCENT_DISCOUNT" || values.rewardType === "FIXED_DISCOUNT";

  return (
    <>
      <dialog
        ref={dialogRef}
        className="reward-form-dialog"
        onCancel={(e) => {
          e.preventDefault();
          requestClose();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) requestClose();
        }}
      >
        {open ? (
          <div className="reward-form-dialog-inner">
            <div className="reward-form-header">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                  {isEdit ? "Modifier l'avantage" : "Nouvel avantage"}
                </p>
                <h2 className="mt-0.5 text-xl font-black text-[var(--ink)]">
                  {isEdit ? values.name || "Avantage" : "Créer un avantage"}
                </h2>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">
                  Répondez simplement : ce que le client reçoit, quand il le reçoit, puis les limites éventuelles.
                </p>
              </div>
              <button type="button" aria-label="Fermer" className="reward-form-close" onClick={requestClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="reward-form-body">
              {Object.keys(errors).length > 0 ? (
                <Alert>Corrigez les champs indiqués ci-dessous avant d&apos;enregistrer.</Alert>
              ) : null}

              <section className="reward-form-section">
                <h3 className="reward-form-section-title">1. Que reçoit le client ?</h3>
                <Field label="Nom visible par le client" hint="Ex : Café offert, -10 %, soin découverte.">
                  <Input
                    value={values.name}
                    placeholder="Ex : Boisson offerte"
                    onChange={(e) => patch({ name: e.target.value })}
                  />
                </Field>
                {errors.name ? <p className="reward-form-error">{errors.name}</p> : null}
                <Field label="Détail utile (optionnel)" hint="Précisez le produit, le service ou une condition simple.">
                  <Input
                    value={values.description ?? ""}
                    placeholder="Ex : Une boisson chaude au choix"
                    onChange={(e) => patch({ description: e.target.value })}
                  />
                </Field>
                {errors.description ? <p className="reward-form-error">{errors.description}</p> : null}
              </section>

              <section className="reward-form-section">
                <h3 className="reward-form-section-title">Choisir le type</h3>
                <div className="reward-type-grid">
                  {REWARD_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => patch({ rewardType: t.id })}
                      className={cn("program-mode-option", values.rewardType === t.id && "program-mode-option-active")}
                    >
                      <span className="font-bold text-[var(--ink)]">{t.label}</span>
                      <span className="text-xs text-[var(--muted)]">{t.hint}</span>
                    </button>
                  ))}
                </div>
                {showDiscountFields ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label={values.rewardType === "PERCENT_DISCOUNT" ? "Pourcentage de réduction (%)" : "Montant de la réduction (€)"}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={values.rewardType === "PERCENT_DISCOUNT" ? 100 : undefined}
                        value={values.value ?? ""}
                        onChange={(e) => patch({ value: toNullableNumber(e.target.value) })}
                      />
                    </Field>
                    {values.rewardType === "PERCENT_DISCOUNT" ? (
                      <Field label="Réduction maximum (€, optionnel)" hint="Plafonne la remise sur un gros achat.">
                        <Input
                          type="number"
                          min={0}
                          placeholder="Illimité"
                          value={values.maxDiscount ?? ""}
                          onChange={(e) => patch({ maxDiscount: toNullableNumber(e.target.value) })}
                        />
                      </Field>
                    ) : null}
                  </div>
                ) : null}
                {errors.value ? <p className="reward-form-error">{errors.value}</p> : null}
                {errors.maxDiscount ? <p className="reward-form-error">{errors.maxDiscount}</p> : null}
              </section>

              <section className="reward-form-section">
                <h3 className="reward-form-section-title">2. À partir de combien ?</h3>
                <Field
                  label={`Nombre de ${unit === "points" ? "points" : "passages"} nécessaires`}
                  hint={`Le client doit avoir au moins ${values.threshold || 0} ${unitWord(unit, values.threshold || 0)} pour débloquer cet avantage.`}
                >
                  <Input
                    type="number"
                    min={1}
                    max={1_000_000}
                    value={values.threshold}
                    onChange={(e) => patch({ threshold: Math.trunc(Number(e.target.value) || 0) })}
                  />
                </Field>
                {errors.threshold ? <p className="reward-form-error">{errors.threshold}</p> : null}
              </section>

              <section className="reward-form-section">
                <h3 className="reward-form-section-title">3. Date de validité</h3>
                <label className="reward-form-checkbox">
                  <input
                    type="checkbox"
                    checked={!values.validUntil}
                    onChange={(e) => patch({ validUntil: e.target.checked ? null : new Date().toISOString().slice(0, 10) })}
                  />
                  Sans expiration
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Début de validité" hint="Vide = disponible immédiatement.">
                    <Input
                      type="date"
                      value={values.validFrom?.slice(0, 10) ?? ""}
                      onChange={(e) => patch({ validFrom: e.target.value || null })}
                    />
                  </Field>
                  {values.validUntil ? (
                    <Field label="Fin de validité">
                      <Input
                        type="date"
                        value={values.validUntil?.slice(0, 10) ?? ""}
                        onChange={(e) => patch({ validUntil: e.target.value || null })}
                      />
                    </Field>
                  ) : null}
                </div>
                {errors.validity ? <p className="reward-form-error">{errors.validity}</p> : null}
              </section>

              <section className="reward-form-section">
                <h3 className="reward-form-section-title">Limites si besoin</h3>
                <label className="reward-form-checkbox">
                  <input type="checkbox" checked={showLimits} onChange={(event) => setShowLimits(event.currentTarget.checked)} />
                  Ajouter une limite d'utilisation
                </label>
                {showLimits ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Montant minimum d'achat (€)" hint="Aucun = pas de minimum.">
                      <Input
                        type="number"
                        min={0}
                        placeholder="Aucun"
                        value={values.minPurchase ?? ""}
                        onChange={(e) => patch({ minPurchase: toNullableNumber(e.target.value) })}
                      />
                    </Field>
                    <Field label="Limite globale" hint="Nombre total d'utilisations, tous clients confondus.">
                      <Input
                        type="number"
                        min={0}
                        placeholder="Illimité"
                        value={values.globalLimit ?? ""}
                        onChange={(e) => patch({ globalLimit: toNullableNumber(e.target.value) })}
                      />
                    </Field>
                    <Field label="Limite par client" hint="Nombre de fois qu'un même client peut l'utiliser.">
                      <Input
                        type="number"
                        min={0}
                        placeholder="Illimité"
                        value={values.maxUsesPerCustomer ?? ""}
                        onChange={(e) => patch({ maxUsesPerCustomer: toNullableNumber(e.target.value) })}
                      />
                    </Field>
                    <Field label="Délai avant réutilisation (jours)" hint="Temps minimum entre deux utilisations.">
                      <Input
                        type="number"
                        min={0}
                        placeholder="Aucun"
                        value={values.reuseDelayDays ?? ""}
                        onChange={(e) => patch({ reuseDelayDays: toNullableNumber(e.target.value) })}
                      />
                    </Field>
                  </div>
                ) : null}
                {errors.minPurchase ? <p className="reward-form-error">{errors.minPurchase}</p> : null}
                {errors.globalLimit ? <p className="reward-form-error">{errors.globalLimit}</p> : null}
                {errors.maxUsesPerCustomer ? <p className="reward-form-error">{errors.maxUsesPerCustomer}</p> : null}
                {errors.reuseDelayDays ? <p className="reward-form-error">{errors.reuseDelayDays}</p> : null}
              </section>

              <section className="reward-form-section">
                <h3 className="reward-form-section-title">Statut</h3>
                <p className="text-xs text-[var(--muted-strong)]">
                  Actif : visible et utilisable. Inactif : conservé mais masqué. Archivé : retiré du catalogue avec son historique conservé.
                </p>
                <label className="reward-form-toggle">
                  <input
                    type="checkbox"
                    checked={values.isActive}
                    onChange={(e) => patch({ isActive: e.target.checked })}
                  />
                  <span className="reward-form-toggle-track" aria-hidden />
                  <span className="text-sm font-semibold text-[var(--ink)]">
                    {values.isActive ? "Avantage activé — proposé aux clients" : "Avantage désactivé — masqué des clients"}
                  </span>
                </label>
              </section>

              <section className="reward-form-preview">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">4. Résumé avant enregistrement</p>
                <p className="mt-1 text-sm font-bold text-[var(--ink)]">{previewLine(values, unit)}</p>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">Type : {rewardTypeLabel(values.rewardType)}</p>
              </section>
            </div>

            <div className="reward-form-actions">
              <Button variant="ghost" className="h-11 px-4 text-sm" onClick={requestClose}>
                Annuler
              </Button>
              <Button className="h-11 px-5 text-sm" disabled={submitting} onClick={handleSubmit}>
                {submitting ? "Enregistrement…" : isEdit ? "Enregistrer les modifications" : "Créer l'avantage"}
              </Button>
            </div>
          </div>
        ) : null}
      </dialog>

      <ConfirmDialog
        open={discardConfirmOpen}
        title="Abandonner les modifications ?"
        description="Les changements apportés à cet avantage n'ont pas été enregistrés et seront perdus."
        confirmLabel="Abandonner"
        cancelLabel="Continuer l'édition"
        tone="danger"
        onCancel={() => setDiscardConfirmOpen(false)}
        onConfirm={() => {
          setDiscardConfirmOpen(false);
          onCancel();
        }}
      />
    </>
  );
}
