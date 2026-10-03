import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Ancienne route : les avantages sponsorisés s’ouvrent via le sheet sur /carte. */
export default async function CarteAvantagesPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string; apercu?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.demo) qs.set("demo", params.demo);
  if (params.apercu) qs.set("apercu", params.apercu);
  qs.set("sheet", "1");
  redirect(`/carte?${qs.toString()}`);
}
