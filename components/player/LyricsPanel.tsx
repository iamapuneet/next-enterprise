'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import { X, Mic2, Music } from 'lucide-react'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { SyncedLyricLine } from '../../types/music'
import { cn } from '../../lib/utils'

export function LyricsPanel() {
  const { currentTrack, currentTime, isLyricsOpen, toggleLyrics, seekTo } = usePlayerStore()
  const activeLineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse synchronized lyrics if available
  const syncedLyrics: SyncedLyricLine[] | null = useMemo(() => {
    if (!currentTrack?.lyricsSynced) return null
    try {
      const parsed = JSON.parse(currentTrack.lyricsSynced)
      return Array.isArray(parsed) ? (parsed as SyncedLyricLine[]) : null
    } catch {
      return null
    }
  }, [currentTrack?.lyricsSynced])

  // Determine current active lyric index
  const activeIndex = useMemo(() => {
    if (!syncedLyrics || syncedLyrics.length === 0) return -1
    for (let i = syncedLyrics.length - 1; i >= 0; i--) {
      const item = syncedLyrics[i]
      if (item && currentTime >= item.time) {
        return i
      }
    }
    return 0
  }, [syncedLyrics, currentTime])

  // Auto-scroll active lyric into view
  useEffect(() => {
    if (activeLineRef.current && containerRef.current && isLyricsOpen) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [activeIndex, isLyricsOpen])

  if (!isLyricsOpen) return null

  return (
    <div className="fixed top-16 right-0 bottom-[76px] z-30 w-full max-w-lg bg-[#141414] border-l border-white/10 shadow-2xl flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-[#FF4B4B]" />
          <h2 className="font-bold text-white text-base">Lyrics</h2>
          {currentTrack && (
            <span className="text-xs text-neutral-400 truncate max-w-[200px]">
              • {currentTrack.title}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={toggleLyrics}
          title="Close lyrics"
          className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Lyrics Content Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth text-center"
      >
        {!currentTrack ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-3">
            <Music className="w-8 h-8 opacity-40" />
            <p className="text-sm">No track currently playing</p>
          </div>
        ) : syncedLyrics && syncedLyrics.length > 0 ? (
          /* Synchronized Lyrics */
          <div className="space-y-6 py-12">
            {syncedLyrics.map((line, idx) => {
              const isActive = idx === activeIndex
              const isPast = idx < activeIndex

              return (
                <div
                  key={`${line.time}-${idx}`}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => seekTo(line.time)}
                  className={cn(
                    'cursor-pointer transition-all duration-300 font-bold leading-relaxed px-4 py-1.5 rounded-xl',
                    isActive
                      ? 'text-white text-2xl md:text-3xl scale-105 bg-white/5 drop-shadow-md text-[#FF4B4B]'
                      : isPast
                      ? 'text-neutral-400 text-lg md:text-xl hover:text-white'
                      : 'text-neutral-400 text-lg md:text-xl hover:text-white'
                  )}
                >
                  {line.text}
                </div>
              )
            })}
          </div>
        ) : currentTrack.lyrics ? (
          /* Plain Lyrics fallback */
          <div className="text-left py-6">
            <p className="text-neutral-300 text-base md:text-lg leading-loose whitespace-pre-line font-medium">
              {currentTrack.lyrics}
            </p>
          </div>
        ) : (
          /* Empty state */
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-3 py-16">
            <Mic2 className="w-10 h-10 opacity-30 text-[#FF4B4B]" />
            <p className="text-sm font-semibold text-neutral-300">
              Lyrics are not available for this track
            </p>
            <p className="text-xs text-neutral-500 max-w-xs">
              Check back soon or explore other songs with synchronized lyrics!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
