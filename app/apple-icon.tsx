import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #181818 0%, #0E0E0E 100%)',
          borderRadius: '40px',
          border: '2px solid rgba(255, 75, 75, 0.4)',
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="18" fill="#FF4B4B" opacity="0.18" />
          <path
            d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C27.18 35 33.195 29.932 34.64 23.2"
            stroke="#FF4B4B"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="20" cy="20" r="3.5" fill="#FFA4A4" />
          <path
            d="M13 20C13 16.134 16.134 13 20 13"
            stroke="#FF6B6B"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M20 27C23.866 27 27 23.866 27 20"
            stroke="#FF6B6B"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
