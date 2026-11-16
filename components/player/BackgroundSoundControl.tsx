'use client'

import React from 'react'
import * as Popover from '@radix-ui/react-popover'
import * as Slider from '@radix-ui/react-slider'
import { Sparkles, Volume2, VolumeX, Radio, Check } from 'lucide-react'
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

  const currentVolume = isBgMuted || !isBgSoundEnabled ? 0 : bgVolume
  const percent = Math.round(currentVolume * 100)

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          title="Ambient Background Sound (Interstellar)"
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition border select-none',
            isBgSoundEnabled && !isBgMuted
              ? 'bg-[#FF4B4B]/15 text-[#FF4B4B] border-[#FF4B4B]/30 hover:bg-[#FF4B4B]/25 shadow-xs'
              : 'bg-neutral-800/80 text-neutral-400 border-white/5 hover:text-white hover:bg-neutral-800'
          )}
        >
          <Sparkles
            className={cn(
              'w-3.5 h-3.5',
              isBgSoundEnabled && isPlaying && !isBgMuted && 'animate-spin'
            )}
            style={{ animationDuration: '6s' }}
          />
          <span className="hidden sm:inline">BG Sound</span>
          <span className="text-[10px] font-mono opacity-80">{percent}%</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="end"
          sideOffset={14}
          className="z-50 w-72 rounded-2xl bg-[#1B1B1B] p-4 text-white shadow-2xl border border-white/10 outline-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF4B4B]/20 flex items-center justify-center text-[#FF4B4B]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Ambient Background</h4>
                <p className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                  Hans Zimmer — Interstellar
                </p>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <button
              type="button"
              onClick={toggleBgSound}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-bold transition',
                isBgSoundEnabled
                  ? 'bg-[#FF4B4B] text-white shadow-sm'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              )}
            >
              {isBgSoundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Volume Control */}
          <div className="pt-3 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">Background Volume</span>
              <span className="font-mono text-[#FF4B4B] font-bold text-xs">{percent}%</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleBgMute}
                title={isBgMuted ? 'Unmute BG sound' : 'Mute BG sound'}
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                {currentVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>

              <div className="flex-1">
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-4"
                  value={[bgVolume]}
                  max={1}
                  step={0.01}
                  onValueChange={([val]) => {
                    if (val !== undefined) setBgVolume(val)
                  }}
                >
                  <Slider.Track className="relative bg-neutral-800 grow rounded-full h-1.5">
                    <Slider.Range className="absolute bg-[#FF4B4B] rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    aria-label="Background Volume"
                    className="block w-3.5 h-3.5 bg-white rounded-full shadow-md focus:outline-hidden hover:scale-110 transition-transform"
                  />
                </Slider.Root>
              </div>
            </div>

            {/* Preset shortcuts */}
            <div className="flex items-center justify-between pt-1 text-[10px]">
              <span className="text-neutral-500">Presets:</span>
              <div className="flex gap-1.5">
                {[0.1, 0.18, 0.3, 0.5].map((preset) => {
                  const isCurrent = Math.abs(bgVolume - preset) < 0.02
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBgVolume(preset)}
                      className={cn(
                        'px-2 py-0.5 rounded font-mono transition',
                        isCurrent
                          ? 'bg-[#FF4B4B] text-white font-bold'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      )}
                    >
                      {Math.round(preset * 100)}%
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
