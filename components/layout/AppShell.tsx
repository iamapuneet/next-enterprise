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
    <div className="relative min-h-screen bg-[#0E0E0E] text-white flex flex-col">
      {/* Persistent Sidebar */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[240px] flex flex-col min-h-screen pb-[80px]">
        {/* Sticky Header */}
        <AppHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 md:px-8 py-4 overflow-y-auto">
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
