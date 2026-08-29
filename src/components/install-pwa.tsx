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
      <div className="rounded-2xl bg-white border border-border p-5 shadow-sm text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Installation iPhone</p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
          Ouvrez le menu de partage <span className="inline-block px-1 bg-slate-100 rounded">⎙</span> puis <strong>Sur l’écran d’accueil</strong>.
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
      className={compact ? "w-auto text-xs py-2 px-4" : "w-full py-4 shadow-xl shadow-primary/20"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 mr-2">
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Installer l'application
    </Button>
  );
}
