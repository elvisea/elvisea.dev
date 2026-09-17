/** Utilitários do feed RSS (`app/rss.xml/route.ts`). */

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** `YYYY-MM-DD` → data RFC 822 (meio-dia UTC, para não trocar o dia). */
export function rfc822(date: string): string {
  return new Date(`${date}T12:00:00Z`).toUTCString();
}
