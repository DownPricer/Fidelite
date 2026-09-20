"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Activer le thème sombre" : "Activer le thème clair"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[light-dark(rgba(122,69,242,0.18),rgba(255,255,255,0.14))] bg-[light-dark(rgba(255,255,255,0.7),rgba(255,255,255,0.06))] text-[var(--ink)] transition hover:bg-[light-dark(rgba(255,255,255,0.9),rgba(255,255,255,0.1))]"
    >
      <span aria-hidden className="text-base leading-none">
        {mounted ? (isLight ? "🌙" : "☀️") : "🌓"}
      </span>
    </button>
  );
}
