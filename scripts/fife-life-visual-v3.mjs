import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3003";
const outDir = join(process.cwd(), "artifacts", "fife-life-visual-v3");
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
    await shot(page, "wallet-v3-390x844.png");
    await shot(page, "wallet-v4-390x844.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}/carte`, { waitUntil: "networkidle" });
    await page.locator(".glass-cta").first().click();
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await shot(page, "wallet-sheet-v3-390x844.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}/carte/identite`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await shot(page, "carte-detail-v3-390x844.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}/carte?toast=Prism%20H%C3%B4tel`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await shot(page, "nouvelle-carte-v3-390x844.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}/connexion`, { waitUntil: "networkidle" });
    await shot(page, "connexion-v3-390x844.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await shot(page, "landing-v3-1440x900.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/app`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await shot(page, "dashboard-v3-1440x900.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/app/clients`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await shot(page, "clients-v3-1440x900.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/app/employes`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await shot(page, "employes-v3-1440x900.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/app/parametres`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await shot(page, "parametres-v3-1440x900.png");
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await page.goto(`${baseUrl}/app/caisse`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await shot(page, "caisse-v3-768x1024.png");
    await page.close();
  }
} finally {
  await browser.close();
}

console.log("Captures v3 terminées dans", outDir);

