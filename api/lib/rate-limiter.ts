import { kv } from '@vercel/kv'
import { RATE_LIMIT_PER_IP, RATE_LIMIT_GLOBAL } from '../../shared/constants.js'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
}

function getSecondsUntilMidnightUTC8(): number {
  const now = new Date()
  const utc8Offset = 8 * 60 * 60 * 1000
  const nowUtc8 = new Date(now.getTime() + utc8Offset)
  const tomorrowUtc8 = new Date(nowUtc8)
  tomorrowUtc8.setUTCHours(0, 0, 0, 0)
  tomorrowUtc8.setUTCDate(tomorrowUtc8.getUTCDate() + 1)

  const diffMs = tomorrowUtc8.getTime() - nowUtc8.getTime()
  return Math.ceil(diffMs / 1000)
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const ipKey = `rate:ip:${ip}`
  const globalKey = 'rate:global'

  const [ipCount, globalCount] = await Promise.all([
    kv.get<number>(ipKey),
    kv.get<number>(globalKey),
  ])

  // Check if already at limit
  if ((ipCount ?? 0) >= RATE_LIMIT_PER_IP) {
    return { allowed: false, remaining: 0 }
  }

  if ((globalCount ?? 0) >= RATE_LIMIT_GLOBAL) {
    return { allowed: false, remaining: 0 }
  }

  // Increment counters
  const ttl = getSecondsUntilMidnightUTC8()

  const [newIpCount] = await Promise.all([
    kv.incr(ipKey),
    kv.incr(globalKey),
  ])

  // Set expiry (only on first increment to avoid resetting TTL)
  if (newIpCount === 1) {
    await kv.expire(ipKey, ttl)
  }
  if ((globalCount ?? 0) === 0) {
    await kv.expire(globalKey, ttl)
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT_PER_IP - newIpCount,
  }
}
