import { describe, expect, it } from "vitest";
import { resolvePublishedGoogleWalletMedia } from "../src/lib/media-storage";

const MERCHANT_ID = "cmtx76vmw0000lc0104evr5rd";
const VERSION = "1789325020022-v6gj74i4";

describe("resolvePublishedGoogleWalletMedia", () => {
  it("résout la version réellement générée sous UPLOADS_DIR", () => {
    const resolved = resolvePublishedGoogleWalletMedia({
      merchantId: MERCHANT_ID,
      kind: "hero",
      version: VERSION,
      uploadsRoot: "/var/lib/fifelite/uploads",
      config: {
        publishedAppearance: {
          heroImageUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
        },
      },
    });

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.filename).toBe(`hero-${VERSION}.png`);
    expect(resolved.filepath.replaceAll("\\", "/")).toContain(
      `/var/lib/fifelite/uploads/google-wallet/merchant/${MERCHANT_ID}/hero-${VERSION}.png`,
    );
  });

  it("refuse les versions invalides et les kinds non publics", () => {
    expect(
      resolvePublishedGoogleWalletMedia({
        merchantId: MERCHANT_ID,
        kind: "hero",
        version: "../secret",
        uploadsRoot: "/var/lib/fifelite/uploads",
        config: { publishedAppearance: { heroImageUrl: "x" } },
      }).ok,
    ).toBe(false);
    expect(
      resolvePublishedGoogleWalletMedia({
        merchantId: MERCHANT_ID,
        kind: "wide-logo",
        version: VERSION,
        uploadsRoot: "/var/lib/fifelite/uploads",
        config: { publishedAppearance: { wideLogoUrl: "x" } },
      }).ok,
    ).toBe(false);
  });
});
