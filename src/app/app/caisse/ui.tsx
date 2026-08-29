"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { QrScanner, UsbScannerField } from "@/components/qr-scanner";
import { Alert, Button, Card } from "@/components/ui";

type ScanResult = {
  grantId: string;
  firstName: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
  rewardAvailable: boolean;
  progressLabel: string;
};

export function CaisseScreen({
  firstName,
  merchantName,
  role,
}: {
  firstName: string;
  merchantName: string;
  role: string;
}) {
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const submitToken = useCallback(async (token: string) => {
    setBusy(true);
    setError(null);
    setSuccess(null);
    setScanning(false);
    const response = await fetch("/api/caisse/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setResult(null);
      setError(data.error ?? "Scan refusé.");
      return;
    }
    setResult(data);
  }, []);

  async function act(path: "/api/caisse/earn" | "/api/caisse/redeem") {
    if (!result || busy) return;
    setBusy(true);
    setError(null);
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grantId: result.grantId }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Action impossible.");
      return;
    }
    setSuccess(
      path.endsWith("earn")
        ? `+1 passage pour ${data.firstName}. Total : ${data.snapshot.progressLabel}`
        : `Récompense utilisée pour ${data.firstName}.`,
    );
    setResult(null);
  }

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-5 py-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{merchantName}</p>
          <h1 className="text-3xl font-semibold">Mode caisse</h1>
          <p className="text-sm text-slate-500">
            {firstName} · {role === "MERCHANT_ADMIN" ? "Admin" : "Employé"}
          </p>
        </div>
        <Link href="/app" className="text-sm underline">
          Retour
        </Link>
      </div>

      <Button className="mt-6 w-full py-5 text-lg" onClick={() => setScanning(true)} disabled={busy}>
        Scanner un client
      </Button>

      {scanning ? (
        <Card className="mt-4">
          <QrScanner active={scanning} onResult={(text) => void submitToken(text)} />
          <Button className="mt-3 w-full" variant="ghost" onClick={() => setScanning(false)}>
            Fermer la caméra
          </Button>
        </Card>
      ) : null}

      <Card className="mt-4">
        <UsbScannerField onSubmit={(value) => void submitToken(value)} disabled={busy} />
      </Card>

      {error ? <div className="mt-4"><Alert>{error}</Alert></div> : null}
      {success ? <div className="mt-4"><Alert tone="ok">{success}</Alert></div> : null}

      {result ? (
        <Card className="mt-5 space-y-4">
          <p className="text-sm text-slate-500">Client</p>
          <p className="text-3xl font-semibold">{result.firstName}</p>
          <p className="text-xl">{result.progressLabel}</p>
          <Button
            className="w-full py-6 text-2xl"
            disabled={busy}
            onClick={() => void act("/api/caisse/earn")}
          >
            +1 passage
          </Button>
          {result.rewardAvailable ? (
            <Button
              className="w-full py-5 text-lg"
              variant="success"
              disabled={busy}
              onClick={() => void act("/api/caisse/redeem")}
            >
              Utiliser la récompense
            </Button>
          ) : null}
        </Card>
      ) : null}
    </main>
  );
}
