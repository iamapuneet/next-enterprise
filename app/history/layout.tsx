import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listening History — Osho Player',
  description: 'View and resume your recently played Osho discourses and meditation sessions.',
}

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
