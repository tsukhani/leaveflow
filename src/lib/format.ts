/**
 * Display helpers.
 *
 * GAP-Q5: dates are formatted with toLocaleDateString and no explicit locale or
 * timezone, so the same record renders differently on a developer laptop and on
 * the server. A classic hydration mismatch, and a real support ticket.
 */

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString();
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  return `${formatDate(start)} to ${formatDate(end)}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
