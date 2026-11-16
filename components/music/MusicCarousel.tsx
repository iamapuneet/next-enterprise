'use client'

import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

interface MusicCarouselProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  onPlayAll?: () => void
}

export function MusicCarousel({
  title,
  subtitle,
  children,
  onPlayAll,
}: MusicCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const offset = direction === 'left' ? -600 : 600
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section className="my-8 select-none">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onPlayAll && (
            <button
              type="button"
              onClick={onPlayAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white text-xs font-semibold transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play all</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              title="Previous"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              title="Next"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-4 px-4 md:-mx-8 md:px-8"
      >
        {children}
      </div>
    </section>
  )
}
