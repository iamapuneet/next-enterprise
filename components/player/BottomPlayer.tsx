'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ListMusic,
  Mic2,
  Maximize2,
  MoreVertical,
  Radio,
  ListPlus,
  Disc,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { ProgressBar } from './ProgressBar'
import { VolumeControl } from './VolumeControl'
import { BackgroundSoundControl } from './BackgroundSoundControl'
import { musicService } from '../../services/musicService'
import { formatTime, cn } from '../../lib/utils'

export function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    repeatMode,
    toggleRepeat,
    isShuffled,
    toggleShuffle,
    volume,
    isMuted,
    setVolume,
    toggleMute,
    isQueueOpen,
    toggleQueue,
    isLyricsOpen,
    toggleLyrics,
    toggleFullScreen,
    playNext,
    addToQueue,
  } = usePlayerStore()

  const [isLiked, setIsLiked] = useState(currentTrack?.isLiked ?? false)

  // Keep like in sync with track
  React.useEffect(() => {
    setIsLiked(currentTrack?.isLiked ?? false)
  }, [currentTrack?.id, currentTrack?.isLiked])

  const handleToggleLike = async () => {
    if (!currentTrack) return
    const updated = await musicService.toggleLikeTrack(currentTrack.id)
    setIsLiked(updated)
  }

  if (!currentTrack) return null

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-[76px] bg-[#121212] border-t border-white/5 select-none flex flex-col justify-between">
      {/* Top Edge Progress Bar */}
      <div className="w-full -mt-1 z-50">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
        />
      </div>

      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left Section: Track Info & Artwork */}
        <div className="flex items-center gap-3 min-w-0 w-1/4 max-w-[280px]">
          <div
            onClick={toggleFullScreen}
            className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 shrink-0 cursor-pointer group shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="truncate flex-1 min-w-0">
            <h4
              onClick={toggleFullScreen}
              className="font-semibold text-sm text-white truncate cursor-pointer hover:underline"
            >
              {currentTrack.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 truncate mt-0.5">
              <Link
                href={`/artist/${currentTrack.artistId}`}
                className="truncate hover:text-white hover:underline transition"
              >
                {currentTrack.artistName}
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleLike}
            title={isLiked ? 'Unlike' : 'Like'}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white transition shrink-0"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-transform active:scale-125',
                isLiked ? 'text-[#FF4B4B] fill-[#FF4B4B]' : 'text-neutral-400 hover:text-white'
              )}
            />
          </button>

          {/* 3 dots context menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition shrink-0 hidden sm:block"
                title="More actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={8}
                className="z-50 w-44 rounded-xl bg-[#222222] p-1.5 text-white shadow-2xl border border-white/10 outline-hidden text-xs"
              >
                <DropdownMenu.Item
                  onClick={() => playNext(currentTrack)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
                >
                  <Radio className="w-4 h-4 text-neutral-400" />
                  Play next
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onClick={() => addToQueue(currentTrack)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer text-neutral-200 hover:text-white outline-hidden"
                >
                  <ListPlus className="w-4 h-4 text-neutral-400" />
                  Add to queue
                </DropdownMenu.Item>

                {currentTrack.albumId && (
                  <DropdownMenu.Item asChild>
                    <Link
                      href={`/album/${currentTrack.albumId}`}
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

        {/* Center Section: Controls & Timer */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-[420px]">
          <div className="flex items-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={toggleShuffle}
              title="Shuffle"
              className={cn(
                'p-1.5 rounded-full transition hidden sm:inline-flex',
                isShuffled ? 'text-[#FF4B4B]' : 'text-neutral-400 hover:text-white'
              )}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={previousTrack}
              title="Previous Track"
              className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              title="Next Track"
              className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              type="button"
              onClick={toggleRepeat}
              title="Repeat"
              className={cn(
                'p-1.5 rounded-full transition hidden sm:inline-flex',
                repeatMode !== 'off' ? 'text-[#FF4B4B]' : 'text-neutral-400 hover:text-white'
              )}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Time display */}
          <div className="text-[11px] font-mono text-neutral-400 mt-0.5 flex items-center gap-1">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Section: BG Ambient Sound, Lyrics, Queue, Volume, FullScreen */}
        <div className="flex items-center justify-end gap-2.5 w-1/3 max-w-[340px]">
          {/* Ambient Background Sound Toggle & Slider */}
          <BackgroundSoundControl />

          <button
            type="button"
            onClick={toggleLyrics}
            title="Lyrics"
            className={cn(
              'p-2 rounded-full transition hidden sm:inline-flex',
              isLyricsOpen
                ? 'bg-neutral-800 text-[#FF4B4B]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            )}
          >
            <Mic2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleQueue}
            title="Queue"
            className={cn(
              'p-2 rounded-full transition hidden sm:inline-flex',
              isQueueOpen
                ? 'bg-neutral-800 text-[#FF4B4B]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            )}
          >
            <ListMusic className="w-5 h-5" />
          </button>

          <div className="hidden lg:flex items-center">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={setVolume}
              onToggleMute={toggleMute}
            />
          </div>

          <button
            type="button"
            onClick={toggleFullScreen}
            title="Full Screen"
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
