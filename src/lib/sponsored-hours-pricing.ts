import { parisHourInstant } from "./insight-period";

/**
 * Tarification à l'heure de la mise en avant (bandeau sponsorisé), en Europe/Paris, en centimes
 * entiers — remplace l'ancien tarif fixe de 5 €/jour pour toute NOUVELLE demande. Les demandes
 * déjà confirmées avant cette fonctionnalité gardent leur `priceCents` déjà persisté — cette
 * fonction n'est jamais appliquée rétroactivement (voir AdRequest.hourlySchedule = null pour
 * distinguer les anciennes demandes).
 *
 * Tranches sans chevauchement, bornes en heure locale Europe/Paris :
 *   00h–08h  2,50 €/h   (NIGHT)
 *   08h–19h  5,00 €/h   (DAY)
 *   19h–22h  5,50 €/h   (EVENING)
 *   22h–00h  1,00 €/h   (HAPPY_HOUR)
 */
export const SPONSORED_HOUR_RATE_CENTS = {
  NIGHT: 250,
  DAY: 500,
  EVENING: 550,
  HAPPY_HOUR: 100,
} as const;

export const MIN_HOURS_PER_DAY = 3;
export const MIN_SPONSORED_DAYS = 1;
export const MAX_SPONSORED_DAYS = 60;

/** Tarif horaire (centimes) pour une heure locale Europe/Paris (0-23). */
export function rateForParisHour(hour: number): number {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError(`Heure invalide : ${hour}.`);
  if (hour < 8) return SPONSORED_HOUR_RATE_CENTS.NIGHT;
  if (hour < 19) return SPONSORED_HOUR_RATE_CENTS.DAY;
  if (hour < 22) return SPONSORED_HOUR_RATE_CENTS.EVENING;
  return SPONSORED_HOUR_RATE_CENTS.HAPPY_HOUR;
}

/** Une journée sélectionnée : date Europe/Paris (YYYY-MM-DD) + heures locales choisies (0-23, sans doublon). */
export type SponsoredDaySelection = { date: string; hours: number[] };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateSponsoredSchedule(days: SponsoredDaySelection[]): { ok: true } | { ok: false; error: string } {
  if (!Array.isArray(days) || days.length < MIN_SPONSORED_DAYS) {
    return { ok: false, error: "Sélectionnez au moins un jour." };
  }
  if (days.length > MAX_SPONSORED_DAYS) {
    return { ok: false, error: `Maximum ${MAX_SPONSORED_DAYS} jours par demande.` };
  }
  const seenDates = new Set<string>();
  for (const day of days) {
    if (!day || typeof day.date !== "string" || !DATE_RE.test(day.date)) {
      return { ok: false, error: "Date invalide." };
    }
    if (seenDates.has(day.date)) return { ok: false, error: `Date en double : ${day.date}.` };
    seenDates.add(day.date);
    if (!Array.isArray(day.hours)) return { ok: false, error: `Heures invalides le ${day.date}.` };
    const uniqueHours = new Set(day.hours);
    if (uniqueHours.size !== day.hours.length) return { ok: false, error: `Heures en double le ${day.date}.` };
    for (const h of day.hours) {
      if (!Number.isInteger(h) || h < 0 || h > 23) return { ok: false, error: `Heure invalide le ${day.date}.` };
    }
    if (day.hours.length < MIN_HOURS_PER_DAY) {
      return { ok: false, error: `Au moins ${MIN_HOURS_PER_DAY} heures requises le ${day.date} (${day.hours.length} sélectionnée${day.hours.length > 1 ? "s" : ""}).` };
    }
  }
  return { ok: true };
}

export type SponsoredDayBreakdown = { date: string; hours: number[]; priceCents: number };
export type SponsoredHoursPricing = {
  totalDays: number;
  totalHours: number;
  totalCents: number;
  byDay: SponsoredDayBreakdown[];
};

/** Calcule le prix — ne valide pas le planning (voir validateSponsoredSchedule, toujours appelé avant côté serveur). */
export function priceSponsoredHours(days: SponsoredDaySelection[]): SponsoredHoursPricing {
  const byDay = days.map((day) => {
    const hours = [...day.hours].sort((a, b) => a - b);
    return { date: day.date, hours, priceCents: hours.reduce((sum, h) => sum + rateForParisHour(h), 0) };
  });
  return {
    totalDays: byDay.length,
    totalHours: byDay.reduce((sum, d) => sum + d.hours.length, 0),
    totalCents: byDay.reduce((sum, d) => sum + d.priceCents, 0),
    byDay,
  };
}

export type UtcInterval = { start: string; end: string };

/**
 * Convertit le planning en intervalles UTC fusionnés (heures consécutives d'un même jour
 * regroupées), utilisés pour la diffusion réelle du bandeau (voir /api/public/merchants) et pour
 * les bornes startDate/endDate historiques (compatibilité avec le reste du code).
 *
 * Cas particulier changement d'heure de printemps : si l'heure locale sélectionnée n'existe pas
 * ce jour-là (ex. 2h le dernier dimanche de mars), l'instant calculé coïncide avec l'heure
 * suivante — l'intervalle a alors une durée nulle et est simplement ignoré ici (rien à diffuser
 * à un instant qui n'existe pas) ; l'heure reste facturée normalement (choix documenté, voir
 * priceSponsoredHours) puisque l'intention du commerçant reste claire.
 */
export function scheduleToUtcIntervals(days: SponsoredDaySelection[]): UtcInterval[] {
  const raw: { start: Date; end: Date }[] = [];
  for (const day of days) {
    const [y, m, d] = day.date.split("-").map(Number);
    for (const hour of [...day.hours].sort((a, b) => a - b)) {
      const start = parisHourInstant(y, m, d, hour);
      const end = hour === 23 ? parisHourInstant(y, m, d + 1, 0) : parisHourInstant(y, m, d, hour + 1);
      if (end.getTime() <= start.getTime()) continue; // heure locale inexistante (printemps) — rien à diffuser
      raw.push({ start, end });
    }
  }
  raw.sort((a, b) => a.start.getTime() - b.start.getTime());

  const merged: { start: Date; end: Date }[] = [];
  for (const interval of raw) {
    const last = merged[merged.length - 1];
    if (last && interval.start.getTime() <= last.end.getTime()) {
      if (interval.end.getTime() > last.end.getTime()) last.end = interval.end;
    } else {
      merged.push({ ...interval });
    }
  }
  return merged.map((i) => ({ start: i.start.toISOString(), end: i.end.toISOString() }));
}

/** `now` tombe-t-il dans un des intervalles diffusés ? Utilisé par /api/public/merchants. */
export function isWithinUtcIntervals(now: Date, intervals: UtcInterval[]): boolean {
  const t = now.getTime();
  return intervals.some((i) => t >= new Date(i.start).getTime() && t < new Date(i.end).getTime());
}
