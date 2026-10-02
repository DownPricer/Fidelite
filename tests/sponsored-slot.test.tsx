// @vitest-environment happy-dom

import React, { StrictMode, act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SponsoredSlot, resetSponsoredSessionState } from "@/components/fife-life/sponsored-slot";
import { HourlySchedulePicker } from "@/app/app/campagnes/ui";
import { MobilePlacementPreview } from "@/components/ad-visual-parts";

/**
 * Composant de bandeau côté client : impression comptée seulement quand il est réellement visible
 * (sans doublon de rendu), croix = masquage pour la session en cours (jamais un refus définitif),
 * et sélecteur de créneaux qui n'offre plus ni jours passés ni heures écoulées (Europe/Paris).
 */

const AD = {
  id: "ad1",
  placement: "WALLET_HOME",
  merchantSlug: "soleil",
  merchantName: "Boulangerie Soleil",
  merchantLogoUrl: null,
  imageUrl: "/api/media/visuels/m1/ad1.png",
  text: "-20 % sur le pain",
  ctaLabel: "Voir",
  impressionUrl: "/api/customer/sponsored/ad1/impression",
  clickUrl: "/api/customer/sponsored/ad1/ouvrir?placement=WALLET_HOME",
};

type Observer = { cb: IntersectionObserverCallback; el: Element; disconnected: boolean };
let observers: Observer[] = [];
let calls: { url: string; method: string; body?: string }[] = [];
let roots: Root[] = [];
let serverAd: typeof AD | null = AD;

class FakeIntersectionObserver {
  private entry: Observer | null = null;
  constructor(private cb: IntersectionObserverCallback) {}
  observe(el: Element) {
    this.entry = { cb: this.cb, el, disconnected: false };
    observers.push(this.entry);
  }
  disconnect() {
    if (this.entry) this.entry.disconnected = true;
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

async function mount(node: React.ReactNode, strict = false) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  await act(async () => {
    root.render(strict ? <StrictMode>{node}</StrictMode> : node);
  });
  await flush();
  return container;
}

async function flush() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}

async function intersect(ratio: number) {
  await act(async () => {
    for (const o of observers.filter((x) => !x.disconnected)) {
      o.cb([{ isIntersecting: ratio > 0, intersectionRatio: ratio, target: o.el } as IntersectionObserverEntry], {} as IntersectionObserver);
    }
  });
}

const impressions = () => calls.filter((c) => c.method === "POST");

beforeEach(() => {
  vi.useFakeTimers();
  observers = [];
  calls = [];
  serverAd = AD;
  resetSponsoredSessionState();
  try {
    sessionStorage.clear();
  } catch {
    // ignore
  }
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeIntersectionObserver;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), method: init?.method ?? "GET", body: init?.body as string | undefined });
    return new Response(JSON.stringify(String(input).includes("impression") ? { ok: true, counted: true } : { ad: serverAd }), { status: 200 });
  }) as typeof fetch;
});

afterEach(async () => {
  for (const root of roots) await act(async () => root.unmount());
  roots = [];
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("impressions : uniquement quand le bandeau est réellement visible", () => {
  it("aucune impression au simple rendu ni quand le bandeau est à peine visible ; une seule après 1 s de vraie visibilité", async () => {
    const container = await mount(<SponsoredSlot placement="WALLET_HOME" />);
    expect(container.textContent).toContain("Boulangerie Soleil");
    expect(container.textContent).toContain("Sponsorisé");
    expect(impressions()).toHaveLength(0); // rendu seul : rien

    await intersect(0.2); // moins de 50 % visible
    await act(async () => vi.advanceTimersByTimeAsync(1500));
    expect(impressions()).toHaveLength(0);

    await intersect(0.8);
    await act(async () => vi.advanceTimersByTimeAsync(400));
    await intersect(0); // sort de l'écran avant 1 s : annulé
    await act(async () => vi.advanceTimersByTimeAsync(1500));
    expect(impressions()).toHaveLength(0);

    await intersect(0.9);
    await act(async () => vi.advanceTimersByTimeAsync(1100));
    expect(impressions()).toHaveLength(1);
    expect(JSON.parse(impressions()[0].body!)).toEqual({ placement: "WALLET_HOME" });
    expect(impressions()[0].url).toBe("/api/customer/sponsored/ad1/impression");
  });

  it("pas de doublon dû aux rendus React (StrictMode, remontage, second emplacement identique)", async () => {
    await mount(<SponsoredSlot placement="SEARCH" />, true);
    await intersect(1);
    await act(async () => vi.advanceTimersByTimeAsync(1200));
    await intersect(1);
    await act(async () => vi.advanceTimersByTimeAsync(1200));
    expect(impressions()).toHaveLength(1);
    // Remontage (navigation puis retour) pendant la même utilisation : toujours une seule impression.
    await mount(<SponsoredSlot placement="SEARCH" />);
    await intersect(1);
    await act(async () => vi.advanceTimersByTimeAsync(1200));
    expect(impressions()).toHaveLength(1);
  });

  it("onglet masqué : pas d'impression", async () => {
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    await mount(<SponsoredSlot placement="NOTIFICATIONS" />);
    await intersect(1);
    await act(async () => vi.advanceTimersByTimeAsync(2000));
    expect(impressions()).toHaveLength(0);
  });
});

describe("croix de fermeture : masquage pour la session, jamais un refus définitif", () => {
  it("masque la publicité pendant l'utilisation en cours, sans aucune requête serveur de refus", async () => {
    const container = await mount(<SponsoredSlot placement="WALLET_HOME" />);
    const close = container.querySelector('button[aria-label="Masquer cette publicité"]') as HTMLButtonElement;
    expect(close).not.toBeNull();
    const before = calls.length;
    await act(async () => close.click());
    expect(container.textContent).not.toContain("Boulangerie Soleil");
    expect(calls.length).toBe(before); // aucun appel : pas de refus enregistré côté serveur
    expect(JSON.parse(sessionStorage.getItem("fideto-sponsored-dismissed") ?? "[]")).toEqual(["ad1"]);

    // Un autre emplacement, pendant la même utilisation : la campagne est exclue (même si le serveur la renvoie).
    const other = await mount(<SponsoredSlot placement="SEARCH" />);
    expect(calls[calls.length - 1].url).toContain("exclude=ad1");
    expect(other.textContent).not.toContain("Boulangerie Soleil");
  });

  it("à la prochaine ouverture de l'application, elle peut réapparaître si son créneau est toujours actif", async () => {
    const container = await mount(<SponsoredSlot placement="WALLET_HOME" />);
    await act(async () => (container.querySelector('button[aria-label="Masquer cette publicité"]') as HTMLButtonElement).click());
    expect(container.textContent).not.toContain("Boulangerie Soleil");

    // Nouvelle ouverture : état de session vidé (sessionStorage et mémoire du module).
    resetSponsoredSessionState();
    sessionStorage.clear();
    const reopened = await mount(<SponsoredSlot placement="WALLET_HOME" />);
    expect(calls[calls.length - 1].url).not.toContain("exclude");
    expect(reopened.textContent).toContain("Boulangerie Soleil");
  });

  it("si le créneau n'est plus actif, le serveur ne renvoie rien : rien n'est affiché malgré l'absence de croix", async () => {
    serverAd = null;
    const container = await mount(<SponsoredSlot placement="WALLET_HOME" />);
    expect(container.textContent).toBe("");
  });
});

describe("sélecteur de créneaux : pas de jour passé ni d'heures écoulées (Europe/Paris)", () => {
  function setValue(el: HTMLInputElement, value: string) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  it("10 h 30 : date minimale = aujourd'hui (Paris), créneau par défaut à partir de 11 h, heures écoulées désactivées", async () => {
    vi.setSystemTime(new Date("2026-10-05T08:30:00.000Z")); // 10 h 30 à Paris
    const emitted: { date: string; hours: number[] }[][] = [];
    const container = await mount(<HourlySchedulePicker initial={[]} onChange={(v) => emitted.push(v)} />);
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(dateInput.min).toBe("2026-10-05");
    expect(dateInput.value).toBe("2026-10-05"); // il reste 13 h futures : aujourd'hui est choisissable

    const add = [...container.querySelectorAll("button")].find((b) => b.textContent?.includes("Ajouter un jour")) as HTMLButtonElement;
    await act(async () => add.click());
    expect(emitted[emitted.length - 1]).toEqual([{ date: "2026-10-05", hours: [11, 12, 13] }]);

    const start = container.querySelector('select[aria-label="Début du créneau 1"]') as HTMLSelectElement;
    const disabled = [...start.options].filter((o) => o.disabled).map((o) => Number(o.value));
    expect(disabled).toContain(10);
    expect(disabled).toContain(0);
    expect(disabled).not.toContain(11);
    expect(disabled).not.toContain(12);
  });

  it("22 h 30 : il ne reste que 23 h → aujourd'hui n'est plus choisissable (minimum 3 h), le jour proposé est demain", async () => {
    vi.setSystemTime(new Date("2026-10-05T20:30:00.000Z")); // 22 h 30 à Paris
    const emitted: { date: string; hours: number[] }[][] = [];
    const container = await mount(<HourlySchedulePicker initial={[]} onChange={(v) => emitted.push(v)} />);
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(dateInput.value).toBe("2026-10-06");

    await act(async () => setValue(dateInput, "2026-10-05"));
    const add = [...container.querySelectorAll("button")].find((b) => b.textContent?.includes("Ajouter un jour")) as HTMLButtonElement;
    await act(async () => add.click());
    expect(container.querySelector('[role="alert"]')?.textContent).toMatch(/3 heures disponibles/);
    expect(emitted.every((v) => v.length === 0)).toBe(true); // rien n'a été ajouté

    await act(async () => setValue(dateInput, "2026-10-04")); // jour passé
    await act(async () => add.click());
    expect(container.querySelector('[role="alert"]')?.textContent).toMatch(/passé/);
    expect(emitted.every((v) => v.length === 0)).toBe(true);
  });
});

describe("aperçu réservé (?apercu=) : visible mais jamais compté", () => {
  afterEach(() => window.history.replaceState({}, "", "/"));

  it("affiche la campagne avec l'étiquette d'aperçu, appelle l'API d'aperçu et ne compte aucune impression", async () => {
    window.history.replaceState({}, "", "/carte?apercu=ad1");
    serverAd = { ...AD, impressionUrl: null as unknown as string, clickUrl: "#" };
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), method: init?.method ?? "GET", body: init?.body as string | undefined });
      return new Response(JSON.stringify({ preview: true, simulated: true, ad: serverAd }), { status: 200 });
    }) as typeof fetch;
    const container = await mount(<SponsoredSlot placement="WALLET_HOME" />);
    expect(calls[0].url).toContain("preview=ad1");
    expect(container.querySelector('[data-testid="preview-label"]')?.textContent).toMatch(/campagne de test, simulée/);
    expect(container.textContent).toContain("Boulangerie Soleil");
    await intersect(1);
    await act(async () => vi.advanceTimersByTimeAsync(3000));
    expect(impressions()).toHaveLength(0); // jamais d'impression pour un aperçu
  });

  it("l'aperçu mobile du back-office montre la vraie bannière dans les trois emplacements, sans aucune requête", async () => {
    const container = await mount(
      <MobilePlacementPreview
        ad={{ imageUrl: "/x.png", merchantName: "Boulangerie Soleil", text: "-20 %", ctaLabel: "Voir" }}
        simulated
        links={{ home: "/carte?apercu=ad1", search: "/decouvrir?apercu=ad1", notifications: "/notifications?apercu=ad1" }}
      />,
    );
    expect([...container.querySelectorAll("[data-variant]")].map((el) => el.getAttribute("data-variant"))).toEqual(["home", "search", "notifications"]);
    expect(container.textContent).toContain("campagne de test (simulée)");
    expect(container.querySelector('[data-testid="preview-link-home"]')?.getAttribute("href")).toBe("/carte?apercu=ad1");
    expect(calls).toHaveLength(0);
  });
});
