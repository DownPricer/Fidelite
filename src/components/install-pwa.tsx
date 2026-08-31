"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui";

type BeforeInstall = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallPwa({ compact = false }: { compact?: boolean }) {
  const [deferred, setDeferred] = useState<BeforeInstall | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setInstalled(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstall);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  if (ios) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-bg)] p-5 text-center text-[var(--panel-text)] shadow-sm">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">Installation iPhone</p>
        <p className="text-sm font-medium italic leading-relaxed text-[var(--panel-text)]">
          Ouvrez le menu de partage <span className="inline-block rounded bg-[var(--page-bg)] px-1">⎙</span> puis <strong>Sur l’écran d’accueil</strong>.
        </p>
      </div>
    );
  }

  return (
    <Button 
      variant={compact ? "secondary" : "primary"} 
      onClick={install} 
      disabled={!deferred} 
      type="button"
      className={compact ? "w-auto px-4 py-2 text-xs" : "w-full py-4"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 mr-2">
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Installer l'application
    </Button>
  );
}
