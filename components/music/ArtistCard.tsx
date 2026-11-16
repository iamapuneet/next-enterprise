'use client'

import React from 'react'
import Link from 'next/link'
import { Play, Check } from 'lucide-react'
import { Artist } from '../../types/music'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { formatNumber } from '../../lib/utils'

interface ArtistCardProps {
  artist: Artist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const { playTrack } = usePlayerStore()

  const handlePlayArtist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (artist.tracks && artist.tracks.length > 0) {
      playTrack(artist.tracks[0]!, artist.tracks)
    }
  }

  return (
    <div className="group relative flex flex-col items-center text-center p-3 rounded-2xl bg-[#1B1B1B]/40 hover:bg-[#1B1B1B] border border-transparent hover:border-white/5 transition-all duration-200 select-none">
      <Link href={`/artist/${artist.id}`} className="block w-full">
        {/* Circular Avatar */}
        <div className="relative aspect-square w-full max-w-[180px] mx-auto rounded-full overflow-hidden bg-neutral-900 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handlePlayArtist}
              aria-label="Play artist"
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-center gap-1">
            <h3 className="font-semibold text-sm text-white truncate group-hover:underline">
              {artist.name}
            </h3>
            {artist.verified && (
              <span className="w-3.5 h-3.5 rounded-full bg-neutral-400 text-black flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            {formatNumber(artist.monthlyListeners)} subscribers
          </p>
        </div>
      </Link>
    </div>
  )
}
