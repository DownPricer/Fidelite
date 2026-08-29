"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui";

export function QrScanner({
  onResult,
  active,
}: {
  onResult: (text: string) => void;
  active: boolean;
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
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
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
      <label className="block text-sm font-medium text-slate-700" htmlFor="usb-scan">
        Scanner USB / Bluetooth
      </label>
      <input
        id="usb-scan"
        autoFocus
        disabled={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full rounded-xl border border-border px-4 py-4 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
        placeholder="Le curseur reste ici pour le scanner clavier"
        autoComplete="off"
        inputMode="none"
      />
      <Button type="submit" variant="secondary" className="w-full" disabled={disabled}>
        Valider le code
      </Button>
    </form>
  );
}
