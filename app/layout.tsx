import 'styles/tailwind.css'
import type { Metadata } from 'next'
import { AppShell } from '../components/layout/AppShell'

export const metadata: Metadata = {
  title: 'NAD Music — Premium Music Streaming',
  description: 'A complete, production-quality music streaming platform inspired by YouTube Music with persistent playback, discover, explore, and lyrics.',
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
