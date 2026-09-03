import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/carte?demo=1", { waitUntil: "networkidle" });
await page.click('[aria-label="Mon profil"]');
await page.waitForURL("**/compte**");
const title = await page.textContent("h1");
console.log("URL:", page.url());
console.log("Title:", title);
await browser.close();
