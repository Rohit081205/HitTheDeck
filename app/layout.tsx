import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HitTheDeck — Ground Intelligence',
  description:
    "Deep intelligence on India's iconic cricket grounds — live weather, pitch behavior, AI scout analysis.",
  openGraph: {
    title: 'HitTheDeck',
    description: 'Know the pitch before the first ball.',
    siteName: 'HitTheDeck',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-50 antialiased`}>
        {children}
      </body>
    </html>
  )
}
