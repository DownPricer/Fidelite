"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Field, Input, cn } from "@/components/ui";

type Employee = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  isActive: boolean;
};

export function EmployeesPanel({ demo = false }: { demo?: boolean }) {
  const [employees, setEmployees] = useState<Employee[]>(
    demo
      ? [
          { id: "e1", firstName: "Sam", lastName: "Durand", email: "employe@cafe-demo.local", isActive: true },
          { id: "e2", firstName: "Noa", lastName: "Petit", email: "noa@cafe-demo.local", isActive: true },
        ]
      : [],
  );
  const [max, setMax] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [temp, setTemp] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/merchant/employees");
    const data = await response.json();
    if (response.ok) {
      setEmployees(data.employees);
      setMax(data.max);
    }
  }

  useEffect(() => {
    if (demo) return;
    void load();
  }, [demo]);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/merchant/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Création impossible.");
      return;
    }
    setError(null);
    event.currentTarget.reset();
    void load();
  }

  async function disable(id: string) {
    await fetch(`/api/merchant/employees/${id}`, { method: "PATCH" });
    void load();
  }

  async function resetPassword(id: string) {
    const response = await fetch(`/api/merchant/employees/${id}/reset`, { method: "POST" });
    const data = await response.json();
    if (response.ok) setTemp(data.temporaryPassword);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <section className="rounded-2xl border border-white/10 bg-[var(--surface)] p-6 lg:sticky lg:top-8 lg:self-start">
        <h3 className="mb-2 text-xl font-bold tracking-tight text-[var(--ink)]">Nouvel employé</h3>
        <p className="mb-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
          Limite : {employees.filter((e) => e.isActive).length}/{max}
        </p>

        <form className="space-y-6" onSubmit={(event) => void create(event)}>
          {error ? <Alert>{error}</Alert> : null}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prénom">
              <Input name="firstName" required placeholder="Jean" />
            </Field>
            <Field label="Nom">
              <Input name="lastName" placeholder="Dupont" />
            </Field>
          </div>
          <Field label="E-mail">
            <Input name="email" type="email" required placeholder="jean@exemple.fr" />
          </Field>
          <Field label="Mot de passe" hint="Temporaire, 8 car. min.">
            <Input name="password" type="password" required minLength={8} />
          </Field>
          <Button className="w-full">Ajouter à l&apos;équipe</Button>
        </form>
      </section>

      <div className="space-y-4 lg:col-span-2">
        {temp ? (
          <Alert tone="ok">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Mot de passe temporaire généré</span>
              <span className="text-lg font-black tracking-tight">{temp}</span>
            </div>
          </Alert>
        ) : null}

        <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[var(--surface)]">
          {employees.map((employee) => (
            <div key={employee.id} className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-black",
                    employee.isActive
                      ? "bg-[var(--violet)]/20 text-[var(--violet-bright)]"
                      : "bg-[var(--surface-strong)] text-[var(--muted)]",
                  )}
                >
                  {employee.firstName.slice(0, 1)}
                </div>
                <div>
                  <h4 className="text-lg font-black leading-none tracking-tight text-[var(--ink)]">
                    {employee.firstName} {employee.lastName}
                  </h4>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{employee.email}</p>
                  <div
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest",
                      employee.isActive
                        ? "border border-[var(--positive)]/30 bg-[var(--positive)]/10 text-[var(--positive)]"
                        : "border border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]",
                    )}
                  >
                    {employee.isActive ? "Actif" : "Désactivé"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" className="h-10 px-4 text-xs font-bold" onClick={() => void resetPassword(employee.id)}>
                  Réinitialiser
                </Button>
                {employee.isActive ? (
                  <Button variant="danger" className="h-10 px-4 text-xs font-bold" onClick={() => void disable(employee.id)}>
                    Désactiver
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
