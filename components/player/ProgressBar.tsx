'use client'

import React, { useRef, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { formatTime } from '../../lib/utils'

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (seconds: number) => void
  variant?: 'bottom' | 'full'
}

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
  variant = 'bottom',
}: ProgressBarProps) {
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const [hoverPosition, setHoverPosition] = useState<number>(0)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const ratio = x / rect.width
    setHoverPosition(x)
    setHoverTime(ratio * duration)
  }

  const handleMouseLeave = () => {
    setHoverTime(null)
  }

  return (
    <div
      ref={progressBarRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full flex items-center cursor-pointer select-none"
    >
      {/* Hover Time Tooltip */}
      {hoverTime !== null && (
        <div
          style={{ left: `${hoverPosition}px` }}
          className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded bg-neutral-900 border border-white/20 text-[10px] font-mono text-white pointer-events-none shadow-md z-30"
        >
          {formatTime(hoverTime)}
        </div>
      )}

      {/* Scrubbable Slider */}
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-3 group"
        value={[currentTime]}
        max={duration || 100}
        step={0.5}
        onValueChange={([val]) => {
          if (val !== undefined) onSeek(val)
        }}
      >
        <Slider.Track className="relative bg-white/20 grow rounded-full h-1 group-hover:h-1.5 transition-all">
          <Slider.Range className="absolute bg-[#FF4B4B] rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          aria-label="Seek time"
          className="block w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-hidden hover:scale-125"
        />
      </Slider.Root>
    </div>
  )
}
