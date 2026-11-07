const DAY_MS = 24 * 60 * 60 * 1000;

/** App clock. `dayOffset` is a presenter tool that simulates future days. */
export function appNow(dayOffset = 0): Date {
  return new Date(Date.now() + dayOffset * DAY_MS);
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar day key, e.g. 2026-11-06 */
export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Week key based on the local Monday that starts the week, e.g. wk-2026-11-02 */
export function weekKey(d: Date): string {
  return `wk-${dateKey(startOfWeek(d))}`;
}

export function startOfWeek(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? -6 : 1 - day; // back to Monday
  x.setDate(x.getDate() + diff);
  return x;
}

export function isSameDay(a: Date, b: Date) {
  return dateKey(a) === dateKey(b);
}

export function isSameWeek(a: Date, b: Date) {
  return weekKey(a) === weekKey(b);
}

/** Whole calendar days between two dates (b - a), using local midnight. */
export function calendarDaysBetween(a: Date, b: Date): number {
  const ma = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const mb = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((mb - ma) / DAY_MS);
}

export function greetingKey(d: Date): 'home.morning' | 'home.afternoon' | 'home.evening' {
  const h = d.getHours();
  if (h < 12) return 'home.morning';
  if (h < 18) return 'home.afternoon';
  return 'home.evening';
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-SG', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

export function formatDay(d: Date): string {
  return d.toLocaleDateString('en-SG', { weekday: 'short' });
}

let counter = 0;
export function uid(prefix = 'id'): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
