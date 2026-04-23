'use client'

import React, { useState } from 'react'
import { type Ground } from '@/lib/grounds'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Users, Calendar, Shield, Loader2, ChevronDown, Trophy, Wind, Target, Swords } from 'lucide-react'
import type { WeatherData } from '@/components/blocks/main-app'

const TEAMS = [
  'India', 'Australia', 'England', 'South Africa', 'New Zealand',
  'Pakistan', 'Sri Lanka', 'Bangladesh', 'West Indies', 'Afghanistan',
  'Ireland', 'Zimbabwe', 'Netherlands', 'Scotland', 'Nepal',
  // IPL
  'Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bengaluru',
  'Kolkata Knight Riders', 'Delhi Capitals', 'Rajasthan Royals',
  'Punjab Kings', 'Sunrisers Hyderabad', 'Gujarat Titans', 'Lucknow Super Giants',
]

const FORMATS = ['Test', 'ODI', 'T20']

// Parse the structured verdict into sections
function parseVerdict(raw: string): { title: string; body: string }[] {
  const sections: { title: string; body: string }[] = []
  // Split by **HEADER** pattern
  const parts = raw.split(/\*\*([^*]+)\*\*/)
  
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i]?.trim()
    const body = parts[i + 1]?.trim()
    if (title && body) {
      sections.push({ title, body })
    }
  }
  
  return sections.length > 0 ? sections : [{ title: 'VERDICT', body: raw }]
}

function getSectionIcon(title: string) {
  const t = title.toLowerCase()
  if (t.includes('surface')) return <Target className="w-4 h-4" />
  if (t.includes('dew') || t.includes('condition') || t.includes('timeline')) return <Wind className="w-4 h-4" />
  if (t.includes('advantage')) return <Shield className="w-4 h-4" />
  if (t.includes('toss')) return <Trophy className="w-4 h-4" />
  if (t.includes('final')) return <Zap className="w-4 h-4" />
  return <Swords className="w-4 h-4" />
}

function getSectionColor(title: string) {
  const t = title.toLowerCase()
  if (t.includes('surface')) return 'teal'
  if (t.includes('dew') || t.includes('timeline')) return 'blue'
  if (t.includes('toss')) return 'amber'
  if (t.includes('final')) return 'red'
  return 'indigo'
}

// ── Custom Select ──
function Select({ value, onChange, options, placeholder, icon }: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  icon?: React.ReactNode
}) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">{icon}</div>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none bg-white/[0.03] border border-white/10 rounded-xl text-sm font-medium text-zinc-200 transition-all",
          "hover:border-white/20 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/20",
          icon ? "pl-9 pr-10 py-3" : "pl-4 pr-10 py-3"
        )}
      >
        <option value="" disabled className="bg-zinc-900 text-zinc-400">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-zinc-900 text-zinc-200">{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
    </div>
  )
}

// ── Main Export ──
export function PitchVerdictGenerator({ ground, weather }: { ground: Ground; weather: WeatherData | null }) {
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [format, setFormat] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [verdict, setVerdict] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = teamA && teamB && format && matchDate && teamA !== teamB && !loading

  const handleGenerate = async () => {
    if (!canSubmit) return
    setLoading(true)
    setVerdict(null)
    setError(null)

    try {
      const r = await fetch('/api/verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groundId: ground.id,
          matchDate,
          format,
          teamA,
          teamB,
          weatherData: weather,
        }),
      })

      if (r.status === 429) {
        setError('Too many requests. Please wait a minute.')
        return
      }

      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Verdict engine failed.')
      setVerdict(data.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate verdict.')
    } finally {
      setLoading(false)
    }
  }

  const sections = verdict ? parseVerdict(verdict) : []

  return (
    <div className="w-full rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
      
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-500">Pre-Match Intelligence</h3>
            <p className="text-lg font-bold text-white">Pitch Verdict Generator</p>
          </div>
        </div>
        <p className="text-[13px] text-zinc-500 mt-2 leading-relaxed max-w-lg">
          Enter the match details below. HitTheDeck will combine live weather, ground history, and tactical analysis to generate a comprehensive pre-match verdict.
        </p>
      </div>

      {/* Form */}
      <div className="px-8 py-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select value={teamA} onChange={setTeamA} options={TEAMS} placeholder="Select Team A" icon={<Shield className="w-4 h-4" />} />
          <Select value={teamB} onChange={setTeamB} options={TEAMS.filter(t => t !== teamA)} placeholder="Select Team B" icon={<Shield className="w-4 h-4" />} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select value={format} onChange={setFormat} options={FORMATS} placeholder="Select Format" icon={<Trophy className="w-4 h-4" />} />
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="date"
              value={matchDate}
              onChange={e => setMatchDate(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl text-sm font-medium text-zinc-200 pl-9 pr-4 py-3 hover:border-white/20 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/20 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Venue Badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] rounded-xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">Venue</span>
          <span className="text-sm font-bold text-white ml-1">{ground.name}, {ground.city}</span>
        </div>

        {/* Warning if same teams or missing info */}
        {teamA && teamB && teamA === teamB && (
          <p className="text-xs text-red-400 font-medium">Teams must be different.</p>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canSubmit}
          className={cn(
            "w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-2",
            canSubmit
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] cursor-pointer"
              : "bg-white/[0.02] text-zinc-600 border-white/5 cursor-not-allowed"
          )}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating Verdict...</>
          ) : (
            <><Zap className="w-4 h-4" /> Generate Pitch Verdict</>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-8 pb-6">
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        </div>
      )}

      {/* Verdict Output */}
      <AnimatePresence>
        {verdict && sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="border-t border-white/5"
          >
            {/* Verdict Title Bar */}
            <div className="px-8 py-5 bg-amber-500/[0.03] border-b border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-amber-400">
                {ground.short} · {teamA} vs {teamB} · {format}
              </span>
            </div>

            {/* Sections */}
            <div className="px-8 py-6 space-y-5">
              {sections.map((section, idx) => {
                const color = getSectionColor(section.title)
                const isFinal = section.title.toLowerCase().includes('final')
                
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "rounded-2xl border p-5 transition-all",
                      isFinal
                        ? "bg-amber-500/[0.06] border-amber-500/20"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={cn(
                        "p-1.5 rounded-lg",
                        `bg-${color}-500/10 text-${color}-400`
                      )}
                      style={{
                        backgroundColor: color === 'teal' ? 'rgba(20,184,166,0.1)' : color === 'blue' ? 'rgba(59,130,246,0.1)' : color === 'amber' ? 'rgba(245,158,11,0.1)' : color === 'red' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                        color: color === 'teal' ? '#14b8a6' : color === 'blue' ? '#3b82f6' : color === 'amber' ? '#f59e0b' : color === 'red' ? '#ef4444' : '#6366f1',
                      }}
                      >
                        {getSectionIcon(section.title)}
                      </div>
                      <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400">{section.title}</h4>
                    </div>
                    <p className={cn(
                      "text-[14px] leading-relaxed font-medium",
                      isFinal ? "text-amber-200" : "text-zinc-300"
                    )}>
                      {section.body}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
