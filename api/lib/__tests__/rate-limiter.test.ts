import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkRateLimit } from '../rate-limiter.js'

const mockGet = vi.fn()
const mockIncr = vi.fn()
const mockExpire = vi.fn()

vi.mock('@vercel/kv', () => ({
  kv: {
    get: (...args: unknown[]) => mockGet(...args),
    incr: (...args: unknown[]) => mockIncr(...args),
    expire: (...args: unknown[]) => mockExpire(...args),
  },
}))

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows request when under limits', async () => {
    mockGet.mockResolvedValue(null)
    mockIncr.mockResolvedValue(1)

    const result = await checkRateLimit('192.168.1.1')

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('blocks request when IP limit exceeded', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key.startsWith('rate:ip:')) return Promise.resolve(3)
      return Promise.resolve(10)
    })

    const result = await checkRateLimit('192.168.1.1')

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('blocks request when global limit exceeded', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key.startsWith('rate:ip:')) return Promise.resolve(1)
      if (key === 'rate:global') return Promise.resolve(500)
      return Promise.resolve(null)
    })

    const result = await checkRateLimit('192.168.1.1')

    expect(result.allowed).toBe(false)
  })
})
