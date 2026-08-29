"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

type Employee = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  isActive: boolean;
};

export function EmployeesPanel() {
  const [employees, setEmployees] = useState<Employee[]>([]);
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
    void load();
  }, []);

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
    <div className="grid gap-12 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="sticky top-28">
          <h3 className="text-xl font-bold tracking-tight mb-2">Nouvel employé</h3>
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-6">Limite : {employees.filter(e => e.isActive).length}/{max}</p>
          
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
            <Button className="w-full">Ajouter à l'équipe</Button>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {temp ? (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4">
            <Alert tone="ok">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Mot de passe temporaire généré</span>
                <span className="text-lg font-black tracking-tight">{temp}</span>
              </div>
            </Alert>
          </div>
        ) : null}

        <div className="space-y-4">
          {employees.map((employee) => (
            <Card key={employee.id} className="group overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-black",
                    employee.isActive ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
                  )}>
                    {employee.firstName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-black tracking-tight text-lg leading-none">
                      {employee.firstName} {employee.lastName}
                    </h4>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">{employee.email}</p>
                    <div className={cn(
                      "mt-3 inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest",
                      employee.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                    )}>
                      {employee.isActive ? "Actif" : "Désactivé"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:self-center">
                  <Button variant="ghost" className="h-10 px-4 text-xs font-bold" onClick={() => void resetPassword(employee.id)}>
                    Réinitialiser
                  </Button>
                  {employee.isActive ? (
                    <Button variant="danger" className="h-10 px-4 text-xs font-bold bg-rose-50 text-rose-600 border-none shadow-none hover:bg-rose-100" onClick={() => void disable(employee.id)}>
                      Désactiver
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
