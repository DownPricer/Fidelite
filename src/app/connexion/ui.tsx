"use client";



import Link from "next/link";

import { useState } from "react";

import { Alert, BrandMark, Button, Field, Input } from "@/components/ui";



export function CustomerLoginForm() {

  const [error, setError] = useState<string | null>(null);

  const [pending, setPending] = useState(false);



  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();

    setError(null);

    setPending(true);

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/login", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({

        email: form.get("email"),

        password: form.get("password"),

      }),

    });

    const data = await response.json();

    setPending(false);

    if (!response.ok) {

      setError(data.error ?? "Connexion impossible.");

      return;

    }

    window.location.href = "/carte";

  }



  return (

    <main className="obsidian-scene relative flex min-h-dvh flex-col items-center justify-center px-6 py-12 text-[var(--ink)]">

      <div className="pointer-events-none absolute right-[-10%] top-[8%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(133,87,255,0.35),transparent_70%)] blur-2xl" />

      <div className="relative w-full max-w-[440px]">

        <div className="mb-10 flex flex-col items-center text-center">

          <BrandMark className="mb-8" />

          <h1 className="text-3xl font-black tracking-tight">Espace client</h1>

          <p className="mt-2 font-medium text-[var(--muted-strong)]">

            Retrouvez vos cartes, vos points et votre QR Fife Life.

          </p>

        </div>



        <section className="glass-panel p-8">

          <form className="space-y-6" onSubmit={onSubmit}>

            {error ? <Alert>{error}</Alert> : null}

            <Field label="Adresse e-mail">

              <Input name="email" type="email" autoComplete="email" required placeholder="jean@exemple.fr" />

            </Field>

            <Field label="Mot de passe">

              <Input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />

            </Field>

            <Button type="submit" className="glass-cta w-full justify-center border-0 py-4 text-base" disabled={pending}>

              {pending ? "Connexion en cours..." : "Ouvrir mon portefeuille"}

            </Button>

          </form>

        </section>



        <div className="glass-panel mt-8 p-6 text-center">

          <p className="text-sm font-medium leading-relaxed text-[var(--muted-strong)]">

            Pas encore de carte ? Scannez le QR en magasin ou testez{" "}

            <Link href="/carte" className="font-bold text-[var(--violet-bright)] hover:underline">

              le wallet démo

            </Link>

            .

          </p>

        </div>

      </div>

    </main>

  );

}

