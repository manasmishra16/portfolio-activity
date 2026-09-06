/**
 * Centralized Date & Timezone Utilities for Portfolio Administration
 *
 * Owner Timezone: Asia/Kolkata (IST, UTC+05:30)
 *
 * Pipeline:
 * - Stored in Database as UTC.
 * - Serialized via API with ISO-8601 timezone information.
 * - Formatted on Frontend using Intl.DateTimeFormat with timeZone: "Asia/Kolkata".
 *
 * Deterministic conversions:
 * - "2026-09-06T19:55:00Z" -> "Sep 7, 2026, 01:25 AM"
 * - "2026-09-06T13:55:00Z" -> "Sep 6, 2026, 07:25 PM"
 */

export function formatAdminDate(isoString: string | null | undefined): string {
  if (!isoString) return "Recent";

  try {
    let normalized = isoString.trim();

    // If string lacks timezone offset or 'Z', treat as canonical UTC
    if (
      normalized.includes("T") &&
      !normalized.endsWith("Z") &&
      !/[+-]\d{2}(?::?\d{2})?$/.test(normalized)
    ) {
      normalized += "Z";
    } else if (
      normalized.includes(" ") &&
      !normalized.endsWith("Z") &&
      !/[+-]\d{2}(?::?\d{2})?$/.test(normalized)
    ) {
      normalized = normalized.replace(" ", "T") + "Z";
    }

    const date = new Date(normalized);
    if (isNaN(date.getTime())) return isoString;

    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Detailed timestamp with explicit IST indicator for detailed views.
 */
export function formatAdminDateWithZone(isoString: string | null | undefined): string {
  const formatted = formatAdminDate(isoString);
  if (formatted === "Recent" || formatted === isoString) return formatted;
  return `${formatted} IST`;
}
