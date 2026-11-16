import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listening History — Oshovani',
  description: 'View and resume your recently played Osho discourses and meditation sessions on Oshovani.',
}

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
