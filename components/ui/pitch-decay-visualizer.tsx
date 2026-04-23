'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { type Ground } from '@/lib/grounds'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Sun, Moon, CloudRain, Droplets, Wind, Thermometer, Clock } from 'lucide-react'

/* ─────────────────────────────────────────────────
   Pitch Decay Visualizer
   
   A living, animated timeline showing how a cricket
   pitch transforms hour-by-hour across a match day.
   Morning hardness → Afternoon drying → Evening dew.
   ───────────────────────────────────────────────── */

// ── Time Phases ──
type TimePhase = {
  hour: string         // Display label  e.g. "9 AM"
  hourNum: number      // 0-based index for interpolation
  period: 'morning' | 'afternoon' | 'evening' | 'night'
  icon: React.ReactNode
  label: string        // Human-readable state
  hardness: number     // 0–100  (100 = rock hard)
  moisture: number     // 0–100  (100 = soaking)
  crackIndex: number   // 0–100  (visible cracks)
  dewLevel: number     // 0–100
  spinGrip: number     // 0–100
  seam: number         // 0–100
}

function generatePhases(ground: Ground): TimePhase[] {
  const { Spin, Pace, Bounce, Deterioration } = ground.traits

  // Base decay curve shaped by the ground's character
  const highDet = Deterioration / 100
  const spinBias = Spin / 100
  const paceBias = Pace / 100

  return [
    {
      hour: '9 AM', hourNum: 0, period: 'morning',
      icon: <Sun className="w-4 h-4" />,
      label: 'Fresh Surface',
      hardness: 85 + paceBias * 10,
      moisture: 60 - highDet * 20,
      crackIndex: 5 + highDet * 10,
      dewLevel: 15,
      spinGrip: 10 + spinBias * 15,
      seam: 70 + paceBias * 20,
    },
    {
      hour: '11 AM', hourNum: 1, period: 'morning',
      icon: <Sun className="w-4 h-4" />,
      label: 'Hardening',
      hardness: 90 + paceBias * 8,
      moisture: 35 - highDet * 10,
      crackIndex: 12 + highDet * 15,
      dewLevel: 5,
      spinGrip: 18 + spinBias * 20,
      seam: 60 + paceBias * 15,
    },
    {
      hour: '1 PM', hourNum: 2, period: 'afternoon',
      icon: <Sun className="w-4 h-4" />,
      label: 'Peak Bake',
      hardness: 75 - highDet * 15,
      moisture: 15 - highDet * 10,
      crackIndex: 30 + highDet * 30,
      dewLevel: 0,
      spinGrip: 35 + spinBias * 25,
      seam: 40 + paceBias * 10,
    },
    {
      hour: '3 PM', hourNum: 3, period: 'afternoon',
      icon: <Thermometer className="w-4 h-4" />,
      label: 'Crumbling',
      hardness: 60 - highDet * 20,
      moisture: 8,
      crackIndex: 50 + highDet * 30,
      dewLevel: 0,
      spinGrip: 55 + spinBias * 25,
      seam: 30 + paceBias * 5,
    },
    {
      hour: '5 PM', hourNum: 4, period: 'evening',
      icon: <Moon className="w-4 h-4" />,
      label: 'Dew Onset',
      hardness: 50 - highDet * 15,
      moisture: 30 + spinBias * 10,
      crackIndex: 60 + highDet * 25,
      dewLevel: 35,
      spinGrip: 50 + spinBias * 15,
      seam: 25 + paceBias * 10,
    },
    {
      hour: '7 PM', hourNum: 5, period: 'evening',
      icon: <Moon className="w-4 h-4" />,
      label: 'Under Lights',
      hardness: 45 - highDet * 10,
      moisture: 50 + spinBias * 15,
      crackIndex: 65 + highDet * 20,
      dewLevel: 60,
      spinGrip: 35 + spinBias * 10,
      seam: 45 + paceBias * 15,
    },
    {
      hour: '9 PM', hourNum: 6, period: 'night',
      icon: <Moon className="w-4 h-4" />,
      label: 'Heavy Dew',
      hardness: 40 - highDet * 10,
      moisture: 70 + spinBias * 10,
      crackIndex: 70 + highDet * 15,
      dewLevel: 85,
      spinGrip: 20 + spinBias * 5,
      seam: 35 + paceBias * 10,
    },
  ]
}

// ── Animated Gauge Bar ──
function DecayBar({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)))
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-500">{label}</span>
        <span className="text-[11px] font-bold text-zinc-300 tabular-nums">{clamped}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, delay, ease: 'circOut' }}
          style={{ background: color }}
        >
          {/* Glow */}
          <div className="absolute inset-0 blur-sm opacity-40" style={{ background: color }} />
        </motion.div>
      </div>
    </div>
  )
}

// ── The Pitch Cross Section (SVG Canvas) ──
function PitchCrossSection({ phase }: { phase: TimePhase }) {
  const crackIntensity = phase.crackIndex / 100
  const moistureLevel = phase.moisture / 100
  const hardnessLevel = phase.hardness / 100
  const dewLevel = phase.dewLevel / 100

  // The pitch base color shifts from green/hard to brown/cracked
  const baseHue = 35 + hardnessLevel * 15 // Range from warm brown to slightly green
  const baseSat = 40 + (1 - crackIntensity) * 20
  const baseLightness = 25 + hardnessLevel * 12

  return (
    <div className="relative w-full h-[140px] rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/5">
      <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="none">
        {/* Sky Gradient */}
        <defs>
          <linearGradient id={`sky-${phase.hourNum}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={
              phase.period === 'morning' ? '#3b82f6' :
              phase.period === 'afternoon' ? '#f59e0b' :
              phase.period === 'evening' ? '#6366f1' : '#1e1b4b'
            } stopOpacity={0.3} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Dew gradient overlay */}
          <linearGradient id={`dew-${phase.hourNum}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="80%" stopColor="#14b8a6" stopOpacity={dewLevel * 0.25} />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity={dewLevel * 0.4} />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="400" height="60" fill={`url(#sky-${phase.hourNum})`} />

        {/* Ground Layer */}
        <rect 
          x="0" y="60" width="400" height="80" 
          fill={`hsl(${baseHue}, ${baseSat}%, ${baseLightness}%)`} 
        />

        {/* Soil Texture Noise Bands */}
        {[0, 1, 2, 3, 4].map(i => (
          <motion.rect
            key={i}
            x={i * 85 + 10} y={75 + i * 8}
            width={60 + Math.random() * 30} height={3}
            rx={1.5}
            fill={`hsl(${baseHue - 5}, ${baseSat - 10}%, ${baseLightness - 8}%)`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 + crackIntensity * 0.4 }}
            transition={{ duration: 0.5 }}
          />
        ))}

        {/* Crack Lines — more appear as crackIndex rises */}
        {Array.from({ length: Math.floor(crackIntensity * 12) }).map((_, i) => {
          const x1 = 30 + (i * 33) % 380
          const y1 = 68 + (i * 7) % 50
          const x2 = x1 + 8 + Math.sin(i) * 15
          const y2 = y1 + 10 + Math.cos(i) * 8
          return (
            <motion.line
              key={`crack-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={`hsl(${baseHue - 10}, ${baseSat}%, ${baseLightness - 15}%)`}
              strokeWidth={1 + crackIntensity}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 + crackIntensity * 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            />
          )
        })}

        {/* Moisture Sheen */}
        <motion.rect
          x="0" y="60" width="400" height="80"
          fill={`url(#dew-${phase.hourNum})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: moistureLevel }}
          transition={{ duration: 0.8 }}
        />

        {/* Dew Droplets */}
        {dewLevel > 0.2 && Array.from({ length: Math.floor(dewLevel * 15) }).map((_, i) => (
          <motion.circle
            key={`dew-${i}`}
            cx={20 + (i * 29) % 380}
            cy={65 + (i * 11) % 60}
            r={1.5}
            fill="#5eead4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3 + dewLevel * 0.5, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.03, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1.5 + Math.random() * 2 }}
          />
        ))}

        {/* Pitch Line */}
        <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

        {/* Horizon glow for evening/night */}
        {(phase.period === 'evening' || phase.period === 'night') && (
          <motion.ellipse
            cx="200" cy="60" rx="200" ry="20"
            fill="#f59e0b"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            transition={{ duration: 1 }}
          />
        )}
      </svg>

      {/* Period Badge */}
      <div className="absolute top-3 right-3">
        <div className={cn(
          "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border backdrop-blur-sm",
          phase.period === 'morning' && "bg-amber-500/10 text-amber-400 border-amber-500/20",
          phase.period === 'afternoon' && "bg-orange-500/10 text-orange-400 border-orange-500/20",
          phase.period === 'evening' && "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          phase.period === 'night' && "bg-violet-500/10 text-violet-400 border-violet-500/20",
        )}>
          {phase.period}
        </div>
      </div>
    </div>
  )
}

// ── Main Export ──
export function PitchDecayVisualizer({ ground }: { ground: Ground }) {
  const phases = useMemo(() => generatePhases(ground), [ground])
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activePhase = phases[activeIdx]

  // Auto-play loop
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveIdx(prev => (prev + 1) % phases.length)
      }, 3000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, phases.length])

  // Manual click pauses auto-play
  const selectPhase = (idx: number) => {
    setActiveIdx(idx)
    setIsPlaying(false)
  }

  return (
    <div className="w-full rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">

      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-1">Pitch Decay Visualizer</h3>
          <p className="text-lg font-bold text-white">Hour-by-Hour Surface Evolution</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
            isPlaying
              ? "bg-teal-500/10 text-teal-400 border-teal-500/30"
              : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"
          )}
        >
          {isPlaying ? '● LIVE' : '▶ PLAY'}
        </button>
      </div>

      {/* Timeline Scrubber */}
      <div className="px-8 pb-4">
        <div className="relative flex items-center">
          {/* Track */}
          <div className="absolute left-0 right-0 h-[2px] bg-white/5 top-1/2 -translate-y-1/2 rounded-full" />
          <motion.div
            className="absolute h-[2px] bg-gradient-to-r from-teal-500 to-teal-400 top-1/2 -translate-y-1/2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(activeIdx / (phases.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          
          {/* Nodes */}
          <div className="relative flex justify-between w-full">
            {phases.map((phase, idx) => (
              <button
                key={phase.hour}
                onClick={() => selectPhase(idx)}
                className="flex flex-col items-center gap-2 group relative z-10"
              >
                <motion.div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300",
                    idx === activeIdx
                      ? "bg-teal-500/20 border-teal-500/50 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-110"
                      : idx < activeIdx
                      ? "bg-teal-500/10 border-teal-500/20 text-teal-500/60"
                      : "bg-white/[0.03] border-white/5 text-zinc-600 group-hover:border-white/15 group-hover:text-zinc-400"
                  )}
                  animate={idx === activeIdx ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {phase.icon}
                </motion.div>
                <span className={cn(
                  "text-[10px] font-bold tracking-wider transition-colors",
                  idx === activeIdx ? "text-teal-400" : "text-zinc-600"
                )}>
                  {phase.hour}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Phase Content */}
      <div className="px-8 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Phase Title */}
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2.5 rounded-xl border",
                activePhase.period === 'morning' && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                activePhase.period === 'afternoon' && "bg-orange-500/10 text-orange-400 border-orange-500/20",
                activePhase.period === 'evening' && "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                activePhase.period === 'night' && "bg-violet-500/10 text-violet-400 border-violet-500/20",
              )}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">{activePhase.label}</h4>
                <p className="text-[11px] font-bold tracking-widest uppercase text-zinc-500">
                  {activePhase.hour} · {activePhase.period}
                </p>
              </div>
            </div>

            {/* SVG Pitch Cross-Section */}
            <PitchCrossSection phase={activePhase} />

            {/* Decay Gauges */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DecayBar label="Hardness" value={activePhase.hardness} color="#f59e0b" delay={0} />
              <DecayBar label="Moisture" value={activePhase.moisture} color="#3b82f6" delay={0.05} />
              <DecayBar label="Crack Index" value={activePhase.crackIndex} color="#ef4444" delay={0.1} />
              <DecayBar label="Dew Level" value={activePhase.dewLevel} color="#14b8a6" delay={0.15} />
              <DecayBar label="Spin Grip" value={activePhase.spinGrip} color="#a855f7" delay={0.2} />
              <DecayBar label="Seam Movement" value={activePhase.seam} color="#f97316" delay={0.25} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
