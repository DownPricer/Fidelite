"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

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
    void load();
  }

  return (
    <div className="mt-6 space-y-3">
      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert tone="ok">{ok}</Alert> : null}
      {customers.map((customer) => (
        <Card key={customer.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{customer.firstName}</p>
              <p className="text-sm text-slate-500">{customer.email}</p>
              <p className="mt-1 text-lg">{customer.points} points</p>
            </div>
          </div>
          <form className="mt-4 grid gap-2 sm:grid-cols-3" onSubmit={(event) => void adjust(event, customer.id)}>
            <Field label="Ajustement">
              <Input name="delta" type="number" required />
            </Field>
            <Field label="Motif">
              <Input name="reason" required />
            </Field>
            <Button className="self-end" variant="secondary">
              Ajuster
            </Button>
          </form>
        </Card>
      ))}
    </div>
  );
}
