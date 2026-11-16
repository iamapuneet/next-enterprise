'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, Music, User, Disc } from 'lucide-react'
import { musicService } from '../../services/musicService'
import { Track, Artist, Album } from '../../types/music'

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    songs: Track[]
    artists: Artist[]
    albums: Album[]
  }>({ songs: [], artists: [], albums: [] })

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Global keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], artists: [], albums: [] })
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timeout = setTimeout(async () => {
      try {
        const res = await musicService.search(query)
        setResults({
          songs: res.songs.slice(0, 3),
          artists: res.artists.slice(0, 2),
          albums: res.albums.slice(0, 2),
        })
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => clearTimeout(timeout)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleSelect = (url: string) => {
    setIsOpen(false)
    router.push(url)
  }

  const hasResults =
    results.songs.length > 0 || results.artists.length > 0 || results.albums.length > 0

  return (
    <div ref={containerRef} className="relative w-full max-w-[540px]">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search songs, albums, artists, podcasts"
            className="w-full h-10 pl-11 pr-16 rounded-full bg-neutral-900 border border-white/10 text-white placeholder-neutral-400 text-sm focus:outline-hidden focus:border-white/20 focus:bg-neutral-800 transition"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
            ) : query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-800 rounded border border-white/5">
                /
              </kbd>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown Popover */}
      {isOpen && query.trim() && (
        <div className="absolute top-12 left-0 right-0 z-50 rounded-2xl bg-[#1B1B1B] border border-white/10 shadow-2xl overflow-hidden py-2 text-sm text-neutral-300 backdrop-blur-md">
          {isLoading && !hasResults ? (
            <div className="py-6 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF4B4B]" />
              Searching catalog...
            </div>
          ) : !hasResults ? (
            <div className="py-4 text-center text-xs text-neutral-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {results.songs.length > 0 && (
                <div className="py-1">
                  <div className="px-3.5 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-[#FF4B4B]" />
                    Songs
                  </div>
                  {results.songs.map((song) => (
                    <div
                      key={song.id}
                      onClick={() => handleSelect(`/search?q=${encodeURIComponent(song.title)}`)}
                      className="px-3.5 py-2 hover:bg-neutral-800 cursor-pointer flex items-center justify-between text-white"
                    >
                      <span className="truncate">{song.title}</span>
                      <span className="text-xs text-neutral-400 ml-2 truncate shrink-0">
                        {song.artistName}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {results.artists.length > 0 && (
                <div className="py-1">
                  <div className="px-3.5 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3 h-3 text-[#FF4B4B]" />
                    Artists
                  </div>
                  {results.artists.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => handleSelect(`/artist/${artist.id}`)}
                      className="px-3.5 py-2 hover:bg-neutral-800 cursor-pointer flex items-center gap-3 text-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <span className="truncate">{artist.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.albums.length > 0 && (
                <div className="py-1">
                  <div className="px-3.5 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Disc className="w-3 h-3 text-[#FF4B4B]" />
                    Albums
                  </div>
                  {results.albums.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => handleSelect(`/album/${album.id}`)}
                      className="px-3.5 py-2 hover:bg-neutral-800 cursor-pointer flex items-center gap-3 text-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-6 h-6 rounded object-cover shrink-0"
                      />
                      <div className="truncate flex-1">
                        <span className="text-white block truncate">{album.title}</span>
                        <span className="text-[11px] text-neutral-400 block truncate">
                          {album.artistName} • {album.releaseYear}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                onClick={handleSubmit}
                className="px-3.5 py-2.5 text-xs text-[#FF4B4B] hover:bg-neutral-800 cursor-pointer font-medium text-center"
              >
                Press Enter to view all results for &quot;{query}&quot;
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
