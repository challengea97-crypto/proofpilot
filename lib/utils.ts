export type ClassValue = string | number | null | false | undefined;

/** Join class names, dropping falsy values. Lightweight `clsx` alternative. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Short human-readable date, e.g. "5 Jul 2026". */
export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/** Relative "time ago" label, e.g. "3 days ago". Falls back to a date. */
export function timeAgo(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return rtf.format(-Math.round(seconds / secondsInUnit), unit);
    }
  }
  return "just now";
}

/** Truncate a string to `max` chars with an ellipsis. */
export function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}
