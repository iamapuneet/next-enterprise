'use client'

import React, { useState, useEffect } from 'react'
import { musicService } from '../../services/musicService'
import { Track } from '../../types/music'
import { TrackRow } from '../../components/music/TrackRow'
import { History, Trash2, Play } from 'lucide-react'
import { usePlayerStore } from '../../stores/usePlayerStore'

export default function HistoryPage() {
  const [history, setHistory] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { playTrack } = usePlayerStore()

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true)
      try {
        const data = await musicService.getHistory()
        setHistory(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadHistory()
  }, [])

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear your listening history?')) {
      await musicService.clearHistory()
      setHistory([])
    }
  }

  const handleRemoveTrack = (trackId: string) => {
    const updated = history.filter((t) => t.id !== trackId)
    setHistory(updated)
    try {
      localStorage.setItem('osho_play_history', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handlePlayAll = () => {
    if (history.length > 0) {
      playTrack(history[0]!, history)
    }
  }

  return (
    <div className="space-y-8 pb-16 select-none">
      {/* Page Title & Clear Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF4B4B] text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Activity</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Listening History
          </h1>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs shadow-md transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play all
            </button>

            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-[#FF4B4B] font-semibold text-xs border border-white/10 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-neutral-400">
          Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
          <History className="w-12 h-12 text-neutral-600" />
          <h3 className="text-lg font-bold text-white">No history yet</h3>
          <p className="text-sm text-neutral-400 max-w-sm">
            Songs you stream will automatically appear here so you can easily replay them.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Recently Played ({history.length})
          </span>

          <div className="bg-[#1B1B1B]/40 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
            {history.map((track, idx) => (
              <TrackRow
                key={`${track.id}-${idx}`}
                track={track}
                index={idx}
                queue={history}
                variant="table"
                onRemove={() => handleRemoveTrack(track.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
