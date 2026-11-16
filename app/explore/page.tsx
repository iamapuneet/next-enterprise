'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { musicService } from '../../services/musicService'
import { oshoApiService } from '../../services/oshoApiService'
import { Track, Album, Artist, Genre } from '../../types/music'
import { TrackRow } from '../../components/music/TrackRow'
import { AlbumCard } from '../../components/music/AlbumCard'
import { ArtistCard } from '../../components/music/ArtistCard'
import { Compass, Flame, Sparkles, Radio, BookOpen } from 'lucide-react'

export default function ExplorePage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [masterCategories, setMasterCategories] = useState<any[]>([])
  const [trending, setTrending] = useState<Track[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadExplore() {
      try {
        const [genreData, masterData, trendData, albumData, artistData] = await Promise.all([
          musicService.getGenres(),
          oshoApiService.getMasterCategories(),
          musicService.getTrending(),
          musicService.getNewReleases(),
          musicService.getPopularArtists(),
        ])
        setGenres(genreData)
        setMasterCategories(masterData)
        setTrending(trendData)
        setAlbums(albumData)
        setArtists(artistData)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadExplore()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse select-none">
        <div className="h-8 w-48 bg-neutral-800/40 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-neutral-800/40 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-16 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 text-[#FF4B4B] mb-1">
          <Compass className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Explore Music</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Discover New Sounds
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Browse by genres, popular charts, and new releases from around the globe.
        </p>
      </div>

      {/* Genres & Moods Grid */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF4B4B]" />
          Genres & Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/search?q=${encodeURIComponent(genre.name)}`}
              style={{ backgroundColor: genre.color || '#1B1B1B' }}
              className="relative h-28 md:h-32 rounded-2xl p-4 overflow-hidden shadow-lg hover:scale-105 transition-transform flex flex-col justify-between group cursor-pointer"
            >
              <span className="text-white font-extrabold text-base md:text-lg z-10 drop-shadow-md">
                {genre.name}
              </span>

              {/* Angled decorative thumbnail */}
              {genre.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={genre.imageUrl}
                  alt={genre.name}
                  className="absolute -right-3 -bottom-3 w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-2xl rotate-25 group-hover:rotate-12 transition-transform duration-300"
                />
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Osho Master Categories (16 Masters: Krishna, Shiv, Kabir, Nanak, Upanishad, Buddha...) */}
      {masterCategories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#FF4B4B]" />
              Osho Discourse Masters & Mystics
            </h2>
            <span className="text-xs text-neutral-400 font-mono">
              {masterCategories.length} Categories
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {masterCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?q=${encodeURIComponent(cat.title.split(' ')[0] || cat.title)}`}
                className="group p-3 rounded-2xl bg-[#1B1B1B]/60 hover:bg-[#1B1B1B] border border-white/5 hover:border-white/10 transition-all duration-200 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-linear-to-tr from-[#FF4B4B]/20 to-[#FF8585]/30 border border-[#FF4B4B]/30 flex items-center justify-center text-white mb-2.5 shadow-md group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-[#FF4B4B]" />
                </div>
                <h3 className="font-semibold text-xs text-white truncate w-full group-hover:text-[#FF4B4B] transition">
                  {cat.title}
                </h3>
                <span className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                  {cat.countSeries} Series
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending Songs Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF4B4B]" />
            Trending Songs
          </h2>
        </div>

        <div className="bg-[#1B1B1B]/40 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
          {trending.slice(0, 6).map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              queue={trending}
              variant="table"
            />
          ))}
        </div>
      </section>

      {/* New Releases Section */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-white mb-4 flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#FF4B4B]" />
          New Albums & EPs
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* Top Artists Section */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-white mb-4">
          Top Artists Spotlight
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  )
}
