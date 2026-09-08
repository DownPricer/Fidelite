#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { join } from "path";

const OUT = join(process.cwd(), "artifacts", "card-backgrounds-final");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: false });

const tiers = [
  { name: "bronze", label: "BRONZE" },
  { name: "argent", label: "ARGENT" },
  { name: "or", label: "OR" },
  { name: "diamant", label: "DIAMANT" },
];

// Mobile captures
console.log("📱 Captures mobile...");
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });

for (const tier of tiers) {
  const url = `http://localhost:3000/carte/identite?demo=1`;
  await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
  await mobile.waitForSelector(".loyalty-card__background", { timeout: 10000 });
  
  // Force change background image and tier label
  await mobile.evaluate(({ name, label }) => {
    const bg = document.querySelector(".loyalty-card__background");
    const tierElem = document.querySelector(".loyalty-card__tier");
    if (bg) bg.src = `/cards/${name}-good.png`;
    if (tierElem) tierElem.textContent = label;
  }, tier);
  
  await mobile.waitForTimeout(800);
  await mobile.screenshot({ path: join(OUT, `card-${tier.name}-390x844.png`), fullPage: false });
  console.log(`  ✓ ${tier.name} mobile`);
}

await mobile.close();

// Desktop captures
console.log("🖥️  Captures desktop...");
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const tier of tiers) {
  const url = `http://localhost:3000/carte/identite?demo=1`;
  await desktop.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
  await desktop.waitForSelector(".loyalty-card__background", { timeout: 10000 });
  
  // Force change background image and tier label
  await desktop.evaluate(({ name, label }) => {
    const bg = document.querySelector(".loyalty-card__background");
    const tierElem = document.querySelector(".loyalty-card__tier");
    if (bg) bg.src = `/cards/${name}-good.png`;
    if (tierElem) tierElem.textContent = label;
  }, tier);
  
  await desktop.waitForTimeout(800);
  await desktop.screenshot({ path: join(OUT, `card-${tier.name}-1440x900.png`), fullPage: false });
  console.log(`  ✓ ${tier.name} desktop`);
}

await desktop.close();
await browser.close();

console.log(`\n✅ 8 captures sauvegardées dans ${OUT}`);
