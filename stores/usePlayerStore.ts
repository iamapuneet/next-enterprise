import { create } from 'zustand'
import { Track, PlayerState, PlaybackRepeatMode } from '../types/music'
import { audioController } from '../lib/audioController'
import { bgAudioController } from '../lib/bgAudioController'
import { MOCK_TRACKS } from '../data/mockMusicData'
import { musicService } from '../services/musicService'

let isControllerBound = false

export const usePlayerStore = create<PlayerState>((set, get) => {
  // Bind audio controller callbacks to zustand store once in client
  if (typeof window !== 'undefined' && !isControllerBound) {
    isControllerBound = true
    audioController.registerCallbacks({
      onTimeUpdate: (currentTime) => set({ currentTime }),
      onDurationChange: (duration) => set({ duration }),
      onLoadingChange: (isLoading) => set({ isLoading }),
      onPlayingChange: (isPlaying) => set({ isPlaying }),
      onEnded: () => {
        const { repeatMode, nextTrack, currentTrack } = get()
        if (repeatMode === 'one' && currentTrack) {
          audioController.seek(0)
          audioController.play()
        } else {
          nextTrack()
        }
      },
      onError: (msg) => {
        console.warn('Playback notice:', msg)
        set({ isLoading: false, isPlaying: false })
      },
    })
  }

  const initialQueue = Array.isArray(MOCK_TRACKS) ? MOCK_TRACKS : []
  const initialTrack = initialQueue.length > 0 ? initialQueue[0] : null

  return {
    currentTrack: initialTrack,
    isPlaying: false,
    isLoading: false,
    duration: initialTrack ? initialTrack.duration : 0,
    currentTime: 0,
    volume: 0.8,
    isMuted: false,
    repeatMode: 'off' as PlaybackRepeatMode,
    isShuffled: false,
    playbackRate: 1,
    queue: initialQueue,
    queueIndex: 0,
    originalQueue: initialQueue,
    isQueueOpen: false,
    isLyricsOpen: false,
    isFullScreen: false,
    isMiniPlayer: false,

    // Background Ambient Sound State (Hans Zimmer - Interstellar)
    isBgSoundEnabled: true,
    bgVolume: 0.18, // Default low volume (18%)
    isBgMuted: false,

    playTrack: (track: Track, newQueue?: Track[]) => {
      const q = newQueue && newQueue.length > 0 ? newQueue : get().queue
      let idx = q.findIndex((t) => t.id === track.id)
      let updatedQueue = q

      if (idx === -1) {
        updatedQueue = [track, ...q]
        idx = 0
      }

      set({
        currentTrack: track,
        queue: updatedQueue,
        queueIndex: idx,
        isPlaying: true,
        isLoading: true,
        currentTime: 0,
        duration: track.duration,
      })

      audioController.loadAndPlay(track)
      if (get().isBgSoundEnabled && !get().isBgMuted) {
        bgAudioController.play()
      }
      musicService.recordHistory(track)
    },

    playNext: (track: Track) => {
      const { queue, queueIndex } = get()
      const newQueue = [...queue]
      newQueue.splice(queueIndex + 1, 0, track)
      set({ queue: newQueue })
    },

    addToQueue: (track: Track) => {
      const { queue } = get()
      set({ queue: [...queue, track] })
    },

    removeFromQueue: (index: number) => {
      const { queue, queueIndex, currentTrack } = get()
      if (queue.length <= 1) return

      const updated = queue.filter((_, idx) => idx !== index)
      let newIdx = queueIndex
      if (index < queueIndex) {
        newIdx = queueIndex - 1
      } else if (index === queueIndex) {
        newIdx = Math.min(queueIndex, updated.length - 1)
        const nextActive = updated[newIdx]
        if (nextActive) {
          set({ currentTrack: nextActive })
          audioController.loadAndPlay(nextActive)
        }
      }

      set({ queue: updated, queueIndex: newIdx })
    },

    reorderQueue: (startIndex: number, endIndex: number) => {
      const { queue, currentTrack } = get()
      const result = Array.from(queue)
      const [removed] = result.splice(startIndex, 1)
      if (!removed) return
      result.splice(endIndex, 0, removed)

      const newIndex = currentTrack ? result.findIndex((t) => t.id === currentTrack.id) : 0
      set({ queue: result, queueIndex: Math.max(0, newIndex) })
    },

    clearQueue: () => {
      const { currentTrack } = get()
      if (!currentTrack) return
      set({ queue: [currentTrack], queueIndex: 0 })
    },

    setQueueIndex: (index: number) => {
      const { queue } = get()
      const track = queue[index]
      if (track) {
        set({
          currentTrack: track,
          queueIndex: index,
          isPlaying: true,
          isLoading: true,
          currentTime: 0,
          duration: track.duration,
        })
        audioController.loadAndPlay(track)
        musicService.recordHistory(track)
      }
    },

    togglePlay: () => {
      const { isPlaying, currentTrack, queue, playTrack, isBgSoundEnabled, isBgMuted } = get()
      if (!currentTrack) {
        if (queue.length > 0 && queue[0]) {
          playTrack(queue[0])
        }
        return
      }

      if (isPlaying) {
        audioController.pause()
        bgAudioController.pause()
        set({ isPlaying: false })
      } else {
        audioController.play()
        if (isBgSoundEnabled && !isBgMuted) {
          bgAudioController.play()
        }
        set({ isPlaying: true })
      }
    },

    nextTrack: () => {
      const { queue, queueIndex, repeatMode, setQueueIndex } = get()
      if (queue.length === 0) return

      const nextIndex = queueIndex + 1
      if (nextIndex < queue.length) {
        setQueueIndex(nextIndex)
      } else if (repeatMode === 'all') {
        setQueueIndex(0)
      } else {
        // End of queue reached
        set({ isPlaying: false })
        audioController.pause()
        bgAudioController.pause()
      }
    },

    previousTrack: () => {
      const { queue, queueIndex, currentTime, seekTo, setQueueIndex } = get()
      // If played for more than 3 seconds, restart current track
      if (currentTime > 3) {
        seekTo(0)
        return
      }

      const prevIndex = queueIndex - 1
      if (prevIndex >= 0) {
        setQueueIndex(prevIndex)
      } else {
        seekTo(0)
      }
    },

    seekTo: (time: number) => {
      set({ currentTime: time })
      audioController.seek(time)
    },

    setVolume: (volume: number) => {
      const clamped = Math.max(0, Math.min(1, volume))
      set({ volume: clamped, isMuted: clamped === 0 })
      audioController.setVolume(clamped)
      audioController.setMuted(clamped === 0)
    },

    toggleMute: () => {
      const { isMuted, volume } = get()
      if (isMuted) {
        const restored = volume === 0 ? 0.7 : volume
        set({ isMuted: false, volume: restored })
        audioController.setMuted(false)
        audioController.setVolume(restored)
      } else {
        set({ isMuted: true })
        audioController.setMuted(true)
      }
    },

    toggleRepeat: () => {
      const { repeatMode } = get()
      const nextMode: PlaybackRepeatMode =
        repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
      set({ repeatMode: nextMode })
    },

    toggleShuffle: () => {
      const { isShuffled, queue, currentTrack, originalQueue } = get()
      if (!isShuffled) {
        // Enable shuffle
        const remaining = queue.filter((t) => t.id !== currentTrack?.id)
        // Fisher-Yates shuffle
        for (let i = remaining.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          const temp = remaining[i]!
          remaining[i] = remaining[j]!
          remaining[j] = temp
        }
        const shuffledQueue = currentTrack ? [currentTrack, ...remaining] : remaining
        set({
          isShuffled: true,
          queue: shuffledQueue,
          queueIndex: 0,
          originalQueue: queue,
        })
      } else {
        // Disable shuffle
        const restoredQueue = originalQueue.length > 0 ? originalQueue : queue
        const newIndex = currentTrack
          ? restoredQueue.findIndex((t) => t.id === currentTrack.id)
          : 0
        set({
          isShuffled: false,
          queue: restoredQueue,
          queueIndex: Math.max(0, newIndex),
        })
      }
    },

    setPlaybackRate: (rate: number) => {
      set({ playbackRate: rate })
      audioController.setPlaybackRate(rate)
    },

    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setCurrentTime: (currentTime: number) => set({ currentTime }),
    setDuration: (duration: number) => set({ duration }),

    toggleQueue: () => {
      const { isQueueOpen } = get()
      set({ isQueueOpen: !isQueueOpen, isLyricsOpen: false })
    },

    toggleLyrics: () => {
      const { isLyricsOpen } = get()
      set({ isLyricsOpen: !isLyricsOpen, isQueueOpen: false })
    },

    toggleFullScreen: () => {
      const { isFullScreen } = get()
      set({ isFullScreen: !isFullScreen })
    },

    toggleMiniPlayer: () => {
      const { isMiniPlayer } = get()
      set({ isMiniPlayer: !isMiniPlayer })
    },

    closeDrawers: () => {
      set({ isQueueOpen: false, isLyricsOpen: false })
    },

    // Background Sound Actions
    toggleBgSound: () => {
      const { isBgSoundEnabled, isPlaying, isBgMuted } = get()
      const nextState = !isBgSoundEnabled
      set({ isBgSoundEnabled: nextState })
      bgAudioController.setEnabled(nextState, isPlaying && !isBgMuted)
    },

    setBgVolume: (volume: number) => {
      const clamped = Math.max(0, Math.min(1, volume))
      set({ bgVolume: clamped, isBgMuted: clamped === 0 })
      bgAudioController.setVolume(clamped)
      bgAudioController.setMuted(clamped === 0)
    },

    toggleBgMute: () => {
      const { isBgMuted, bgVolume, isPlaying, isBgSoundEnabled } = get()
      if (isBgMuted) {
        const restored = bgVolume === 0 ? 0.18 : bgVolume
        set({ isBgMuted: false, bgVolume: restored })
        bgAudioController.setMuted(false)
        bgAudioController.setVolume(restored)
        if (isPlaying && isBgSoundEnabled) {
          bgAudioController.play()
        }
      } else {
        set({ isBgMuted: true })
        bgAudioController.setMuted(true)
      }
    },
  }
})
