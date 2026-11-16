import type { Metadata } from 'next'
import { oshoApiService } from '../../../services/oshoApiService'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const series = await oshoApiService.getSeries(id)
  const title = series?.title ? `${series.title} — Oshovani` : 'Discourse Series — Oshovani'
  const description =
    series?.description ||
    `Listen to complete original audio discourses by Osho on ${series?.title || 'spirituality and meditation'} on Oshovani.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: series?.coverUrl ? [{ url: series.coverUrl }] : [],
    },
    twitter: {
      title,
      description,
      images: series?.coverUrl ? [series.coverUrl] : [],
    },
  }
}

export default function AlbumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
