/**
 * Captures d'écran super-admin (nécessite serveur local + PostgreSQL + super-admin seedé).
 * Usage : npm run dev (autre terminal) puis node scripts/capture-super-admin.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { join } from "path";

const BASE = process.env.APP_URL ?? "http://localhost:3000";
const SECRET = process.env.SUPER_ADMIN_PATH ?? "fife-super-admin-dev-only-change-me";
const OUT = join(process.cwd(), "artifacts", "super-admin-v1");

const shots = [
  { name: "01-connexion-1440x900", path: `/${SECRET}/connexion`, viewport: { width: 1440, height: 900 } },
  { name: "02-dashboard-1440x900", path: "/super-admin", viewport: { width: 1440, height: 900 }, auth: true },
  { name: "03-commerces-1440x900", path: "/super-admin/commerces", viewport: { width: 1440, height: 900 }, auth: true },
  { name: "04-wizard-1440x900", path: "/super-admin/commerces/nouveau", viewport: { width: 1440, height: 900 }, auth: true },
  { name: "05-dashboard-mobile-390x844", path: "/super-admin", viewport: { width: 390, height: 844 }, auth: true },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  if (process.env.SUPER_ADMIN_EMAIL && process.env.SUPER_ADMIN_PASSWORD) {
    await page.goto(`${BASE}/${SECRET}/connexion`);
    await page.fill('input[name="email"]', process.env.SUPER_ADMIN_EMAIL);
    await page.fill('input[name="password"]', process.env.SUPER_ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/super-admin(?!\/connexion)/, { timeout: 15000 }).catch(() => undefined);
  }

  for (const shot of shots) {
    if (shot.auth && !process.env.SUPER_ADMIN_EMAIL) continue;
    await page.setViewportSize(shot.viewport);
    await page.goto(`${BASE}${shot.path}`);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(OUT, `${shot.name}.png`), fullPage: true });
    console.log("Capture:", shot.name);
  }

  await browser.close();
  console.log(`Captures dans ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
