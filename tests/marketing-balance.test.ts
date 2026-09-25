import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Faux client Prisma à état, avec les mêmes garanties que la base : UPDATE conditionnel du solde,
 * contraintes UNIQUE (campaignId, reversalOfId, stripeCheckoutSessionId) et retour arrière de la
 * transaction en cas d'erreur.
 */
type Mode = "TEST" | "LIVE";
type Entry = {
  id: string;
  merchantId: string;
  mode: Mode;
  type: "TOPUP" | "DEBIT" | "REFUND";
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  amountCents: number;
  balanceAfterCents: number | null;
  campaignId: string | null;
  reversalOfId: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  description: string;
};

const state = { balances: new Map<string, number>(), entries: [] as Entry[], seq: 0 };

function snapshot() {
  return { balances: new Map(state.balances), entries: state.entries.map((e) => ({ ...e })) };
}

function uniqueViolation(data: Partial<Entry>) {
  for (const key of ["campaignId", "reversalOfId", "stripeCheckoutSessionId"] as const) {
    const value = data[key];
    if (value && state.entries.some((e) => e[key] === value)) throw new Error(`Unique constraint failed on ${key}`);
  }
}

function makeTx() {
  return {
    $executeRaw: async (_strings: TemplateStringsArray, amount: number, merchantId: string, mode: Mode) => {
      const key = `${merchantId}:${mode}`;
      const current = state.balances.get(key);
      if (current === undefined || current < amount) return 0;
      state.balances.set(key, current - amount);
      return 1;
    },
    marketingBalance: {
      findUnique: async ({ where }: { where: { merchantId_mode: { merchantId: string; mode: Mode } } }) => {
        const key = `${where.merchantId_mode.merchantId}:${where.merchantId_mode.mode}`;
        return state.balances.has(key) ? { balanceCents: state.balances.get(key)! } : null;
      },
      upsert: async ({ where, create, update }: { where: { merchantId_mode: { merchantId: string; mode: Mode } }; create: { balanceCents: number }; update: { balanceCents: { increment: number } } }) => {
        const key = `${where.merchantId_mode.merchantId}:${where.merchantId_mode.mode}`;
        const current = state.balances.get(key);
        state.balances.set(key, current === undefined ? create.balanceCents : current + update.balanceCents.increment);
      },
    },
    marketingLedgerEntry: {
      findUnique: async ({ where }: { where: Partial<Entry> }) => {
        const [key, value] = Object.entries(where)[0] as [keyof Entry, unknown];
        return state.entries.find((e) => e[key] === value) ?? null;
      },
      create: async ({ data }: { data: Partial<Entry> }) => {
        uniqueViolation(data);
        const entry = {
          id: `led_${++state.seq}`,
          status: "PAID",
          balanceAfterCents: null,
          campaignId: null,
          reversalOfId: null,
          stripeCheckoutSessionId: null,
          stripePaymentIntentId: null,
          ...data,
        } as Entry;
        state.entries.push(entry);
        return entry;
      },
      updateMany: async ({ where, data }: { where: { id: string; status: { in: string[] } }; data: Partial<Entry> }) => {
        const entry = state.entries.find((e) => e.id === where.id && where.status.in.includes(e.status));
        if (!entry) return { count: 0 };
        Object.assign(entry, data);
        return { count: 1 };
      },
      update: async ({ where, data }: { where: { id: string }; data: Partial<Entry> }) => {
        Object.assign(state.entries.find((e) => e.id === where.id)!, data);
      },
    },
  };
}

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

async function transaction<T>(fn: (tx: ReturnType<typeof makeTx>) => Promise<T>): Promise<T> {
  const saved = snapshot();
  try {
    return await fn(makeTx());
  } catch (error) {
    state.balances = saved.balances;
    state.entries = saved.entries;
    throw error;
  }
}

function seedTopup(id: string, amountCents: number, sessionId: string, merchantId = "m1", mode: Mode = "TEST") {
  state.entries.push({
    id,
    merchantId,
    mode,
    type: "TOPUP",
    status: "PENDING",
    amountCents,
    balanceAfterCents: null,
    campaignId: null,
    reversalOfId: null,
    stripeCheckoutSessionId: sessionId,
    stripePaymentIntentId: null,
    description: "Recharge du solde marketing",
  });
}

beforeEach(() => {
  state.balances = new Map();
  state.entries = [];
  state.seq = 0;
});

describe("validation du montant de recharge", () => {
  it("accepte 5/10/20 € et un montant libre >= 5 €, refuse le reste", async () => {
    const { isValidTopupAmountCents, TOPUP_PRESETS_CENTS, MIN_TOPUP_CENTS } = await import("../src/lib/marketing-balance");
    expect(TOPUP_PRESETS_CENTS).toEqual([500, 1000, 2000]);
    expect(MIN_TOPUP_CENTS).toBe(500);
    for (const ok of [500, 1000, 2000, 2550, 50_000]) expect(isValidTopupAmountCents(ok)).toBe(true);
    for (const bad of [0, 499, -500, 5.5, 50_001, Number.NaN, "1000", null, undefined]) {
      expect(isValidTopupAmountCents(bad)).toBe(false);
    }
  });
});

describe("creditTopup — crédit unique après paiement confirmé", () => {
  it("crédite le montant enregistré côté serveur, une seule fois même si l'événement est rejoué", async () => {
    const { creditTopup } = await import("../src/lib/marketing-balance");
    seedTopup("t1", 1000, "cs_1");

    const first = await transaction((tx) =>
      creditTopup(tx as never, { checkoutSessionId: "cs_1", mode: "TEST", paymentIntentId: "pi_1", amountPaidCents: 1000 }),
    );
    const replay = await transaction((tx) =>
      creditTopup(tx as never, { checkoutSessionId: "cs_1", mode: "TEST", paymentIntentId: "pi_1", amountPaidCents: 1000 }),
    );

    expect(first).toBe("credited");
    expect(replay).toBe("already");
    expect(state.balances.get("m1:TEST")).toBe(1000);
    expect(state.entries[0]).toMatchObject({ status: "PAID", balanceAfterCents: 1000 });
  });

  it("refuse un montant Stripe différent du montant attendu (rien n'est crédité)", async () => {
    const { creditTopup } = await import("../src/lib/marketing-balance");
    seedTopup("t1", 1000, "cs_1");
    const result = await transaction((tx) =>
      creditTopup(tx as never, { checkoutSessionId: "cs_1", mode: "TEST", paymentIntentId: null, amountPaidCents: 100 }),
    );
    expect(result).toBe("amount_mismatch");
    expect(state.balances.get("m1:TEST")).toBeUndefined();
    expect(state.entries[0].status).toBe("PENDING");
  });

  it("ignore une session inconnue ou une recharge annulée", async () => {
    const { creditTopup } = await import("../src/lib/marketing-balance");
    seedTopup("t1", 1000, "cs_1");
    state.entries[0].status = "CANCELLED";
    expect(
      await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_1", mode: "TEST", paymentIntentId: null, amountPaidCents: 1000 })),
    ).toBe("unknown");
    expect(
      await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_x", mode: "TEST", paymentIntentId: null, amountPaidCents: 1000 })),
    ).toBe("unknown");
    expect(state.balances.size).toBe(0);
  });

  it("une recharge échouée puis payée (nouvelle tentative dans la même session) est créditée une fois", async () => {
    const { creditTopup } = await import("../src/lib/marketing-balance");
    seedTopup("t1", 500, "cs_1");
    state.entries[0].status = "FAILED";
    await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_1", mode: "TEST", paymentIntentId: "pi", amountPaidCents: 500 }));
    expect(state.balances.get("m1:TEST")).toBe(500);
  });
});

describe("debitForCampaign — débit atomique, unique et jamais négatif", () => {
  it("débite le prix exact et écrit l'historique avec le solde restant", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1:TEST", 500);
    const result = await transaction((tx) =>
      debitForCampaign(tx as never, { merchantId: "m1", mode: "TEST", campaignId: "c1", amountCents: 199, description: "Envoi" }),
    );
    expect(result).toEqual({ ok: true, balanceAfterCents: 301 });
    expect(state.entries[0]).toMatchObject({ type: "DEBIT", amountCents: 199, campaignId: "c1", balanceAfterCents: 301 });
  });

  it("solde insuffisant : refuse, le solde reste inchangé et ne devient jamais négatif", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1:TEST", 198);
    const result = await transaction((tx) =>
      debitForCampaign(tx as never, { merchantId: "m1", mode: "TEST", campaignId: "c1", amountCents: 199, description: "Envoi" }),
    );
    expect(result).toEqual({ ok: false });
    expect(state.balances.get("m1:TEST")).toBe(198);
    expect(state.entries).toHaveLength(0);
  });

  it("commerce sans solde : refuse", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    const result = await transaction((tx) =>
      debitForCampaign(tx as never, { merchantId: "m1", mode: "TEST", campaignId: "c1", amountCents: 50, description: "Envoi" }),
    );
    expect(result.ok).toBe(false);
  });

  it("un même envoi n'est jamais débité deux fois : le second débit échoue et est annulé", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1:TEST", 1000);
    await transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", mode: "TEST", campaignId: "c1", amountCents: 199, description: "Envoi" }));
    await expect(
      transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", mode: "TEST", campaignId: "c1", amountCents: 199, description: "Envoi" })),
    ).rejects.toThrow(/Unique constraint/);
    expect(state.balances.get("m1:TEST")).toBe(801); // un seul débit
    expect(state.entries.filter((e) => e.type === "DEBIT")).toHaveLength(1);
  });

  it("refuse un montant nul, négatif ou non entier", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1:TEST", 1000);
    for (const amountCents of [0, -5, 0.5]) {
      const result = await transaction((tx) =>
        debitForCampaign(tx as never, { merchantId: "m1", mode: "TEST", campaignId: `c${amountCents}`, amountCents, description: "x" }),
      );
      expect(result.ok).toBe(false);
    }
    expect(state.balances.get("m1:TEST")).toBe(1000);
  });
});

describe("refundCampaignDebit — restitution avant diffusion, une seule fois", () => {
  it("restitue le débit une seule fois", async () => {
    const { debitForCampaign, refundCampaignDebit } = await import("../src/lib/marketing-balance");
    state.balances.set("m1:TEST", 500);
    await transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", mode: "TEST", campaignId: "c1", amountCents: 199, description: "Envoi" }));

    expect(await transaction((tx) => refundCampaignDebit(tx as never, "c1", "Annulée"))).toBe(true);
    expect(await transaction((tx) => refundCampaignDebit(tx as never, "c1", "Annulée"))).toBe(false);
    expect(state.balances.get("m1:TEST")).toBe(500);
  });

  it("ne fait rien pour une campagne jamais débitée (quota gratuit)", async () => {
    const { refundCampaignDebit } = await import("../src/lib/marketing-balance");
    expect(await transaction((tx) => refundCampaignDebit(tx as never, "inconnue", "x"))).toBe(false);
    expect(state.balances.size).toBe(0);
  });
});

describe("séparation TEST / LIVE des soldes", () => {
  it("une recharge test crédite uniquement le solde test, jamais le solde réel", async () => {
    const { creditTopup, getMarketingBalanceCents } = await import("../src/lib/marketing-balance");
    void getMarketingBalanceCents;
    seedTopup("t1", 2000, "cs_test_1", "m1", "TEST");
    await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_test_1", mode: "TEST", paymentIntentId: null, amountPaidCents: 2000 }));
    expect(state.balances.get("m1:TEST")).toBe(2000);
    expect(state.balances.get("m1:LIVE")).toBeUndefined();
  });

  it("un événement d'un autre mode ne crédite rien (recharge test + événement live, et inversement)", async () => {
    const { creditTopup } = await import("../src/lib/marketing-balance");
    seedTopup("t1", 1000, "cs_a", "m1", "TEST");
    seedTopup("t2", 1000, "cs_b", "m1", "LIVE");
    expect(await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_a", mode: "LIVE", paymentIntentId: null, amountPaidCents: 1000 }))).toBe("unknown");
    expect(await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_b", mode: "TEST", paymentIntentId: null, amountPaidCents: 1000 }))).toBe("unknown");
    expect(state.balances.size).toBe(0);
  });

  it("un événement test retardé après le passage en réel crédite le solde TEST sans toucher au réel", async () => {
    const { creditTopup, debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1:LIVE", 300);
    seedTopup("t1", 1000, "cs_late_test", "m1", "TEST");
    await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_late_test", mode: "TEST", paymentIntentId: null, amountPaidCents: 1000 }));
    expect(state.balances.get("m1:LIVE")).toBe(300);
    expect(state.balances.get("m1:TEST")).toBe(1000);
    // et le solde test ne peut pas payer un envoi réel : débit LIVE de 500 > 300 refusé
    const live = await transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", mode: "LIVE", campaignId: "c_live", amountCents: 500, description: "x" }));
    expect(live.ok).toBe(false);
    expect(state.balances.get("m1:TEST")).toBe(1000);
  });

  it("débit dans le bon mode : un débit test ne touche pas le solde réel", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1:TEST", 1000);
    state.balances.set("m1:LIVE", 1000);
    await transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", mode: "TEST", campaignId: "c1", amountCents: 199, description: "x" }));
    expect(state.balances.get("m1:TEST")).toBe(801);
    expect(state.balances.get("m1:LIVE")).toBe(1000);
    expect(state.entries[0].mode).toBe("TEST");
  });

  it("commerce sans solde réel mais avec solde test : le débit réel est refusé", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1:TEST", 5000);
    const result = await transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", mode: "LIVE", campaignId: "c1", amountCents: 99, description: "x" }));
    expect(result.ok).toBe(false);
    expect(state.balances.get("m1:TEST")).toBe(5000);
  });

  it("la restitution avant diffusion se fait dans le mode du débit d'origine", async () => {
    const { debitForCampaign, refundCampaignDebit } = await import("../src/lib/marketing-balance");
    state.balances.set("m1:TEST", 500);
    state.balances.set("m1:LIVE", 500);
    await transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", mode: "TEST", campaignId: "c1", amountCents: 199, description: "x" }));
    await transaction((tx) => refundCampaignDebit(tx as never, "c1", "Annulée"));
    expect(state.balances.get("m1:TEST")).toBe(500);
    expect(state.balances.get("m1:LIVE")).toBe(500);
  });
});
