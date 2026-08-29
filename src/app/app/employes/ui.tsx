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
    <div className="mt-6 space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      {temp ? <Alert tone="ok">Mot de passe temporaire : {temp}</Alert> : null}
      <Card>
        <h2 className="text-lg font-semibold">Nouvel employé</h2>
        <p className="text-sm text-slate-500">Maximum {max} employés actifs.</p>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={(event) => void create(event)}>
          <Field label="Prénom">
            <Input name="firstName" required />
          </Field>
          <Field label="Nom">
            <Input name="lastName" />
          </Field>
          <Field label="E-mail">
            <Input name="email" type="email" required />
          </Field>
          <Field label="Mot de passe temporaire">
            <Input name="password" type="password" required minLength={8} />
          </Field>
          <Button className="sm:col-span-2">Créer</Button>
        </form>
      </Card>
      {employees.map((employee) => (
        <Card key={employee.id} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">
              {employee.firstName} {employee.lastName}
            </p>
            <p className="text-sm text-slate-500">{employee.email}</p>
            <p className="text-xs text-slate-400">{employee.isActive ? "Actif" : "Désactivé"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => void resetPassword(employee.id)}>
              Réinitialiser
            </Button>
            {employee.isActive ? (
              <Button variant="danger" onClick={() => void disable(employee.id)}>
                Désactiver
              </Button>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
