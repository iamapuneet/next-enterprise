'use client'

import React from 'react'
import Link from 'next/link'
import { Play, Pause, MoreVertical, Heart, ListPlus, Radio, Disc } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Track } from '../../types/music'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { musicService } from '../../services/musicService'

interface MusicCardProps {
  track: Track
  queue?: Track[]
}

export function MusicCard({ track, queue }: MusicCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, playNext } = usePlayerStore()

  const isCurrent = currentTrack?.id === track.id
  const isCurrentlyPlaying = isCurrent && isPlaying
  const [isLiked, setIsLiked] = React.useState(track.isLiked ?? false)

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCurrent) {
      togglePlay()
    } else {
      playTrack(track, queue)
    }
  }

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const updated = await musicService.toggleLikeTrack(track.id)
    setIsLiked(updated)
  }

  return (
    <div className="group relative flex flex-col p-3 rounded-2xl bg-[#1B1B1B]/40 hover:bg-[#1B1B1B] border border-transparent hover:border-white/5 transition-all duration-200 select-none">
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handlePlayClick}
            aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Currently playing equalizer indicator */}
        {isCurrentlyPlaying && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-xs flex items-center gap-1">
            <span className="w-1 h-3 bg-[#FF4B4B] animate-pulse rounded-full" />
            <span className="w-1 h-4 bg-[#FF4B4B] animate-pulse delay-75 rounded-full" />
            <span className="w-1 h-2 bg-[#FF4B4B] animate-pulse delay-150 rounded-full" />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-3 flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <h3
            onClick={handlePlayClick}
            className="font-semibold text-sm text-white truncate cursor-pointer hover:underline"
            title={track.title}
          >
            {track.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-neutral-400">
            {track.explicit && (
              <span className="px-1 py-0.2 bg-neutral-800 text-neutral-300 rounded text-[9px] font-bold tracking-wider">
                E
              </span>
            )}
            <Link
              href={`/artist/${track.artistId}`}
              className="truncate hover:text-white hover:underline transition"
            >
              {track.artistName || 'Unknown Artist'}
            </Link>
          </div>
        </div>

        {/* 3-dots context menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition shrink-0"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 w-48 rounded-xl bg-[#222222] p-1.5 text-white shadow-2xl border border-white/10 outline-hidden text-xs"
            >
              <DropdownMenu.Item
                onClick={() => playNext(track)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
              >
                <Radio className="w-4 h-4 text-neutral-400" />
                Play next
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={() => addToQueue(track)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
              >
                <ListPlus className="w-4 h-4 text-neutral-400" />
                Add to queue
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={handleToggleLike}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'text-[#FF4B4B] fill-[#FF4B4B]' : 'text-neutral-400'}`} />
                {isLiked ? 'Remove from Liked' : 'Save to Liked Songs'}
              </DropdownMenu.Item>

              {track.albumId && (
                <DropdownMenu.Item asChild>
                  <Link
                    href={`/album/${track.albumId}`}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
                  >
                    <Disc className="w-4 h-4 text-neutral-400" />
                    Go to album
                  </Link>
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  )
}
