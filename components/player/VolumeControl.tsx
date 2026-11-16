'use client'

import React from 'react'
import * as Slider from '@radix-ui/react-slider'
import { Volume2, Volume1, VolumeX } from 'lucide-react'

interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onVolumeChange: (val: number) => void
  onToggleMute: () => void
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const currentVolume = isMuted ? 0 : volume

  const VolumeIcon =
    currentVolume === 0 || isMuted
      ? VolumeX
      : currentVolume < 0.5
      ? Volume1
      : Volume2

  return (
    <div className="flex items-center gap-2 group select-none">
      <button
        type="button"
        onClick={onToggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
        className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
      >
        <VolumeIcon className="w-5 h-5" />
      </button>

      <div className="w-24 flex items-center">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-3"
          value={[currentVolume]}
          max={1}
          step={0.01}
          onValueChange={([val]) => {
            if (val !== undefined) onVolumeChange(val)
          }}
        >
          <Slider.Track className="relative bg-white/20 grow rounded-full h-1 group-hover:h-1.5 transition-all">
            <Slider.Range className="absolute bg-white rounded-full h-full group-hover:bg-[#FF4B4B] transition-colors" />
          </Slider.Track>
          <Slider.Thumb
            aria-label="Volume"
            className="block w-2.5 h-2.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-hidden"
          />
        </Slider.Root>
      </div>
    </div>
  )
}
