/**
 * Rate limit em memória, por chave (ex.: `contact-inquiry:${ip}`).
 * Suficiente para deploy single-instance; multi-instância exige Redis/Upstash.
 */

interface WindowEntry {
  count: number;
  firstRequest: number;
}

const buckets = new Map<string, WindowEntry>();

function cleanupExpired(now: number, windowMs: number) {
  for (const [key, info] of buckets.entries()) {
    if (now - info.firstRequest >= windowMs) buckets.delete(key);
  }
}

export function isRateLimited(
  key: string,
  max = 3,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  cleanupExpired(now, windowMs);

  const entry = buckets.get(key);
  if (!entry || now - entry.firstRequest >= windowMs) {
    buckets.set(key, { count: 1, firstRequest: now });
    return false;
  }
  if (entry.count >= max) return true;
  entry.count++;
  return false;
}

export function resetRateLimitForTests(): void {
  buckets.clear();
}
