"use client";

import Link from "next/link";
import { BrandMark } from "@/components/ui";

export function CustomerAuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="login-scene obsidian-scene relative flex min-h-dvh flex-col items-center justify-center px-5 py-10 sm:px-6 sm:py-12">
      <div className="relative w-full max-w-[440px]">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <BrandMark className="mb-6 sm:mb-8" />
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-sm text-sm font-medium leading-relaxed text-[var(--muted-strong)] sm:text-base">
            {subtitle}
          </p>
        </div>

        <section className="glass-panel p-6 sm:p-8">{children}</section>

        {footer}

        <nav className="mt-6 text-center text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
          <p className="mb-3">Autres espaces</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/app/connexion" className="text-[var(--violet-bright)] hover:underline normal-case tracking-normal">
              Commerçant
            </Link>
            <Link href="/employe/connexion" className="text-[var(--violet-bright)] hover:underline normal-case tracking-normal">
              Employé
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
