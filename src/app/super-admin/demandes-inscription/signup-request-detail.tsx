"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

type Detail = {
  id: string;
  status: string;
  statusLabel: string;
  planLabel: string;
  planId: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessActivity: string;
  email: string;
  mobilePhone: string;
  landlinePhone: string | null;
  website: string | null;
  siret: string | null;
  message: string | null;
  addressLine1: string;
  postalCode: string;
  city: string;
  internalNote: string | null;
  codeSentAt: string | null;
  codeUsedAt: string | null;
  codeExpiresAt: string | null;
  codeActive: boolean;
  merchantId: string | null;
  rejectionReason: string | null;
};

export function SignupRequestDetail({ firstName, requestId }: { firstName: string; requestId: string }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/super-admin/signup-requests/${requestId}`);
    const data = (await res.json()) as { request?: Detail; error?: string };
    if (!res.ok) {
      setError(data.error ?? "Chargement impossible.");
      return;
    }
    setDetail(data.request ?? null);
    setNote(data.request?.internalNote ?? "");
  }, [requestId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function action(name: Detail["status"] extends string ? string : never, body: Record<string, unknown> = {}) {
    setPending(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch(`/api/super-admin/signup-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: name, ...body }),
      });
      const data = (await res.json()) as { error?: string; devCode?: string; emailError?: string };
      if (!res.ok) {
        setError(data.error ?? "Action impossible.");
        return;
      }
      if (data.devCode) setInfo(`Code (environnement de démo) : ${data.devCode}`);
      if (data.emailError) setInfo(`E-mail non envoyé : ${data.emailError}`);
      await load();
    } catch {
      setError("Action impossible.");
    } finally {
      setPending(false);
    }
  }

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="space-y-6">
        <Link href="/super-admin/demandes-inscription" className="text-sm font-bold text-[var(--violet-bright)] hover:underline">
          ← Toutes les demandes
        </Link>
        {error ? <Alert>{error}</Alert> : null}
        {info ? <Alert>{info}</Alert> : null}
        {detail ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[var(--ink)]">{detail.businessName}</h1>
                <p className="text-sm text-[var(--muted-text)]">{detail.statusLabel} · {detail.planLabel}</p>
              </div>
              {detail.merchantId ? (
                <Link href={`/super-admin/commerces/${detail.merchantId}`} className="text-sm font-bold text-[var(--violet-bright)] hover:underline">
                  Ouvrir le commerce →
                </Link>
              ) : null}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="space-y-2 p-4 text-sm">
                <p><strong>Contact :</strong> {detail.firstName} {detail.lastName}</p>
                <p><strong>E-mail :</strong> {detail.email}</p>
                <p><strong>Mobile :</strong> {detail.mobilePhone}</p>
                {detail.landlinePhone ? <p><strong>Fixe :</strong> {detail.landlinePhone}</p> : null}
                <p><strong>Activité :</strong> {detail.businessActivity}</p>
                <p><strong>Adresse :</strong> {detail.addressLine1}, {detail.postalCode} {detail.city}</p>
                {detail.website ? <p><strong>Site :</strong> {detail.website}</p> : null}
                {detail.siret ? <p><strong>SIRET :</strong> {detail.siret}</p> : null}
                {detail.message ? <p className="whitespace-pre-wrap"><strong>Message :</strong> {detail.message}</p> : null}
              </Card>
              <Card className="space-y-3 p-4 text-sm">
                <p><strong>Code envoyé :</strong> {detail.codeSentAt ? new Date(detail.codeSentAt).toLocaleString("fr-FR") : "—"}</p>
                <p><strong>Expiration :</strong> {detail.codeExpiresAt ? new Date(detail.codeExpiresAt).toLocaleString("fr-FR") : "—"}</p>
                <p><strong>Code utilisé :</strong> {detail.codeUsedAt ? new Date(detail.codeUsedAt).toLocaleString("fr-FR") : "Non"}</p>
                <p><strong>Code actif :</strong> {detail.codeActive ? "Oui" : "Non"}</p>
                {detail.rejectionReason ? <p><strong>Motif de refus :</strong> {detail.rejectionReason}</p> : null}
              </Card>
            </div>

            <Card className="space-y-4 p-4">
              <Field label="Note interne">
                <Input value={note} onChange={(e) => setNote(e.target.value)} />
              </Field>
              <div className="flex flex-wrap gap-2">
                <Button type="button" disabled={pending} onClick={() => void action("note", { internalNote: note })}>
                  Enregistrer la note
                </Button>
                {detail.status === "PENDING_REVIEW" ? (
                  <>
                    <Button type="button" disabled={pending} onClick={() => void action("accept", { internalNote: note })}>
                      Accepter et envoyer un code
                    </Button>
                    <Button type="button" variant="danger" disabled={pending} onClick={() => void action("reject", { rejectionReason: rejectReason, internalNote: note })}>
                      Refuser
                    </Button>
                  </>
                ) : null}
                {detail.status === "CODE_SENT" || detail.status === "CODE_REVOKED" ? (
                  <>
                    <Button type="button" disabled={pending} onClick={() => void action("resend_code")}>
                      Renvoyer un code
                    </Button>
                    {detail.status === "CODE_SENT" && !detail.codeUsedAt ? (
                      <Button type="button" variant="secondary" disabled={pending} onClick={() => void action("revoke_code")}>
                        Révoquer le code
                      </Button>
                    ) : null}
                  </>
                ) : null}
              </div>
              {detail.status === "PENDING_REVIEW" ? (
                <Field label="Motif de refus (e-mail au commerçant)">
                  <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                </Field>
              ) : null}
            </Card>
          </>
        ) : null}
      </div>
    </SuperAdminShell>
  );
}
