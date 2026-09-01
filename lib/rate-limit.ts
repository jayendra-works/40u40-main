/**
 * In-memory rate limits (per IP or identifier).
 * For production at scale, use Redis (e.g. Upstash) or similar.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const NOMINATION_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const NOMINATION_MAX = 5;

const SUMMIT_NOTIFY_WINDOW_MS = 60 * 60 * 1000;
const SUMMIT_NOTIFY_MAX = 12;

function checkLimit(
  key: string,
  windowMs: number,
  maxCount: number,
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) return { allowed: true };
  if (now > entry.resetAt) {
    store.delete(key);
    return { allowed: true };
  }
  if (entry.count >= maxCount) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true };
}

function recordLimit(key: string, windowMs: number): void {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  entry.count += 1;
}

/** Nomination form submissions per IP. */
export function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  return checkLimit(`nomination:${identifier}`, NOMINATION_WINDOW_MS, NOMINATION_MAX);
}

export function recordSubmission(identifier: string): void {
  recordLimit(`nomination:${identifier}`, NOMINATION_WINDOW_MS);
}

/** Summit venue & date email signup per IP. */
export function checkSummitVenueNotifyRateLimit(identifier: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  return checkLimit(`summit-venue-notify:${identifier}`, SUMMIT_NOTIFY_WINDOW_MS, SUMMIT_NOTIFY_MAX);
}

export function recordSummitVenueNotifySubmission(identifier: string): void {
  recordLimit(`summit-venue-notify:${identifier}`, SUMMIT_NOTIFY_WINDOW_MS);
}
