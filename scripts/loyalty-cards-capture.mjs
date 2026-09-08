import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "artifacts", "loyalty-cards-v1");
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
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(".loyalty-card", { timeout: 20000 });
  await page.waitForTimeout(1200);
}

await goto("/carte?demo=1");
await shot("wallet-mobile-silver-390x844.png", { width: 390, height: 844 });
await shot("wallet-desktop-1440x900.png", { width: 1440, height: 900 });

const tiers = [
  { name: "bronze", clicks: 0 },
  { name: "silver", clicks: 1 },
  { name: "gold", clicks: 2 },
  { name: "diamond", clicks: 3 },
];

for (const tier of tiers) {
  await goto("/carte?demo=1");
  for (let i = 0; i < tier.clicks; i++) {
    await page.locator(".deck-nav-next").click({ force: true });
    await page.waitForTimeout(600);
  }
  await shot(`tier-${tier.name}-1440x900.png`, { width: 1440, height: 900 });
}

await goto("/carte?demo=1&sheet=1");
await shot("bottom-sheet-1440x900.png", { width: 1440, height: 900 });

await goto("/carte?demo=1");
await page.locator(".fife-deck-wrap button.deck-card-slot").first().click({ force: true, timeout: 15000 });
await page.waitForSelector(".card-enlarged-loyalty-card", { timeout: 10000 });
await page.waitForTimeout(700);
await shot("carte-agrandie-1440x900.png", { width: 1440, height: 900 });

await page.keyboard.press("Escape");
await page.waitForTimeout(400);

await goto("/carte/brasserie-nova?demo=1");
await shot("detail-qr-390x844.png", { width: 390, height: 844 });

await goto("/carte?demo=1&toast=Café%20Nova");
await page.waitForSelector(".merchant-interactive-card", { timeout: 10000 });
await page.waitForTimeout(900);
await shot("nouvelle-carte-390x844.png", { width: 390, height: 844 });

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector(".landing-card-featured .loyalty-card", { timeout: 15000 });
await page.waitForTimeout(800);
await shot("landing-page-1440x900.png", { width: 1440, height: 900 });

await browser.close();
console.log(`\nCaptures dans ${OUT}`);
