"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { date: string; value: number };

export function PlatformChart({
  title,
  data,
  color = "#875BFF",
  loading,
  emptyLabel = "Aucune donnée sur cette période.",
}: {
  title: string;
  data: Point[];
  color?: string;
  loading?: boolean;
  emptyLabel?: string;
}) {
  const hasData = data.some((point) => point.value > 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-4">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[var(--muted-text)]">{title}</h3>
      {loading ? (
        <div className="grid h-56 place-items-center text-sm text-[var(--muted-text)]">Chargement…</div>
      ) : !hasData ? (
        <div className="grid h-56 place-items-center text-sm text-[var(--muted-text)]">{emptyLabel}</div>
      ) : (
        <>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#8b8ca5" />
                <YAxis tick={{ fontSize: 10 }} stroke="#8b8ca5" width={40} />
                <Tooltip
                  contentStyle={{ background: "#12121a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
                />
                <Legend />
                <Line type="monotone" dataKey="value" name={title} stroke={color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-semibold text-[var(--violet-bright)]">Voir en tableau</summary>
            <div className="mt-2 max-h-40 overflow-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[var(--muted-text)]">
                    <th className="py-1">Date</th>
                    <th className="py-1">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.date} className="border-t border-white/5">
                      <td className="py-1">{row.date}</td>
                      <td className="py-1">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
