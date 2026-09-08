import { chromium, devices } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = join(process.cwd(), "docs", "screenshots", "employe-creation-directe");
mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const mobile = await browser.newContext({ ...devices["iPhone 12"] });
  const page = await mobile.newPage();

  await page.goto(`${base}/demo/enter/merchant`, { waitUntil: "networkidle" });
  await page.goto(`${base}/app/employes`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Nouvel employé" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(outDir, "01-formulaire-mot-de-passe-390x844.png"), fullPage: true });

  await page.locator('input[name="password"]').fill("abcdefgh");
  await page.locator('input[name="passwordConfirm"]').fill("abcdefghX");
  await page.getByRole("button", { name: "Créer le compte employé" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(outDir, "02-validation-champs-390x844.png"), fullPage: true });

  await page.locator('input[name="firstName"]').fill("Camille");
  await page.locator('input[name="lastName"]').fill("Roux");
  await page.locator('input[name="email"]').fill("camille.roux@cafe-demo.local");
  await page.locator('input[name="password"]').fill("DemoEmploye1!");
  await page.locator('input[name="passwordConfirm"]').fill("DemoEmploye1!");
  await page.getByRole("button", { name: "Créer le compte employé" }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(outDir, "03-confirmation-creation-390x844.png"), fullPage: true });

  await page.goto(`${base}/app/employes/e1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(outDir, "04-employe-actif-390x844.png"), fullPage: true });

  await page.goto(`${base}/employe/connexion`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(outDir, "05-connexion-employe-390x844.png"), fullPage: true });

  await page.goto(`${base}/employe/demo/scan`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(outDir, "06-scanner-apres-connexion-390x844.png"), fullPage: true });

  await browser.close();
  console.log(`Captures dans ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
