import { Track, Album, Artist } from '../types/music'
import oshoPreloadedRaw from '../data/oshoPreloaded.json'

const oshoPreloaded = oshoPreloadedRaw as Record<string, any>

const BUILD_ID = 'oae6oV2EY3UaGMuWKOyIB'
const BASE_DATA = `https://oshoworld.com/_next/data/${BUILD_ID}`
const BASE_HOST = 'https://oshoworld.com'

export function parseDurationToSeconds(durationStr?: string): number {
  if (!durationStr) return 3600 // fallback 1 hour
  const parts = durationStr.split(':').map((p) => parseInt(p, 10))
  if (parts.length === 3 && parts[0] !== undefined && parts[1] !== undefined && parts[2] !== undefined) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  if (parts.length === 2 && parts[0] !== undefined && parts[1] !== undefined) {
    return parts[0] * 60 + parts[1]
  }
  return 3600
}

export function formatOshoMediaUrl(path?: string): string {
  if (!path) return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const cleaned = path.startsWith('/') ? path : `/${path}`
  return `${BASE_HOST}${cleaned}`
}

export const OSHO_ARTIST: Artist = {
  id: 'artist-osho',
  name: 'Osho (ओशो)',
  monthlyListeners: 18400000,
  verified: true,
  bio: 'Mystic, philosopher, and spiritual master whose discourses on Upanishads, Gita, Zen, and meditation have awakened millions across the globe.',
  image: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg',
  bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
  isFollowed: true,
}

export const oshoApiService = {
  async fetchPageData(slug: string): Promise<any> {
    // Check preloaded cache first for instant response
    if (oshoPreloaded[slug]) {
      return oshoPreloaded[slug]
    }

    try {
      const url = `${BASE_DATA}/${slug}.json?index=${slug}`
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as any
      return json.pageProps?.data?.pageData || null
    } catch (err) {
      console.warn(`Fallback for Osho slug ${slug}:`, err)
      return oshoPreloaded[slug] || null
    }
  },

  async getSeriesList(): Promise<Album[]> {
    const data = await this.fetchPageData('audio-series-home-hindi')
    const items = data?.items || []

    return items.map((item: any) => ({
      id: item.slug,
      title: item.title,
      artistId: OSHO_ARTIST.id,
      artistName: OSHO_ARTIST.name,
      coverUrl: formatOshoMediaUrl(item.image),
      releaseYear: 2024,
      description: `Discourse series by Osho containing ${item.count} audio discourses.`,
      isSaved: false,
    }))
  },

  async getSeries(slug: string): Promise<Album | null> {
    const data = await this.fetchPageData(slug)
    if (!data) return null

    const category = data.categoryData || {}
    const list = data.listData || []

    const tracks: Track[] = list.map((item: any, idx: number) => {
      const audioUrl = formatOshoMediaUrl(item.file)
      const coverUrl = formatOshoMediaUrl(item.imageFile || category.image)

      return {
        id: item.slug || `osho-${slug}-${idx + 1}`,
        title: item.title,
        artistId: OSHO_ARTIST.id,
        artistName: OSHO_ARTIST.name,
        artistImage: OSHO_ARTIST.image,
        albumId: slug,
        albumTitle: category.title || item.title,
        duration: parseDurationToSeconds(item.duration),
        audioUrl,
        coverUrl,
        trackNumber: item.audio_index || idx + 1,
        releaseDate: '1971',
        explicit: false,
        playCount: 154000 + idx * 8200,
        genres: ['spiritual', 'hindi', 'meditation'],
      }
    })

    const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0)

    return {
      id: slug,
      title: category.title || slug,
      artistId: OSHO_ARTIST.id,
      artistName: OSHO_ARTIST.name,
      coverUrl: tracks[0]?.coverUrl || formatOshoMediaUrl(category.image),
      releaseYear: 1971,
      description: `Complete discourse series with ${tracks.length} discourses by Osho. Available in original studio audio quality.`,
      tracks,
      totalDuration,
    }
  },

  async getTrack(slug: string): Promise<Track | null> {
    const data = await this.fetchPageData(slug)
    if (!data || !data.audioData) return null

    const audio = data.audioData
    const coverUrl = formatOshoMediaUrl(audio.imageFile)
    const audioUrl = formatOshoMediaUrl(audio.audioFile)

    // Clean html in description for lyrics display
    let lyricsClean = audio.description || ''
    lyricsClean = lyricsClean.replace(/<br\s*[\/]?>/gi, '\n')
    lyricsClean = lyricsClean.replace(/<[^>]+>/g, '')

    return {
      id: slug,
      title: audio.title,
      artistId: OSHO_ARTIST.id,
      artistName: OSHO_ARTIST.name,
      artistImage: OSHO_ARTIST.image,
      albumId: 'adhyatam-upanishad-by-osho-1-17',
      albumTitle: 'Adhyatam Upanishad',
      duration: parseDurationToSeconds(audio.duration),
      audioUrl,
      coverUrl,
      lyrics: lyricsClean,
      explicit: false,
      playCount: 489000,
      genres: ['spiritual', 'hindi', 'meditation'],
    }
  },

  async getFeaturedTracks(): Promise<Track[]> {
    // Load top tracks from preloaded datasets
    const series1 = await this.getSeries('adhyatam-upanishad-by-osho-1-17')
    const series2 = await this.getSeries('010-agyat-ki-aur-1-7')
    const series3 = await this.getSeries('ajhun-chet-ganwar-by-osho-1-21')

    const t1 = series1?.tracks?.slice(0, 5) || []
    const t2 = series2?.tracks?.slice(0, 3) || []
    const t3 = series3?.tracks?.slice(0, 3) || []

    // Fetch full description for track 1
    const detail = await this.getTrack('adhyatam-upanishad-01')
    if (detail && t1[0]) {
      t1[0].lyrics = detail.lyrics
    }

    return [...t1, ...t2, ...t3]
  },
}
