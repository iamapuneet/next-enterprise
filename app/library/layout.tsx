import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Spiritual Library — Saved Discourses & Playlists',
  description:
    'Access your liked Osho discourses, customized meditation playlists, downloaded audio series, and listening history.',
}

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
