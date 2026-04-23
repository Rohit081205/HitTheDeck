'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

import { MenuBar, MenuItem } from '@/components/ui/animated-menu-bar'

export function NavWrapper({ active, onSelect }: { active?: MenuItem; onSelect?: (val: MenuItem) => void }) {
  return (
    <nav className="sticky top-0 z-50 px-4 md:px-8 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left Side: Logo + Status */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 no-underline group">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-zinc-950 font-black text-sm group-hover:scale-105 transition-transform">
              H
            </div>
            <span className="text-[17px] font-bold text-zinc-50 tracking-tight">HitTheDeck</span>
          </a>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live IQ Engine</span>
          </div>
        </div>

        {/* Right Side: Navigation or Secondary Actions if needed */}
        <div className="flex items-center gap-4">
           {/* We can add a simple 'Back to Browse' button here if viewMode is 'detail' 
               but for now let's keep it clean as requested. */}
           <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hidden sm:block">
              IPL 2024 Intelligence
           </div>
        </div>
      </div>
    </nav>
  )
}
