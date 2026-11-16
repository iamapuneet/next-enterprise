'use client'

import React from 'react'
import * as Popover from '@radix-ui/react-popover'
import * as Slider from '@radix-ui/react-slider'
import { Waves, Volume2, VolumeX, SlidersHorizontal, Check } from 'lucide-react'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { cn } from '../../lib/utils'

export function BackgroundSoundControl() {
  const {
    isBgSoundEnabled,
    bgVolume,
    isBgMuted,
    toggleBgSound,
    setBgVolume,
    toggleBgMute,
    isPlaying,
  } = usePlayerStore()

  const isActuallyPlaying = isBgSoundEnabled && isPlaying && !isBgMuted
  const currentVolume = isBgMuted || !isBgSoundEnabled ? 0 : bgVolume
  const percent = Math.round(currentVolume * 100)

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          title="Ambient Background Sound (Hans Zimmer - Interstellar)"
          className={cn(
            'group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-out border select-none cursor-pointer',
            isActuallyPlaying
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-neutral-900/80 text-neutral-400 border-white/10 hover:text-white hover:bg-neutral-800 hover:border-white/20'
          )}
        >
          {/* Authentic Ambient Sound Wave Icon / Animated Equalizer Bars */}
          {isActuallyPlaying ? (
            <div className="flex items-center gap-0.5 h-3.5 w-3.5 justify-center">
              <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-2.5 transition-all" />
              <span className="w-0.5 bg-amber-300 rounded-full animate-pulse h-3.5 [animation-delay:200ms] transition-all" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-2 [animation-delay:400ms] transition-all" />
            </div>
          ) : (
            <Waves className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
          )}

          <span className="hidden sm:inline font-medium">Ambient BG</span>
          <span className="text-[11px] font-mono opacity-80 font-semibold">{percent}%</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="end"
          sideOffset={14}
          className="z-50 w-80 rounded-2xl bg-[#161616]/95 p-4 text-white shadow-2xl border border-white/10 outline-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Waves className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white tracking-wide">
                  Ambient Atmosphere
                </h4>
                <p className="text-[11px] text-neutral-400 truncate max-w-[150px]">
                  Hans Zimmer — Interstellar Loop
                </p>
              </div>
            </div>

            {/* Enable/Disable Toggle Pill */}
            <button
              type="button"
              onClick={toggleBgSound}
              className={cn(
                'px-3 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all duration-200 cursor-pointer',
                isBgSoundEnabled
                  ? 'bg-amber-500 text-black shadow-md hover:bg-amber-400'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              )}
            >
              {isBgSoundEnabled ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>

          {/* Volume Control */}
          <div className="pt-3.5 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
                Background Volume
              </span>
              <span className="font-mono text-amber-400 font-bold text-xs tracking-tight">
                {percent}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleBgMute}
                title={isBgMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition duration-150 cursor-pointer"
              >
                {currentVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                )}
              </button>

              <div className="flex-1">
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                  value={[bgVolume]}
                  max={1}
                  step={0.01}
                  onValueChange={([val]) => {
                    if (val !== undefined) setBgVolume(val)
                  }}
                >
                  <Slider.Track className="relative bg-neutral-800 grow rounded-full h-1.5 overflow-hidden">
                    <Slider.Range className="absolute bg-linear-to-r from-amber-600 to-amber-400 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    aria-label="Background Volume"
                    className="block w-3.5 h-3.5 bg-white rounded-full shadow-lg focus:outline-hidden hover:scale-125 transition-transform duration-150 ring-2 ring-amber-400/50"
                  />
                </Slider.Root>
              </div>
            </div>

            {/* Preset shortcuts */}
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-neutral-500 font-medium">Presets:</span>
              <div className="flex gap-1.5">
                {[0.1, 0.18, 0.3, 0.5].map((preset) => {
                  const isCurrent = Math.abs(bgVolume - preset) < 0.02
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBgVolume(preset)}
                      className={cn(
                        'px-2 py-0.5 rounded-md font-mono text-[10px] transition-all duration-150 cursor-pointer',
                        isCurrent
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent'
                      )}
                    >
                      {Math.round(preset * 100)}%
                    </button>
                  )
                })}
              </div>
            </div>

            <p className="text-[10px] text-neutral-500 text-center pt-1 border-t border-white/5">
              Harmoniously blends subtle ambient music beneath Osho&apos;s discourses.
            </p>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
