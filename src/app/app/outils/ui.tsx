"use client";

import { ToolCard } from "@/components/merchant/merchant-ui";

const icons = {
  loyalty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 21s-7.5-4.6-10-9.3C.5 7.8 2.6 4.5 6 4.5c2 0 3.5 1.1 4.5 2.6C11.5 5.6 13 4.5 15 4.5c3.4 0 5.5 3.3 4 7.2C16.5 16.4 12 21 12 21z" strokeLinejoin="round" />
    </svg>
  ),
  campaigns: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M3 11v2a2 2 0 002 2h1l3 5V4L6 9H5a2 2 0 00-2 2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8a4 4 0 010 8M17 5a8 8 0 010 14" strokeLinecap="round" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  stats: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 20V10m6.5 10V4m6.5 16v-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const TOOLS = [
  { href: "/app/fidelisation", title: "Fidélisation", hint: "Programme et avantages", icon: icons.loyalty },
  { href: "/app/campagnes", title: "Campagnes", hint: "Annonces et mise en avant", icon: icons.campaigns },
  { href: "/app/employes", title: "Équipe", hint: "Rôles et accès du personnel", icon: icons.team },
  { href: "/app/statistiques", title: "Statistiques", hint: "Analytique et tendances", icon: icons.stats },
  { href: "/app/parametres", title: "Réglages", hint: "Identité et compte", icon: icons.settings },
] as const;

export function OutilsPanel() {
  return (
    <div className="tool-cards-grid">
      {TOOLS.map((tool) => (
        <ToolCard key={tool.href} href={tool.href} icon={tool.icon} title={tool.title} hint={tool.hint} />
      ))}
    </div>
  );
}
