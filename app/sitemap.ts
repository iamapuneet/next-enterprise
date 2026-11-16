import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://oshoworld.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()

  // Core navigation pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/library`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/history`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/artist/artist-osho`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  // Key discourse series
  const seriesSlugs = [
    'adhyatam-upanishad-by-osho-1-17',
    '010-agyat-ki-aur-1-7',
    'ajhun-chet-ganwar-by-osho-1-21',
    'ami-jharat-bigsat-kanwal-by-osho-1-14',
    'anahad-mein-bisram-by-osho-1-10',
    'jas-panihar-dhare-sir-gagar-by-osho-01-11',
    'ashtavakra-maha-geeta-01',
    '011-amrit-dwar-1-6',
    '012-amrit-ki-disha-1-8',
    '013-amrit-varsha-1-5',
    '014-anant-ki-pukar-1-12',
    '015-antar-ki-khoj-1-10',
    '008-apne-mahin-tatol-1-8',
    '007-apui-gai-hiray-1-10',
    'ari-main-to-naam-ke-rang-chhaki-by-osho-1-10',
    '009-asambhav-kranti-1-10',
    'athato-bhakti-jigyasa-by-osho-1-40',
    'bahuri-na-aiso-daon-by-osho-1-10',
  ]

  const seriesRoutes: MetadataRoute.Sitemap = seriesSlugs.map((slug) => ({
    url: `${BASE_URL}/album/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  // Playlist pages
  const playlistSlugs = ['playlist-upanishad', 'playlist-meditation', 'playlist-mystics']
  const playlistRoutes: MetadataRoute.Sitemap = playlistSlugs.map((id) => ({
    url: `${BASE_URL}/playlist/${id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...seriesRoutes, ...playlistRoutes]
}
