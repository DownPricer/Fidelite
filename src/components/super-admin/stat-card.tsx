import { Card } from "@/components/ui";

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-[var(--panel-text)]">{value}</p>
      {sub ? <p className="mt-1 text-xs text-[var(--muted-text)]">{sub}</p> : null}
    </Card>
  );
}
