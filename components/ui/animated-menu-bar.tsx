'use client'

import React from 'react'
import { Map, BotMessageSquare } from 'lucide-react'

export type MenuItem = 'grounds' | 'scout'

interface MenuBarProps {
  active?: MenuItem
  onSelect?: (key: MenuItem) => void
}

interface IconButtonProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

const IconButton: React.FC<IconButtonProps> = ({ icon, label, active, onClick }) => {
  const [hovered, setHovered] = React.useState(false)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const tooltipTimeout = React.useRef<NodeJS.Timeout | null>(null)

  // Calculate width based on label length (min 32px for icon, plus label)
  const expandedWidth = Math.max(32 + label.length * 7 + 24, 100)

  const isExpanded = hovered || active

  const handleMobileTooltip = (e: React.MouseEvent) => {
    if (window.innerWidth < 640) {
      e.preventDefault()
      setShowTooltip(true)
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current)
      tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 1200)
    }
    if (onClick) onClick()
  }

  React.useEffect(
    () => () => {
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current)
    },
    []
  )

  return (
    <button
      type="button"
      aria-label={label}
      className={`flex items-center rounded-lg border transition-colors focus:outline-none relative overflow-visible
        ${
          active
            ? 'border-zinc-400 bg-zinc-900 text-white font-semibold'
            : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/60'
        }
        duration-300 w-8 sm:w-auto px-0 sm:px-3 justify-center sm:justify-start bg-transparent
      `}
      style={{
        minWidth: 32,
        minHeight: 32,
        transition: 'background 0.2s, border 0.2s',
        paddingTop: 6,
        paddingBottom: 6,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleMobileTooltip}
    >
      {/* Tooltip for mobile view */}
      <span
        className={`sm:hidden absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-zinc-900 text-[10px] rounded px-2 py-1 shadow transition-opacity duration-200 pointer-events-none z-20 ${
          showTooltip ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {label}
      </span>
      <span className="flex items-center justify-center w-8 h-8 pointer-events-none">{icon}</span>
      <span
        className={`text-[12px] font-medium tracking-tight transition-all duration-300 whitespace-nowrap pointer-events-none ml-1.5 hidden sm:inline ${
          isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
        }`}
        style={{
          transition: 'opacity 0.3s, width 0.35s cubic-bezier(0.4,0,0.2,1), margin 0.3s',
          width: isExpanded ? expandedWidth - 32 - 24 : 0,
        }}
      >
        {label}
      </span>
    </button>
  )
}

export const MenuBar = ({ active = 'grounds', onSelect }: MenuBarProps) => {
  return (
    <nav className="flex items-center gap-1 bg-zinc-950/40 p-1 rounded-xl border border-zinc-800/60 w-fit transition-all duration-300">
      <IconButton
        icon={<Map size={16} strokeWidth={1.5} />}
        label="Grounds"
        active={active === 'grounds'}
        onClick={() => onSelect?.('grounds')}
      />
      <div className="w-px h-4 bg-zinc-800 mx-1" />
      <IconButton
        icon={<BotMessageSquare size={16} strokeWidth={1.5} />}
        label="Scout Room"
        active={active === 'scout'}
        onClick={() => onSelect?.('scout')}
      />
    </nav>
  )
}
