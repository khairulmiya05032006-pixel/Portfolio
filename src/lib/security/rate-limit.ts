/**
 * Simple in-memory rate limiter.
 * For production, use a Redis-backed solution.
 */
const requests = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  key: string,
  maxRequests = 5,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = requests.get(key)

  if (!record || now > record.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}
