'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Play,
  Pause,
  Heart,
  MoreVertical,
  Radio,
  ListPlus,
  Disc,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Track } from '../../types/music'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { musicService } from '../../services/musicService'
import { formatTime, formatNumber, cn } from '../../lib/utils'

interface TrackRowProps {
  track: Track
  index?: number
  queue?: Track[]
  variant?: 'table' | 'compact'
  onRemove?: () => void
}

export function TrackRow({
  track,
  index,
  queue,
  variant = 'table',
  onRemove,
}: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, playNext } = usePlayerStore()

  const isCurrent = currentTrack?.id === track.id
  const isCurrentlyPlaying = isCurrent && isPlaying
  const [isLiked, setIsLiked] = useState(track.isLiked ?? false)

  const handleRowClick = () => {
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

  if (variant === 'compact') {
    return (
      <div
        onClick={handleRowClick}
        className={cn(
          'group flex items-center justify-between p-2 rounded-xl transition cursor-pointer select-none',
          isCurrent
            ? 'bg-neutral-800/80 text-white'
            : 'hover:bg-neutral-800/40 text-neutral-300'
        )}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Thumbnail */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className={cn(
                'absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity',
                isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            >
              {isCurrentlyPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              )}
            </div>
          </div>

          {/* Titles */}
          <div className="truncate flex-1 min-w-0 pr-2">
            <h4
              className={cn(
                'text-sm font-semibold truncate',
                isCurrent ? 'text-[#FF4B4B]' : 'text-white'
              )}
            >
              {track.title}
            </h4>
            <p className="text-xs text-neutral-400 truncate mt-0.5">
              {track.artistName} • {track.albumTitle || 'Single'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleToggleLike}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white transition"
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={cn(
                'w-4 h-4',
                isLiked ? 'text-[#FF4B4B] fill-[#FF4B4B]' : 'text-neutral-400 opacity-0 group-hover:opacity-100'
              )}
            />
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                className="z-50 w-44 rounded-xl bg-[#222222] p-1.5 text-white shadow-2xl border border-white/10 outline-hidden text-xs"
              >
                <DropdownMenu.Item
                  onClick={(e) => {
                    e.stopPropagation()
                    playNext(track)
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
                >
                  <Radio className="w-4 h-4 text-neutral-400" />
                  Play next
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onClick={(e) => {
                    e.stopPropagation()
                    addToQueue(track)
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
                >
                  <ListPlus className="w-4 h-4 text-neutral-400" />
                  Add to queue
                </DropdownMenu.Item>

                {onRemove && (
                  <DropdownMenu.Item
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove()
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-[#FF4B4B] outline-hidden"
                  >
                    Remove
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    )
  }

  // Full table row variant
  return (
    <div
      onClick={handleRowClick}
      className={cn(
        'group grid grid-cols-[36px_1fr_auto] md:grid-cols-[40px_1fr_1fr_auto_80px_40px] items-center px-4 py-2.5 rounded-xl transition cursor-pointer select-none text-sm',
        isCurrent
          ? 'bg-neutral-800/80 text-white font-medium'
          : 'hover:bg-neutral-800/40 text-neutral-300'
      )}
    >
      {/* Index or Play icon */}
      <div className="flex items-center justify-start text-xs font-mono text-neutral-400">
        {isCurrentlyPlaying ? (
          <div className="flex items-center gap-0.5">
            <span className="w-0.5 h-3 bg-[#FF4B4B] animate-pulse" />
            <span className="w-0.5 h-4 bg-[#FF4B4B] animate-pulse delay-75" />
            <span className="w-0.5 h-2 bg-[#FF4B4B] animate-pulse delay-150" />
          </div>
        ) : (
          <>
            <span className="group-hover:hidden">{index !== undefined ? index + 1 : ''}</span>
            <Play className="w-4 h-4 text-white fill-white hidden group-hover:block" />
          </>
        )}
      </div>

      {/* Title & Cover */}
      <div className="flex items-center gap-3 min-w-0 pr-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-10 h-10 rounded-md object-cover shrink-0"
          loading="lazy"
        />
        <div className="truncate min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'truncate font-semibold',
                isCurrent ? 'text-[#FF4B4B]' : 'text-white'
              )}
            >
              {track.title}
            </span>
            {track.explicit && (
              <span className="px-1 py-0.2 bg-neutral-800 text-neutral-400 rounded text-[9px] font-bold">
                E
              </span>
            )}
          </div>
          <span className="text-xs text-neutral-400 block md:hidden truncate">
            {track.artistName}
          </span>
        </div>
      </div>

      {/* Artist & Plays (Desktop) */}
      <div className="hidden md:flex flex-col truncate pr-3">
        <Link
          href={`/artist/${track.artistId}`}
          onClick={(e) => e.stopPropagation()}
          className="truncate text-neutral-300 hover:text-white hover:underline text-xs"
        >
          {track.artistName}
        </Link>
        {track.playCount && (
          <span className="text-[11px] text-neutral-500 font-mono">
            {formatNumber(track.playCount)} plays
          </span>
        )}
      </div>

      {/* Like Button */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={handleToggleLike}
          className="p-1 rounded-full text-neutral-400 hover:text-white transition"
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition',
              isLiked
                ? 'text-[#FF4B4B] fill-[#FF4B4B]'
                : 'text-neutral-400 opacity-0 group-hover:opacity-100'
            )}
          />
        </button>
      </div>

      {/* Duration */}
      <div className="hidden md:block text-right text-xs font-mono text-neutral-400">
        {formatTime(track.duration)}
      </div>

      {/* More Options Menu */}
      <div className="flex items-center justify-end">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="z-50 w-44 rounded-xl bg-[#222222] p-1.5 text-white shadow-2xl border border-white/10 outline-hidden text-xs"
            >
              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation()
                  playNext(track)
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
              >
                <Radio className="w-4 h-4 text-neutral-400" />
                Play next
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation()
                  addToQueue(track)
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
              >
                <ListPlus className="w-4 h-4 text-neutral-400" />
                Add to queue
              </DropdownMenu.Item>

              {track.albumId && (
                <DropdownMenu.Item asChild>
                  <Link
                    href={`/album/${track.albumId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
                  >
                    <Disc className="w-4 h-4 text-neutral-400" />
                    Go to album
                  </Link>
                </DropdownMenu.Item>
              )}

              {onRemove && (
                <DropdownMenu.Item
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-[#FF4B4B] outline-hidden"
                >
                  Remove from list
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  )
}
