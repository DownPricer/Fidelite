import { chromium, devices } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const base = "http://localhost:3000";
const outDir = join(process.cwd(), "docs", "screenshots", "employes-etape-3-4");
mkdirSync(outDir, { recursive: true });

async function shot(page, name, url, action) {
  await page.goto(url, { waitUntil: "networkidle" });
  if (action) await action();
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: true });
}

async function main() {
  const browser = await chromium.launch();
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mobile = await browser.newContext({ ...devices["iPhone 12"] });

  const d = await desktop.newPage();
  const m = await mobile.newPage();

  await d.goto(`${base}/demo/enter/merchant`, { waitUntil: "networkidle" });
  await d.goto(`${base}/app/employes`, { waitUntil: "networkidle" });
  await d.screenshot({ path: join(outDir, "01-equipe-liste-desktop.png"), fullPage: true });

  await shot(d, "02-nouvel-employe-form", `${base}/app/employes`, async () => {
    await d.getByRole("button", { name: "Nouvel employé" }).click();
  });

  await shot(d, "03-employe-en-attente", `${base}/app/employes/e3`);
  await shot(d, "04-employe-actif", `${base}/app/employes/e1`);
  await shot(d, "05-invitation-expiree", `${base}/employe/invitation?token=invalid-demo-token`);
  await shot(m, "06-equipe-liste-mobile", `${base}/app/employes`);

  await browser.close();
  console.log(`Captures enregistrées dans ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
