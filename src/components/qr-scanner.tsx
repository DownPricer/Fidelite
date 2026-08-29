"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui";

export function QrScanner({
  onResult,
  active,
  variant = "light",
}: {
  onResult: (text: string) => void;
  active: boolean;
  variant?: "light" | "dark";
}) {
  const ref = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) {
      void ref.current?.stop().catch(() => undefined);
      return;
    }

    const scanner = new Html5Qrcode("fifelite-scanner");
    ref.current = scanner;
    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (text) => {
          onResult(text);
          void scanner.stop().catch(() => undefined);
        },
        () => undefined,
      )
      .catch(() => {
        setError("Caméra indisponible. Autorisez l'accès ou utilisez le scanner USB.");
      });

    return () => {
      void scanner.stop().catch(() => undefined);
    };
  }, [active, onResult]);

  return (
    <div className="space-y-3">
      <div id="fifelite-scanner" className="overflow-hidden rounded-3xl bg-black" />
      {error ? (
        <p className={variant === "dark" ? "text-sm font-bold text-rose-300" : "text-sm text-rose-700"}>
          Caméra indisponible. Autorisez l&apos;accès à la caméra dans les paramètres du navigateur, ou utilisez le scanner USB / Bluetooth ci-dessous.
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
        className={variant === "dark" ? "block text-sm font-bold text-white/80" : "block text-sm font-medium text-slate-700"}
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
            ? "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-4 text-base text-white outline-none placeholder:text-white/40 focus:border-primary focus:ring-4 focus:ring-primary/20"
            : "w-full rounded-xl border border-border px-4 py-4 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
        }
        placeholder="Le curseur reste ici — le scanner envoie le code puis Entrée"
        autoComplete="off"
        inputMode="none"
      />
      <Button
        type="submit"
        variant="secondary"
        className={variant === "dark" ? "w-full border-white/20 bg-white/10 text-white hover:bg-white/20" : "w-full"}
        disabled={disabled}
      >
        Valider le code
      </Button>
    </form>
  );
}
