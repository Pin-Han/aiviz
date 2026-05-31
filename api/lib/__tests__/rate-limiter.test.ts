import { describe, it, expect, vi, beforeEach } from 'vitest'

// Ensure KV env vars are NOT set so we use in-memory fallback
beforeEach(() => {
  delete process.env.KV_REST_API_URL
  delete process.env.KV_REST_API_TOKEN
})

describe('checkRateLimit (in-memory fallback)', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('allows request when under limits', async () => {
    const { checkRateLimit } = await import('../rate-limiter.js')
    const result = await checkRateLimit('192.168.1.100')

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('blocks request when IP limit exceeded', async () => {
    const { checkRateLimit } = await import('../rate-limiter.js')

    await checkRateLimit('192.168.1.200')
    await checkRateLimit('192.168.1.200')
    await checkRateLimit('192.168.1.200')
    const result = await checkRateLimit('192.168.1.200')

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('tracks different IPs independently', async () => {
    const { checkRateLimit } = await import('../rate-limiter.js')

    await checkRateLimit('192.168.1.300')
    const result = await checkRateLimit('192.168.1.301')

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })
})
