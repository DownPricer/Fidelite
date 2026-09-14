import { mkdtemp, mkdir, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const MERCHANT_ID = "cmtx76vmw0000lc0104evr5rd";
const VERSION = "1789325020022-v6gj74i4";
const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4]);

async function loadRoute(input: { uploadsRoot: string; configByMode: unknown | null }) {
  vi.resetModules();
  process.env.UPLOADS_DIR = input.uploadsRoot;
  vi.doMock("../src/lib/prisma", () => ({
    prisma: {
      googleWalletClass: {
        findUnique: vi.fn(async () =>
          input.configByMode === null ? null : { configByMode: input.configByMode },
        ),
      },
    },
  }));
  return import("../src/app/google-wallet/media/merchant/[merchantId]/[kind]/route");
}

function config(urls: Partial<{ heroImageUrl: string; logoUrl: string; wideLogoUrl: string }>) {
  return {
    publishedAppearance: urls,
  };
}

async function createPublishedFile(root: string, kind: "hero" | "logo" | "wideLogo", version = VERSION) {
  const dir = join(root, "google-wallet", "merchant", MERCHANT_ID);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${kind}-${version}.png`), PNG_BYTES);
}

async function get(route: Awaited<ReturnType<typeof loadRoute>>, kind: string, version = VERSION) {
  return route.GET(
    new Request(`https://fidelite.sitereadyshd.fr/google-wallet/media/merchant/${MERCHANT_ID}/${kind}?v=${version}`),
    { params: Promise.resolve({ merchantId: MERCHANT_ID, kind }) },
  );
}

describe("GET /google-wallet/media/merchant/[merchantId]/[kind]", () => {
  let uploadsRoot: string;

  beforeEach(async () => {
    uploadsRoot = await mkdtemp(join(tmpdir(), "wallet-media-"));
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.UPLOADS_DIR;
  });

  it("sert un hero publié existant sans dépendre de mediaGallery", async () => {
    await createPublishedFile(uploadsRoot, "hero");
    const route = await loadRoute({
      uploadsRoot,
      configByMode: config({
        heroImageUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
      }),
    });

    const response = await get(route, "hero");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
    expect(response.headers.get("etag")).toBe(`"${VERSION}-${PNG_BYTES.length}"`);
    expect(Buffer.from(await response.arrayBuffer())).toEqual(PNG_BYTES);
  });

  it.each([
    ["logo", "logoUrl"],
    ["wideLogo", "wideLogoUrl"],
  ] as const)("sert %s publié existant", async (kind, key) => {
    await createPublishedFile(uploadsRoot, kind);
    const route = await loadRoute({
      uploadsRoot,
      configByMode: config({
        [key]: `/google-wallet/media/merchant/${MERCHANT_ID}/${kind}?v=${VERSION}`,
      }),
    });

    const response = await get(route, kind);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  it("après publication, les trois URLs publiques répondent 200 image/png", async () => {
    await createPublishedFile(uploadsRoot, "hero");
    await createPublishedFile(uploadsRoot, "logo");
    await createPublishedFile(uploadsRoot, "wideLogo");
    const route = await loadRoute({
      uploadsRoot,
      configByMode: config({
        heroImageUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
        logoUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/logo?v=${VERSION}`,
        wideLogoUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/wideLogo?v=${VERSION}`,
      }),
    });

    const testedUrls = [
      `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
      `/google-wallet/media/merchant/${MERCHANT_ID}/logo?v=${VERSION}`,
      `/google-wallet/media/merchant/${MERCHANT_ID}/wideLogo?v=${VERSION}`,
    ];
    const responses = await Promise.all([
      get(route, "hero"),
      get(route, "logo"),
      get(route, "wideLogo"),
    ]);

    expect(testedUrls).toEqual([
      `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
      `/google-wallet/media/merchant/${MERCHANT_ID}/logo?v=${VERSION}`,
      `/google-wallet/media/merchant/${MERCHANT_ID}/wideLogo?v=${VERSION}`,
    ]);
    expect(responses.map((response) => response.status)).toEqual([200, 200, 200]);
    expect(responses.map((response) => response.headers.get("content-type"))).toEqual([
      "image/png",
      "image/png",
      "image/png",
    ]);
  });

  it("ne sert pas publiquement un brouillon non publié", async () => {
    await createPublishedFile(uploadsRoot, "hero");
    const route = await loadRoute({
      uploadsRoot,
      configByMode: {
        draftAppearance: {
          heroImageUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
        },
      },
    });

    const response = await get(route, "hero");

    expect(response.status).toBe(404);
  });

  it("rejette une ancienne version", async () => {
    await createPublishedFile(uploadsRoot, "hero");
    const route = await loadRoute({
      uploadsRoot,
      configByMode: config({
        heroImageUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
      }),
    });

    const response = await get(route, "hero", "1789325020021-aaaaaaaa");

    expect(response.status).toBe(404);
  });

  it("rejette un kind invalide", async () => {
    const route = await loadRoute({
      uploadsRoot,
      configByMode: config({
        heroImageUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
      }),
    });

    const response = await get(route, "wide-logo");

    expect(response.status).toBe(404);
  });

  it("rejette une version invalide", async () => {
    const route = await loadRoute({
      uploadsRoot,
      configByMode: config({
        heroImageUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
      }),
    });

    const response = await get(route, "hero", "../secret");

    expect(response.status).toBe(404);
  });

  it("rejette une traversée de chemin dans merchantId", async () => {
    const route = await loadRoute({
      uploadsRoot,
      configByMode: config({
        heroImageUrl: `/google-wallet/media/merchant/${MERCHANT_ID}/hero?v=${VERSION}`,
      }),
    });

    const response = await route.GET(
      new Request(`https://fidelite.sitereadyshd.fr/google-wallet/media/merchant/../${MERCHANT_ID}/hero?v=${VERSION}`),
      { params: Promise.resolve({ merchantId: `../${MERCHANT_ID}`, kind: "hero" }) },
    );

    expect(response.status).toBe(404);
  });
});
