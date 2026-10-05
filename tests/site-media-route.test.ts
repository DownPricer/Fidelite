import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const root = process.cwd();
const siteDir = join(root, "data", "uploads", "site");
const fixtureName = "fideto-presentation.mp4";
const fixturePath = join(siteDir, fixtureName);

describe("GET /api/media/site/[filename]", () => {
  beforeAll(() => {
    if (!existsSync(siteDir)) mkdirSync(siteDir, { recursive: true });
    if (!existsSync(fixturePath)) {
      writeFileSync(fixturePath, Buffer.from("fake-mp4-fixture"));
    }
  });

  afterAll(() => {
    // Ne pas supprimer le fichier réel s'il a été déployé localement avant les tests.
  });

  it("refuse les fichiers hors liste blanche", async () => {
    const { GET } = await import("../src/app/api/media/site/[filename]/route");
    const response = await GET(new Request("http://localhost/api/media/site/evil.exe"), {
      params: Promise.resolve({ filename: "evil.exe" }),
    });
    expect(response.status).toBe(400);
  });

  it("sert le MP4 de présentation avec support des plages d'octets", async () => {
    const { GET } = await import("../src/app/api/media/site/[filename]/route");
    const response = await GET(
      new Request("http://localhost/api/media/site/fideto-presentation.mp4", {
        headers: { Range: "bytes=0-3" },
      }),
      { params: Promise.resolve({ filename: fixtureName }) },
    );
    expect(response.status).toBe(206);
    expect(response.headers.get("Content-Type")).toBe("video/mp4");
    expect(response.headers.get("Accept-Ranges")).toBe("bytes");
    const body = Buffer.from(await response.arrayBuffer());
    expect(body.length).toBe(4);
    expect(body.toString()).toBe(readFileSync(fixturePath).subarray(0, 4).toString());
  });
});
