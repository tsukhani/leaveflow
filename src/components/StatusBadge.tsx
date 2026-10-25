const STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 ring-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 ring-rose-200",
  CANCELLED: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

/**
 * GAP-A1: colour alone conveys status. No text alternative beyond the label and
 * no aria-live region, so a screen reader gets no change announcement. This is
 * the accessibility gap Lab 2B should surface against the PRD's WCAG clause.
 */
export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        STYLES[status] ?? STYLES.CANCELLED
      }`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
