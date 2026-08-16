const TZ = "America/Sao_Paulo";

const MONTHS_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const MONTHS_LONG = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export const WEEKDAYS_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"];

/** Today as an ISO date string (yyyy-mm-dd) in São Paulo local time. */
export function todayISO(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts;
}

/** Parses yyyy-mm-dd into a UTC-noon Date so no timezone can shift the day. */
export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, (m ?? 1) - 1, d ?? 1, 12));
}

export function dateToISO(date: Date): string {
  const y = date.getUTCFullYear();
  const m = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const d = `${date.getUTCDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = isoToDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return dateToISO(date);
}

export function addMonths(iso: string, months: number): string {
  const date = isoToDate(iso);
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  return dateToISO(date);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round(
    (isoToDate(checkOut).getTime() - isoToDate(checkIn).getTime()) / 86_400_000,
  );
}

export function dayNumber(iso: string): number {
  return isoToDate(iso).getUTCDate();
}

export function weekday(iso: string): number {
  return isoToDate(iso).getUTCDay();
}

export function monthLabel(iso: string): string {
  const d = isoToDate(iso);
  return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatShort(iso?: string | null): string {
  if (!iso) return "";
  const d = isoToDate(iso);
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]}`;
}

export function formatLong(iso?: string | null): string {
  if (!iso) return "";
  const d = isoToDate(iso);
  return `${d.getUTCDate()} de ${MONTHS_LONG[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

export function formatNumeric(iso?: string | null): string {
  if (!iso) return "";
  const d = isoToDate(iso);
  return `${`${d.getUTCDate()}`.padStart(2, "0")}/${`${d.getUTCMonth() + 1}`.padStart(2, "0")}/${d.getUTCFullYear()}`;
}

/** "18 → 21 agosto" or "29 ago → 2 set" */
export function formatRange(checkIn?: string | null, checkOut?: string | null): string {
  if (!checkIn || !checkOut) return "";
  const a = isoToDate(checkIn);
  const b = isoToDate(checkOut);
  if (a.getUTCMonth() === b.getUTCMonth()) {
    return `${a.getUTCDate()} → ${b.getUTCDate()} ${MONTHS_LONG[a.getUTCMonth()]}`;
  }
  return `${formatShort(checkIn)} → ${formatShort(checkOut)}`;
}

export function brl(value: number, withCents = false): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  }).format(value);
}

export function guestLabel(total: number): string {
  return total === 1 ? "1 hóspede" : `${total} hóspedes`;
}

export function nightsLabel(nights: number): string {
  return nights === 1 ? "1 noite" : `${nights} noites`;
}