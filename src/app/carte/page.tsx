import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export default async function CarteIndexPage() {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");

  const memberships = await prisma.customerMembership.findMany({
    where: { userId: user.id, merchant: { isActive: true } },
    include: { merchant: true },
    orderBy: { updatedAt: "desc" },
  });

  if (memberships.length === 1) {
    redirect(`/carte/${memberships[0].merchant.slug}`);
  }

  return (
    <main className="min-h-dvh bg-[var(--page-bg)] text-[var(--body-text)]">
      <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl font-semibold text-[var(--panel-text)]">Mes cartes</h1>
      <ul className="mt-6 space-y-3">
        {memberships.map((item) => (
          <li key={item.id}>
            <a
              href={`/carte/${item.merchant.slug}`}
              className="block rounded-3xl border border-[var(--border)] bg-[var(--panel-bg)] px-5 py-4 text-[var(--panel-text)] shadow-sm"
            >
              <p className="font-semibold">{item.merchant.name}</p>
              <p className="text-sm text-[var(--muted-text)]">{item.points} passages</p>
            </a>
          </li>
        ))}
      </ul>
      {memberships.length === 0 ? (
        <p className="mt-6 text-[var(--muted-text)]">
          Aucune carte pour le moment. Scannez le QR d’un commerce pour commencer.
        </p>
      ) : null}
      </div>
    </main>
  );
}
