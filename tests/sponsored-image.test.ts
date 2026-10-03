import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({ env: { appUrl: "https://fideto.example" } }));

describe("resolveSponsoredImageUrl", () => {
  it("préfixe les chemins relatifs avec l'origine app", async () => {
    const { resolveSponsoredImageUrl } = await import("../src/lib/sponsored-image");
    expect(resolveSponsoredImageUrl("/api/media/visuels/m1/b.png")).toBe("https://fideto.example/api/media/visuels/m1/b.png");
    expect(resolveSponsoredImageUrl("https://cdn.test/x.jpg")).toBe("https://cdn.test/x.jpg");
    expect(resolveSponsoredImageUrl(null)).toBeNull();
  });
});
