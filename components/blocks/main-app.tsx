'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GROUNDS, type Ground } from '@/lib/grounds'
import { MenuBar, type MenuItem } from '@/components/ui/animated-menu-bar'
import { GroundsView } from '@/components/blocks/app-shell'

/* ── Shared Weather types ── */
export type WeatherData = {
  temp: string
  feels: string
  hum: number
  wind: number
  desc: string
  highDew: boolean
  code: string
}

import { FeatureCarousel } from '@/components/ui/feature-carousel'
import { ArrowLeft } from 'lucide-react'
import { NavWrapper } from '@/components/blocks/nav'
import ScrollMorphHero from '@/components/ui/scroll-morph-hero'
import { FloatingAiAssistant } from '@/components/ui/glowing-ai-chat-assistant'
import { useCallback } from 'react'

export function MainApp() {
  const [viewMode, setViewMode] = useState<'browse' | 'detail'>('browse')
  const [activeTab, setActiveTab] = useState<MenuItem>('grounds')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherError, setWeatherError] = useState(false)
  const [scoutLoading, setScoutLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([])

  const ground = GROUNDS[currentIdx]

  /* Fetch weather on ground change */
  useEffect(() => {
    if (viewMode !== 'detail') return
    setWeather(null)
    setWeatherError(false)
    let cancelled = false

    fetch(`/api/weather?city=${encodeURIComponent(ground.city)}`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((d) => {
        if (cancelled) return
        const cur = d.current_condition?.[0]
        if (!cur) throw new Error()
        const hum = parseInt(cur.humidity)
        setWeather({
          temp: cur.temp_C,
          feels: cur.FeelsLikeC,
          hum,
          wind: Math.round(parseInt(cur.windspeedKmph)),
          desc: cur.weatherDesc?.[0]?.value ?? '',
          highDew: hum > 72,
          code: cur.weatherCode,
        })
      })
      .catch(() => {
        if (!cancelled) setWeatherError(true)
      })

    return () => {
      cancelled = true
    }
  }, [ground.city, viewMode])

  const handleScoutQuery = async (query: string) => {
    if (!query.trim() || scoutLoading) return
    setScoutLoading(true)
    
    try {
      const r = await fetch('/api/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: query, 
          groundId: ground.id,
          weatherData: weather,
          chatHistory: chatHistory.slice(-6)
        }),
      })
      
      const data = await r.json()
      
      if (r.status === 429) {
        alert("Scout: You are sending too many questions. Please wait a minute.")
        return
      }

      if (!r.ok) {
        throw new Error(data.error || 'Intelligence engine offline.')
      }
      
      setChatHistory(prev => [...prev, {role: 'user', content: query}, {role: 'assistant', content: data.text}])

    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Scout failed to respond.")
    } finally {
      setScoutLoading(false)
    }
  }

  /* Reset chat history when ground changes */
  useEffect(() => {
    setChatHistory([])
  }, [ground.id])

  const handleSelectGround = (idx: number) => {
    setCurrentIdx(idx)
    setActiveTab('grounds')
    setViewMode('detail')
    // Reset scroll to top of appSection so detail view is visible quickly
    setTimeout(() => {
      document.getElementById('appSection')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const handleBackToBrowse = () => {
    setViewMode('browse')
    setTimeout(() => {
      document.getElementById('appSection')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <>
      {viewMode === 'browse' && (
        <>
          <div className="h-screen w-full relative">
             <ScrollMorphHero onExplore={() => document.getElementById('appSection')?.scrollIntoView({ behavior: 'smooth' })} />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </>
      )}
      <div className="max-w-[1240px] mx-auto px-6 pt-16 pb-32 relative min-h-screen" id="appSection">
        
        {viewMode === 'browse' && (
          <div className="flex flex-col gap-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-zinc-50 mb-2">Ground Selection</h2>
              <p className="text-sm text-zinc-400">Cycle through the venues to explore live intelligence and AI scouting.</p>
            </div>
            
            <FeatureCarousel 
              grounds={GROUNDS} 
              onSelectGround={handleSelectGround} 
            />
          </div>
        )}

        {viewMode === 'detail' && (
          <>
            <button
              onClick={handleBackToBrowse}
              className="mb-8 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-50 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5 cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Selection
            </button>
            <AnimatePresence mode="wait">
              {activeTab === 'grounds' && (
                <motion.div
                  key="grounds"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <GroundsView
                    ground={ground}
                    weather={weather}
                    weatherError={weatherError}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingAiAssistant 
              groundName={ground.name}
              loading={scoutLoading}
              onSend={handleScoutQuery}
              messages={chatHistory}
            />
          </>
        )}
      </div>
    </>
  )
}
