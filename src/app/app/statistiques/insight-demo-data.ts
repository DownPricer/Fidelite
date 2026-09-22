// Données statiques pour le mode démo de /app/statistiques — jamais de requête Prisma.
// Le commerce démo est toujours affiché avec Fidelo Insight débloqué, pour présenter la
// fonctionnalité complète.

function series(base: number, spread: number, days = 7) {
  return Array.from({ length: days }, (_, i) => ({
    date: `J-${days - 1 - i}`,
    value: Math.max(0, Math.round(base + Math.sin(i / 1.3) * spread + (i % 3))),
  }));
}

const heatmap = Array.from({ length: 7 }, (_, weekday) =>
  Array.from({ length: 24 }, (_, hour) => {
    const isOpenHour = hour >= 9 && hour <= 20;
    const isWeekend = weekday >= 5;
    const base = isOpenHour ? (isWeekend ? 6 : 4) : 0;
    const lunchBoost = hour >= 12 && hour <= 14 ? 5 : 0;
    const eveningBoost = hour >= 18 && hour <= 20 ? 3 : 0;
    return { weekday, hour, value: Math.max(0, base + lunchBoost + eveningBoost - (weekday === 1 ? 1 : 0)) };
  }),
).flat();

export const INSIGHT_DEMO_RESPONSE = {
  period: "30d" as const,
  locked: false,
  free: {
    totalClients: 128,
    activeClients30d: 74,
    newClientsThisWeek: 9,
    passagesThisWeek: 41,
    scansValidatedThisWeek: 46,
    passagesSeries: series(18, 6),
    revenue: { amountCents: 184250, amountCentsLabel: "1 842,50 €" },
  },
  previewPlaceholder: null,
  premium: {
    overview: {
      totalClients: { current: 128, previous: 111, changePct: 15.3 },
      activeClients: { current: 74, previous: 61, changePct: 21.3 },
      newClients: { current: 17, previous: 12, changePct: 41.7 },
      returningClients: { current: 52, previous: 44, changePct: 18.2 },
      passages: { current: 186, previous: 152, changePct: 22.4 },
      scansValidated: { current: 186, previous: 152, changePct: 22.4 },
      rewardsUsed: { current: 23, previous: 19, changePct: 21.1 },
    },
    frequentation: {
      series: series(6, 3, 30),
      newVsReturningSeries: Array.from({ length: 30 }, (_, i) => ({
        date: `J-${29 - i}`,
        new: Math.max(0, Math.round(1.2 + Math.sin(i / 2) * 1)),
        returning: Math.max(0, Math.round(4 + Math.cos(i / 3) * 2)),
      })),
      byWeekday: [
        { label: "Lun", value: 21 },
        { label: "Mar", value: 24 },
        { label: "Mer", value: 26 },
        { label: "Jeu", value: 29 },
        { label: "Ven", value: 38 },
        { label: "Sam", value: 42 },
        { label: "Dim", value: 6 },
      ],
      heatmap,
      avgVisitsPerClient: 2.4,
      avgDaysBetweenVisits: 9.6,
      busiestDay: "Samedi",
      busiestHour: 13,
    },
    retention: {
      returnRate7d: 38.2,
      returnRate30d: 61.5,
      returnRate90d: 71.0,
      avgVisitFrequencyDays: 9.6,
      inactive30d: 31,
      inactive60d: 18,
      inactive90d: 11,
      reactivated: 6,
      cohorts: [
        { cohortWeek: "S1", size: 14, retention: [100, 57, 43, 36] },
        { cohortWeek: "S2", size: 11, retention: [100, 64, 45] },
        { cohortWeek: "S3", size: 9, retention: [100, 55] },
        { cohortWeek: "S4", size: 12, retention: [100] },
      ],
    },
    segments: {
      segments: [
        { key: "nouveaux", label: "Nouveaux clients", description: "Première visite il y a moins de 14 jours.", size: 17, changePct: 41.7 },
        { key: "reguliers", label: "Clients réguliers", description: "Au moins deux passages, actifs récemment.", size: 46, changePct: 8.1 },
        { key: "fideles", label: "Clients très fidèles", description: "Huit passages ou plus.", size: 21, changePct: 12.4 },
        { key: "prometteurs", label: "Clients prometteurs", description: "Un seul passage pour l'instant, pas encore à risque.", size: 12, changePct: -3.2 },
        { key: "risque", label: "Clients à risque", description: "Aucun passage depuis 30 à 89 jours.", size: 20, changePct: -5.6 },
        { key: "inactifs", label: "Clients inactifs", description: "Aucun passage depuis 90 jours ou plus.", size: 11, changePct: 2.1 },
        { key: "reactives", label: "Clients réactivés", description: "Revenus après une longue absence.", size: 6, changePct: 20.0 },
      ],
    },
    rewards: {
      pointsDistributed: { current: 1840, previous: 1520, changePct: 21.1 },
      pointsUsed: { current: 690, previous: 540, changePct: 27.8 },
      pointsBalance: 4120,
      rewardsUsedCount: { current: 23, previous: 19, changePct: 21.1 },
      redemptionRate: 37.5,
      avgDaysToFirstReward: 18.4,
      topRewards: [
        { rewardId: "r1", count: 12 },
        { rewardId: "r2", count: 7 },
        { rewardId: "r3", count: 4 },
      ],
      lowRewards: [{ rewardId: "r4", count: 1 }],
      funnel: { registered: 74, returned: 52, rewardUsed: 23 },
    },
    team: {
      employees: [
        { userId: "e1", firstName: "Sam", scansValidated: 62, scansDenied: 3, commits: 58 },
        { userId: "e2", firstName: "Noa", scansValidated: 41, scansDenied: 1, commits: 39 },
        { userId: "e3", firstName: "Léa", scansValidated: 28, scansDenied: 2, commits: 27 },
      ],
    },
    financial: {
      revenue: { current: 184250, previous: 151900, changePct: 21.3 },
      avgBasketCents: 1420,
      avgSpendPerClientCents: 2490,
      loyalRewardValueCents: 68400,
      revenueFromRewardsCents: 15200,
      topSpenders: [
        { customerMembershipId: "c1", firstName: "Marie", totalCents: 8420 },
        { customerMembershipId: "c2", firstName: "Lucas", totalCents: 6110 },
        { customerMembershipId: "c3", firstName: "Sarah", totalCents: 5330 },
      ],
    },
    comparison: {
      hasRevenue: true,
      series: Array.from({ length: 30 }, (_, i) => ({
        date: `J-${29 - i}`,
        passages: Math.max(0, Math.round(5 + Math.sin(i / 2.4) * 2 + (i % 4))),
        scans: Math.max(0, Math.round(6 + Math.cos(i / 2.8) * 2 + (i % 3))),
        newClients: Math.max(0, Math.round(1 + Math.sin(i / 3) * 1.2)),
        returningClients: Math.max(0, Math.round(3 + Math.cos(i / 3.5) * 1.5 + (i % 2))),
        rewardsUsed: Math.max(0, Math.round(1 + Math.sin(i / 4) * 1.1)),
        revenueCents: Math.max(0, Math.round(5200 + Math.sin(i / 2.5) * 1800 + (i % 5) * 420)),
      })),
    },
  },
};
