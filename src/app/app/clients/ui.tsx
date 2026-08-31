"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";

type Customer = {
  id: string;
  firstName: string;
  email: string;
  points: number;
  lastActivity: string;
};

export function CustomersPanel({ demo = false }: { demo?: boolean }) {
  const [customers, setCustomers] = useState<Customer[]>(
    demo
      ? [
          { id: "c1", firstName: "Irène", email: "irene@demo.local", points: 7, lastActivity: "2026-08-30" },
          { id: "c2", firstName: "Marc", email: "marc@demo.local", points: 3, lastActivity: "2026-08-29" },
          { id: "c3", firstName: "Lina", email: "lina@demo.local", points: 10, lastActivity: "2026-08-28" },
        ]
      : [],
  );
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/merchant/customers");
    const data = await response.json();
    if (response.ok) setCustomers(data.customers);
  }

  useEffect(() => {
    if (demo) return;
    void load();
  }, [demo]);

  async function adjust(event: React.FormEvent<HTMLFormElement>, membershipId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/merchant/adjust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        membershipId,
        delta: Number(form.get("delta")),
        reason: form.get("reason"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Ajustement impossible.");
      return;
    }
    setOk("Ajustement enregistré.");
    event.currentTarget.reset();
    void load();
  }

  return (
    <div className="space-y-6">
      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert tone="ok">{ok}</Alert> : null}

      {customers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/12 py-20 text-center text-[var(--muted)]">
          <p className="font-bold tracking-tight text-[var(--ink)]">Aucun client pour le moment</p>
          <p className="text-sm">Les clients apparaîtront ici après leur premier scan.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
          {customers.map((customer) => (
            <div key={customer.id} className="flex flex-col justify-between gap-6 p-6 lg:flex-row lg:items-center">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--surface-strong)] font-bold uppercase text-[var(--ink)]">
                  {customer.firstName.slice(0, 1)}
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-tight text-[var(--ink)]">{customer.firstName}</h4>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{customer.email}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--violet)]/15 px-3 py-1 text-[var(--violet-bright)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet-bright)]" />
                    <span className="text-xs font-black uppercase tracking-widest">{customer.points} points</span>
                  </div>
                </div>
              </div>

              <form
                className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-[var(--surface-raised)] p-4 lg:mt-0"
                onSubmit={(event) => void adjust(event, customer.id)}
              >
                <div className="w-24">
                  <Field label="Points">
                    <Input name="delta" type="number" placeholder="+/-" required className="h-10 text-sm" />
                  </Field>
                </div>
                <div className="min-w-[150px] flex-1">
                  <Field label="Motif">
                    <Input name="reason" placeholder="Ex: Geste co" required className="h-10 text-sm" />
                  </Field>
                </div>
                <Button variant="secondary" className="h-10 px-4 text-xs">
                  Appliquer
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
