/**
 * Lightweight localStorage cache with TTL.
 * Keys are prefixed with src_v1_ so all can be wiped by changing PREFIX.
 * Safe to call in SSR/non-browser environments — all ops are try/catch guarded.
 */
const PREFIX = 'src_v1_';

export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { data, ts, ttl } = JSON.parse(raw);
    if (Date.now() - ts > ttl) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function cacheSet(key, data, ttl = 5 * 60 * 1000) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ data, ts: Date.now(), ttl }));
  } catch {
    // Storage quota exceeded or unavailable — silent fail
  }
}

export function cacheDel(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {}
}

/** Remove all keys that START with the given prefix (after the src_v1_ prefix). */
export function cacheBust(keyPrefix) {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX + keyPrefix))
      .forEach(k => localStorage.removeItem(k));
  } catch {}
}
