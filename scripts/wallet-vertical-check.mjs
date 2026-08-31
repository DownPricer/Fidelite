import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "artifacts", "fife-life-visual-v4");

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
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

// Wallet avec défilement vertical
await page.goto("http://localhost:3000/carte", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1200);
await shot(page, "wallet-v4-390x844.png");

await browser.close();
console.log("\n✓ Capture terminée");
