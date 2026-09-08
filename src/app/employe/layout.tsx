import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Fife Life Employé",
  description: "Application de scan Fife Life pour les employés.",
  applicationName: "Fife Life Employé",
  manifest: "/employe/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Fife Life Employé",
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
