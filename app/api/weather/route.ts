import { NextRequest, NextResponse } from 'next/server'
import { GROUNDS } from '@/lib/grounds'

// Safety: Derive allowlist directly from ground data
const ALLOWED_CITIES = new Set(GROUNDS.map(g => g.city))

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city') ?? ''
  
  // 1. SSRF & Territory Protection
  if (!city || !ALLOWED_CITIES.has(city)) {
    return NextResponse.json({ error: 'Unauthorized location query' }, { status: 403 })
  }

  try {
    const r = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
      next: { revalidate: 300 }, // cache for 5 minutes
    })
    
    if (!r.ok) throw new Error(`Weather service unavailable`)
    
    const data = await r.json()
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Weather fetch failed'
    console.error('[weather] error:', message)
    return NextResponse.json({ error: 'Failed to synchronize weather data' }, { status: 502 })
  }
}
