'use client'

import React, { useState, useEffect, use } from 'react'
import { musicService } from '../../../services/musicService'
import { Artist } from '../../../types/music'
import { TrackRow } from '../../../components/music/TrackRow'
import { AlbumCard } from '../../../components/music/AlbumCard'
import { usePlayerStore } from '../../../stores/usePlayerStore'
import { Play, Shuffle, Check, Radio } from 'lucide-react'
import { formatNumber } from '../../../lib/utils'

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const artistId = resolvedParams.id

  const [artist, setArtist] = useState<Artist | null>(null)
  const [isFollowed, setIsFollowed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { playTrack, toggleShuffle } = usePlayerStore()

  useEffect(() => {
    async function loadArtist() {
      setIsLoading(true)
      try {
        const data = await musicService.getArtistById(artistId)
        setArtist(data)
        setIsFollowed(data?.isFollowed ?? false)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadArtist()
  }, [artistId])

  if (isLoading || !artist) {
    return (
      <div className="py-20 text-center text-sm text-neutral-400">
        Loading artist profile...
      </div>
    )
  }

  const handlePlayAll = () => {
    if (artist.tracks && artist.tracks.length > 0) {
      playTrack(artist.tracks[0]!, artist.tracks)
    }
  }

  const handleShuffleAll = () => {
    if (artist.tracks && artist.tracks.length > 0) {
      toggleShuffle()
      playTrack(artist.tracks[0]!, artist.tracks)
    }
  }

  return (
    <div className="space-y-8 pb-16 select-none -mx-4 md:-mx-8">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden flex items-end px-6 md:px-12 pb-8">
        {artist.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artist.bannerUrl}
            alt={artist.name}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-50"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0E0E0E] via-[#0E0E0E]/60 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6">
          {/* Avatar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artist.image}
            alt={artist.name}
            className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover shadow-2xl border-2 border-white/20 shrink-0"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {artist.name}
              </h1>
              {artist.verified && (
                <span className="w-5 h-5 rounded-full bg-[#FF4B4B] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </div>

            <p className="text-sm text-neutral-300 font-mono">
              {formatNumber(artist.monthlyListeners)} monthly listeners
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 space-y-10">
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlayAll}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition shadow-lg"
          >
            <Play className="w-4 h-4 fill-current" />
            Play
          </button>

          <button
            type="button"
            onClick={handleShuffleAll}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm border border-white/10 transition"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </button>

          <button
            type="button"
            onClick={() => setIsFollowed(!isFollowed)}
            className={`px-5 py-3 rounded-full font-semibold text-sm transition border ${
              isFollowed
                ? 'bg-transparent text-white border-white/30 hover:border-white'
                : 'bg-[#FF4B4B] text-white border-[#FF4B4B] hover:bg-[#E03E3E]'
            }`}
          >
            {isFollowed ? 'Following' : 'Follow'}
          </button>

          <button
            type="button"
            className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 transition"
            title="Artist Radio"
          >
            <Radio className="w-4 h-4" />
          </button>
        </div>

        {/* Bio */}
        {artist.bio && (
          <div className="max-w-2xl text-sm text-neutral-300 leading-relaxed bg-[#1B1B1B]/40 p-4 rounded-2xl border border-white/5">
            {artist.bio}
          </div>
        )}

        {/* Popular Tracks Table */}
        <section>
          <h2 className="text-xl font-bold tracking-tight text-white mb-4">
            Popular Songs
          </h2>
          <div className="bg-[#1B1B1B]/40 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
            {artist.tracks?.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                queue={artist.tracks}
                variant="table"
              />
            ))}
          </div>
        </section>

        {/* Albums & Discography */}
        {artist.albums && artist.albums.length > 0 && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-white mb-4">
              Discography & Albums
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {artist.albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
