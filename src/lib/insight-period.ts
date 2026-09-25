// Date-range helpers for Fideto Insight. Everything is anchored to Europe/Paris, with
// weeks starting on Monday, as required by the merchant statistics spec. No date library
// is added — the codebase already hand-rolls this kind of thing (see money.ts).

export const PARIS_TZ = "Europe/Paris";

export type InsightPeriodKey = "7d" | "30d" | "90d" | "12m" | "custom";
export type InsightBucket = "day" | "week" | "month";

export type InsightRange = {
  start: Date;
  end: Date;
  compareStart: Date;
  compareEnd: Date;
  bucket: InsightBucket;
};

function parisParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: PARIS_TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
  });
  const parts = fmt.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: parts.weekday,
  };
}

/** Offset (ms) such that `parisLocalTime = instant + offset`. Positive east of UTC. */
function parisOffsetMs(date: Date): number {
  const p = parisParts(date);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - date.getTime();
}

/** The UTC instant whose Europe/Paris wall-clock reads Y-M-D 00:00:00. */
function parisMidnight(year: number, month: number, day: number): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const offset = parisOffsetMs(utcGuess);
  return new Date(utcGuess.getTime() - offset);
}

/** "YYYY-MM-DD" for `date`, read in Europe/Paris. Used as a stable bucketing/display key. */
export function parisDateKey(date: Date): string {
  const p = parisParts(date);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** Hour of day (0-23) in Europe/Paris. */
export function parisHour(date: Date): number {
  return parisParts(date).hour;
}

const WEEKDAY_INDEX: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

/** Day of week (0=Monday .. 6=Sunday) in Europe/Paris. */
export function parisWeekdayIndex(date: Date): number {
  return WEEKDAY_INDEX[parisParts(date).weekday] ?? 0;
}

/** Start of the Paris calendar day containing `date`. */
export function startOfParisDay(date: Date): Date {
  const p = parisParts(date);
  return parisMidnight(p.year, p.month, p.day);
}

/** Start of the Monday containing `date`, in Europe/Paris. */
export function startOfParisWeek(date: Date): Date {
  const day = startOfParisDay(date);
  const weekday = parisWeekdayIndex(date);
  return new Date(day.getTime() - weekday * 86_400_000);
}

/** Start of the Paris calendar month containing `date`. */
export function startOfParisMonth(date: Date): Date {
  const p = parisParts(date);
  return parisMidnight(p.year, p.month, 1);
}

function addParisDays(date: Date, days: number): Date {
  const p = parisParts(date);
  return parisMidnight(p.year, p.month, p.day + days);
}

function addParisMonths(date: Date, months: number): Date {
  const p = parisParts(date);
  const total = (p.month - 1) + months;
  const year = p.year + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  return parisMidnight(year, month + 1, 1);
}

export function resolvePeriod(
  key: InsightPeriodKey,
  now: Date = new Date(),
  custom?: { from: Date; to: Date },
): InsightRange {
  const todayStart = startOfParisDay(now);
  const end = now;

  if (key === "custom" && custom) {
    const start = startOfParisDay(custom.from);
    const customEnd = new Date(startOfParisDay(custom.to).getTime() + 86_400_000);
    const duration = customEnd.getTime() - start.getTime();
    return {
      start,
      end: customEnd > now ? now : customEnd,
      compareStart: new Date(start.getTime() - duration),
      compareEnd: start,
      bucket: duration > 90 * 86_400_000 ? "week" : "day",
    };
  }

  if (key === "12m") {
    const start = addParisMonths(todayStart, -11);
    const duration = end.getTime() - start.getTime();
    return {
      start,
      end,
      compareStart: new Date(start.getTime() - duration),
      compareEnd: start,
      bucket: "month",
    };
  }

  const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
  const start = addParisDays(todayStart, -(days - 1));
  const duration = end.getTime() - start.getTime();
  return {
    start,
    end,
    compareStart: new Date(start.getTime() - duration),
    compareEnd: start,
    bucket: "day",
  };
}

/** Evolution en % entre deux valeurs, sans jamais renvoyer NaN/Infinity. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

export function enumerateDayKeys(start: Date, end: Date): string[] {
  const keys: string[] = [];
  let cursor = startOfParisDay(start);
  const last = startOfParisDay(new Date(end.getTime() - 1));
  while (cursor.getTime() <= last.getTime()) {
    keys.push(parisDateKey(cursor));
    cursor = addParisDays(cursor, 1);
  }
  return keys;
}

export function enumerateWeekKeys(start: Date, end: Date): string[] {
  const keys: string[] = [];
  let cursor = startOfParisWeek(start);
  const last = startOfParisWeek(new Date(end.getTime() - 1));
  while (cursor.getTime() <= last.getTime()) {
    keys.push(parisDateKey(cursor));
    cursor = new Date(cursor.getTime() + 7 * 86_400_000);
  }
  return keys;
}

export function enumerateMonthKeys(start: Date, end: Date): string[] {
  const keys: string[] = [];
  let cursor = startOfParisMonth(start);
  const last = startOfParisMonth(new Date(end.getTime() - 1));
  while (cursor.getTime() <= last.getTime()) {
    keys.push(parisDateKey(cursor).slice(0, 7));
    cursor = addParisMonths(cursor, 1);
  }
  return keys;
}

export function bucketKey(date: Date, bucket: InsightBucket): string {
  if (bucket === "week") return parisDateKey(startOfParisWeek(date));
  if (bucket === "month") return parisDateKey(startOfParisMonth(date)).slice(0, 7);
  return parisDateKey(date);
}

export function enumerateBucketKeys(range: Pick<InsightRange, "start" | "end" | "bucket">): string[] {
  if (range.bucket === "week") return enumerateWeekKeys(range.start, range.end);
  if (range.bucket === "month") return enumerateMonthKeys(range.start, range.end);
  return enumerateDayKeys(range.start, range.end);
}
