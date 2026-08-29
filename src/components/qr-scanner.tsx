"use client";

import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "./ui";

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
      .catch(() => {
        if (!cancelled) {
          isScanningRef.current = false;
          setError(
            "Caméra indisponible. Autorisez l'accès ou utilisez le scanner USB / Bluetooth ci-dessous.",
          );
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
  variant = "light",
}: {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  variant?: "light" | "dark";
}) {
  const [value, setValue] = useState("");

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        const token = value.trim();
        if (!token) return;
        onSubmit(token);
        setValue("");
      }}
    >
      <label
        className={
          variant === "dark"
            ? "block text-sm font-bold text-[var(--navy-text)]/80"
            : "block text-sm font-medium text-[var(--panel-text)]"
        }
        htmlFor="usb-scan"
      >
        Scanner USB / Bluetooth
      </label>
      <input
        id="usb-scan"
        autoFocus
        disabled={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={
          variant === "dark"
            ? "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-4 text-base text-[var(--navy-text)] outline-none placeholder:text-[var(--navy-text)]/40 focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/20"
            : "w-full rounded-xl border border-[var(--border)] bg-[var(--panel-bg)] px-4 py-4 text-base text-[var(--panel-text)] outline-none placeholder:text-[var(--muted-text)] focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/15"
        }
        placeholder="Le curseur reste ici — le scanner envoie le code puis Entrée"
        autoComplete="off"
        inputMode="none"
      />
      <Button
        type="submit"
        variant="secondary"
        className={variant === "dark" ? "w-full border-white/20 bg-white/10 text-[var(--navy-text)] hover:bg-white/20" : "w-full"}
        disabled={disabled}
      >
        Valider le code
      </Button>
    </form>
  );
}
