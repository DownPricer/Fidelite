import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "artifacts", "cards-test-v1");
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

await page.goto(`${BASE}/carte?demo=1`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector(".demo-tier-card-visual", { timeout: 15000 });
await shot("wallet-demo-cards-390x844.png", { width: 390, height: 844 });

await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(900);
await page.screenshot({ path: join(OUT, "wallet-demo-cards-1440x900.png"), fullPage: false });
console.log("✓ wallet-demo-cards-1440x900.png");

await page.locator(".deck-card-layer").first().click({ force: true });
await page.waitForSelector(".demo-tier-card-enlarged", { timeout: 10000 });
await page.waitForTimeout(600);
await shot("wallet-demo-enlarged-1440x900.png", { width: 1440, height: 900 });

await page.keyboard.press("Escape");
await page.waitForTimeout(400);

for (let i = 0; i < 2; i++) {
  await page.locator(".deck-nav-next").click({ force: true });
  await page.waitForTimeout(700);
}
await shot("wallet-demo-multi-tiers-1440x900.png", { width: 1440, height: 900 });

await browser.close();
console.log(`\nCaptures dans ${OUT}`);
