'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  House,
  Compass,
  Library,
  History,
  Heart,
  ListMusic,
  Disc3,
  Users,
  Podcast,
  Settings,
  Plus,
  Music2,
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { musicService } from '../../services/musicService'
import { Playlist } from '../../types/music'
import { CreatePlaylistDialog } from '../dialogs/CreatePlaylistDialog'

interface AppSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AppSidebar({ isOpen = true, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  useEffect(() => {
    musicService.getPlaylists().then(setPlaylists)
  }, [])

  const mainNav = [
    { label: 'Home', href: '/', icon: House },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Library', href: '/library', icon: Library },
  ]

  const libraryNav = [
    { label: 'History', href: '/history', icon: History },
    { label: 'Liked Songs', href: '/library?tab=liked', icon: Heart },
    { label: 'Playlists', href: '/library?tab=playlists', icon: ListMusic },
    { label: 'Albums', href: '/library?tab=albums', icon: Disc3 },
    { label: 'Artists', href: '/library?tab=artists', icon: Users },
    { label: 'Podcasts', href: '/library?tab=podcasts', icon: Podcast },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && onClose && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-[240px] bg-[#121212] flex flex-col border-r border-white/5 transition-transform duration-200 select-none pb-[76px]',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#FF4B4B] to-[#FF8585] flex items-center justify-center shadow-lg shadow-[#FF4B4B]/20 group-hover:scale-105 transition">
              <Music2 className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white text-base leading-none">
                NAD <span className="text-[#FF4B4B]">Music</span>
              </span>
              <span className="text-[10px] tracking-wider text-neutral-400 uppercase mt-0.5 font-medium">
                Streaming
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Discover Nav */}
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-4 px-3.5 py-2.5 rounded-xl text-sm font-medium transition group',
                    isActive
                      ? 'bg-neutral-800/80 text-white font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform group-hover:scale-110',
                      isActive ? 'text-[#FF4B4B]' : 'text-neutral-400 group-hover:text-white'
                    )}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="h-px bg-white/5 mx-2" />

          {/* Library Section */}
          <div>
            <div className="flex items-center justify-between px-3.5 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Library
              </span>
              <button
                onClick={() => setIsCreateOpen(true)}
                title="Create playlist"
                className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {libraryNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href.includes('?') && pathname + '?tab=' === item.href.split('&')[0])
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-4 px-3.5 py-2 rounded-xl text-sm font-medium transition group',
                      isActive
                        ? 'bg-neutral-800/80 text-white font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-transform group-hover:scale-110',
                        isActive ? 'text-[#FF4B4B]' : 'text-neutral-400 group-hover:text-white'
                      )}
                      strokeWidth={1.8}
                    />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="h-px bg-white/5 mx-2" />

          {/* Playlists Quick List */}
          <div>
            <div className="px-3.5 mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Your Playlists
              </span>
              <span className="text-xs text-neutral-400 font-mono">{playlists.length}</span>
            </div>
            <div className="space-y-0.5">
              {playlists.map((pl) => (
                <Link
                  key={pl.id}
                  href={`/playlist/${pl.id}`}
                  onClick={onClose}
                  className="block px-3.5 py-1.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/40 transition truncate"
                >
                  {pl.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/5 shrink-0 bg-[#121212]">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/40 transition"
          >
            <Settings className="w-4 h-4 text-neutral-400" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      <CreatePlaylistDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newPl) => setPlaylists((prev) => [newPl, ...prev])}
      />
    </>
  )
}
