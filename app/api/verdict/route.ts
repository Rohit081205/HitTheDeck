import { NextRequest, NextResponse } from 'next/server'
import { GROUNDS } from '@/lib/grounds'
import { headers } from 'next/headers'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Reuse rate limiter from scout (shared map for simplicity)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const LIMIT = 5  // Tighter limit — verdicts are expensive
const WINDOW = 60 * 1000

function getRateLimit(ip: string) {
  const now = Date.now()
  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now }
  if (now - record.lastReset > WINDOW) {
    record.count = 1
    record.lastReset = now
    rateLimitMap.set(ip, record)
    return true
  }
  if (record.count >= LIMIT) return false
  record.count++
  rateLimitMap.set(ip, record)
  return true
}

const VALID_FORMATS = ['Test', 'ODI', 'T20']

const TEAMS = [
  'India', 'Australia', 'England', 'South Africa', 'New Zealand',
  'Pakistan', 'Sri Lanka', 'Bangladesh', 'West Indies', 'Afghanistan',
  'Ireland', 'Zimbabwe', 'Netherlands', 'Scotland', 'Nepal',
  // IPL teams
  'Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bengaluru',
  'Kolkata Knight Riders', 'Delhi Capitals', 'Rajasthan Royals',
  'Punjab Kings', 'Sunrisers Hyderabad', 'Gujarat Titans', 'Lucknow Super Giants',
]

export async function POST(req: NextRequest) {
  try {
    const forwarded = (await headers()).get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'anonymous'
    if (!getRateLimit(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    const { groundId, matchDate, format, teamA, teamB, weatherData } = await req.json()

    // Validation
    if (!groundId || !matchDate || !format || !teamA || !teamB) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (!VALID_FORMATS.includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }
    if (!TEAMS.includes(teamA) || !TEAMS.includes(teamB)) {
      return NextResponse.json({ error: 'Invalid team selection' }, { status: 400 })
    }
    if (teamA === teamB) {
      return NextResponse.json({ error: 'Teams must be different' }, { status: 400 })
    }

    const ground = GROUNDS.find(g => g.id === groundId)
    if (!ground) {
      return NextResponse.json({ error: 'Invalid ground' }, { status: 400 })
    }

    // Sanitize date
    const sanitizedDate = matchDate.replace(/[<>{}]/g, '').slice(0, 20)

    const wx = weatherData
      ? `LIVE WEATHER at ${ground.city}: ${weatherData.temp}°C, feels ${weatherData.feels}°C, ${weatherData.desc}, humidity ${weatherData.hum}%, wind ${weatherData.wind} km/h. Dew risk: ${weatherData.highDew ? 'HIGH' : 'LOW'}.`
      : 'Live weather unavailable.'

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 })
    }

    const systemPrompt = `You are HitTheDeck Verdict Engine — the world's most authoritative pre-match cricket pitch intelligence system.

GROUND DATA:
Name: ${ground.name} (${ground.short}), ${ground.city}. Est: ${ground.est}. Capacity: ${ground.cap}.
Traits — Spin: ${ground.traits.Spin}/100, Pace: ${ground.traits.Pace}/100, Bounce: ${ground.traits.Bounce}/100, Swing: ${ground.traits.Swing}/100, Deterioration: ${ground.traits.Deterioration}/100
Character: ${ground.narrative}
Innings Behaviour: ${ground.innings.map((i: any) => i.num + ': ' + i.label + ' (' + i.note + ')').join(' | ')}
Intel: ${ground.intel.map((i: any) => i.label + ': ' + i.value).join(' | ')}

${wx}

MATCH CONTEXT:
Date: ${sanitizedDate}
Format: ${format}
${teamA} vs ${teamB}

YOUR TASK:
Generate a comprehensive Pre-Match Pitch Verdict. Structure your response EXACTLY as follows using these headers (use ** for bold):

**SURFACE ASSESSMENT**
2-3 sentences about the expected pitch condition on match day based on ground traits and weather.

**DEW & CONDITIONS TIMELINE**
Predict hour-by-hour: when will dew set in? When is swing at its peak? When does spin become ineffective? Be specific with over numbers for T20/ODI or session references for Tests.

**${teamA.toUpperCase()} ADVANTAGE**
2-3 specific tactical advantages this team has at this venue in this format. Reference player types or historical data.

**${teamB.toUpperCase()} ADVANTAGE**
Same for the other team.

**TOSS VERDICT**
Clear recommendation: bat first or bowl first, and WHY. Be decisive, not wishy-washy.

**FINAL VERDICT**
One powerful, quotable sentence summarizing the entire match prediction. This should read like a broadcast expert's pre-match verdict.

Write with authority. Use cricket terminology. Be specific and decisive — never hedge. Maximum 400 words total.`

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: `Generate the Pre-Match Pitch Verdict for ${teamA} vs ${teamB} at ${ground.name} on ${sanitizedDate} (${format}).` }] }],
          generationConfig: { maxOutputTokens: 1500, temperature: 0.8 },
        }),
      }
    )

    if (!r.ok) {
      const errData = await r.json().catch(() => ({}))
      console.error('[verdict] gemini error:', errData)
      throw new Error('Verdict engine error')
    }

    const data = await r.json()
    const text = data.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? '')
      .join('') ?? ''

    return NextResponse.json({ text })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[verdict] error:', message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
