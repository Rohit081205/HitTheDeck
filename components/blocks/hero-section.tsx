'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import InfiniteGallery from '@/components/ui/3d-gallery-photography'
import { GROUNDS } from '@/lib/grounds'

export function HeroSection({ onExplore }: { onExplore: () => void }) {
  const galleryImages = GROUNDS.map(g => ({ src: g.tsimage.url, alt: g.name }))

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* 3D Gallery Background - Layer 0 */}
      <div className="absolute inset-0 z-0 scale-110">
        <InfiniteGallery 
          images={galleryImages} 
          className="h-full w-full"
          visibleCount={10}
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950 z-[1] pointer-events-none" />
      </div>

      {/* 1. Wordmark Overlay (The Blend Layer) - Now Absolute and Medium Size */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-exclusion text-white z-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-center"
        >
          Pitch<span className="italic font-serif">Scout.</span>
        </motion.h1>
      </div>

      {/* 2. Hero UI Elements (Subtitle, Badge) - Clean and Transparent Layer */}
      <div className="relative z-30 flex flex-col items-center text-center px-6 max-w-6xl mt-64 md:mt-80 lg:mt-[28rem]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'circOut' }}
          className="mb-8"
        >
          <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            AI-Powered Ground Intelligence
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mb-12 leading-relaxed"
        >
          Deep intelligence on India's iconic cricket grounds — live weather, 
          pitch behavior, AI scout analysis, all in one place.
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer z-30 group"
        onClick={onExplore}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 group-hover:text-zinc-300 transition-colors">Explore Grounds</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
           <ChevronDown className="text-zinc-600 w-5 h-5 group-hover:text-teal-400 transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  )
}
