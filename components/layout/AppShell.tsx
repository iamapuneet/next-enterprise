'use client'

import React, { useState } from 'react'
import { AppSidebar } from '../navigation/AppSidebar'
import { AppHeader } from './AppHeader'
import { BottomPlayer } from '../player/BottomPlayer'
import { QueuePanel } from '../player/QueuePanel'
import { LyricsPanel } from '../player/LyricsPanel'
import { FullScreenPlayer } from '../player/FullScreenPlayer'
import { MobileNavigation } from '../navigation/MobileNavigation'
import { usePlayerStore } from '../../stores/usePlayerStore'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentTrack } = usePlayerStore()

  return (
    <div className="relative h-screen w-screen bg-[#0E0E0E] text-white overflow-hidden flex flex-col">
      {/* Persistent Sidebar */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area - scrolls independently while sidebar and bottom player remain fixed */}
      <div className="flex-1 md:pl-[240px] h-[calc(100vh-76px)] flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <AppHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Persistent Audio Player and Panels */}
      <BottomPlayer />
      <QueuePanel />
      <LyricsPanel />
      <FullScreenPlayer />

      {/* Bottom mobile navigation if no music is active or on small screens */}
      {!currentTrack && <MobileNavigation />}
    </div>
  )
}
