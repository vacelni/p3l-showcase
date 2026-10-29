import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { programs } from '@/lib/programs'
import { engineeringServices } from '@/lib/content'
import { getInsights } from '@/lib/supabase'
import { insightSlug, isIndexable, parseLooseDate } from '@/lib/format'

export const revalidate = 3600

// Halaman statis tidak diberi lastModified: tanggal "hari ini" yang selalu berubah membuat Google mengabaikannya.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insights = (await getInsights()).filter(isIndexable)

  const page = (path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly') => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  })

  return [
    page('', 1, 'weekly'),
    page('/jadwal', 0.9, 'daily'),
    page('/program', 0.8, 'monthly'),
    ...programs.map((p) => page(`/program/${p.slug}`, 0.9, 'weekly')),
    page('/layanan', 0.8, 'monthly'),
    ...engineeringServices.map((s) => page(`/layanan/${s.slug}`, 0.8, 'monthly')),
    page('/artikel', 0.7, 'weekly'),
    ...insights.map((i) => ({
      ...page(`/artikel/${insightSlug(i)}`, 0.6, 'monthly'),
      ...(parseLooseDate(i.date) && { lastModified: parseLooseDate(i.date)! }),
    })),
    page('/tentang', 0.6, 'yearly'),
    page('/kontak', 0.6, 'yearly'),
    page('/kebijakan-privasi', 0.2, 'yearly'),
  ]
}
