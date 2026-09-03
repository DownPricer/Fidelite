import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "artifacts", "profile-v1");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});

const page = await context.newPage();

async function shot(name, scrollY = 0) {
  if (scrollY > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, name), fullPage: false });
  console.log(`✓ ${name}`);
}

console.log("Capturing profile page...");
await page.goto(`${BASE_URL}/compte?demo=1`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

await shot("profile-top-390x844.png");

await shot("profile-history-390x844.png", 520);

await shot("profile-benefits-390x844.png", 980);

await shot("profile-settings-390x844.png", 1500);

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);
await shot("profile-delete-zone-390x844.png");

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.click(".profile-avatar-btn");
await page.waitForTimeout(800);
await shot("profile-avatar-sheet-390x844.png");

await browser.close();
console.log(`\nCaptures terminées : ${OUT}`);
