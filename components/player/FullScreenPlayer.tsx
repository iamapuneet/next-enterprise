'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Mic2,
} from 'lucide-react'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { ProgressBar } from './ProgressBar'
import { VolumeControl } from './VolumeControl'
import { BackgroundSoundControl } from './BackgroundSoundControl'
import { formatTime } from '../../lib/utils'

export function FullScreenPlayer() {
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
    isFullScreen,
    toggleFullScreen,
    isQueueOpen,
    toggleQueue,
    isLyricsOpen,
    toggleLyrics,
  } = usePlayerStore()

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        toggleFullScreen()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullScreen, toggleFullScreen])

  if (!isFullScreen || !currentTrack) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#0E0E0E] flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Dynamic blurred ambient background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentTrack.coverUrl}
        alt={currentTrack.title}
        className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-30 scale-125 pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Top Header Controls */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#FF4B4B] bg-[#FF4B4B]/15 px-3 py-1 rounded-full border border-[#FF4B4B]/20">
            Playing From NAD Music
          </span>
        </div>

        <div className="flex items-center gap-3">
          <BackgroundSoundControl />

          <button
            type="button"
            onClick={toggleLyrics}
            className={`p-2.5 rounded-full border transition ${
              isLyricsOpen
                ? 'bg-[#FF4B4B] text-white border-[#FF4B4B]'
                : 'text-neutral-300 hover:text-white bg-neutral-900/60 border-white/10'
            }`}
            title="Lyrics"
          >
            <Mic2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleQueue}
            className={`p-2.5 rounded-full border transition ${
              isQueueOpen
                ? 'bg-[#FF4B4B] text-white border-[#FF4B4B]'
                : 'text-neutral-300 hover:text-white bg-neutral-900/60 border-white/10'
            }`}
            title="Queue"
          >
            <ListMusic className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-2.5 rounded-full text-neutral-300 hover:text-white bg-neutral-900/60 border border-white/10 hover:bg-neutral-800 transition"
            title="Close Full Screen"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center Artwork & Meta */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full my-6">
        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="mt-8 text-center w-full">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight truncate">
            {currentTrack.title}
          </h2>
          <p className="text-base md:text-lg text-neutral-300 mt-1 truncate">
            <Link
              href={`/artist/${currentTrack.artistId}`}
              onClick={toggleFullScreen}
              className="hover:underline hover:text-white"
            >
              {currentTrack.artistName}
            </Link>
            {currentTrack.albumTitle && (
              <span className="text-neutral-500"> • {currentTrack.albumTitle}</span>
            )}
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-4">
        {/* Progress Bar & Timers */}
        <div>
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
            variant="full"
          />
          <div className="flex justify-between items-center text-xs font-mono text-neutral-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Action Buttons */}
        <div className="flex items-center justify-between">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleShuffle}
              title="Shuffle"
              className={`p-2 rounded-full transition ${
                isShuffled ? 'text-[#FF4B4B]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
          </div>

          {/* Center Main Transport */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={previousTrack}
              title="Previous"
              className="p-3 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              title="Next"
              className="p-3 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleRepeat}
              title="Repeat"
              className={`p-2 rounded-full transition ${
                repeatMode !== 'off' ? 'text-[#FF4B4B]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Volume slider row */}
        <div className="flex justify-center pt-2">
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
          />
        </div>
      </div>
    </div>
  )
}
