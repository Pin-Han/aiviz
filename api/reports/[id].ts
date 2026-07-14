import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRedis } from '../_lib/redis.js'

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Missing report ID' })
    return
  }

  const redis = getRedis()
  if (!redis) {
    res.status(503).json({ error: 'Storage not configured' })
    return
  }

  const data = await redis.get<string>(`report:${id}`)
  if (!data) {
    res.status(404).json({ error: 'Report not found or expired' })
    return
  }

  // Upstash may return parsed object or string depending on what was stored
  const report = typeof data === 'string' ? JSON.parse(data) : data

  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.status(200).json(report)
}
