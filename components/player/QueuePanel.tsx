'use client'

import React from 'react'
import { X, Trash2, ListMusic, Play, Disc3, ArrowUp, ArrowDown } from 'lucide-react'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { formatTime } from '../../lib/utils'

export function QueuePanel() {
  const {
    queue,
    queueIndex,
    currentTrack,
    isQueueOpen,
    toggleQueue,
    setQueueIndex,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    isPlaying,
  } = usePlayerStore()

  if (!isQueueOpen) return null

  return (
    <div className="fixed top-16 right-0 bottom-[76px] z-30 w-full max-w-md bg-[#1B1B1B] border-l border-white/10 shadow-2xl flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-[#FF4B4B]" />
          <h2 className="font-bold text-white text-base">Up Next Queue</h2>
          <span className="text-xs text-neutral-400 font-mono">({queue.length})</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearQueue}
            title="Clear Queue"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs flex items-center gap-1 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            type="button"
            onClick={toggleQueue}
            title="Close"
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Now Playing Header */}
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF4B4B]">
          Now Playing
        </div>

        {currentTrack && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-800/80 border border-white/10 mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-11 h-11 rounded-lg object-cover shrink-0"
              />
              <div className="truncate flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {currentTrack.artistName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-2">
              {isPlaying ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-0.5 h-3 bg-[#FF4B4B] animate-pulse" />
                  <span className="w-0.5 h-4 bg-[#FF4B4B] animate-pulse delay-75" />
                  <span className="w-0.5 h-2 bg-[#FF4B4B] animate-pulse delay-150" />
                </div>
              ) : (
                <Disc3 className="w-4 h-4 text-[#FF4B4B] animate-spin" />
              )}
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
          <span>Next In Queue</span>
        </div>

        {queue.length <= 1 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No more tracks in queue. Add songs from any album or playlist!
          </div>
        ) : (
          queue.map((track, idx) => {
            if (idx === queueIndex) return null
            return (
              <div
                key={`${track.id}-${idx}`}
                className="group flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800/60 transition"
              >
                <div
                  onClick={() => setQueueIndex(idx)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="relative w-10 h-10 rounded-md overflow-hidden bg-neutral-900 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="truncate flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate group-hover:text-[#FF4B4B] transition">
                      {track.title}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {track.artistName}
                    </p>
                  </div>
                </div>

                {/* Move buttons and remove */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-mono text-neutral-500 mr-1">
                    {formatTime(track.duration)}
                  </span>

                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => reorderQueue(idx, idx - 1)}
                      title="Move up"
                      className="p-1 rounded text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {idx < queue.length - 1 && (
                    <button
                      type="button"
                      onClick={() => reorderQueue(idx, idx + 1)}
                      title="Move down"
                      className="p-1 rounded text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFromQueue(idx)}
                    title="Remove from queue"
                    className="p-1 rounded text-neutral-400 hover:text-[#FF4B4B] opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
