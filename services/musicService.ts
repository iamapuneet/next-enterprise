import {
  MOCK_TRACKS,
  MOCK_ALBUMS,
  MOCK_ARTISTS,
  MOCK_PLAYLISTS,
  MOCK_GENRES,
  MOOD_CATEGORIES,
} from '../data/mockMusicData'
import { Track, Artist, Album, Playlist, Genre } from '../types/music'

// In-memory / localStorage state persistence for client interactions
const getStoredLikes = (): string[] => {
  if (typeof window === 'undefined') return ['track-1', 'track-2', 'track-4', 'track-6', 'track-8']
  try {
    const saved = localStorage.getItem('nad_liked_tracks')
    return saved ? (JSON.parse(saved) as string[]) : ['track-1', 'track-2', 'track-4', 'track-6', 'track-8']
  } catch {
    return ['track-1', 'track-2', 'track-4', 'track-6', 'track-8']
  }
}

const saveStoredLikes = (ids: string[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('nad_liked_tracks', JSON.stringify(ids))
  } catch (e) {
    console.error(e)
  }
}

const getStoredPlaylists = (): Playlist[] => {
  if (typeof window === 'undefined') return MOCK_PLAYLISTS
  try {
    const saved = localStorage.getItem('nad_custom_playlists')
    return saved ? (JSON.parse(saved) as Playlist[]) : MOCK_PLAYLISTS
  } catch {
    return MOCK_PLAYLISTS
  }
}

const saveStoredPlaylists = (playlists: Playlist[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('nad_custom_playlists', JSON.stringify(playlists))
  } catch (e) {
    console.error(e)
  }
}

const getStoredHistory = (): Track[] => {
  if (typeof window === 'undefined') return MOCK_TRACKS.slice(0, 4)
  try {
    const saved = localStorage.getItem('nad_play_history')
    return saved ? (JSON.parse(saved) as Track[]) : MOCK_TRACKS.slice(0, 4)
  } catch {
    return MOCK_TRACKS.slice(0, 4)
  }
}

const saveStoredHistory = (tracks: Track[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('nad_play_history', JSON.stringify(tracks))
  } catch (e) {
    console.error(e)
  }
}

export const musicService = {
  // Discovery & Home
  async getFeatured(): Promise<{
    banner: {
      title: string
      subtitle: string
      description: string
      coverUrl: string
      artistName: string
      track: Track
    }
  }> {
    return {
      banner: {
        title: 'Neon Horizon — Deluxe Edition',
        subtitle: 'Featured Release • Synthwave & Electronic',
        description: 'Immerse yourself into cinematic retro electro, driving drums, and night skylines.',
        coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
        artistName: 'The Midnight Echo',
        track: MOCK_TRACKS[0]!,
      },
    }
  },

  async getMoodCategories(): Promise<string[]> {
    return MOOD_CATEGORIES
  },

  async getQuickPicks(): Promise<Track[]> {
    const likes = getStoredLikes()
    return MOCK_TRACKS.map((t) => ({
      ...t,
      isLiked: likes.includes(t.id),
    }))
  },

  async getTrending(): Promise<Track[]> {
    const likes = getStoredLikes()
    return [...MOCK_TRACKS]
      .sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0))
      .map((t) => ({ ...t, isLiked: likes.includes(t.id) }))
  },

  async getNewReleases(): Promise<Album[]> {
    return MOCK_ALBUMS
  },

  async getPopularArtists(): Promise<Artist[]> {
    return MOCK_ARTISTS
  },

  async getPlaylists(): Promise<Playlist[]> {
    return getStoredPlaylists()
  },

  // Explore & Categories
  async getGenres(): Promise<Genre[]> {
    return MOCK_GENRES
  },

  // Details
  async getArtistById(id: string): Promise<Artist | null> {
    const artist = MOCK_ARTISTS.find((a) => a.id === id) || MOCK_ARTISTS[0]!
    const tracks = (await this.getQuickPicks()).filter((t) => t.artistId === artist.id || t.artistName === artist.name)
    const albums = MOCK_ALBUMS.filter((al) => al.artistId === artist.id || al.artistName === artist.name)

    return {
      ...artist,
      tracks: tracks.length > 0 ? tracks : (await this.getQuickPicks()).slice(0, 5),
      albums,
    }
  },

  async getAlbumById(id: string): Promise<Album | null> {
    const album = MOCK_ALBUMS.find((a) => a.id === id) || MOCK_ALBUMS[0]!
    const tracks = (await this.getQuickPicks()).filter((t) => t.albumId === album.id)
    const albumTracks = tracks.length > 0 ? tracks : (await this.getQuickPicks()).slice(0, 4)
    const totalDuration = albumTracks.reduce((acc, curr) => acc + curr.duration, 0)

    return {
      ...album,
      tracks: albumTracks,
      totalDuration,
    }
  },

  async getPlaylistById(id: string): Promise<Playlist | null> {
    const playlists = getStoredPlaylists()
    const playlist = playlists.find((p) => p.id === id) || playlists[0]!
    const likes = getStoredLikes()
    const tracks = (playlist.tracks ?? MOCK_TRACKS).map((t) => ({
      ...t,
      isLiked: likes.includes(t.id),
    }))
    const totalDuration = tracks.reduce((acc, curr) => acc + curr.duration, 0)

    return {
      ...playlist,
      tracks,
      trackCount: tracks.length,
      totalDuration,
    }
  },

  // Search
  async search(
    query: string,
    category: 'all' | 'songs' | 'albums' | 'artists' | 'playlists' = 'all'
  ): Promise<{
    topResult?: Track | Artist | Album
    songs: Track[]
    albums: Album[]
    artists: Artist[]
    playlists: Playlist[]
  }> {
    const q = query.trim().toLowerCase()
    const allTracks = await this.getQuickPicks()
    const allPlaylists = getStoredPlaylists()

    if (!q) {
      return {
        songs: allTracks.slice(0, 5),
        albums: MOCK_ALBUMS,
        artists: MOCK_ARTISTS,
        playlists: allPlaylists,
      }
    }

    const filteredSongs = allTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.artistName && t.artistName.toLowerCase().includes(q)) ||
        (t.albumTitle && t.albumTitle.toLowerCase().includes(q))
    )

    const filteredAlbums = MOCK_ALBUMS.filter(
      (al) =>
        al.title.toLowerCase().includes(q) ||
        (al.artistName && al.artistName.toLowerCase().includes(q))
    )

    const filteredArtists = MOCK_ARTISTS.filter((ar) =>
      ar.name.toLowerCase().includes(q)
    )

    const filteredPlaylists = allPlaylists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    )

    const topResult =
      filteredSongs[0] || filteredArtists[0] || filteredAlbums[0] || undefined

    return {
      topResult,
      songs: category === 'all' || category === 'songs' ? filteredSongs : [],
      albums: category === 'all' || category === 'albums' ? filteredAlbums : [],
      artists: category === 'all' || category === 'artists' ? filteredArtists : [],
      playlists: category === 'all' || category === 'playlists' ? filteredPlaylists : [],
    }
  },

  // User Actions
  async toggleLikeTrack(trackId: string): Promise<boolean> {
    const current = getStoredLikes()
    let updated: string[]
    let isLiked = false

    if (current.includes(trackId)) {
      updated = current.filter((id) => id !== trackId)
      isLiked = false
    } else {
      updated = [...current, trackId]
      isLiked = true
    }

    saveStoredLikes(updated)
    return isLiked
  },

  async getLikedTracks(): Promise<Track[]> {
    const likedIds = getStoredLikes()
    return MOCK_TRACKS.filter((t) => likedIds.includes(t.id)).map((t) => ({
      ...t,
      isLiked: true,
    }))
  },

  async recordHistory(track: Track): Promise<void> {
    const current = getStoredHistory()
    const filtered = current.filter((t) => t.id !== track.id)
    const updated = [track, ...filtered].slice(0, 30)
    saveStoredHistory(updated)
  },

  async getHistory(): Promise<Track[]> {
    return getStoredHistory()
  },

  async clearHistory(): Promise<void> {
    saveStoredHistory([])
  },

  async createPlaylist(data: { title: string; description?: string }): Promise<Playlist> {
    const playlists = getStoredPlaylists()
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      userId: 'user-me',
      userName: 'You',
      isPublic: true,
      trackCount: 0,
      totalDuration: 0,
      tracks: [],
    }

    const updated = [newPlaylist, ...playlists]
    saveStoredPlaylists(updated)
    return newPlaylist
  },

  async addTrackToPlaylist(playlistId: string, track: Track): Promise<Playlist | null> {
    const playlists = getStoredPlaylists()
    const playlist = playlists.find((p) => p.id === playlistId)
    if (!playlist) return null

    const existingTracks = playlist.tracks || []
    if (existingTracks.some((t) => t.id === track.id)) return playlist

    const updatedTracks = [...existingTracks, track]
    const updatedPlaylist: Playlist = {
      ...playlist,
      tracks: updatedTracks,
      trackCount: updatedTracks.length,
      totalDuration: updatedTracks.reduce((acc, t) => acc + t.duration, 0),
    }

    const updatedList = playlists.map((p) => (p.id === playlistId ? updatedPlaylist : p))
    saveStoredPlaylists(updatedList)
    return updatedPlaylist
  },

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<Playlist | null> {
    const playlists = getStoredPlaylists()
    const playlist = playlists.find((p) => p.id === playlistId)
    if (!playlist) return null

    const updatedTracks = (playlist.tracks || []).filter((t) => t.id !== trackId)
    const updatedPlaylist: Playlist = {
      ...playlist,
      tracks: updatedTracks,
      trackCount: updatedTracks.length,
      totalDuration: updatedTracks.reduce((acc, t) => acc + t.duration, 0),
    }

    const updatedList = playlists.map((p) => (p.id === playlistId ? updatedPlaylist : p))
    saveStoredPlaylists(updatedList)
    return updatedPlaylist
  },
}
