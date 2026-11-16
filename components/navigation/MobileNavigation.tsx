'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, Compass, Library, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

export function MobileNavigation() {
  const pathname = usePathname()

  const links = [
    { label: 'Home', href: '/', icon: House },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Library', href: '/library', icon: Library },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-14 bg-[#121212] border-t border-white/5 flex items-center justify-around md:hidden select-none">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition py-1 px-3',
              isActive ? 'text-[#FF4B4B]' : 'text-neutral-400 hover:text-white'
            )}
          >
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
