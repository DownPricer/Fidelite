/**
 * Mini base en mémoire (assez de Prisma pour exécuter les VRAIES routes du parcours « visuel
 * des mises en avant ») : where (égalité, in, not, lte, gte, OR, NOT), orderBy, include.
 */
type Row = Record<string, unknown> & { id: string };

let counter = 0;
const nextId = (prefix: string) => `${prefix}_${++counter}`;

function matchValue(actual: unknown, expected: unknown): boolean {
  if (expected && typeof expected === "object" && !(expected instanceof Date) && !Array.isArray(expected)) {
    const ops = expected as Record<string, unknown>;
    if ("in" in ops) return (ops.in as unknown[]).includes(actual);
    if ("not" in ops) return ops.not === null ? actual !== null && actual !== undefined : actual !== ops.not;
    if ("lt" in ops) return (actual as Date).getTime() < (ops.lt as Date).getTime();
    if ("lte" in ops) return (actual as Date).getTime() <= (ops.lte as Date).getTime();
    if ("gte" in ops) return (actual as Date).getTime() >= (ops.gte as Date).getTime();
    if ("equals" in ops) return actual === ops.equals;
  }
  if (expected === null) return actual === null || actual === undefined;
  return actual === expected;
}

function match(row: Row, where: Record<string, unknown> = {}): boolean {
  return Object.entries(where).every(([key, value]) => {
    // Clé composée Prisma (ex. userId_adRequestId: { userId, adRequestId }).
    if (key.includes("_") && value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      return match(row, value as Record<string, unknown>);
    }
    if (key === "OR") return (value as Record<string, unknown>[]).some((w) => match(row, w));
    if (key === "NOT") return !match(row, value as Record<string, unknown>);
    return matchValue(row[key], value);
  });
}

function sortRows(rows: Row[], orderBy?: Record<string, "asc" | "desc"> | Record<string, "asc" | "desc">[]) {
  const spec = Array.isArray(orderBy) ? orderBy[0] : orderBy;
  if (!spec) return rows;
  const [key, dir] = Object.entries(spec)[0];
  return [...rows].sort((a, b) => {
    const av = a[key] as number | Date;
    const bv = b[key] as number | Date;
    const diff = +av - +bv;
    return dir === "desc" ? -diff : diff;
  });
}

/** Commerce simulé (zone du secteur : Lyon / 69001) — modifiable par les tests. */
export const merchantInfo = { slug: "boulangerie", name: "Boulangerie Test", logoUrl: null as string | null, city: "Lyon", postalCode: "69001", isActive: true, status: "ACTIVE" };

function applyUpdate(row: Row, data: Record<string, unknown>) {
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    if (v && typeof v === "object" && !(v instanceof Date) && "increment" in (v as object)) {
      row[k] = ((row[k] as number) ?? 0) + (v as { increment: number }).increment;
    } else row[k] = v;
  }
}

export function createFakeAdDb() {
  const tables: Record<string, Row[]> = {
    adRequest: [],
    campaign: [],
    adVisualVersion: [],
    adRequestImage: [],
    staffNotification: [],
    campaignPayment: [],
    auditLog: [],
    stripeWebhookEvent: [],
    adEvent: [],
    adCustomerView: [],
    user: [],
    customerPreferences: [],
    marketingBalance: [],
    marketingLedgerEntry: [],
    campaignQuotaUsage: [],
    merchantSubscription: [],
    merchantStripeCustomer: [],
    sponsoredAdTestBroadcast: [],
  };

  function hydrate(table: string, row: Row | undefined, include?: Record<string, unknown>) {
    if (!row) return null;
    const out: Record<string, unknown> = { ...row };
    if (!include) return out;
    if (table === "adRequest") {
      if (include.campaign) {
        const campaign = tables.campaign.find((c) => c.id === row.campaignId);
        out.campaign = campaign
          ? {
              ...campaign,
              payment: tables.campaignPayment.find((p) => p.campaignId === campaign.id) ?? null,
              ledgerEntry: tables.marketingLedgerEntry.find((e) => e.campaignId === campaign.id) ?? null,
            }
          : null;
      }
      if (include.images) out.images = sortRows(tables.adRequestImage.filter((i) => i.adRequestId === row.id), { position: "asc" });
      if (include.versions) out.versions = sortRows(tables.adVisualVersion.filter((v) => v.adRequestId === row.id), { number: "desc" });
      if (include.merchant) out.merchant = { id: row.merchantId, ...merchantInfo };
      if (include._count) out._count = { versions: tables.adVisualVersion.filter((v) => v.adRequestId === row.id).length };
    }
    if (table === "campaignPayment" && include.campaign) {
      out.campaign = tables.campaign.find((c) => c.id === row.campaignId) ?? null;
    }
    if (table === "sponsoredAdTestBroadcast" && include.adRequest) {
      const ad = tables.adRequest.find((a) => a.id === row.adRequestId);
      const adInc = include.adRequest as Record<string, unknown>;
      const nested = (adInc.include as Record<string, unknown> | undefined) ?? adInc;
      out.adRequest = hydrate("adRequest", ad, nested);
    }
    return out;
  }

  function model(table: string, prefix: string) {
    return {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        // Contrainte unique (userId, adRequestId) de AdCustomerView : la seconde création concurrente échoue.
        if (table === "marketingLedgerEntry" && data.campaignId && tables[table].some((r) => r.campaignId === data.campaignId)) {
          throw Object.assign(new Error("Unique constraint failed"), { code: "P2002" });
        }
        if (table === "adCustomerView" && tables[table].some((r) => r.userId === data.userId && r.adRequestId === data.adRequestId)) {
          throw new Error("Unique constraint failed");
        }
        const row = { id: nextId(prefix), createdAt: new Date(counter * 1000 + 1_700_000_000_000), updatedAt: new Date(), ...data } as Row;
        tables[table].push(row);
        return { ...row };
      },
      createMany: async ({ data }: { data: Record<string, unknown>[] }) => {
        for (const d of data) tables[table].push({ id: nextId(prefix), createdAt: new Date(counter * 1000 + 1_700_000_000_000), ...d } as Row);
        return { count: data.length };
      },
      findFirst: async ({ where, orderBy, include, select }: { where?: Record<string, unknown>; orderBy?: never; include?: Record<string, unknown>; select?: unknown } = {}) => {
        const found = sortRows(tables[table].filter((r) => match(r, where)), orderBy)[0];
        void select;
        return hydrate(table, found, include);
      },
      findUnique: async ({ where, include }: { where: Record<string, unknown>; include?: Record<string, unknown> }) =>
        hydrate(table, tables[table].find((r) => match(r, where)), include),
      findMany: async ({ where, orderBy, include, take }: { where?: Record<string, unknown>; orderBy?: never; include?: Record<string, unknown>; take?: number } = {}) => {
        const rows = sortRows(tables[table].filter((r) => match(r, where)), orderBy);
        return rows.slice(0, take ?? rows.length).map((r) => hydrate(table, r, include));
      },
      update: async ({ where, data }: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
        const row = tables[table].find((r) => match(r, where));
        if (!row) throw new Error(`${table}: introuvable`);
        applyUpdate(row, data);
        return { ...row };
      },
      updateMany: async ({ where, data }: { where?: Record<string, unknown>; data: Record<string, unknown> }) => {
        const rows = tables[table].filter((r) => match(r, where));
        for (const row of rows) applyUpdate(row, data);
        return { count: rows.length };
      },
      deleteMany: async ({ where }: { where?: Record<string, unknown> }) => {
        const before = tables[table].length;
        tables[table] = tables[table].filter((r) => !match(r, where));
        return { count: before - tables[table].length };
      },
      count: async ({ where }: { where?: Record<string, unknown> } = {}) => tables[table].filter((r) => match(r, where)).length,
      upsert: async ({ where, create, update }: { where: Record<string, unknown>; create: Record<string, unknown>; update: Record<string, unknown> }) => {
        const row = tables[table].find((r) => match(r, where));
        if (row) {
          Object.assign(row, update, { updatedAt: new Date() });
          return { ...row };
        }
        const created = { id: nextId(prefix), createdAt: new Date(), updatedAt: new Date(), ...create } as Row;
        tables[table].push(created);
        return { ...created };
      },
      delete: async ({ where }: { where: Record<string, unknown> }) => {
        tables[table] = tables[table].filter((r) => !match(r, where));
      },
    };
  }

  const prisma = {
    adRequest: model("adRequest", "ad"),
    campaign: model("campaign", "camp"),
    adVisualVersion: model("adVisualVersion", "ver"),
    adRequestImage: model("adRequestImage", "img"),
    staffNotification: model("staffNotification", "notif"),
    campaignPayment: model("campaignPayment", "pay"),
    auditLog: model("auditLog", "audit"),
    stripeWebhookEvent: model("stripeWebhookEvent", "evt"),
    adEvent: model("adEvent", "ev"),
    adCustomerView: model("adCustomerView", "view"),
    user: model("user", "user"),
    customerPreferences: {
      ...model("customerPreferences", "pref"),
      // count du diagnostic : consentement + zone (ville/code postal) du commerce simulé.
      count: async () =>
        tables.customerPreferences.filter(
          (r) => r.notifyFifeLifeNews === true && (r.marketingZonePostalCode === merchantInfo.postalCode || String(r.marketingZoneCity ?? "").toLowerCase() === merchantInfo.city.toLowerCase()),
        ).length,
    },
    marketingBalance: model("marketingBalance", "bal"),
    campaignQuotaUsage: model("campaignQuotaUsage", "quota"),
    merchantSubscription: model("merchantSubscription", "sub"),
    merchantStripeCustomer: model("merchantStripeCustomer", "scus"),
    marketingLedgerEntry: model("marketingLedgerEntry", "led"),
    sponsoredAdTestBroadcast: model("sponsoredAdTestBroadcast", "tbc"),
    merchant: {
      findMany: async () => [] as unknown[],
      findUnique: async () => ({ id: "m1", city: merchantInfo.city, postalCode: merchantInfo.postalCode }),
    },
    $transaction: async (callback: (client: unknown) => Promise<unknown>) => {
      // Transaction avec annulation : si le callback échoue, les tables reviennent à leur état d'avant.
      const snapshot = Object.fromEntries(Object.entries(tables).map(([k, rows]) => [k, rows.map((r) => ({ ...r }))]));
      try {
        return await callback(prisma);
      } catch (error) {
        for (const [k, rows] of Object.entries(snapshot)) tables[k] = rows;
        throw error;
      }
    },
    // Seul le débit atomique du solde marketing est simulé (UPDATE conditionnel solde >= montant).
    $executeRaw: async (strings: TemplateStringsArray, ...values: unknown[]) => {
      if (!strings.join("").includes('UPDATE "MarketingBalance"')) return 1;
      const [amount, merchantId, mode] = values as [number, string, string];
      const row = tables.marketingBalance.find((r) => r.merchantId === merchantId && r.mode === mode);
      if (!row || (row.balanceCents as number) < amount) return 0;
      row.balanceCents = (row.balanceCents as number) - amount;
      return 1;
    },
  };

  return { prisma, tables };
}
