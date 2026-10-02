import type { ReactNode } from "react";
import { enforceCustomerWalletAccess } from "@/lib/customer-layout-guard";

export default async function CompteLayout({ children }: { children: ReactNode }) {
  await enforceCustomerWalletAccess();
  return children;
}
