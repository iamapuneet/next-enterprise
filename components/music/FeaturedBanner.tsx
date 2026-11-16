'use client'

import React from 'react'
import { Play, Shuffle, Plus, Radio } from 'lucide-react'
import { Track } from '../../types/music'
import { usePlayerStore } from '../../stores/usePlayerStore'

interface FeaturedBannerProps {
  banner: {
    title: string
    subtitle: string
    description: string
    coverUrl: string
    artistName: string
    track: Track
  }
}

export function FeaturedBanner({ banner }: FeaturedBannerProps) {
  const { playTrack, toggleShuffle, addToQueue } = usePlayerStore()

  const handlePlay = () => {
    playTrack(banner.track)
  }

  const handleShuffle = () => {
    toggleShuffle()
    playTrack(banner.track)
  }

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl my-4 min-h-[320px] md:min-h-[380px] flex items-end select-none">
      {/* Background artwork with gradients */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.coverUrl}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-60 scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#0E0E0E] via-[#0E0E0E]/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0E0E0E]/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10 max-w-2xl">
        <span className="inline-block px-3 py-1 rounded-full bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]/30 text-xs font-semibold uppercase tracking-wider mb-3">
          {banner.subtitle}
        </span>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          {banner.title}
        </h1>

        <p className="mt-2 text-sm md:text-base text-neutral-300 line-clamp-2">
          {banner.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition shadow-lg"
          >
            <Play className="w-5 h-5 fill-current" />
            Play
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white font-semibold text-sm border border-white/10 transition"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </button>

          <button
            type="button"
            onClick={() => addToQueue(banner.track)}
            className="p-3 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white border border-white/10 transition"
            title="Add to queue"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handlePlay}
            className="p-3 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white border border-white/10 transition"
            title="Start radio"
          >
            <Radio className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
