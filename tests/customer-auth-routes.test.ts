import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const readSrc = (path: string) => readFileSync(join(root, path), "utf8");

describe("client auth routes and navigation", () => {
  it("exposes dedicated customer auth endpoints", () => {
    for (const route of [
      "src/app/api/customer/auth/login/route.ts",
      "src/app/api/customer/auth/register/route.ts",
      "src/app/api/customer/auth/recover/route.ts",
      "src/app/api/customer/auth/verify-email/route.ts",
      "src/app/api/customer/finalize/route.ts",
    ]) {
      expect(readSrc(route)).toContain("export async function");
    }
  });

  it("routes the public client login UI to customer auth APIs", () => {
    const connexion = readSrc("src/app/connexion/ui.tsx");
    expect(connexion).toContain("/api/customer/auth/login");
    expect(connexion).toContain("/inscription");
    expect(connexion).not.toContain("wallet démo");
    const shell = readSrc("src/components/customer-auth/customer-auth-shell.tsx");
    expect(shell).toContain("/app/connexion");
    expect(shell).toContain("/employe/connexion");
    expect(connexion).not.toContain("/demo");
    expect(shell).not.toContain("/demo");
  });

  it("keeps merchant and employee login redirects on their existing routes", () => {
    expect(readSrc("src/components/staff-login.tsx")).toContain("/api/auth/login");
    expect(readSrc("src/app/employe/connexion/ui.tsx")).toContain("/api/employe/auth/login");
    expect(readSrc("src/app/employe/connexion/ui.tsx")).toContain("/employe/scan");
    expect(readSrc("src/components/fife-life/profile/settings-page.tsx")).toContain("/api/auth/logout");
  });
});
