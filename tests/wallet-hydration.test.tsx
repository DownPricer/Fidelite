// @vitest-environment happy-dom

import React, { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CardDeck } from "@/components/fife-life/card-deck";
import { GlobalCard } from "@/components/fife-life/global-card";
import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";
import { NewCardToast } from "@/components/fife-life/new-card-toast";
import { WalletHome } from "@/components/fife-life/wallet-home";
import { WalletMotionRoot } from "@/components/fife-life/wallet-motion-root";
import { PREVIEW_CARDS } from "@/components/fife-life/preview-data";
import type { MerchantCardData } from "@/components/fife-life/types";
import { defaultCardTemplateConfig } from "@/lib/card-template-schema";
import {
  DEFAULT_QR_ELEMENT_ID,
  normalizePublishedWalletTemplate,
} from "@/lib/wallet-card-template";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    "aria-label"?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const baseMerchantCard: MerchantCardData = {
  id: "membership-1",
  merchantId: "merchant-1",
  slug: "brasserie-nova",
  name: "Brasserie Nova",
  logoUrl: null,
  primaryColor: "#8557ff",
  points: 4,
  visitsRequired: 10,
  rewardLabel: "Cocktail offert",
};

function legacyTemplateWithoutQr() {
  const baseConfig = defaultCardTemplateConfig("/media/bg.png");
  return normalizePublishedWalletTemplate({
    backgroundUrl: "/media/bg.png",
    config: {
      ...baseConfig,
      elements: baseConfig.elements.filter((element) => element.type !== "qr"),
    },
    loyaltyMode: "VISITS",
  });
}

function templateWithExistingQr() {
  const baseConfig = defaultCardTemplateConfig("/media/bg.png");
  return normalizePublishedWalletTemplate({
    backgroundUrl: "/media/bg.png",
    config: baseConfig,
    loyaltyMode: "VISITS",
  });
}

async function expectCleanHydration(element: React.ReactElement, label: string) {
  const errors: unknown[] = [];
  const html = renderToString(element);
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.innerHTML = "";
  document.body.appendChild(container);

  await act(async () => {
    hydrateRoot(container, element, {
      onRecoverableError(error) {
        errors.push({ label, error, message: String(error) });
      },
    });
  });

  expect(errors, `hydratation « ${label} »`).toEqual([]);
  return container;
}

describe("wallet — hydratation renderToString + hydrateRoot", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/api/customer/qr")) {
          return new Response(JSON.stringify({ image: "data:image/png;base64,hydration-test" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (url.includes("/api/customer/wallet/pending-unlocks")) {
          return new Response(JSON.stringify({ events: [] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (url.includes("/api/customer/wallet/events")) {
          return new Response(null, { status: 404 });
        }
        return new Response(JSON.stringify({}), { status: 200, headers: { "Content-Type": "application/json" } });
      }),
    );

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("hydrate la carte principale Fife Life", async () => {
    await expectCleanHydration(
      <WalletMotionRoot>
        <GlobalCard
          points={180}
          customerName="Léa Martin"
          clientNumber="482917"
          large
          mode="wallet"
          preview
        />
      </WalletMotionRoot>,
      "carte principale Fife Life",
    );
  });

  it("hydrate une carte commerçant avec ancien gabarit sans QR", async () => {
    const card = { ...baseMerchantCard, cardTemplate: legacyTemplateWithoutQr() };
    await expectCleanHydration(
      <WalletMotionRoot>
        <MerchantCardRenderer
          template={card.cardTemplate}
          merchant={{ name: card.name, logoUrl: card.logoUrl, primaryColor: card.primaryColor }}
          card={card}
          slug={card.slug}
          clientName="Léa Martin"
          clientNumber="482917"
          displayMode="personalized"
          showQr
        />
      </WalletMotionRoot>,
      "carte commerçant sans QR hérité",
    );
    expect(card.cardTemplate?.config.elements.some((element) => element.id === DEFAULT_QR_ELEMENT_ID)).toBe(
      true,
    );
  });

  it("hydrate une carte commerçant avec QR existant", async () => {
    const card = { ...baseMerchantCard, cardTemplate: templateWithExistingQr() };
    await expectCleanHydration(
      <WalletMotionRoot>
        <MerchantCardRenderer
          template={card.cardTemplate}
          merchant={{ name: card.name, logoUrl: card.logoUrl, primaryColor: card.primaryColor }}
          card={card}
          slug={card.slug}
          clientName="Léa Martin"
          displayMode="personalized"
          showQr
        />
      </WalletMotionRoot>,
      "carte commerçant avec QR existant",
    );
  });

  it("hydrate le wallet complet sans animation", async () => {
    await expectCleanHydration(
      <WalletHome
        firstName="Léa"
        lastName="Martin"
        customerName="Léa Martin"
        clientNumber="482917"
        fifeLifePoints={180}
        cards={[]}
        preview
      />,
      "wallet sans animation",
    );
  });

  it("hydrate le deck avec cartes commerçants", async () => {
    await expectCleanHydration(
      <WalletMotionRoot>
        <CardDeck
          points={180}
          customerName="Léa Martin"
          clientNumber="482917"
          cards={PREVIEW_CARDS.slice(0, 2)}
          onOpenMerchant={() => undefined}
        />
      </WalletMotionRoot>,
      "deck wallet",
    );
  });

  it("hydrate l’overlay de déblocage avec la vraie carte commerçant", async () => {
    const card = { ...baseMerchantCard, cardTemplate: legacyTemplateWithoutQr() };
    await expectCleanHydration(
      <WalletMotionRoot>
        <NewCardToast
          phase="revealed"
          card={card}
          clientName="Léa Martin"
          clientNumber="482917"
          eventId="evt-hydration"
          onDone={() => undefined}
        />
      </WalletMotionRoot>,
      "overlay déblocage",
    );
  });

  it("hydrate avec prefers-reduced-motion actif sans erreur", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const container = await expectCleanHydration(
      <WalletMotionRoot>
        <GlobalCard points={180} customerName="Léa Martin" large mode="wallet" preview />
      </WalletMotionRoot>,
      "prefers-reduced-motion actif",
    );

    expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(true);
    expect(container.querySelector(".loyalty-card")).toBeTruthy();
  });
});
