"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { LiquidCard, CardContent, CardHeader } from "@/components/ui/liquid-glass-card"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import type { Ground } from "@/lib/grounds"

// Types and Enums
enum Strength {
  None = "none",
  Weak = "weak",
  Moderate = "moderate",
  Strong = "strong",
}

interface FinancialScoreProps {
  title: string
  description: string
  score: number | null
}

interface FinancialScoreCardProps {
  children?: React.ReactNode
}

interface FinancialScoreDisplayProps {
  value: number | null
  max: number
}

interface FinancialScoreHalfCircleProps {
  value: number | null
  max: number
}

interface FinancialScoreHeaderProps {
  title?: string
  strength?: Strength
}

type CounterContextType = {
  getNextIndex: () => number
}

// Utils Class
class Utils {
  static LOCALE = "en-US"

  static easings = {
    easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    easeOut: "cubic-bezier(0.33, 1, 0.68, 1)",
  }

  static circumference(r: number): number {
    return 2 * Math.PI * r
  }

  static formatNumber(n: number) {
    return new Intl.NumberFormat(this.LOCALE).format(n)
  }

  static getStrength(score: number | null, maxScore: number): Strength {
    if (score === null) return Strength.None

    const percent = score / maxScore

    if (percent >= 0.8) return Strength.Strong
    if (percent >= 0.4) return Strength.Moderate

    return Strength.Weak
  }

  static randomHash(length = 4): string {
    const chars = "abcdef0123456789"
    const bytes = crypto.getRandomValues(new Uint8Array(length))

    return [...bytes].map((b) => chars[b % chars.length]).join("")
  }
}

// Context
const CounterContext = createContext<CounterContextType | undefined>(undefined)

const CounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const counterRef = useRef(0)
  const getNextIndex = useCallback(() => {
    return counterRef.current++
  }, [])

  return <CounterContext.Provider value={{ getNextIndex }}>{children}</CounterContext.Provider>
}

const useCounter = () => {
  const context = useContext(CounterContext)

  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider")
  }

  return context.getNextIndex
}

// Components
function FinancialScoreCard({ children }: FinancialScoreCardProps) {
  const getNextIndex = useCounter()
  const indexRef = useRef<number | null>(null)
  const animationRef = useRef(0)
  const [appearing, setAppearing] = useState(false)

  if (indexRef.current === null) {
    indexRef.current = getNextIndex()
  }

  useEffect(() => {
    const delayInc = 150
    const delay = 100 + indexRef.current! * delayInc

    animationRef.current = window.setTimeout(() => setAppearing(true), delay)

    return () => {
      window.clearTimeout(animationRef.current)
    }
  }, [])

  if (!appearing) return null

  return (
    <LiquidCard className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-800 fill-mode-both border-white/5 bg-zinc-900/10">
      <CardContent className="p-8">{children}</CardContent>
    </LiquidCard>
  )
}

function FinancialScoreDisplay({ value, max }: FinancialScoreDisplayProps) {
  const hasValue = value !== null
  const digits = hasValue ? String(Math.floor(value!)).split("") : []
  const maxFormatted = Utils.formatNumber(max)
  const label = hasValue ? `out of ${maxFormatted}` : "No stats"

  return (
    <div className="absolute bottom-0 w-full text-center">
      <div className="text-4xl font-bold h-15 overflow-hidden relative text-zinc-50">
        <div className="absolute inset-x-0 bottom-0 opacity-0">
          <div className="inline-block tracking-tighter w-full text-center">0</div>
        </div>
        <div className="absolute inset-x-0 bottom-0 tracking-tighter w-full text-center flex justify-center">
          {hasValue &&
            digits.map((digit, i) => (
              <span
                key={i}
                className="inline-block animate-in slide-in-from-bottom-full duration-800 fill-mode-both"
                style={{
                  animationDelay: `${100 + i * 50}ms`,
                  animationDuration: `${600 + i * 200}ms`,
                }}
              >
                {digit}
              </span>
            ))}
        </div>
      </div>
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{label}</div>
    </div>
  )
}

function FinancialScoreHalfCircle({ value, max }: FinancialScoreHalfCircleProps) {
  const strokeRef = useRef<SVGCircleElement>(null)
  const gradIdRef = useRef(`grad-${Utils.randomHash()}`)
  const gradId = gradIdRef.current
  const gradStroke = `url(#${gradId})`
  const radius = 45
  const dist = Utils.circumference(radius)
  const distHalf = dist / 2
  const strokeDasharray = `${distHalf} ${distHalf}`
  const distForValue = value !== null ? Math.min(value / max, 1) * -distHalf : -distHalf / 2
  const strength = Utils.getStrength(value, max)
  
  const strengthColors: Record<Strength, string[]> = {
    none: ["hsl(240, 5%, 33%)", "hsl(240, 5%, 20%)"],
    weak: ["#ef4444", "#991b1b"], // Red
    moderate: ["#f59e0b", "#92400e"], // Amber
    strong: ["#2dd4bf", "#115e59"], // Teal
  }
  const colorStops = strengthColors[strength]

  useEffect(() => {
    const strokeStart = 200
    const duration = 1000

    strokeRef.current?.animate(
      [
        { strokeDashoffset: "0", offset: 0 },
        { strokeDashoffset: "0", offset: strokeStart / duration },
        { strokeDashoffset: distForValue.toString() },
      ],
      {
        duration,
        easing: Utils.easings.easeInOut,
        fill: "forwards",
      },
    )
  }, [value, max, distForValue])

  return (
    <svg className="block mx-auto w-auto max-w-full h-32" viewBox="0 0 100 50" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          {colorStops.map((stop, i) => {
            const offset = `${(100 / (colorStops.length - 1)) * i}%`
            return <stop key={i} offset={offset} stopColor={stop} />
          })}
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="8" transform="translate(50, 50.5)">
        <circle className="stroke-white/5" r={radius} />
        <circle ref={strokeRef} stroke={gradStroke} strokeDasharray={strokeDasharray} r={radius} />
      </g>
    </svg>
  )
}

function FinancialScoreHeader({ title, strength }: FinancialScoreHeaderProps) {
  const hasStrength = strength !== Strength.None

  const getBadgeClassName = (strength: Strength | undefined) => {
    switch (strength) {
      case Strength.Weak:
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case Strength.Moderate:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case Strength.Strong:
        return "bg-teal-500/10 text-teal-400 border-teal-500/20"
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
    }
  }

  return (
    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-6 px-0 animate-in fade-in slide-in-from-bottom-8 duration-800">
      <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">{title}</h2>
      {hasStrength && (
        <div
          className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shrink-0 ${getBadgeClassName(strength)}`}
        >
          {strength}
        </div>
      )}
    </CardHeader>
  )
}

function FinancialScore({ title, description, score }: FinancialScoreProps) {
  const max = 100
  const strength = Utils.getStrength(score, max)

  return (
    <FinancialScoreCard>
      <FinancialScoreHeader title={title} strength={strength} />
      <div className="relative mb-6">
        <FinancialScoreHalfCircle value={score} max={max} />
        <FinancialScoreDisplay value={score} max={max} />
      </div>
      <p className="text-zinc-500 text-[11px] text-center min-h-[3rem] leading-relaxed">
        {description}
      </p>
    </FinancialScoreCard>
  )
}

// Main Component
export function FinancialScoreCards({ ground }: { ground: Ground }) {
  // Logic to map ground traits to the three score types
  
  // 1. Ground Stability (Average of Spin and Deterioration - lower deterioration is actually more stable, 
  // but in our traits high Deterioration means it crumbles. 
  // Let's use 100 - Deterioration as a stability metric)
  const groundStability = Math.round((ground.traits.Spin + (100 - ground.traits.Deterioration)) / 2)
  
  // 2. Pace & Bounce Rating
  const paceBounce = Math.round((ground.traits.Pace + ground.traits.Bounce) / 2)
  
  // 3. Technical Difficulty (weighted average)
  const technicalDiff = Math.round((ground.traits.Spin * 0.4 + ground.traits.Swing * 0.3 + ground.traits.Deterioration * 0.3))

  const adaptiveData = [
    {
      title: "Ground Stability",
      description: "Propensity for the pitch to hold its character over time.",
      score: groundStability,
    },
    {
      title: "Hard Surface Rating",
      description: "Combined metric of pace and vertical carry assistance.",
      score: paceBounce,
    },
    {
      title: "Technical Difficulty",
      description: "Overall skill floor required to survive on this surface.",
      score: technicalDiff,
    },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mx-auto py-2 px-0 bg-transparent">
      <CounterProvider>
        {adaptiveData.map((card, i) => (
          <FinancialScore key={ground.id + i} {...card} />
        ))}
      </CounterProvider>
    </div>
  )
}
