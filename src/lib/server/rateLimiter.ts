type Bucket = { tokens: number; last: number };
const BUCKETS: Map<string, Bucket> = new Map();

// Simple token bucket per key (IP or routeKey)
export function allowRequest(key: string, capacity = 10, refillMs = 60_000) {
  const now = Date.now();
  let b = BUCKETS.get(key);
  if (!b) {
    b = { tokens: capacity, last: now };
    BUCKETS.set(key, b);
  }
  // refill
  const elapsed = now - b.last;
  const refillTokens = Math.floor(elapsed / refillMs) * capacity;
  if (refillTokens > 0) {
    b.tokens = Math.min(capacity, b.tokens + refillTokens);
    b.last = now;
  }
  if (b.tokens <= 0) return false;
  b.tokens -= 1;
  return true;
}

export default { allowRequest };
