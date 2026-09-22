// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { getPushSupportState, isIosNotStandalone } from "../src/lib/push-client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getPushSupportState", () => {
  it("unsupported quand serviceWorker/PushManager sont absents", () => {
    expect(getPushSupportState()).toBe("unsupported");
  });

  it("ready quand tout est disponible et la permission n'est pas refusée", () => {
    Object.defineProperty(window, "PushManager", { value: function () {}, configurable: true });
    Object.defineProperty(navigator, "serviceWorker", { value: {}, configurable: true });
    Object.defineProperty(window, "Notification", { value: { permission: "default" }, configurable: true });
    expect(getPushSupportState()).toBe("ready");
  });

  it("denied quand la permission a déjà été refusée", () => {
    Object.defineProperty(window, "PushManager", { value: function () {}, configurable: true });
    Object.defineProperty(navigator, "serviceWorker", { value: {}, configurable: true });
    Object.defineProperty(window, "Notification", { value: { permission: "denied" }, configurable: true });
    expect(getPushSupportState()).toBe("denied");
  });
});

describe("isIosNotStandalone", () => {
  it("détecte un iPhone non ajouté à l'écran d'accueil (Safari)", () => {
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      standalone: false,
    });
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
    });
    expect(isIosNotStandalone()).toBe(true);
  });

  it("ne signale rien sur Android", () => {
    vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 (Linux; Android 14)", standalone: undefined });
    vi.stubGlobal("window", { matchMedia: () => ({ matches: false }) });
    expect(isIosNotStandalone()).toBe(false);
  });
});
