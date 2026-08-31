import type { MerchantCardData } from "./types";

export function MerchantFace({
  card,
  compact = false,
}: {
  card: MerchantCardData;
  compact?: boolean;
}) {
  const remaining = Math.max(0, card.visitsRequired - card.points);
  return (
    <div className={compact ? "flex min-w-0 items-center gap-3" : "flex items-center gap-3"}>
      {card.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.logoUrl}
          alt=""
          className={compact ? "h-11 w-11 rounded-xl object-cover" : "h-12 w-12 rounded-xl object-cover"}
        />
      ) : (
        <div
          className={
            compact
              ? "grid h-11 w-11 place-items-center rounded-xl text-base font-black text-[var(--ink)]"
              : "grid h-12 w-12 place-items-center rounded-xl text-lg font-black text-[var(--ink)]"
          }
          style={{ backgroundColor: card.primaryColor }}
        >
          {card.name.slice(0, 1)}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-bold tracking-tight text-[var(--ink)]">{card.name}</p>
        <p className="text-xs text-[var(--muted)]">
          {card.points} / {card.visitsRequired} ·{" "}
          {remaining === 0 ? card.rewardLabel : `encore ${remaining}`}
        </p>
      </div>
    </div>
  );
}
