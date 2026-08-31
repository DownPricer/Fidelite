import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3003";
const outDir = join(process.cwd(), "artifacts", "fife-life-visual-v4");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

async function shot(page, name) {
  const file = join(outDir, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log(file);
}

try {
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}/carte`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await shot(page, "wallet-v4-390x844.png");
    await page.close();
  }
} finally {
  await browser.close();
}

console.log("Capture v4 terminée dans", outDir);

