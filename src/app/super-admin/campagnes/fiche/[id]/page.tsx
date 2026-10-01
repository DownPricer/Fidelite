import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { AdDetailPage } from "./ad-detail";

export default async function SuperAdminAdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");

  // Vraie page 404 serveur si la mise en avant n'existe pas — jamais une redirection vers /app
  // ni vers une autre page : seul un 404 standard Next.js, comme pour toute route /super-admin/*.
  const exists = await prisma.adRequest.findUnique({ where: { id }, select: { id: true } });
  if (!exists) notFound();

  return <AdDetailPage id={id} firstName={user.firstName} />;
}
