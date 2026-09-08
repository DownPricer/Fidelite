import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "artifacts", "wallet-desktop-v1");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

async function shot(name, viewport) {
  await page.setViewportSize(viewport);
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, name), fullPage: false });
  console.log(`✓ ${name}`);
}

async function goto(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1000);
}

await goto("/carte?demo=1");
await shot("wallet-desktop-1440x900.png", { width: 1440, height: 900 });
await shot("wallet-desktop-1920x1080.png", { width: 1920, height: 1080 });
await shot("wallet-tablet-1024x768.png", { width: 1024, height: 768 });
await shot("wallet-mobile-regression-390x844.png", { width: 390, height: 844 });

await goto("/carte?demo=1&sheet=1");
await shot("wallet-sheet-desktop-1440x900.png", { width: 1440, height: 900 });

await goto("/carte?demo=1");
await page.setViewportSize({ width: 1440, height: 900 });
await page.locator(".fife-deck-wrap button, .deck-card-slot").first().click({ timeout: 15000 });
await page.waitForTimeout(800);
await shot("carte-agrandie-desktop-1440x900.png", { width: 1440, height: 900 });

await goto("/compte?demo=1");
await shot("profil-desktop-1440x900.png", { width: 1440, height: 900 });

await goto("/compte/parametres?demo=1");
await shot("parametres-desktop-1440x900.png", { width: 1440, height: 900 });

await goto("/carte/brasserie-nova?demo=1");
await shot("carte-detail-desktop-1440x900.png", { width: 1440, height: 900 });

await browser.close();
console.log(`\nCaptures dans ${OUT}`);
