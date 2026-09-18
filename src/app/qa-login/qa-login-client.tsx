"use client";

import { useEffect } from "react";

function readFragmentToken() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return params.get("token");
}

export function QaLoginClient() {
  useEffect(() => {
    const token = readFragmentToken();
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

    async function exchange() {
      const response = await fetch("/api/qa-login/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store",
      });
      if (!response.ok) {
        window.location.href = "/connexion";
        return;
      }
      const data = (await response.json()) as { redirectTo?: string };
      window.location.href = data.redirectTo ?? "/connexion";
    }

    void exchange();
  }, []);

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 text-center">
      <p className="text-base font-semibold text-[var(--ink)]">Connexion QA en cours</p>
    </main>
  );
}
