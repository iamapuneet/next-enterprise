'use client'

import React, { useState, useEffect, use } from 'react'
import { musicService } from '../../../services/musicService'
import { Playlist, Track } from '../../../types/music'
import { TrackRow } from '../../../components/music/TrackRow'
import { usePlayerStore } from '../../../stores/usePlayerStore'
import {
  Play,
  Shuffle,
  Share2,
  Trash2,
  Bookmark,
  Sparkles,
} from 'lucide-react'
import { formatDuration } from '../../../lib/utils'

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const playlistId = resolvedParams.id

  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { playTrack, toggleShuffle } = usePlayerStore()

  useEffect(() => {
    async function loadPlaylist() {
      setIsLoading(true)
      try {
        const data = await musicService.getPlaylistById(playlistId)
        setPlaylist(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadPlaylist()
  }, [playlistId])

  if (isLoading || !playlist) {
    return (
      <div className="py-20 text-center text-sm text-neutral-400">
        Loading playlist...
      </div>
    )
  }

  const tracks = playlist.tracks || []

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0]!, tracks)
    }
  }

  const handleShuffleAll = () => {
    if (tracks.length > 0) {
      toggleShuffle()
      playTrack(tracks[0]!, tracks)
    }
  }

  const handleRemoveTrack = async (trackId: string) => {
    const updated = await musicService.removeTrackFromPlaylist(playlist.id, trackId)
    if (updated) setPlaylist(updated)
  }

  return (
    <div className="space-y-8 pb-16 select-none">
      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start pt-4">
        {/* Left Column: Details */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/10 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                playlist.coverUrl ||
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
              }
              alt={playlist.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[#FF4B4B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Playlist</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {playlist.title}
            </h1>

            <p className="text-sm text-neutral-300 font-medium">
              Curated by <span className="text-white">{playlist.userName || 'NAD Music'}</span>
            </p>

            <p className="text-xs text-neutral-400 font-mono">
              {tracks.length} songs • {formatDuration(playlist.totalDuration || 0)}
            </p>

            {playlist.description && (
              <p className="text-xs text-neutral-400 pt-1 line-clamp-3">
                {playlist.description}
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePlayAll}
              title="Play Playlist"
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition"
            >
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </button>

            <button
              type="button"
              onClick={handleShuffleAll}
              title="Shuffle Playlist"
              className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center border border-white/10 transition"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Playlist link copied to clipboard!')
                }
              }}
              title="Share"
              className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center border border-white/10 transition"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Track Listing Table */}
        <div className="flex-1">
          {tracks.length === 0 ? (
            <div className="py-16 text-center text-sm text-neutral-400 bg-[#1B1B1B]/40 rounded-2xl border border-white/5">
              This playlist is currently empty. Explore tracks and add them to this playlist!
            </div>
          ) : (
            <div className="bg-[#1B1B1B]/40 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
              {tracks.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  queue={tracks}
                  variant="table"
                  onRemove={() => handleRemoveTrack(track.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
