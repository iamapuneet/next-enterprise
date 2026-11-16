'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  Cast,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  Music2,
  LogOut,
  Sparkles,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { SearchBar } from '../search/SearchBar'
import { OshoLogo } from '../common/OshoLogo'

interface AppHeaderProps {
  onToggleSidebar?: () => void
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next)
    }
  }

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#0E0E0E]/90 backdrop-blur-md border-b border-white/5 px-4 md:px-8 flex items-center justify-between gap-4 select-none">
      {/* Left side (Mobile Logo + Menu) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-2 md:hidden">
          <OshoLogo size={26} />
          <span className="font-bold text-white text-sm tracking-tight">Oshovani</span>
        </Link>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-[540px]">
        <SearchBar />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Cast button */}
        <button
          type="button"
          title="Connect to a device"
          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition hidden sm:inline-flex"
        >
          <Cast className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          title="Notifications"
          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition hidden sm:inline-flex relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4B4B]" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Profile Dropdown Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="ml-1 w-9 h-9 rounded-full bg-linear-to-br from-neutral-700 to-neutral-900 border border-white/20 flex items-center justify-center text-white font-semibold text-xs hover:ring-2 hover:ring-[#FF4B4B] transition overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-56 rounded-2xl bg-[#1B1B1B] p-2 text-white shadow-2xl border border-white/10 outline-hidden backdrop-blur-md text-sm"
            >
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="font-semibold text-sm truncate">Puneet</p>
                <p className="text-xs text-neutral-400 truncate">puneet@oshovani.com</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[11px] font-medium border border-amber-500/20">
                  <Sparkles className="w-3 h-3" />
                  Oshovani Member
                </div>
              </div>

              <DropdownMenu.Item asChild>
                <Link
                  href="/library"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer transition outline-hidden"
                >
                  <User className="w-4 h-4 text-neutral-400" />
                  Your Channel / Library
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item asChild>
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer transition outline-hidden"
                >
                  <Settings className="w-4 h-4 text-neutral-400" />
                  Settings
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-white/5 my-1" />

              <DropdownMenu.Item
                onClick={() => alert('Oshovani account signed in.')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer transition outline-hidden"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
