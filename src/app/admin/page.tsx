import { notFound, redirect } from "next/navigation";
import { env } from "@/lib/env";

export default function AdminPage() {
  const prefix = env.superAdminPath.replace(/^\/+|\/+$/g, "");
  if (!prefix) notFound();
  redirect(`/${prefix}`);
}
