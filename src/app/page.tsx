import Link from "next/link";
import { BrandMark } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-16">
      <BrandMark className="mb-8 text-xl" />
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-900">
        La fidélité sans application à télécharger.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600">
        Un client touche un badge NFC ou scanne un QR au comptoir, crée sa carte, et
        revient. L’employé scanne. Les points s’ajoutent.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/c/cafe-demo"
          className="rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white"
        >
          Voir Café Demo
        </Link>
        <Link href="/connexion" className="rounded-2xl bg-white px-5 py-3 font-semibold ring-1 ring-slate-200">
          Espace client
        </Link>
      </div>
      <p className="mt-10 text-sm text-slate-500">
        Commerçants :{" "}
        <Link href="/app/connexion" className="underline">
          app-fidelite.sitereadyshd.fr
        </Link>
        {" · "}
        Super-admin :{" "}
        <Link href="/admin/connexion" className="underline">
          admin-fidelite.sitereadyshd.fr
        </Link>
      </p>
    </main>
  );
}
