import type { WalletTier } from "./types";

const LADDER: Array<{ name: WalletTier; min: number; next: number | null }> = [
  { name: "Bronze", min: 0, next: 100 },
  { name: "Silver", min: 100, next: 250 },
  { name: "Gold", min: 250, next: 500 },
  { name: "Diamond", min: 500, next: null },
];

export function resolveTier(points: number) {
  const safe = Math.max(0, points);
  let current = LADDER[0];
  for (const step of LADDER) {
    if (safe >= step.min) current = step;
  }
  const span = current.next == null ? current.min : current.next - current.min;
  const progressed = current.next == null ? 1 : (safe - current.min) / Math.max(1, span);
  return {
    name: current.name,
    min: current.min,
    next: current.next,
    nextName:
      current.name === "Bronze"
        ? "Silver"
        : current.name === "Silver"
          ? "Gold"
          : current.name === "Gold"
            ? "Diamond"
            : null,
    progress: Math.min(1, Math.max(0, progressed)),
    remaining: current.next == null ? 0 : Math.max(0, current.next - safe),
  };
}

export const TIER_STYLE: Record<
  WalletTier,
  { from: string; to: string; glow: string; metal: string }
> = {
  Bronze: {
    from: "#3a2416",
    to: "#8a5a32",
    glow: "rgba(196, 148, 86, 0.35)",
    metal: "#e0b27a",
  },
  Silver: {
    from: "#1c1d24",
    to: "#6d7384",
    glow: "rgba(210, 216, 230, 0.28)",
    metal: "#d9dee8",
  },
  Gold: {
    from: "#2c2108",
    to: "#b8892a",
    glow: "rgba(232, 196, 96, 0.38)",
    metal: "#f0d48a",
  },
  Diamond: {
    from: "#14102a",
    to: "#5b3aa8",
    glow: "rgba(184, 108, 255, 0.45)",
    metal: "#f4f0ff",
  },
};
