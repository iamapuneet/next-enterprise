'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { musicService } from '../../services/musicService'
import { Track, Playlist, Album, Artist } from '../../types/music'
import { TrackRow } from '../../components/music/TrackRow'
import { PlaylistCard } from '../../components/music/PlaylistCard'
import { AlbumCard } from '../../components/music/AlbumCard'
import { ArtistCard } from '../../components/music/ArtistCard'
import { CreatePlaylistDialog } from '../../components/dialogs/CreatePlaylistDialog'
import {
  Library,
  Heart,
  ListMusic,
  Disc3,
  Users,
  Podcast,
  Plus,
  Play,
} from 'lucide-react'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { cn } from '../../lib/utils'

function LibraryContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'playlists'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [likedTracks, setLikedTracks] = useState<Track[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { playTrack } = usePlayerStore()

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam) setActiveTab(tabParam)
  }, [searchParams])

  useEffect(() => {
    async function loadLibrary() {
      setIsLoading(true)
      try {
        const [plData, likedData, albumData, artistData] = await Promise.all([
          musicService.getPlaylists(),
          musicService.getLikedTracks(),
          musicService.getNewReleases(),
          musicService.getPopularArtists(),
        ])
        setPlaylists(plData)
        setLikedTracks(likedData)
        setAlbums(albumData)
        setArtists(artistData)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadLibrary()
  }, [])

  const tabs = [
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'liked', label: 'Liked Songs', icon: Heart },
    { id: 'albums', label: 'Saved Albums', icon: Disc3 },
    { id: 'artists', label: 'Followed Artists', icon: Users },
    { id: 'podcasts', label: 'Podcasts', icon: Podcast },
  ]

  const handlePlayLikedAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0]!, likedTracks)
    }
  }

  return (
    <div className="space-y-8 pb-16 select-none">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF4B4B] text-xs font-bold uppercase tracking-wider mb-1">
            <Library className="w-4 h-4" />
            <span>Your Collection</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Library
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF4B4B] hover:bg-[#E03E3E] text-white font-semibold text-xs shadow-lg transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer',
                isActive
                  ? 'bg-white text-black shadow-md'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-neutral-400">
          Loading library collection...
        </div>
      ) : (
        <>
          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {playlists.length} Playlists
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </div>
          )}

          {/* Liked Songs Tab */}
          {activeTab === 'liked' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {likedTracks.length} Liked Tracks
                </span>

                {likedTracks.length > 0 && (
                  <button
                    type="button"
                    onClick={handlePlayLikedAll}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Play all
                  </button>
                )}
              </div>

              {likedTracks.length === 0 ? (
                <div className="py-20 text-center text-sm text-neutral-400">
                  You haven&apos;t liked any songs yet. Click the heart icon on any song!
                </div>
              ) : (
                <div className="bg-[#1B1B1B]/40 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
                  {likedTracks.map((track, idx) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={idx}
                      queue={likedTracks}
                      variant="table"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Albums Tab */}
          {activeTab === 'albums' && (
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {albums.length} Saved Albums
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </div>
          )}

          {/* Followed Artists Tab */}
          {activeTab === 'artists' && (
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {artists.length} Followed Artists
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          )}

          {/* Podcasts Tab */}
          {activeTab === 'podcasts' && (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
              <Podcast className="w-12 h-12 text-[#FF4B4B] opacity-50" />
              <h3 className="text-lg font-bold text-white">Your Podcasts & Shows</h3>
              <p className="text-sm text-neutral-400 max-w-sm">
                Follow your favorite podcasts and talk shows to receive latest episode updates.
              </p>
            </div>
          )}
        </>
      )}

      <CreatePlaylistDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newPl) => {
          setPlaylists((prev) => [newPl, ...prev])
          setActiveTab('playlists')
        }}
      />
    </div>
  )
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-neutral-400">Loading library...</div>}>
      <LibraryContent />
    </Suspense>
  )
}
