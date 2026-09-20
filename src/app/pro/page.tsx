import { redirect } from "next/navigation";
import Link from "next/link";
import { BrandMark } from "@/components/ui";
import { getSessionUser } from "@/lib/session";
import { getEmployeeSession } from "@/lib/employee-session";
import { firstActiveStaffMembership } from "@/lib/rbac";

const SPACES = [
  {
    title: "Commerçant",
    description: "Gérez votre programme de fidélité, vos récompenses et votre équipe.",
    href: "/app/connexion",
    cta: "Continuer en tant que commerçant",
  },
  {
    title: "Employé",
    description: "Accédez à la caisse et aux fonctionnalités autorisées par votre commerce.",
    href: "/employe/connexion",
    cta: "Continuer en tant qu'employé",
  },
] as const;

export default async function ProEntryPage() {
  const employeeSession = await getEmployeeSession();
  if (employeeSession) redirect("/employe/scan");

  const user = await getSessionUser();
  if (user) {
    const membership = firstActiveStaffMembership(user.merchantMemberships);
    if (membership) redirect(membership.role === "EMPLOYEE" ? "/app/caisse" : "/app");
  }

  return (
    <main className="obsidian-scene relative flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="relative w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark className="mb-6" />
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--violet-bright)]">
            Espace professionnel
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--ink)]">Quel est votre rôle ?</h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--muted-strong)]">
            Choisissez votre espace pour continuer.
          </p>
        </div>

        <div className="space-y-3">
          {SPACES.map((space) => (
            <Link
              key={space.href}
              href={space.href}
              className="glass-panel group block rounded-2xl p-5 transition hover:border-[rgba(190,164,255,0.45)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[var(--ink)]">{space.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted-strong)]">{space.description}</p>
                </div>
                <span
                  className="mt-0.5 shrink-0 text-[var(--violet-bright)] transition group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </div>
              <span className="mt-4 inline-flex rounded-full border border-[rgba(190,164,255,0.32)] bg-[rgba(12,10,24,0.88)] px-4 py-2 text-xs font-bold text-[var(--ink)]">
                {space.cta}
              </span>
            </Link>
          ))}
        </div>

        <nav className="mt-6 text-center text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
          <p className="mb-3">Autres espaces</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/connexion" className="text-[var(--violet-bright)] hover:underline normal-case tracking-normal">
              Client
            </Link>
            <Link href="/demo" className="text-[var(--violet-bright)] hover:underline normal-case tracking-normal">
              Démos
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
