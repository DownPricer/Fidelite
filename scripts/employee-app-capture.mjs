import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "playwright";

const BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), "artifacts", "employee-app-v1");

const shots = [
  { name: "01-connexion-390x844.png", url: "/employe/connexion" },
  { name: "02-camera-ready-390x844.png", url: "/employe/demo/scan" },
  { name: "03-paste-link-390x844.png", url: "/employe/demo/scan?view=paste" },
  { name: "04-scan-success-390x844.png", url: "/employe/demo/scan?view=result" },
  { name: "05-invalid-qr-390x844.png", url: "/employe/demo/scan?view=error" },
  { name: "06-compte-suspendu-390x844.png", url: "/employe/demo/suspendu" },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices["iPhone 12"],
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  for (const shot of shots) {
    try {
      await page.goto(`${BASE}${shot.url}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(OUT, shot.name), fullPage: true });
      console.log("saved", shot.name);
    } catch (error) {
      console.error("failed", shot.name, error instanceof Error ? error.message : error);
    }
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
