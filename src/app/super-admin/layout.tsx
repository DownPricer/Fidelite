import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super-administration Fife Life",
  robots: { index: false, follow: false },
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
