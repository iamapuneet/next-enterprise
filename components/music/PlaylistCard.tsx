'use client'

import React from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { Playlist } from '../../types/music'
import { usePlayerStore } from '../../stores/usePlayerStore'

interface PlaylistCardProps {
  playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { playTrack } = usePlayerStore()

  const handlePlayPlaylist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]!, playlist.tracks)
    }
  }

  return (
    <div className="group relative flex flex-col p-3 rounded-2xl bg-[#1B1B1B]/40 hover:bg-[#1B1B1B] border border-transparent hover:border-white/5 transition-all duration-200 select-none">
      <Link href={`/playlist/${playlist.id}`} className="block">
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={playlist.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}
            alt={playlist.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handlePlayPlaylist}
              aria-label="Play playlist"
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="font-semibold text-sm text-white truncate group-hover:underline">
            {playlist.title}
          </h3>
          <p className="text-xs text-neutral-400 truncate mt-0.5">
            Playlist • {playlist.userName || 'Osho World'} • {playlist.trackCount ?? (playlist.tracks?.length || 0)} discourses
          </p>
        </div>
      </Link>
    </div>
  )
}
