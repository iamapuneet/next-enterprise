'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { musicService } from '../../../services/musicService'
import { Album } from '../../../types/music'
import { TrackRow } from '../../../components/music/TrackRow'
import { usePlayerStore } from '../../../stores/usePlayerStore'
import {
  Play,
  Shuffle,
  Bookmark,
  Share2,
} from 'lucide-react'
import { formatDuration } from '../../../lib/utils'

export default function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const albumId = resolvedParams.id

  const [album, setAlbum] = useState<Album | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { playTrack, toggleShuffle } = usePlayerStore()

  useEffect(() => {
    async function loadAlbum() {
      setIsLoading(true)
      try {
        const data = await musicService.getAlbumById(albumId)
        setAlbum(data)
        setIsSaved(data?.isSaved ?? false)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadAlbum()
  }, [albumId])

  if (isLoading || !album) {
    return (
      <div className="py-20 text-center text-sm text-neutral-400">
        Loading album details...
      </div>
    )
  }

  const tracks = album.tracks || []

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

  return (
    <div className="space-y-8 pb-16 select-none">
      {/* 2-Column YouTube Music style Layout (Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start pt-4">
        {/* Left Column: Artwork, Details & Main Actions */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          {/* Large Artwork */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/10 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={album.coverUrl}
              alt={album.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Meta Info */}
          <div className="space-y-1.5 w-full">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {album.title}
            </h1>

            <p className="text-sm font-semibold text-neutral-300">
              <Link
                href={`/artist/${album.artistId}`}
                className="hover:text-white hover:underline transition"
              >
                {album.artistName}
              </Link>
            </p>

            <p className="text-xs text-neutral-400 font-mono">
              Album • {album.releaseYear} • {tracks.length} songs •{' '}
              {formatDuration(album.totalDuration || 0)}
            </p>

            {album.description && (
              <p className="text-xs text-neutral-400 pt-1 line-clamp-3">
                {album.description}
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            {/* Large Circular Play Button */}
            <button
              type="button"
              onClick={handlePlayAll}
              title="Play Album"
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition"
            >
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </button>

            {/* Shuffle Button */}
            <button
              type="button"
              onClick={handleShuffleAll}
              title="Shuffle Album"
              className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center border border-white/10 transition"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Save/Bookmark */}
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              title={isSaved ? 'Remove from Library' : 'Save to Library'}
              className={`w-11 h-11 rounded-full flex items-center justify-center border transition ${
                isSaved
                  ? 'bg-[#FF4B4B] text-white border-[#FF4B4B]'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border-white/10'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Album link copied to clipboard!')
                }
              }}
              title="Share Album"
              className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center border border-white/10 transition"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Track Listing Table */}
        <div className="flex-1">
          <div className="bg-[#1B1B1B]/40 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
            {tracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                queue={tracks}
                variant="table"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
