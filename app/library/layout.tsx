import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Spiritual Library — Oshovani',
  description:
    'Access your liked Osho discourses, customized meditation playlists, downloaded audio series, and listening history on Oshovani.',
}

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
