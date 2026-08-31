import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center bg-[var(--void)] px-6 text-[var(--ink-soft)]">
      <h1 className="text-3xl font-semibold text-[var(--ink)]">Page introuvable</h1>
      <p className="mt-3 text-[var(--muted-strong)]">Ce commerce ou cette page n’existe pas.</p>
      <Link href="/" className="mt-6 text-[var(--violet-bright)] underline">
        Retour à l’accueil
      </Link>
    </main>
  );
}
