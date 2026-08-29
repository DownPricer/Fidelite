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
      <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Sur iPhone : ouvrez le menu de partage, puis <strong>Sur l’écran d’accueil</strong>.
      </p>
    );
  }

  return (
    <Button variant={compact ? "secondary" : "primary"} onClick={install} disabled={!deferred} type="button">
      Ajouter à l’écran d’accueil
    </Button>
  );
}
