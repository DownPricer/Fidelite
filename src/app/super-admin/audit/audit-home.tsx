"use client";

import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Card } from "@/components/ui";

export function AuditPage({ firstName }: { firstName: string }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    void fetch("/api/super-admin/audit?pageSize=100")
      .then((r) => r.json())
      .then((data) => setLogs(data.logs ?? []));
  }, []);

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-2xl font-black text-[var(--ink)]">Sécurité et audit</h1>
        <Card className="overflow-hidden p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-widest text-[var(--muted-text)]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Auteur</th>
                <th className="px-4 py-3">Commerce</th>
                <th className="px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--muted-text)]">Aucune entrée.</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="border-b border-white/5">
                  <td className="px-4 py-2 text-xs">{new Date(log.createdAt).toLocaleString("fr-FR")}</td>
                  <td className="px-4 py-2 font-semibold">{log.action}</td>
                  <td className="px-4 py-2 text-xs">{log.actor?.email ?? "—"}</td>
                  <td className="px-4 py-2 text-xs">{log.merchant?.name ?? "—"}</td>
                  <td className="px-4 py-2 text-xs">{log.ip ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </SuperAdminShell>
  );
}
