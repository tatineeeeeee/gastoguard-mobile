export function formatRelativeDate(ms: number): string {
  const now = new Date();
  const date = new Date(ms);

  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffMs = nowMidnight.getTime() - dateMidnight.getTime();
  const diffDays = Math.round(diffMs / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 6) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

export type DueTone = "overdue" | "soon" | "normal";

export function formatDueBadge(
  dueMs: number,
  now: number = Date.now()
): { label: string; tone: DueTone } {
  const diff = dueMs - now;
  const diffDays = diff / 86400000;

  if (diff < 0) {
    return { label: "Overdue", tone: "overdue" };
  }
  if (diffDays <= 3) {
    const date = new Date(dueMs);
    const label = date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    return { label: `Due ${label}`, tone: "soon" };
  }
  const date = new Date(dueMs);
  const label = date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
  return { label: `Due ${label}`, tone: "normal" };
}

export function monthRange(now: number = Date.now()): { startMs: number; endMs: number } {
  const d = new Date(now);
  const startMs = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  const endMs = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
  return { startMs, endMs };
}

export function formatMonthYear(ms: number): string {
  return new Date(ms).toLocaleDateString("en-PH", { month: "long", year: "numeric" });
}
