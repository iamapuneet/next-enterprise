import React from 'react'

interface OshoLogoProps {
  className?: string
  size?: number
}

/**
 * Handcrafted Zen / Meditation Consciousness logo mark in the unified Oshovani RED theme.
 * Features an organic red Enso circle (#FF4B4B) embracing the inner flame of consciousness.
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
      {/* Outer subtle red glow */}
      <circle cx="20" cy="20" r="18" fill="url(#osho-glow-red)" opacity="0.4" />

      {/* Zen Enso ring with dynamic spiritual brush stroke */}
      <path
        d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C27.18 35 33.195 29.932 34.64 23.2"
        stroke="url(#osho-enso-red)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Inner consciousness droplet / flame / bindu */}
      <circle cx="20" cy="20" r="3.2" fill="url(#osho-core-red)" />

      {/* Ambient sound ripples / awakening waves */}
      <path
        d="M13 20C13 16.134 16.134 13 20 13"
        stroke="url(#osho-enso-red)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M20 27C23.866 27 27 23.866 27 20"
        stroke="url(#osho-enso-red)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />

      <defs>
        <radialGradient
          id="osho-glow-red"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(20 20) scale(18)"
        >
          <stop stopColor="#FF4B4B" stopOpacity="0.5" />
          <stop offset="1" stopColor="#B91C1C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="osho-enso-red" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFA4A4" />
          <stop offset="0.4" stopColor="#FF4B4B" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
        <linearGradient id="osho-core-red" x1="17" y1="17" x2="23" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FF4B4B" />
        </linearGradient>
      </defs>
    </svg>
  )
}
