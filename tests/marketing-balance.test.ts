import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Faux client Prisma à état, avec les mêmes garanties que la base : UPDATE conditionnel du solde,
 * contraintes UNIQUE (campaignId, reversalOfId, stripeCheckoutSessionId) et retour arrière de la
 * transaction en cas d'erreur.
 */
type Entry = {
  id: string;
  merchantId: string;
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
    $executeRaw: async (_strings: TemplateStringsArray, amount: number, merchantId: string) => {
      const current = state.balances.get(merchantId);
      if (current === undefined || current < amount) return 0;
      state.balances.set(merchantId, current - amount);
      return 1;
    },
    marketingBalance: {
      findUnique: async ({ where }: { where: { merchantId: string } }) =>
        state.balances.has(where.merchantId) ? { balanceCents: state.balances.get(where.merchantId)! } : null,
      upsert: async ({ where, create, update }: { where: { merchantId: string }; create: { balanceCents: number }; update: { balanceCents: { increment: number } } }) => {
        const current = state.balances.get(where.merchantId);
        state.balances.set(where.merchantId, current === undefined ? create.balanceCents : current + update.balanceCents.increment);
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

function seedTopup(id: string, amountCents: number, sessionId: string, merchantId = "m1") {
  state.entries.push({
    id,
    merchantId,
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
      creditTopup(tx as never, { checkoutSessionId: "cs_1", paymentIntentId: "pi_1", amountPaidCents: 1000 }),
    );
    const replay = await transaction((tx) =>
      creditTopup(tx as never, { checkoutSessionId: "cs_1", paymentIntentId: "pi_1", amountPaidCents: 1000 }),
    );

    expect(first).toBe("credited");
    expect(replay).toBe("already");
    expect(state.balances.get("m1")).toBe(1000);
    expect(state.entries[0]).toMatchObject({ status: "PAID", balanceAfterCents: 1000 });
  });

  it("refuse un montant Stripe différent du montant attendu (rien n'est crédité)", async () => {
    const { creditTopup } = await import("../src/lib/marketing-balance");
    seedTopup("t1", 1000, "cs_1");
    const result = await transaction((tx) =>
      creditTopup(tx as never, { checkoutSessionId: "cs_1", paymentIntentId: null, amountPaidCents: 100 }),
    );
    expect(result).toBe("amount_mismatch");
    expect(state.balances.get("m1")).toBeUndefined();
    expect(state.entries[0].status).toBe("PENDING");
  });

  it("ignore une session inconnue ou une recharge annulée", async () => {
    const { creditTopup } = await import("../src/lib/marketing-balance");
    seedTopup("t1", 1000, "cs_1");
    state.entries[0].status = "CANCELLED";
    expect(
      await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_1", paymentIntentId: null, amountPaidCents: 1000 })),
    ).toBe("unknown");
    expect(
      await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_x", paymentIntentId: null, amountPaidCents: 1000 })),
    ).toBe("unknown");
    expect(state.balances.size).toBe(0);
  });

  it("une recharge échouée puis payée (nouvelle tentative dans la même session) est créditée une fois", async () => {
    const { creditTopup } = await import("../src/lib/marketing-balance");
    seedTopup("t1", 500, "cs_1");
    state.entries[0].status = "FAILED";
    await transaction((tx) => creditTopup(tx as never, { checkoutSessionId: "cs_1", paymentIntentId: "pi", amountPaidCents: 500 }));
    expect(state.balances.get("m1")).toBe(500);
  });
});

describe("debitForCampaign — débit atomique, unique et jamais négatif", () => {
  it("débite le prix exact et écrit l'historique avec le solde restant", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1", 500);
    const result = await transaction((tx) =>
      debitForCampaign(tx as never, { merchantId: "m1", campaignId: "c1", amountCents: 199, description: "Envoi" }),
    );
    expect(result).toEqual({ ok: true, balanceAfterCents: 301 });
    expect(state.entries[0]).toMatchObject({ type: "DEBIT", amountCents: 199, campaignId: "c1", balanceAfterCents: 301 });
  });

  it("solde insuffisant : refuse, le solde reste inchangé et ne devient jamais négatif", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1", 198);
    const result = await transaction((tx) =>
      debitForCampaign(tx as never, { merchantId: "m1", campaignId: "c1", amountCents: 199, description: "Envoi" }),
    );
    expect(result).toEqual({ ok: false });
    expect(state.balances.get("m1")).toBe(198);
    expect(state.entries).toHaveLength(0);
  });

  it("commerce sans solde : refuse", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    const result = await transaction((tx) =>
      debitForCampaign(tx as never, { merchantId: "m1", campaignId: "c1", amountCents: 50, description: "Envoi" }),
    );
    expect(result.ok).toBe(false);
  });

  it("un même envoi n'est jamais débité deux fois : le second débit échoue et est annulé", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1", 1000);
    await transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", campaignId: "c1", amountCents: 199, description: "Envoi" }));
    await expect(
      transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", campaignId: "c1", amountCents: 199, description: "Envoi" })),
    ).rejects.toThrow(/Unique constraint/);
    expect(state.balances.get("m1")).toBe(801); // un seul débit
    expect(state.entries.filter((e) => e.type === "DEBIT")).toHaveLength(1);
  });

  it("refuse un montant nul, négatif ou non entier", async () => {
    const { debitForCampaign } = await import("../src/lib/marketing-balance");
    state.balances.set("m1", 1000);
    for (const amountCents of [0, -5, 0.5]) {
      const result = await transaction((tx) =>
        debitForCampaign(tx as never, { merchantId: "m1", campaignId: `c${amountCents}`, amountCents, description: "x" }),
      );
      expect(result.ok).toBe(false);
    }
    expect(state.balances.get("m1")).toBe(1000);
  });
});

describe("refundCampaignDebit — restitution avant diffusion, une seule fois", () => {
  it("restitue le débit une seule fois", async () => {
    const { debitForCampaign, refundCampaignDebit } = await import("../src/lib/marketing-balance");
    state.balances.set("m1", 500);
    await transaction((tx) => debitForCampaign(tx as never, { merchantId: "m1", campaignId: "c1", amountCents: 199, description: "Envoi" }));

    expect(await transaction((tx) => refundCampaignDebit(tx as never, "c1", "Annulée"))).toBe(true);
    expect(await transaction((tx) => refundCampaignDebit(tx as never, "c1", "Annulée"))).toBe(false);
    expect(state.balances.get("m1")).toBe(500);
  });

  it("ne fait rien pour une campagne jamais débitée (quota gratuit)", async () => {
    const { refundCampaignDebit } = await import("../src/lib/marketing-balance");
    expect(await transaction((tx) => refundCampaignDebit(tx as never, "inconnue", "x"))).toBe(false);
    expect(state.balances.size).toBe(0);
  });
});
