import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const routeSource = () =>
  readFileSync(resolve(process.cwd(), "src/app/api/customer/wallet/events/route.ts"), "utf8");

describe("wallet events SSE stream", () => {
  it("rend la fermeture et le cleanup idempotents", () => {
    const source = routeSource();
    expect(source).toContain("let closed = false");
    expect(source).toContain("const safeClose");
    expect(source).toContain("if (closed) return");
    expect(source).toContain("const cleanup");
    expect(source).toContain("timers.clear()");
    expect(source).toContain('removeEventListener("abort", onAbort)');
  });

  it("bloque les enqueue après fermeture ou abort", () => {
    const source = routeSource();
    expect(source).toContain("const safeEnqueue");
    expect(source).toContain("if (closed || req.signal.aborted) return false");
    expect(source).toContain("if (closed || req.signal.aborted) return");
    expect(source).toContain("if (closed || req.signal.aborted) break");
  });

  it("ne journalise pas une déconnexion normale comme erreur serveur", () => {
    const source = routeSource();
    expect(source).toContain("if (!closed && !req.signal.aborted)");
    expect(source).toContain('console.error("[wallet events] stream error", error);');
  });
});
