import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "artifacts", "merchant-search-v1");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: false }); // headless: false pour debug
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});

const page = await context.newPage();

async function shot(p, name) {
  await p.waitForTimeout(800);
  await p.screenshot({
    path: join(OUT, name),
    fullPage: false,
  });
  console.log(`✓ ${name}`);
}

// 1. Panneau de recherche ouvert
console.log("Capturing search panel...");
await page.goto(`${BASE_URL}/carte?demo=1`, {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1500);

// Click on the chevron to open the search panel
await page.click('.wallet-chevron-btn');
await page.waitForTimeout(800);
await shot(page, "search-panel-390x844.png");

// 2. Page de détail d'une carte commerçante
console.log("Capturing merchant detail page...");
// Try different merchant slugs
const merchantSlugs = ['pizza-time', 'brasserie-nova', 'cinema-lumiere'];
let detailPageFound = false;

for (const slug of merchantSlugs) {
  try {
    await page.goto(`${BASE_URL}/carte/${slug}?demo=1`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(1500);
    await shot(page, "merchant-detail-390x844.png");
    detailPageFound = true;
    break;
  } catch (error) {
    console.log(`Failed to load ${slug}, trying next...`);
  }
}

if (!detailPageFound) {
  console.log("Could not capture merchant detail page - no valid slug found");
}

// 3. Mode agrandi de la carte
console.log("Capturing enlarged card view...");
// The card-preview-btn should already be visible on the detail page
const cardBtn = await page.locator('.card-preview-btn').first();
if (await cardBtn.isVisible()) {
  await cardBtn.click();
  await page.waitForTimeout(800);
  await shot(page, "card-enlarged-390x844.png");
} else {
  console.log("Card preview button not found, skipping enlarged view capture");
}

await browser.close();
console.log("\n✓ Captures terminées");
console.log(`\nChemin: ${OUT}`);
console.log("\nFichiers générés:");
console.log("  - search-panel-390x844.png");
console.log("  - merchant-detail-390x844.png");
console.log("  - card-enlarged-390x844.png");
