"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PlayIcon } from "@/components/landing/icons";
import { LANDING_EXPLAINER_VIDEO_TITLE } from "@/lib/landing-explainer-video";

type LandingExplainerVideoProps = {
  videoSrc: string;
  posterSrc: string;
  captionsSrc?: string | null;
};

export function LandingExplainerVideo({ videoSrc, posterSrc, captionsSrc }: LandingExplainerVideoProps) {
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const playVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setShowPlayOverlay(false);
    } catch {
      video.focus();
    }
  };

  return (
    <figure className="mx-auto w-full max-w-[920px]">
      <div
        className="group relative overflow-hidden rounded-[22px] border border-[rgba(167,139,250,0.22)] bg-[var(--fh-surface-solid)] shadow-[0_24px_60px_rgba(76,29,149,0.22)]"
        style={{ aspectRatio: "16 / 9" }}
      >
        <video
          ref={videoRef}
          id={titleId}
          className="h-full w-full bg-black object-contain"
          controls
          playsInline
          preload="metadata"
          poster={posterSrc}
          aria-labelledby={`${titleId}-label`}
          onPlay={() => setShowPlayOverlay(false)}
          onEnded={() => setShowPlayOverlay(true)}
          onPause={() => {
            const video = videoRef.current;
            if (video && video.currentTime < 0.05) setShowPlayOverlay(true);
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          {captionsSrc ? (
            <track kind="captions" src={captionsSrc} srcLang="fr" label="Français" default />
          ) : null}
          Votre navigateur ne permet pas de lire cette vidéo.
        </video>

        {showPlayOverlay ? (
          <button
            type="button"
            onClick={() => void playVideo()}
            className={`absolute inset-0 z-10 flex items-center justify-center bg-[rgba(12,8,20,0.35)] transition ${
              reducedMotion ? "" : "duration-200 group-hover:bg-[rgba(12,8,20,0.42)]"
            }`}
            aria-label="Lire la vidéo de présentation Fideto"
          >
            <span
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-white shadow-[0_16px_40px_rgba(91,33,182,0.45)] sm:h-[84px] sm:w-[84px]"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              <PlayIcon className="ml-1 h-8 w-8 sm:h-9 sm:w-9" />
            </span>
          </button>
        ) : null}
      </div>
      <figcaption id={`${titleId}-label`} className="sr-only">
        {LANDING_EXPLAINER_VIDEO_TITLE}
      </figcaption>
    </figure>
  );
}
