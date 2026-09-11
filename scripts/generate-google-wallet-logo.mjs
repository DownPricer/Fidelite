import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const SIZE = 1024;
const MARGIN_RATIO = 0.15;
const SYMBOL_SIZE = SIZE * (1 - MARGIN_RATIO * 2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="#1A1A1A"/>
  <defs>
    <linearGradient id="fl-violet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b86cff"/>
      <stop offset="45%" stop-color="#8557ff"/>
      <stop offset="100%" stop-color="#e774ff"/>
    </linearGradient>
  </defs>
  <g transform="translate(${(SIZE - SYMBOL_SIZE) / 2} ${(SIZE - SYMBOL_SIZE) / 2})">
    <svg width="${SYMBOL_SIZE}" height="${SYMBOL_SIZE}" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12.5C4 8.91 6.91 6 10.5 6h3A6.5 6.5 0 0120 12.5c0 3.59-2.91 6.5-6.5 6.5h-3A6.5 6.5 0 014 12.5Z"
        stroke="url(#fl-violet)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 12.5c0-2.071 1.679-3.75 3.75-3.75S15.5 10.429 15.5 12.5 13.821 16.25 11.75 16.25 8 14.571 8 12.5Z"
        fill="url(#fl-violet)"
        opacity="0.92"
      />
    </svg>
  </g>
</svg>`;

const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; padding: 0; background: #1A1A1A; }
    </style>
  </head>
  <body>${svg}</body>
</html>`;

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "..", "public", "google-wallet");
const outFile = join(outDir, "fife-life-logo.png");

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });
  await page.setContent(html, { waitUntil: "load" });
  await page.locator("body > svg").screenshot({ path: outFile, type: "png" });
  console.log(`Logo Google Wallet généré : ${outFile}`);
} finally {
  await browser.close();
}
