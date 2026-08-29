import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <h1 className="text-3xl font-semibold">Page introuvable</h1>
      <p className="mt-3 text-slate-600">Ce commerce ou cette page n’existe pas.</p>
      <Link href="/" className="mt-6 underline">
        Retour à l’accueil
      </Link>
    </main>
  );
}
