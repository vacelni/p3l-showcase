import type { Metadata } from 'next'
import { getInsights } from '@/lib/supabase'
import PageHero from '@/components/PageHero'
import InsightList from '@/components/artikel/InsightList'
import CtaBand from '@/components/CtaBand'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Artikel Teknis IPAL & Berita PROPER KLHK',
  description:
    'Artikel teknis pengolahan air limbah dan operasional IPAL, laporan peringkat PROPER KLHK, serta informasi pelatihan dan acara dari P3L.',
  alternates: { canonical: '/artikel' },
}

export default async function ArtikelPage() {
  const insights = await getInsights()

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Artikel', path: '/artikel' }]}
        title="Artikel & berita pengolahan air limbah"
        lead="Catatan teknis dari lapangan, laporan peringkat PROPER, dan informasi acara P3L."
      />
      <section className="section !pt-12 bg-white">
        <div className="container-x">
          <InsightList insights={insights} />
        </div>
      </section>
      <CtaBand />
    </>
  )
}
