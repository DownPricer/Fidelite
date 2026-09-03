"use client";

import { useCallback, useRef, useState } from "react";

const MAX_DIM = 512;
const JPEG_QUALITY = 0.85;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Impossible de charger l'image."));
    img.src = src;
  });
}

function cropCircleToDataUrl(img: HTMLImageElement, rotation = 0) {
  const canvas = document.createElement("canvas");
  const size = Math.min(MAX_DIM, Math.min(img.width, img.height));
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible.");

  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.translate(size / 2, size / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  const scale = size / Math.min(img.width, img.height);
  ctx.drawImage(img, (-img.width * scale) / 2, (-img.height * scale) / 2, img.width * scale, img.height * scale);
  ctx.restore();

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export function useAvatarEditor(onSaved: (dataUrl: string) => Promise<void>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = useCallback((capture?: boolean) => {
    const input = inputRef.current;
    if (!input) return;
    input.value = "";
    if (capture) input.setAttribute("capture", "environment");
    else input.removeAttribute("capture");
    input.click();
  }, []);

  const onFile = useCallback(async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Formats acceptés : JPEG, PNG, WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image trop volumineuse (max 5 Mo).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }, []);

  const save = useCallback(async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);
    try {
      const img = await loadImage(preview);
      const dataUrl = cropCircleToDataUrl(img, rotation);
      await onSaved(dataUrl);
      setPreview(null);
      setRotation(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setLoading(false);
    }
  }, [preview, rotation, onSaved]);

  const cancelPreview = useCallback(() => {
    setPreview(null);
    setRotation(0);
    setError(null);
  }, []);

  return {
    inputRef,
    preview,
    rotation,
    loading,
    error,
    openPicker,
    onFile,
    save,
    cancelPreview,
    rotate: () => setRotation((r) => (r + 90) % 360),
  };
}

export function AvatarFileInput({
  inputRef,
  onFile,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (file: File) => void;
}) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) void onFile(file);
      }}
    />
  );
}

export function AvatarPreviewEditor({
  preview,
  rotation,
  loading,
  error,
  onRotate,
  onSave,
  onCancel,
}: {
  preview: string;
  rotation: number;
  loading: boolean;
  error: string | null;
  onRotate: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border border-white/15 shadow-[0_0_40px_rgba(133,87,255,0.25)]">
        <img
          src={preview}
          alt="Aperçu"
          className="h-full w-full object-cover transition-transform duration-300"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      {error ? <p className="text-center text-xs text-[var(--danger)]">{error}</p> : null}
      <div className="flex gap-2">
        <button type="button" className="profile-btn-secondary flex-1" onClick={onRotate} disabled={loading}>
          Pivoter
        </button>
        <button type="button" className="profile-btn-secondary flex-1" onClick={onCancel} disabled={loading}>
          Annuler
        </button>
        <button type="button" className="profile-btn-primary flex-1" onClick={onSave} disabled={loading}>
          {loading ? "…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
