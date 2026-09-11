// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpandableQrCode } from "@/components/fife-life/expandable-qr-code";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ExpandableQrCode interaction", () => {
  it("marque la zone QR pour empêcher l’agrandissement carte", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <ExpandableQrCode
          qrSrc="data:image/png;base64,abc"
          zoomEnabled
        />,
      );
    });

    const hitbox = container.querySelector('[data-no-card-expand="true"]');
    expect(hitbox).not.toBeNull();
    expect(hitbox?.getAttribute("style")).toContain("pointer-events: auto");
  });

  it("ouvre le QR agrandi au clic sans propager vers la carte", async () => {
    const cardClick = vi.fn();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <div role="button" tabIndex={0} onClick={cardClick}>
          <ExpandableQrCode qrSrc="data:image/png;base64,abc" zoomEnabled />
        </div>,
      );
    });

    const hitbox = container.querySelector('[data-no-card-expand="true"]') as HTMLElement;
    expect(hitbox).toBeTruthy();

    await act(async () => {
      hitbox.click();
    });

    expect(cardClick).not.toHaveBeenCalled();
    expect(document.body.querySelector(".qr-enlarged-overlay")).toBeTruthy();
  });
});
