import { getInsightBySlug } from '@/lib/supabase'
import { insightTypeLabel } from '@/lib/format'
import { renderOg, ogSize } from '@/lib/og'

export const alt = 'Artikel P3L'
export const size = ogSize
export const contentType = 'image/png'
export const revalidate = 300

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const insight = await getInsightBySlug(slug)
  return renderOg({
    kicker: insight ? `${insightTypeLabel[insight.type] ?? insight.type} • ${insight.category}` : 'Artikel',
    title: insight?.title ?? 'Artikel pengolahan air limbah',
  })
}
