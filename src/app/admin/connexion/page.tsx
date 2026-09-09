import { notFound, redirect } from "next/navigation";
import { env } from "@/lib/env";

export default function AdminLoginPage() {
  const prefix = env.superAdminPath.replace(/^\/+|\/+$/g, "");
  if (!prefix) notFound();
  redirect(`/${prefix}/connexion`);
}
