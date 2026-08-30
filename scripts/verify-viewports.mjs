import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = join(process.cwd(), "scripts", "screenshots-verify");

mkdirSync(outDir, { recursive: true });

async function assertNoScroll(page, label) {
  const metrics = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    bodyScrollHeight: document.body.scrollHeight,
    bodyClientHeight: document.body.clientHeight,
  }));
  const overflow = Math.max(
    metrics.scrollHeight - metrics.clientHeight,
    metrics.bodyScrollHeight - metrics.bodyClientHeight,
  );
  if (overflow > 2) {
    throw new Error(`${label}: scroll vertical détecté (${overflow}px)`);
  }
}

async function assertVisible(page, text) {
  const el = page.locator(`text=${text}`).first();
  if (!(await el.isVisible())) throw new Error(`Élément manquant: ${text}`);
}

async function assertHidden(page, text, label) {
  const count = await page.locator(`text=${text}`).count();
  for (let i = 0; i < count; i += 1) {
    if (await page.locator(`text=${text}`).nth(i).isVisible()) {
      throw new Error(`${label}: texte interdit visible: ${text}`);
    }
  }
}

async function assertVisiblePlaceholder(page, placeholder) {
  const el = page.locator(`input[placeholder="${placeholder}"]`);
  if (!(await el.isVisible())) throw new Error(`Input manquant: ${placeholder}`);
}

const browser = await chromium.launch();
try {
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}/carte/preview`, { waitUntil: "networkidle" });
    await assertVisible(page, "Café Demo");
    await assertVisible(page, "Actualiser mes points");
    await assertVisible(page, "Mon compte");
    await assertVisible(page, "Google Wallet");
    await assertNoScroll(page, "carte 390x844");
    await page.screenshot({ path: join(outDir, "carte-390x844.png"), fullPage: true });
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    const consoleErrors = [];
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(`${baseUrl}/app/caisse/preview`, { waitUntil: "networkidle" });
    await assertVisible(page, "Caisse");
    await assertVisible(page, "Scanner une carte");
    await assertVisiblePlaceholder(page, "Coller le code de la carte");
    await assertVisible(page, "Valider le code");
    await assertHidden(page, "Zone caméra", "caisse idle");
    await assertHidden(page, "Appuyez sur Scanner une carte", "caisse idle");
    await assertHidden(page, "Scanner avec un lecteur USB", "caisse idle");
    await assertHidden(page, "Placer le curseur ici", "caisse idle");
    await assertNoScroll(page, "caisse 768x1024 idle");
    await page.screenshot({ path: join(outDir, "caisse-768x1024-idle.png"), fullPage: true });

    await page.locator("text=Scanner une carte").first().evaluate((el) => el.click());
    await page.waitForTimeout(800);
    await assertVisible(page, "Annuler le scan");
    await assertVisiblePlaceholder(page, "Coller le code de la carte");
    await assertNoScroll(page, "caisse 768x1024 scanning");
    await page.screenshot({ path: join(outDir, "caisse-768x1024-scanning.png"), fullPage: true });

    const form = page.locator('[data-testid="caisse-manual-form"]');
    if (!(await form.isVisible())) throw new Error("Formulaire manuel absent");
    await page.locator('input[placeholder="Coller le code de la carte"]').press("Enter");

    if (consoleErrors.length) {
      throw new Error(`Exceptions console: ${consoleErrors.join(" | ")}`);
    }

    await page.close();
  }

  console.log("Viewport checks OK");
} finally {
  await browser.close();
}
