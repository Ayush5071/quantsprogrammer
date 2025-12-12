// simple in-memory cache with TTL (suitable for single-instance server)
type CacheEntry<T> = { value: T; expiresAt: number };

const CACHE: Map<string, CacheEntry<any>> = new Map();

export function setCache<T>(key: string, value: T, ttlMs = 5 * 60 * 1000) {
  CACHE.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function getCache<T>(key: string): T | null {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    CACHE.delete(key);
    return null;
  }
  return entry.value as T;
}

export function clearCache(key?: string) {
  if (key) CACHE.delete(key);
  else CACHE.clear();
}

export default { setCache, getCache, clearCache };
