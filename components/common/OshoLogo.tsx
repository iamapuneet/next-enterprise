import React from 'react'

interface OshoLogoProps {
  className?: string
  size?: number
}

/**
 * Handcrafted minimalist Zen / Meditation Consciousness logo mark.
 * Features an organic golden-amber Enso circle embracing an inner soundwave of silence.
 */
export function OshoLogo({ className = '', size = 32 }: OshoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer subtle glow */}
      <circle cx="20" cy="20" r="18" fill="url(#osho-glow)" opacity="0.35" />

      {/* Zen Enso ring with dynamic spiritual brush stroke */}
      <path
        d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C27.18 35 33.195 29.932 34.64 23.2"
        stroke="url(#osho-enso)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Inner consciousness droplet / flame / sound point */}
      <circle cx="20" cy="20" r="3.2" fill="url(#osho-core)" />

      {/* Ambient sound ripples / awakening waves */}
      <path
        d="M13 20C13 16.134 16.134 13 20 13"
        stroke="url(#osho-enso)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M20 27C23.866 27 27 23.866 27 20"
        stroke="url(#osho-enso)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />

      <defs>
        <radialGradient
          id="osho-glow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(20 20) scale(18)"
        >
          <stop stopColor="#F59E0B" stopOpacity="0.4" />
          <stop offset="1" stopColor="#B45309" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="osho-enso" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="osho-core" x1="17" y1="17" x2="23" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFBEB" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  )
}
