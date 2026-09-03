import { PREVIEW_CARDS, PREVIEW_HISTORY, PREVIEW_PROFILE, PREVIEW_PREFERENCES } from "@/components/fife-life/preview-data";

export const DEMO_FIRST_NAME = "Irène";
export const DEMO_POINTS = 180;
export const DEMO_EMAIL = "client@demo.local";

export function isDevVisualDemo(searchParams?: {
  demo?: string;
  sheet?: string;
  toast?: string;
}) {
  if (process.env.NODE_ENV !== "development") return false;
  if (searchParams?.demo === "0") return false;
  if (searchParams?.demo === "1") return true;
  if (searchParams?.sheet) return true;
  if (searchParams?.toast) return true;
  return true;
}

export function demoWalletProps(searchParams?: { sheet?: string; toast?: string }) {
  return {
    firstName: DEMO_FIRST_NAME,
    fifeLifePoints: DEMO_POINTS,
    cards: PREVIEW_CARDS,
    preview: true,
    initialSheetOpen: searchParams?.sheet === "1",
    initialNewCard: searchParams?.toast ?? null,
  };
}

export function demoUniversalDetailProps() {
  return {
    firstName: DEMO_FIRST_NAME,
    fifeLifePoints: DEMO_POINTS,
    history: PREVIEW_HISTORY,
    preview: true,
  };
}

export function demoProfileProps() {
  return {
    profile: PREVIEW_PROFILE,
    preferences: PREVIEW_PREFERENCES,
    preview: true,
  };
}

export const DEMO_MERCHANT = {
  firstName: "Léa",
  merchantName: "Café Demo",
  role: "MERCHANT_ADMIN",
  stats: {
    customers: 128,
    visitsToday: 24,
    rewards: 16,
    employees: 3,
  },
};
