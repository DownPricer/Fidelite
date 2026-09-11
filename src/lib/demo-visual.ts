import { PREVIEW_CARDS, PREVIEW_HISTORY, PREVIEW_PROFILE, PREVIEW_PREFERENCES } from "@/components/fife-life/preview-data";
import { DEMO_LOYALTY_OVERVIEW } from "@/lib/demo-loyalty-overview";
import { isClientDemoMode, isDemoCookie, CLIENT_DEMO_COOKIE } from "@/lib/demo-mode";
import { presetPermissions } from "@/lib/staff-permissions";

export { CLIENT_DEMO_COOKIE };

export const DEMO_FIRST_NAME = "Léa";
export const DEMO_LAST_NAME = "Martin";
export const DEMO_FULL_NAME = "Léa Martin";
export const DEMO_CLIENT_NUMBER = "482917";
export const DEMO_POINTS = 180;
export const DEMO_EMAIL = "client@demo.local";

/** Alias pour compatibilité avec les pages serveur existantes. */
export function isDevVisualDemo(
  searchParams?: { demo?: string; sheet?: string; toast?: string },
  cookie?: string,
) {
  return isClientDemoMode(searchParams, cookie);
}

export function isClientDemoCookie(value: string | undefined) {
  return isDemoCookie(value);
}

export function demoWalletProps(searchParams?: { sheet?: string; toast?: string }) {
  return {
    firstName: DEMO_FIRST_NAME,
    lastName: DEMO_LAST_NAME,
    customerName: DEMO_FULL_NAME,
    clientNumber: DEMO_CLIENT_NUMBER,
    fifeLifePoints: DEMO_POINTS,
    cards: PREVIEW_CARDS,
    initialOverview: DEMO_LOYALTY_OVERVIEW,
    preview: true,
    initialSheetOpen: searchParams?.sheet === "1",
    initialNewCard: searchParams?.toast ?? null,
  };
}

export function demoUniversalDetailProps() {
  return {
    customerName: DEMO_FULL_NAME,
    fifeLifePoints: DEMO_POINTS,
    history: PREVIEW_HISTORY,
    preview: true,
  };
}

export function demoProfileProps() {
  return {
    profile: {
      ...PREVIEW_PROFILE,
      firstName: DEMO_FIRST_NAME,
      lastName: DEMO_LAST_NAME,
    },
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
    employees: 5,
  },
};

export const DEMO_EMPLOYEE = {
  firstName: "Hugo",
  merchantName: DEMO_MERCHANT.merchantName,
  permissions: presetPermissions("CASHIER"),
};

/** Token QR de test affichable en mode démo employé (coller dans le scan). */
export const DEMO_SCAN_HINT = "Utilisez le QR de la carte client démo ou le code 482917.";
