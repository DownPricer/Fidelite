"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Card } from "@/components/ui";

export function CardsIndexPage({ firstName }: { firstName: string }) {
  const [merchants, setMerchants] = useState<any[]>([]);

  useEffect(() => {
    void fetch("/api/super-admin/merchants?pageSize=50")
      .then((r) => r.json())
      .then((data) => setMerchants(data.merchants ?? []));
  }, []);

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-2xl font-black text-[var(--ink)]">Cartes commerçant</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {merchants.map((merchant) => (
            <Card key={merchant.id} className="p-4">
              <h2 className="font-bold">{merchant.name}</h2>
              <p className="text-xs text-[var(--muted-text)]">{merchant.loyaltyMode ?? "VISITS"}</p>
              <Link href={`/super-admin/commerces/${merchant.id}/cartes`} className="mt-3 inline-block text-sm font-semibold text-[var(--violet-bright)]">
                Gérer les 5 cartes
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </SuperAdminShell>
  );
}
