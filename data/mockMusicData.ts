import { Genre, Playlist } from '../types/music'

export const OSHO_GENRES: Genre[] = [
  { id: 'upanishad', name: 'Upanishad (उपनिषद)', color: '#B45309', imageUrl: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg' },
  { id: 'geeta', name: 'Maha Geeta (महागीता)', color: '#DC2626', imageUrl: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg' },
  { id: 'krishna', name: 'Krishna (कृष्ण)', color: '#2563EB', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80' },
  { id: 'kabir', name: 'Kabir & Mystics (कबीर)', color: '#7C3AED', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80' },
  { id: 'zen', name: 'Zen & Sufi (ज़ेन सूफ़ी)', color: '#059669', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80' },
  { id: 'meditation', name: 'Meditation & Dhyan (ध्यान)', color: '#DB2777', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80' },
  { id: 'buddha', name: 'Buddha (बुद्ध)', color: '#D97706', imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80' },
  { id: 'nanak', name: 'Nanak & Japji (नानक)', color: '#4B5563', imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80' },
]

export const OSHO_MOOD_CATEGORIES = [
  'All',
  'Upanishad',
  'Maha Geeta',
  'Krishna',
  'Kabir',
  'Meditation',
  'Zen & Sufi',
  'Buddha',
  'Silent Meditation',
]

export const OSHO_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-upanishad',
    title: 'Adhyatam Upanishad Complete Series',
    description: 'All 17 original audio discourses on Adhyatam Upanishad by Osho.',
    coverUrl: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg',
    userId: 'osho-curator',
    userName: 'Osho World',
    isPublic: true,
    trackCount: 17,
    totalDuration: 59400,
    tracks: [],
  },
  {
    id: 'playlist-meditation',
    title: 'Evening Silence & Meditation',
    description: 'Immersive talks exploring the inner fragrance of consciousness and no-mind.',
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    userId: 'osho-curator',
    userName: 'Osho World',
    isPublic: true,
    trackCount: 8,
    totalDuration: 32400,
    tracks: [],
  },
  {
    id: 'playlist-mystics',
    title: 'Songs of the Mystics (Kabir, Sahajo & Dadu)',
    description: 'Discourses celebrating the poetry of enlightenment, love, and surrender.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    userId: 'osho-curator',
    userName: 'Osho World',
    isPublic: true,
    trackCount: 10,
    totalDuration: 41000,
    tracks: [],
  },
]
