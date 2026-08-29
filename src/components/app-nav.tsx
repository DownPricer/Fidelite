import Link from "next/link";

export function AppNav({ admin }: { admin: boolean }) {
  return (
    <nav className="mt-6 flex flex-wrap gap-2 text-sm">
      <Link className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200" href="/app">
        Accueil
      </Link>
      <Link className="rounded-full bg-teal-700 px-3 py-2 text-white" href="/app/caisse">
        Mode caisse
      </Link>
      {admin ? (
        <>
          <Link className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200" href="/app/clients">
            Clients
          </Link>
          <Link className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200" href="/app/employes">
            Employés
          </Link>
          <Link className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200" href="/app/parametres">
            Paramètres
          </Link>
        </>
      ) : null}
    </nav>
  );
}
