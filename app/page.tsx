'use client'

import React, { useState, useEffect } from 'react'
import { musicService } from '../services/musicService'
import { Track, Artist, Album, Playlist } from '../types/music'
import { FeaturedBanner } from '../components/music/FeaturedBanner'
import { MusicCard } from '../components/music/MusicCard'
import { AlbumCard } from '../components/music/AlbumCard'
import { ArtistCard } from '../components/music/ArtistCard'
import { PlaylistCard } from '../components/music/PlaylistCard'
import { TrackRow } from '../components/music/TrackRow'
import { MusicCarousel } from '../components/music/MusicCarousel'
import { usePlayerStore } from '../stores/usePlayerStore'
import { Play } from 'lucide-react'
import { cn } from '../lib/utils'

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState('All')
  const [moods, setMoods] = useState<string[]>([])
  const [featured, setFeatured] = useState<any>(null)
  const [quickPicks, setQuickPicks] = useState<Track[]>([])
  const [trending, setTrending] = useState<Track[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { playTrack } = usePlayerStore()

  useEffect(() => {
    async function loadData() {
      try {
        const [
          moodData,
          featData,
          quickData,
          trendData,
          albumData,
          artistData,
          playlistData,
        ] = await Promise.all([
          musicService.getMoodCategories(),
          musicService.getFeatured(),
          musicService.getQuickPicks(),
          musicService.getTrending(),
          musicService.getNewReleases(),
          musicService.getPopularArtists(),
          musicService.getPlaylists(),
        ])

        setMoods(moodData)
        setFeatured(featData)
        setQuickPicks(quickData)
        setTrending(trendData)
        setAlbums(albumData)
        setArtists(artistData)
        setPlaylists(playlistData)
      } catch (err) {
        console.error('Failed to load home music data', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter tracks by mood or category
  const displayedQuickPicks = quickPicks.filter((t) => {
    if (selectedMood === 'All') return true
    const s = selectedMood.toLowerCase()
    return (
      t.title.toLowerCase().includes(s) ||
      t.albumTitle?.toLowerCase().includes(s) ||
      t.genres?.some((g) => g.toLowerCase().includes(s))
    )
  })

  const handlePlayQuickAll = () => {
    if (displayedQuickPicks.length > 0) {
      playTrack(displayedQuickPicks[0]!, displayedQuickPicks)
    }
  }

  const handlePlayTrendingAll = () => {
    if (trending.length > 0) {
      playTrack(trending[0]!, trending)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse select-none">
        <div className="h-10 w-full max-w-md bg-neutral-800/40 rounded-full" />
        <div className="h-80 w-full bg-neutral-800/40 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-neutral-800/40 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Mood Filter Chips Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:-mx-8 md:px-8 pb-1 pt-1">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood
          return (
            <button
              key={mood}
              type="button"
              onClick={() => setSelectedMood(mood)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer',
                isSelected
                  ? 'bg-white text-black shadow-md'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              )}
            >
              {mood}
            </button>
          )
        })}
      </div>

      {/* Featured Banner Hero */}
      {featured && <FeaturedBanner banner={featured.banner} />}

      {/* Quick Picks - YouTube Music 4-row grid */}
      <section className="my-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Quick picks
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 mt-0.5">
              Listen to the songs you love right away
            </p>
          </div>

          <button
            type="button"
            onClick={handlePlayQuickAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white text-xs font-semibold transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play all</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {displayedQuickPicks.slice(0, 8).map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              queue={displayedQuickPicks}
              variant="compact"
            />
          ))}
        </div>
      </section>

      {/* Recommended for You Carousel */}
      <MusicCarousel
        title="Recommended for You"
        subtitle="Curated tracks matching your recent listening taste"
        onPlayAll={handlePlayQuickAll}
      >
        {quickPicks.map((track) => (
          <div key={track.id} className="w-48 shrink-0">
            <MusicCard track={track} queue={quickPicks} />
          </div>
        ))}
      </MusicCarousel>

      {/* Trending Music */}
      <MusicCarousel
        title="Trending on Osho Player"
        subtitle="Most listened Hindi and English discourses"
        onPlayAll={handlePlayTrendingAll}
      >
        {trending.map((track) => (
          <div key={track.id} className="w-48 shrink-0">
            <MusicCard track={track} queue={trending} />
          </div>
        ))}
      </MusicCarousel>

      {/* Popular Discourse Series */}
      <MusicCarousel
        title="Complete Discourse Series"
        subtitle="Full multi-part discourses from Osho World"
      >
        {albums.map((album) => (
          <div key={album.id} className="w-48 shrink-0">
            <AlbumCard album={album} />
          </div>
        ))}
      </MusicCarousel>

      {/* Masters & Teachers */}
      <MusicCarousel
        title="Featured Master"
        subtitle="Discourses and guidance by Osho"
      >
        {artists.map((artist) => (
          <div key={artist.id} className="w-44 shrink-0">
            <ArtistCard artist={artist} />
          </div>
        ))}
      </MusicCarousel>

      {/* Featured Playlists */}
      <MusicCarousel
        title="Featured Playlists"
        subtitle="Handpicked by music editors"
      >
        {playlists.map((playlist) => (
          <div key={playlist.id} className="w-48 shrink-0">
            <PlaylistCard playlist={playlist} />
          </div>
        ))}
      </MusicCarousel>
    </div>
  )
}
