import { chromium } from "playwright";
import { join } from "node:path";

const OUT = join(process.cwd(), "artifacts", "wallet-desktop-v1");
const BASE = process.env.BASE_URL ?? "http://localhost:3001";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(`${BASE}/carte?demo=1`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2000);
await page.locator(".deck-card-layer").first().click({ force: true });
await page.waitForTimeout(1000);
await page.screenshot({ path: join(OUT, "carte-agrandie-desktop-1440x900.png") });
console.log("✓ carte-agrandie");

await page.goto(`${BASE}/compte?demo=1`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: join(OUT, "profil-desktop-1440x900.png") });
console.log("✓ profil");

await page.goto(`${BASE}/compte/parametres?demo=1`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: join(OUT, "parametres-desktop-1440x900.png") });
console.log("✓ parametres");

await page.goto(`${BASE}/carte/brasserie-nova?demo=1`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: join(OUT, "carte-detail-desktop-1440x900.png") });
console.log("✓ carte-detail");

await browser.close();
