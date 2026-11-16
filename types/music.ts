export interface Track {
  id: string
  title: string
  artistId: string
  artistName?: string
  artistImage?: string
  albumId?: string | null
  albumTitle?: string | null
  duration: number // in seconds
  audioUrl: string
  coverUrl: string
  trackNumber?: number | null
  releaseDate?: string | null
  explicit?: boolean
  lyrics?: string | null
  lyricsSynced?: string | null // JSON string of SyncedLyricLine[]
  playCount?: number
  isLiked?: boolean
  genres?: string[]
}

export interface SyncedLyricLine {
  time: number // in seconds
  text: string
}

export interface Artist {
  id: string
  name: string
  image: string
  bannerUrl?: string | null
  bio?: string | null
  monthlyListeners: number
  verified: boolean
  isFollowed?: boolean
  tracks?: Track[]
  albums?: Album[]
}

export interface Album {
  id: string
  title: string
  artistId: string
  artistName?: string
  coverUrl: string
  releaseYear: number
  description?: string | null
  tracks?: Track[]
  isSaved?: boolean
  totalDuration?: number
}

export interface Playlist {
  id: string
  title: string
  description?: string | null
  coverUrl?: string | null
  userId: string
  userName?: string
  isPublic: boolean
  tracks?: Track[]
  trackCount?: number
  totalDuration?: number
  createdAt?: string
}

export interface Genre {
  id: string
  name: string
  color?: string | null
  imageUrl?: string | null
}

export interface HistoryItem {
  id: string
  userId: string
  trackId: string
  playedAt: string
  track: Track
}

export type PlaybackRepeatMode = 'off' | 'all' | 'one'

export interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  isLoading: boolean
  duration: number
  currentTime: number
  volume: number
  isMuted: boolean
  repeatMode: PlaybackRepeatMode
  isShuffled: boolean
  playbackRate: number
  queue: Track[]
  queueIndex: number
  originalQueue: Track[]
  isQueueOpen: boolean
  isLyricsOpen: boolean
  isFullScreen: boolean
  isMiniPlayer: boolean

  // Background Ambient Sound State
  isBgSoundEnabled: boolean
  bgVolume: number
  isBgMuted: boolean

  // Player Actions
  playTrack: (track: Track, newQueue?: Track[]) => void
  playNext: (track: Track) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  reorderQueue: (startIndex: number, endIndex: number) => void
  clearQueue: () => void
  setQueueIndex: (index: number) => void
  togglePlay: () => void
  nextTrack: () => void
  previousTrack: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleRepeat: () => void
  toggleShuffle: () => void
  setPlaybackRate: (rate: number) => void
  setIsLoading: (loading: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  toggleQueue: () => void
  toggleLyrics: () => void
  toggleFullScreen: () => void
  toggleMiniPlayer: () => void
  closeDrawers: () => void

  // Background Sound Actions
  toggleBgSound: () => void
  setBgVolume: (volume: number) => void
  toggleBgMute: () => void
}
