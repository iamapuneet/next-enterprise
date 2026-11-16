import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Osho Player — Audio Discourses & Meditation',
    short_name: 'Osho Player',
    description:
      'High-fidelity streaming platform for 160+ audio discourses by Osho with ambient background sound integration.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0E0E0E',
    theme_color: '#0E0E0E',
    categories: ['music', 'spirituality', 'education', 'lifestyle'],
    icons: [
      {
        src: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
