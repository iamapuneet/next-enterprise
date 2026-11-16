import 'styles/tailwind.css'
import type { Metadata, Viewport } from 'next'
import { AppShell } from '../components/layout/AppShell'

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://oshoworld.com'

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Oshovani (ओशोवाणी) — Audio Discourses, Upanishads, Gita & Meditation',
    template: '%s | Oshovani',
  },
  description:
    'Experience the complete catalog of 160+ audio discourse series on Oshovani (ओशोवाणी). Stream Adhyatam Upanishad, Ashtavakra Maha Geeta, Zen, Sufi, and Kabir discourses in studio quality with ambient background soundtrack accompaniment.',
  keywords: [
    'Oshovani',
    'ओशोवाणी',
    'Osho',
    'Osho World',
    'Osho Discourses',
    'Osho Audio',
    'Hindi Pravachan',
    'Adhyatam Upanishad',
    'अध्यात्म उपनिषद्',
    'Ashtavakra Maha Geeta',
    'अष्टावक्र महागीता',
    'Kabir Pravachan',
    'Zen Meditation',
    'Dhyan',
    'Spiritual Discourses',
    'Osho Audio Series Hindi',
    'Hans Zimmer Ambient Music',
  ],
  authors: [{ name: 'Oshovani', url: 'https://oshoworld.com' }],
  creator: 'Oshovani',
  publisher: 'Oshovani Foundation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    alternateLocale: ['en_US'],
    url: APP_URL,
    siteName: 'Oshovani — World of Consciousness',
    title: 'Oshovani (ओशोवाणी) — Audio Discourses & Meditation',
    description:
      'Stream over 160+ complete multi-part discourse series by Osho on Oshovani, accompanied by subtle ambient music for enhanced dhyan and meditation.',
    images: [
      {
        url: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg',
        width: 1200,
        height: 630,
        alt: 'Oshovani — Audio Discourses and Meditation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oshovani — Audio Discourses & Meditation',
    description:
      'Listen to authentic audio discourses by Osho on Upanishad, Geeta, and Zen with ambient sound integration on Oshovani.',
    images: ['https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg'],
    creator: '@oshovani',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Spiritual & Music Streaming',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${APP_URL}/#website`,
      url: APP_URL,
      name: 'Oshovani',
      alternateName: 'ओशोवाणी',
      description: 'Online streaming platform for audio discourses by Osho.',
      publisher: {
        '@type': 'Organization',
        name: 'Oshovani Foundation',
        url: 'https://oshoworld.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg',
        },
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${APP_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
      inLanguage: ['hi', 'en'],
    },
    {
      '@type': 'MusicGroup',
      '@id': `${APP_URL}/#artist`,
      name: 'Osho',
      genre: ['Spiritual', 'Meditation', 'Upanishad', 'Philosophy'],
      description:
        'Enlightened mystic and spiritual master whose recorded discourses explore the depths of human consciousness.',
      image: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg',
      url: APP_URL,
    },
    {
      '@type': 'AudioObject',
      '@id': `${APP_URL}/#featured-audio`,
      name: 'Adhyatam Upanishad 01',
      description: 'Original Hindi audio discourse on Adhyatam Upanishad by Osho on Oshovani.',
      duration: 'PT1H56M17S',
      contentUrl: 'https://oshoworld.com/wp-content/uploads/2020/11/Hindi%20Audio/OSHO-Adhyatam_Upanishad_01.mp3',
      thumbnailUrl: 'https://oshoworld.com/uploads/adhyatma-upanishad-osho.jpg',
      author: {
        '@type': 'Person',
        name: 'Osho',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0E0E0E] text-white antialiased selection:bg-amber-500 selection:text-black overflow-x-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
