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
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl font-semibold">Mes cartes</h1>
      <ul className="mt-6 space-y-3">
        {memberships.map((item) => (
          <li key={item.id}>
            <a
              href={`/carte/${item.merchant.slug}`}
              className="block rounded-3xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200"
            >
              <p className="font-semibold">{item.merchant.name}</p>
              <p className="text-sm text-slate-500">{item.points} passages</p>
            </a>
          </li>
        ))}
      </ul>
      {memberships.length === 0 ? (
        <p className="mt-6 text-slate-600">
          Aucune carte pour le moment. Scannez le QR d’un commerce pour commencer.
        </p>
      ) : null}
    </main>
  );
}
