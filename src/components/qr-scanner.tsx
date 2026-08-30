"use client";

import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "./ui";

function formatCameraError(err: unknown): string {
  const labels: Record<string, string> = {
    NotAllowedError: "Permission refusée",
    NotFoundError: "Aucune caméra détectée",
    NotReadableError: "Caméra déjà utilisée",
    OverconstrainedError: "Caméra incompatible",
    SecurityError: "Accès caméra bloqué",
    AbortError: "Accès caméra interrompu",
  };

  const knownNames = Object.keys(labels);

  if (err instanceof DOMException) {
    const label = labels[err.name] ?? "Erreur caméra";
    return `${label} (${err.name})`;
  }

  if (err instanceof Error) {
    const fromMessage = err.message.match(
      new RegExp(`\\b(${knownNames.join("|")})\\b`),
    )?.[1];
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

async function safeStopScanner(scanner: Html5Qrcode | null, isScanningRef: { current: boolean }) {
  if (!scanner || !isScanningRef.current) return;
  try {
    const state = scanner.getState();
    if (
      state === Html5QrcodeScannerState.SCANNING ||
      state === Html5QrcodeScannerState.PAUSED
    ) {
      await scanner.stop();
    }
  } catch {
    // Scanner déjà arrêté ou jamais démarré — ignorer silencieusement.
  } finally {
    isScanningRef.current = false;
  }
}

export function QrScanner({
  onResult,
  active,
  variant = "light",
}: {
  onResult: (text: string) => void;
  active: boolean;
  variant?: "light" | "dark";
}) {
  const scannerId = useId().replace(/:/g, "");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const onResultRef = useRef(onResult);
  const [error, setError] = useState<string | null>(null);

  onResultRef.current = onResult;

  const stopScanner = useCallback(async () => {
    await safeStopScanner(scannerRef.current, isScanningRef);
  }, []);

  useEffect(() => {
    if (!active) {
      void stopScanner();
      return;
    }

    setError(null);
    isScanningRef.current = false;

    let cancelled = false;
    const scanner = new Html5Qrcode(scannerId);
    scannerRef.current = scanner;

    void scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (text) => {
          onResultRef.current(text);
          void safeStopScanner(scanner, isScanningRef);
        },
        () => undefined,
      )
      .then(() => {
        if (!cancelled) {
          isScanningRef.current = true;
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          isScanningRef.current = false;
          setError(formatCameraError(err));
        }
      });

    return () => {
      cancelled = true;
      void safeStopScanner(scanner, isScanningRef);
      scannerRef.current = null;
    };
  }, [active, scannerId, stopScanner]);

  return (
    <div className="space-y-3">
      <div id={scannerId} className="overflow-hidden rounded-3xl bg-black" />
      {error ? (
        <p
          role="alert"
          className={
            variant === "dark"
              ? "text-sm font-bold text-rose-300"
              : "text-sm font-medium text-[var(--danger)]"
          }
        >
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  function submitValue() {
    const token = value.trim();
    if (!token) return;
    onSubmit(token);
    setValue("");
  }

  return (
    <section className="w-full rounded-2xl border-2 border-white/40 bg-white p-6 shadow-xl">
      <h2 className="text-base font-black text-[var(--navy)]">
        Scanner avec un lecteur USB ou Bluetooth
      </h2>
      <p className="mt-1 text-sm text-[var(--navy)]/70">
        Branchez le lecteur : il saisira automatiquement le code ici.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          submitValue();
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          disabled={disabled}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded-xl border-2 border-[var(--navy)]/25 bg-white px-4 py-4 text-base font-medium text-[var(--navy)] outline-none placeholder:text-[var(--navy)]/45 focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/20"
          placeholder="Scannez ou collez le code de la carte"
          autoComplete="off"
          inputMode="text"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="w-full border-[var(--navy)]/20 bg-[var(--navy)]/5 text-[var(--navy)] hover:bg-[var(--navy)]/10 sm:flex-1"
            disabled={disabled}
            onClick={() => inputRef.current?.focus()}
          >
            Placer le curseur ici
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:flex-1"
            disabled={disabled}
          >
            Valider le code
          </Button>
        </div>
      </form>
    </section>
  );
}
