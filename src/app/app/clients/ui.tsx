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

export function CustomersPanel() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/merchant/customers");
    const data = await response.json();
    if (response.ok) setCustomers(data.customers);
  }

  useEffect(() => {
    void load();
  }, []);

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
        <div className="py-20 text-center rounded-3xl border-2 border-dashed border-border text-muted">
          <p className="font-bold tracking-tight">Aucun client pour le moment</p>
          <p className="text-sm">Les clients apparaîtront ici après leur premier scan.</p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-2xl border border-border">
          {customers.map((customer) => (
            <div key={customer.id} className="flex flex-col justify-between gap-6 p-6 lg:flex-row lg:items-center">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 font-bold uppercase">
                    {customer.firstName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-black tracking-tight text-lg">{customer.firstName}</h4>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest leading-none mt-1">{customer.email}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest">{customer.points} points</span>
                    </div>
                  </div>
                </div>
                
                <form
                  className="mt-4 flex flex-wrap items-end gap-3 rounded-xl bg-slate-50 p-4 lg:mt-0"
                  onSubmit={(event) => void adjust(event, customer.id)}
                >
                  <div className="w-24">
                    <Field label="Points">
                      <Input name="delta" type="number" placeholder="+/-" required className="h-10 text-sm" />
                    </Field>
                  </div>
                  <div className="flex-1 min-w-[150px]">
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
