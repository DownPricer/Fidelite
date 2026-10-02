import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.CAPTURE_BASE_URL ?? "http://127.0.0.1:3000";
const outDir = join(process.cwd(), "graphify-out", "captures-client-auth-mobile");

const pages = [
  { name: "connexion", path: "/connexion" },
  { name: "inscription", path: "/inscription" },
  { name: "finalisation", path: "/finalisation" },
];

async function main() {
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices["iPhone 13"],
  });

  for (const pageDef of pages) {
    const page = await context.newPage();
    await page.goto(`${baseUrl}${pageDef.path}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: join(outDir, `${pageDef.name}-mobile.png`),
      fullPage: true,
    });
    await page.close();
  }

  await browser.close();
  console.log(`Captures enregistrées dans ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
