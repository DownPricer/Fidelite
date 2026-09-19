import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Fidelo Employé",
  description: "Application de scan Fidelo pour les employés.",
  applicationName: "Fidelo Employé",
  manifest: "/employe/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Fidelo Employé",
    statusBarStyle: "black",
  },
};

export const viewport: Viewport = {
  themeColor: "#090911",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <div className="employee-app min-h-dvh bg-[#06060b] text-[var(--body-text)]">{children}</div>;
}
