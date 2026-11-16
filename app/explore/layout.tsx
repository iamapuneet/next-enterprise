import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Osho Discourses — Master Categories, Upanishad & Geeta',
  description:
    'Browse complete collections of discourses categorized into 16 master themes: Krishna, Shiva, Kabir, Upanishad, Ashtavakra, Zen, Buddha, and Nanak with original Hindi audio streaming.',
  openGraph: {
    title: 'Explore Osho Audio Discourses & Master Categories',
    description:
      'Search and browse discourse series by category: Upanishad, Geeta, Kabir, Zen, and Dhyan.',
  },
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
