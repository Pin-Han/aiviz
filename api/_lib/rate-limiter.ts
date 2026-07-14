import { RATE_LIMIT_PER_IP, RATE_LIMIT_GLOBAL } from '../../shared/constants.js'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
}

// In-memory fallback when Vercel KV is not configured
const memoryStore = new Map<string, { count: number; expiresAt: number }>()

function getMemoryCount(key: string): number {
  const entry = memoryStore.get(key)
  if (!entry) return 0
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(key)
    return 0
  }
  return entry.count
}

function incrementMemory(key: string, ttlSeconds: number): number {
  const entry = memoryStore.get(key)
  if (!entry || Date.now() > entry.expiresAt) {
    memoryStore.set(key, { count: 1, expiresAt: Date.now() + ttlSeconds * 1000 })
    return 1
  }
  entry.count++
  return entry.count
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

async function checkWithKv(ip: string): Promise<RateLimitResult> {
  const { getRedis } = await import('./redis.js')
  const redis = getRedis()
  if (!redis) return checkWithMemory(ip)

  const ipKey = `rate:ip:${ip}`
  const globalKey = 'rate:global'

  const [ipCount, globalCount] = await Promise.all([
    redis.get<number>(ipKey),
    redis.get<number>(globalKey),
  ])

  if ((ipCount ?? 0) >= RATE_LIMIT_PER_IP) {
    return { allowed: false, remaining: 0 }
  }
  if ((globalCount ?? 0) >= RATE_LIMIT_GLOBAL) {
    return { allowed: false, remaining: 0 }
  }

  const ttl = getSecondsUntilMidnightUTC8()
  const pipeline = redis.pipeline()
  pipeline.incr(ipKey)
  pipeline.incr(globalKey)
  const results = await pipeline.exec()
  const newIpCount = results[0] as number

  if (newIpCount === 1) await redis.expire(ipKey, ttl)
  if ((globalCount ?? 0) === 0) await redis.expire(globalKey, ttl)

  return { allowed: true, remaining: RATE_LIMIT_PER_IP - newIpCount }
}

function checkWithMemory(ip: string): RateLimitResult {
  const ipKey = `rate:ip:${ip}`
  const globalKey = 'rate:global'

  const ipCount = getMemoryCount(ipKey)
  const globalCount = getMemoryCount(globalKey)

  if (ipCount >= RATE_LIMIT_PER_IP) return { allowed: false, remaining: 0 }
  if (globalCount >= RATE_LIMIT_GLOBAL) return { allowed: false, remaining: 0 }

  const ttl = getSecondsUntilMidnightUTC8()
  const newIpCount = incrementMemory(ipKey, ttl)
  incrementMemory(globalKey, ttl)

  return { allowed: true, remaining: RATE_LIMIT_PER_IP - newIpCount }
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  // Use Vercel KV if configured, otherwise fall back to in-memory
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      return await checkWithKv(ip)
    } catch {
      return checkWithMemory(ip)
    }
  }
  return checkWithMemory(ip)
}
