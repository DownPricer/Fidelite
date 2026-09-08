import { chromium, devices } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const base = "http://localhost:3000";
const outDir = join(process.cwd(), "docs", "screenshots", "employe-app");
mkdirSync(outDir, { recursive: true });

async function shot(page, name, url, action) {
  await page.goto(url, { waitUntil: "load" });
  if (action) await action();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(outDir, name), fullPage: true });
}

async function main() {
  const browser = await chromium.launch();
  const mobile = await browser.newContext({ ...devices["iPhone 12"] });
  const tablet = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const m = await mobile.newPage();
  const t = await tablet.newPage();

  await shot(m, "01-connexion-employe-390x844.png", `${base}/employe/connexion`);
  await shot(m, "02-camera-prete-390x844.png", `${base}/employe/demo/scan`);
  await shot(m, "03-coller-lien-390x844.png", `${base}/employe/demo/scan`, async () => {
    await m.getByRole("button", { name: "Coller un lien" }).click();
  });
  await shot(m, "04-scan-reussi-390x844.png", `${base}/employe/demo/scan?view=result`);
  await shot(m, "05-montant-achat-390x844.png", `${base}/employe/demo/scan?view=result&mode=amount`);
  await shot(m, "06-recompense-disponible-390x844.png", `${base}/employe/demo/scan?view=result&reward=1`);
  await shot(m, "07-qr-invalide-390x844.png", `${base}/employe/demo/scan?view=error`);
  await shot(m, "08-compte-suspendu-390x844.png", `${base}/employe/demo/suspendu`);
  await shot(t, "09-portail-employe-tablette.png", `${base}/employe/demo/scan?view=result`);

  await browser.close();
  console.log(`Captures enregistrées dans ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
