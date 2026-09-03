import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "artifacts", "merchant-admin-v1");
const BASE = process.env.BASE_URL || "http://localhost:3000";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

async function shot(name, path, scrollY = 0) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  if (scrollY > 0) await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, name), fullPage: false });
  console.log(`✓ ${name}`);
}

console.log("Captures espace administrateur…");

await shot("01-dashboard-nav-390x844.png", "/app");
await shot("02-clients-compact-390x844.png", "/app/clients?demo=1");
await shot("03-equipe-list-390x844.png", "/app/employes?demo=1");
await shot("04-employe-fiche-390x844.png", "/app/employes/e1?demo=1");
await shot("05-employe-historique-390x844.png", "/app/employes/e1?demo=1", 420);
await shot("06-mode-fidelite-390x844.png", "/app/parametres/programme?demo=1");
await shot("07-regle-montant-390x844.png", "/app/parametres/programme?demo=1");

await page.goto(`${BASE}/app/parametres/programme?demo=1`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.getByRole("button", { name: /2\. Règle/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: join(OUT, "07-regle-montant-390x844.png"), fullPage: false });
console.log("✓ 07-regle-montant-390x844.png");

await page.getByRole("button", { name: /3\. Avantages/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: join(OUT, "08-avantages-390x844.png"), fullPage: false });
console.log("✓ 08-avantages-390x844.png");

await page.getByRole("button", { name: /4\. Limites/i }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: /5\. Aperçu/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: join(OUT, "09-simulateur-390x844.png"), fullPage: false });
console.log("✓ 09-simulateur-390x844.png");

await page.getByRole("button", { name: /6\. Publication/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: join(OUT, "10-confirmation-publication-390x844.png"), fullPage: false });
console.log("✓ 10-confirmation-publication-390x844.png");

await browser.close();
console.log(`\nCaptures : ${OUT}`);
