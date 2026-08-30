"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "./ui";
import {
  finalizeCameraStart,
  rememberToken,
  safeStopScanner,
  shouldIgnoreInstantDuplicate,
  withTimeout,
  type TokenMemory,
} from "@/lib/scan-session";

function formatCameraError(err: unknown): string {
  const labels: Record<string, string> = {
    NotAllowedError: "Permission refusée",
    NotFoundError: "Aucune caméra détectée",
    NotReadableError: "Caméra déjà utilisée",
    OverconstrainedError: "Caméra incompatible",
    SecurityError: "Accès caméra bloqué",
    AbortError: "Accès caméra interrompu",
    TimeoutError: "Caméra trop longue à démarrer",
  };

  const knownNames = Object.keys(labels);

  if (err instanceof DOMException) {
    const label = labels[err.name] ?? "Erreur caméra";
    return `${label} (${err.name})`;
  }

  if (err instanceof Error) {
    const fromMessage = err.message.match(new RegExp(`\\b(${knownNames.join("|")})\\b`))?.[1];
    const name = err.name !== "Error" ? err.name : fromMessage ?? "UnknownError";
    const label = labels[name] ?? "Erreur caméra";
    return `${label} (${name})`;
  }

  if (typeof err === "string") {
    const fromMessage = err.match(new RegExp(`\\b(${knownNames.join("|")})\\b`))?.[1];
    if (fromMessage) {
      return `${labels[fromMessage]} (${fromMessage})`;
    }
  }

  return "Erreur caméra (UnknownError)";
}

export function QrScanner({
  onResult,
  active,
  sessionKey = 0,
}: {
  onResult: (text: string) => void;
  active: boolean;
  sessionKey?: number;
}) {
  const reactId = useId().replace(/:/g, "");
  const instanceIdRef = useRef(`qr-${reactId}-${sessionKey}-${Math.random().toString(36).slice(2, 8)}`);
  const scannerId = instanceIdRef.current;
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const hasScannedRef = useRef(false);
  const lastTokenRef = useRef<TokenMemory | null>(null);
  const onResultRef = useRef(onResult);
  const [error, setError] = useState<string | null>(null);

  onResultRef.current = onResult;

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let scanner: Html5Qrcode | null = null;
    let startPromise: Promise<unknown> | null = null;

    isScanningRef.current = false;
    hasScannedRef.current = false;
    lastTokenRef.current = null;
    setError(null);

    function onDecode(text: string) {
      if (cancelled || hasScannedRef.current) return;
      if (shouldIgnoreInstantDuplicate(lastTokenRef.current, text)) return;
      lastTokenRef.current = rememberToken(text);
      hasScannedRef.current = true;
      onResultRef.current(text);
      void safeStopScanner(scanner);
      isScanningRef.current = false;
    }

    try {
      scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;
      startPromise = scanner.start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 220, height: 220 } },
        onDecode,
        () => undefined,
      );
    } catch (err: unknown) {
      setError(formatCameraError(err));
      return () => {
        cancelled = true;
      };
    }

    void finalizeCameraStart({
      startPromise,
      scanner,
      cancelled: () => cancelled,
    }).then((result) => {
      if (result.error) {
        setError(formatCameraError(result.error));
        isScanningRef.current = false;
        return;
      }
      isScanningRef.current = result.started;
    });

    return () => {
      cancelled = true;
      isScanningRef.current = false;
      const instance = scanner;
      void (async () => {
        if (startPromise) {
          try {
            await withTimeout(startPromise, 3_000, "TimeoutError");
          } catch {
            // Démarrage refusé, occupé, ou encore en cours — on tente un stop sûr.
          }
        }
        await safeStopScanner(instance);
        if (scannerRef.current === instance) scannerRef.current = null;
      })();
    };
  }, [active, scannerId]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div
        id={scannerId}
        className="min-h-[12rem] flex-1 rounded-2xl bg-black [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
      />
      {error ? (
        <p role="alert" className="shrink-0 text-sm font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function UsbScannerField({
  onSubmit,
  disabled,
}: {
  onSubmit: (value: string) => void;
  disabled?: boolean;
}) {
  const inputId = useId();
  const [value, setValue] = useState("");

  function submitValue() {
    const token = value.trim();
    if (!token) return;
    onSubmit(token);
    setValue("");
  }

  return (
    <form
      data-testid="caisse-manual-form"
      className="flex w-full gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        submitValue();
      }}
    >
      <input
        id={inputId}
        disabled={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--panel-bg)] px-4 py-3 text-base text-[var(--panel-text)] outline-none placeholder:text-[var(--muted-text)] focus:border-[var(--teal)]"
        placeholder="Coller le code de la carte"
        autoComplete="off"
        inputMode="text"
        enterKeyHint="done"
      />
      <Button type="submit" variant="primary" className="shrink-0 px-5" disabled={disabled}>
        Valider le code
      </Button>
    </form>
  );
}
