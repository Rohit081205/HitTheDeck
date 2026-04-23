'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

/**
 * HitTheDeck Mascot — mesh-gradient blob with tracking eyes + blink.
 * Uses SVG with animated gradient fills (same shape as the prototype).
 */
export function Mascot() {
  const eyeLRef = useRef<SVGEllipseElement>(null)
  const eyeRRef = useRef<SVGEllipseElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const MAX = 9

  const track = useCallback(
    (cx: number, cy: number) => {
      const svg = svgRef.current
      if (!svg) return
      const r = svg.getBoundingClientRect()
      const scx = r.left + r.width / 2
      const scy = r.top + r.height / 2
      const dx = Math.max(-MAX, Math.min(MAX, (cx - scx) * 0.08))
      const dy = Math.max(-MAX, Math.min(MAX, (cy - scy) * 0.08))
      if (eyeLRef.current) {
        eyeLRef.current.setAttribute('cx', String(80 + dx))
        eyeLRef.current.setAttribute('cy', String(122 + dy))
      }
      if (eyeRRef.current) {
        eyeRRef.current.setAttribute('cx', String(150 + dx))
        eyeRRef.current.setAttribute('cy', String(122 + dy))
      }
    },
    []
  )

  useEffect(() => {
    const onMouse = (e: MouseEvent) => track(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) track(e.touches[0].clientX, e.touches[0].clientY)
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [track])

  return (
    <motion.div
      className="relative z-[2] mb-7"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: 'top center' }}
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 231 289"
        className="w-[180px] h-auto block"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(245,158,11,0.25))' }}
      >
        <defs>
          <linearGradient id="mg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB3D9" />
            <stop offset="30%" stopColor="#87CEEB" />
            <stop offset="60%" stopColor="#4A90E2" />
            <stop offset="85%" stopColor="#2C3E50" />
            <stop offset="100%" stopColor="#1A1A2E" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 0.5 0.5"
              to="360 0.5 0.5"
              dur="6s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <radialGradient id="mg2" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFB3D9" stopOpacity={0.9} />
            <stop offset="40%" stopColor="#4A90E2" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#1A1A2E" stopOpacity={1} />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 0.5 0.5"
              to="-360 0.5 0.5"
              dur="9s"
              repeatCount="indefinite"
            />
          </radialGradient>
          <filter id="meshBlur">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves={4}
              seed={2}
              result="noise"
            >
              <animate attributeName="seed" values="2;8;2" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={18}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation={0.5} />
          </filter>
          <clipPath id="shapeClip">
            <path d="M230.809 115.385V249.411C230.809 269.923 214.985 287.282 194.495 288.411C184.544 288.949 175.364 285.718 168.26 280C159.746 273.154 147.769 273.461 139.178 280.23C132.638 285.384 124.381 288.462 115.379 288.462C106.377 288.462 98.1451 285.384 91.6055 280.23C82.912 273.385 70.9353 273.385 62.2415 280.23C55.7532 285.334 47.598 288.411 38.7246 288.462C17.4132 288.615 0 270.667 0 249.359V115.385C0 51.6667 51.6756 0 115.404 0C179.134 0 230.809 51.6667 230.809 115.385Z" />
          </clipPath>
        </defs>

        {/* Mesh gradient body */}
        <g clipPath="url(#shapeClip)">
          <rect width="231" height="289" fill="url(#mg1)" />
          <rect width="231" height="289" fill="url(#mg2)" opacity={0.6} />
          <rect width="231" height="289" fill="url(#mg1)" filter="url(#meshBlur)" opacity={0.5} />
        </g>

        {/* Eye whites */}
        <ellipse cx="80" cy="120" rx="21" ry="27" fill="white" />
        <ellipse cx="150" cy="120" rx="21" ry="27" fill="white" />

        {/* Pupils — tracked via ref */}
        <ellipse
          ref={eyeLRef}
          cx="80"
          cy="122"
          rx="11"
          ry="13"
          fill="#0f0f0f"
          style={{ animation: 'hitthedeck-blink 3.5s infinite ease-in-out' }}
        />
        <ellipse
          ref={eyeRRef}
          cx="150"
          cy="122"
          rx="11"
          ry="13"
          fill="#0f0f0f"
          style={{ animation: 'hitthedeck-blink 3.5s infinite ease-in-out' }}
        />

        {/* Shine dots */}
        <circle cx="85" cy="116" r="4" fill="rgba(255,255,255,0.85)" />
        <circle cx="155" cy="116" r="4" fill="rgba(255,255,255,0.85)" />
      </svg>
    </motion.div>
  )
}
