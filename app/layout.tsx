import 'styles/tailwind.css'
import type { Metadata } from 'next'
import { AppShell } from '../components/layout/AppShell'

export const metadata: Metadata = {
  title: 'Osho Player — Audio Discourses & Meditation',
  description: 'A complete, high-fidelity audio discourse streaming platform for Osho discourses, Upanishads, Gita, Zen, and meditation with ambient background sound.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0E0E0E] text-white antialiased selection:bg-[#FF4B4B] selection:text-white overflow-x-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
