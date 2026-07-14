import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomBytes } from 'crypto'
import { getRedis } from './_lib/redis.js'

const REPORT_TTL = 60 * 60 * 24 * 30 // 30 days

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const redis = getRedis()
  if (!redis) {
    res.status(503).json({ error: 'Storage not configured' })
    return
  }

  const { report } = req.body ?? {}
  if (!report || typeof report !== 'object') {
    res.status(400).json({ error: 'Missing report data' })
    return
  }

  const id = randomBytes(6).toString('base64url') // 8 chars, URL-safe
  await redis.set(`report:${id}`, JSON.stringify(report), { ex: REPORT_TTL })

  res.status(201).json({ id })
}
