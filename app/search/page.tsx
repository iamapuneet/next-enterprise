'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { musicService } from '../../services/musicService'
import { Track, Album, Artist, Playlist } from '../../types/music'
import { TrackRow } from '../../components/music/TrackRow'
import { AlbumCard } from '../../components/music/AlbumCard'
import { ArtistCard } from '../../components/music/ArtistCard'
import { PlaylistCard } from '../../components/music/PlaylistCard'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { Search, Play, Disc, User, Music2, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'albums' | 'artists' | 'playlists'>('all')
  const [results, setResults] = useState<{
    topResult?: any
    songs: Track[]
    albums: Album[]
    artists: Artist[]
    playlists: Playlist[]
  }>({ songs: [], albums: [], artists: [], playlists: [] })
  const [isLoading, setIsLoading] = useState(false)

  const { playTrack } = usePlayerStore()

  useEffect(() => {
    async function executeSearch() {
      setIsLoading(true)
      try {
        const data = await musicService.search(query, activeTab)
        setResults(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    executeSearch()
  }, [query, activeTab])

  const tabs: Array<{ id: 'all' | 'songs' | 'albums' | 'artists' | 'playlists'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
    { id: 'playlists', label: 'Playlists' },
  ]

  const topResult = results.topResult

  return (
    <div className="space-y-6 pb-16 select-none">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer',
              activeTab === tab.id
                ? 'bg-white text-black shadow-md'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-neutral-400">
          Searching catalogue for &quot;{query}&quot;...
        </div>
      ) : !query ? (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
          <Search className="w-12 h-12 text-neutral-600" />
          <h2 className="text-xl font-bold text-white">Search for anything</h2>
          <p className="text-sm text-neutral-400 max-w-sm">
            Find your favorite songs, albums, artists, podcasts, and playlists across the library.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Result + Top Songs Layout for 'All' tab */}
          {activeTab === 'all' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Prominent Top Result Card */}
              {topResult && (
                <div className="lg:col-span-1 p-5 rounded-2xl bg-[#1B1B1B] border border-white/5 flex flex-col justify-between group">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3 block">
                      Top Result
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={topResult.coverUrl || topResult.image}
                      alt={topResult.title || topResult.name}
                      className="w-24 h-24 rounded-xl object-cover shadow-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-white truncate">
                      {topResult.title || topResult.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {topResult.artistName
                        ? `Song • ${topResult.artistName}`
                        : topResult.monthlyListeners
                        ? 'Artist'
                        : 'Album'}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (topResult.audioUrl) {
                          playTrack(topResult)
                        } else if (results.songs.length > 0) {
                          playTrack(results.songs[0]!)
                        }
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#FF4B4B] hover:bg-[#E03E3E] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Play
                    </button>
                  </div>
                </div>
              )}

              {/* Top Songs */}
              <div className={topResult ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-[#FF4B4B]" />
                  Songs
                </h3>
                <div className="bg-[#1B1B1B]/40 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
                  {results.songs.slice(0, 4).map((song, idx) => (
                    <TrackRow
                      key={song.id}
                      track={song}
                      index={idx}
                      queue={results.songs}
                      variant="table"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Songs List (if Songs tab selected) */}
          {activeTab === 'songs' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">All Matching Songs</h3>
              <div className="bg-[#1B1B1B]/40 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
                {results.songs.map((song, idx) => (
                  <TrackRow
                    key={song.id}
                    track={song}
                    index={idx}
                    queue={results.songs}
                    variant="table"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Albums Section */}
          {(activeTab === 'all' || activeTab === 'albums') && results.albums.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Disc className="w-4 h-4 text-[#FF4B4B]" />
                Albums
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </div>
          )}

          {/* Artists Section */}
          {(activeTab === 'all' || activeTab === 'artists') && results.artists.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF4B4B]" />
                Artists
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {results.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          )}

          {/* Playlists Section */}
          {(activeTab === 'all' || activeTab === 'playlists') && results.playlists.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF4B4B]" />
                Playlists
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {results.songs.length === 0 &&
            results.albums.length === 0 &&
            results.artists.length === 0 &&
            results.playlists.length === 0 && (
              <div className="py-16 text-center text-sm text-neutral-400">
                No matching results found for &quot;{query}&quot;. Try a different search keyword.
              </div>
            )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-neutral-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  )
}
