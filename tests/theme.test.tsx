// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "@/components/theme-provider";
import { AppearanceRow } from "@/components/fife-life/profile/profile-shared";

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("dark") ? prefersDark : !prefersDark,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

async function renderAppearance() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(
      <ThemeProvider>
        <AppearanceRow />
      </ThemeProvider>,
    );
  });
  return { container, root };
}

describe("thème — sélecteur d'apparence", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    mockMatchMedia(false);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("propose les trois choix Sombre / Clair / Système", async () => {
    const { container } = await renderAppearance();
    const labels = Array.from(container.querySelectorAll('[role="radio"]')).map((el) => el.textContent);
    expect(labels.some((l) => l?.includes("Sombre"))).toBe(true);
    expect(labels.some((l) => l?.includes("Clair"))).toBe(true);
    expect(labels.some((l) => l?.includes("Système"))).toBe(true);
  });

  it("le thème sombre est sélectionné par défaut pour les utilisateurs existants", async () => {
    const { container } = await renderAppearance();
    const darkBtn = Array.from(container.querySelectorAll('[role="radio"]')).find((el) =>
      el.textContent?.includes("Sombre"),
    );
    expect(darkBtn?.getAttribute("aria-checked")).toBe("true");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("applique le thème clair immédiatement au clic, sans rechargement", async () => {
    const { container } = await renderAppearance();
    const lightBtn = Array.from(container.querySelectorAll('[role="radio"]')).find((el) =>
      el.textContent?.includes("Clair"),
    ) as HTMLButtonElement;

    await act(async () => {
      lightBtn.click();
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(lightBtn.getAttribute("aria-checked")).toBe("true");
  });

  it("persiste le choix dans le stockage local sous la clé fidelo-theme", async () => {
    const { container } = await renderAppearance();
    const lightBtn = Array.from(container.querySelectorAll('[role="radio"]')).find((el) =>
      el.textContent?.includes("Clair"),
    ) as HTMLButtonElement;

    await act(async () => {
      lightBtn.click();
    });

    expect(window.localStorage.getItem("fidelo-theme")).toBe("light");
  });

  it("le mode système suit prefers-color-scheme", async () => {
    mockMatchMedia(true);
    const { container } = await renderAppearance();
    const systemBtn = Array.from(container.querySelectorAll('[role="radio"]')).find((el) =>
      el.textContent?.includes("Système"),
    ) as HTMLButtonElement;

    await act(async () => {
      systemBtn.click();
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("restaure le thème choisi après un rechargement (stockage local relu)", async () => {
    window.localStorage.setItem("fidelo-theme", "light");
    const { container } = await renderAppearance();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    const lightBtn = Array.from(container.querySelectorAll('[role="radio"]')).find((el) =>
      el.textContent?.includes("Clair"),
    );
    expect(lightBtn?.getAttribute("aria-checked")).toBe("true");
  });
});
