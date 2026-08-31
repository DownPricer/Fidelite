"use client";



import { useEffect, useState } from "react";

import { getCachedQr, loadUniversalQr } from "./qr-cache";

import { PREVIEW_QR } from "./preview-data";



export function QrBlock({
  slug,
  preview = false,
  variant = "standalone",
}: {
  slug: string;
  preview?: boolean;
  variant?: "standalone" | "embedded";
}) {

  const [image, setImage] = useState<string | null>(preview ? PREVIEW_QR : getCachedQr());

  const [error, setError] = useState<string | null>(null);



  useEffect(() => {

    if (preview) return;

    if (image) return;

    let cancelled = false;

    void loadUniversalQr(slug).then((next) => {

      if (cancelled) return;

      if (next) setImage(next);

      else setError("QR indisponible.");

    });

    return () => {

      cancelled = true;

    };

  }, [preview, slug, image]);



  return (

    <div className="flex flex-col items-center">

      <div className="rounded-[20px] border border-white/20 bg-[#faf9ff] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_12px_30px_rgba(0,0,0,0.35)]">

        <div className="aspect-square w-[196px]">

          {image ? (

            // eslint-disable-next-line @next/next/no-img-element

            <img src={image} alt="QR Fife Life universel" className="h-full w-full" />

          ) : (

            <div className="grid h-full w-full place-items-center">

              <div className="h-7 w-7 rounded-full border-2 border-[var(--violet)] border-t-transparent" />

            </div>

          )}

        </div>

      </div>

      <p className="mt-3 text-center text-sm font-semibold text-[var(--ink-soft)]">QR universel Fife Life</p>

      {error ? <p className="mt-1 text-xs font-bold text-[var(--danger)]">{error}</p> : null}

    </div>

  );

}

