import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { ArrowRight, CalendarDays, FileDown, MapPin } from 'lucide-react'
import { getInsightBySlug, getInsights } from '@/lib/supabase'
import { formatDate, insightSlug, insightTypeLabel, isIndexable, plainExcerpt, wordCount } from '@/lib/format'
import { SITE_URL, WA_GENERAL } from '@/lib/site'
import { JsonLd, articleJsonLd } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import ArticleBody, { parseArticle, sectionHeadings } from '@/components/artikel/ArticleBody'

export const revalidate = 300

function TableOfContents({ items, className = '' }: { items: { id: string; text: string }[]; className?: string }) {
  return (
    <nav aria-label="Daftar isi" className={`rounded-2xl border border-line bg-white p-5 ${className}`}>
      <p className="text-sm font-bold uppercase tracking-wide text-muted">Daftar isi</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-[0.9375rem] leading-snug marker:text-muted">
        {items.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="text-navy-800 hover:text-green-700 hover:underline">
              {h.text.replace(/\*\*/g, '')}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export async function generateStaticParams() {
  const insights = await getInsights()
  return insights.map((i) => ({ slug: insightSlug(i) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const insight = await getInsightBySlug(slug)
  if (!insight) return { title: 'Artikel tidak ditemukan', robots: { index: false } }
  const path = `/artikel/${insightSlug(insight)}`
  const description = plainExcerpt(insight.excerpt)
  return {
    title: insight.seo_title || insight.title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'article', url: path, title: insight.title, description },
    ...(!isIndexable(insight) && { robots: { index: false, follow: true } }),
  }
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const insight = await getInsightBySlug(slug)
  if (!insight) notFound()

  // Judul diubah admin → arahkan URL lama ke slug yang baru.
  const canonicalSlug = insightSlug(insight)
  if (slug !== canonicalSlug) permanentRedirect(`/artikel/${canonicalSlug}`)

  const related = (await getInsights()).filter((i) => i.id !== insight.id).slice(0, 3)
  const blocks = parseArticle(insight.excerpt)
  const toc = sectionHeadings(blocks)
  const minutes = Math.max(1, Math.round(wordCount(insight.excerpt) / 200))

  return (
    <>
      <JsonLd data={articleJsonLd(insight, `${SITE_URL}/artikel/${canonicalSlug}`)} />

      <PageHero
        crumbs={[
          { name: 'Artikel', path: '/artikel' },
          { name: insight.title, path: `/artikel/${canonicalSlug}` },
        ]}
        title={insight.title}
        lead={
          <p className="text-base">
            {insight.category} • <time>{formatDate(insight.date, true)}</time> • Tim P3L
            {insight.type === 'Artikel' && <> • {minutes} menit baca</>}
          </p>
        }
      />

      <article className="section bg-white !pt-12">
        <div className="container-x grid gap-10 xl:grid-cols-[minmax(0,62rem)_24rem] xl:justify-between xl:gap-16">
          <div className="min-w-0 max-w-4xl xl:max-w-none">
            {insight.type === 'Event' && (insight.event_date || insight.event_location) && (
              <div className="mb-10 grid gap-4 rounded-2xl bg-paper p-6 sm:grid-cols-2">
                {insight.event_date && (
                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                    <div>
                      <p className="text-sm text-muted">Waktu</p>
                      <p className="font-bold text-navy-900">{insight.event_date}</p>
                    </div>
                  </div>
                )}
                {insight.event_location && (
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                    <div>
                      <p className="text-sm text-muted">Lokasi</p>
                      <p className="font-bold text-navy-900">{insight.event_location}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {toc.length >= 3 && <TableOfContents items={toc} className="mb-10 xl:hidden" />}

            <ArticleBody blocks={blocks} />

            {insight.external_pdf_url && (
              <a
                href={insight.external_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 flex items-center gap-4 rounded-2xl border border-line p-5 transition-colors hover:border-navy-900/40"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <FileDown className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-navy-900">Unduh laporan lengkap (PDF)</span>
                  <span className="block text-sm text-muted">{insight.title}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-green-700" />
              </a>
            )}

            {insight.type === 'Event' && (
              <Link href="/jadwal" className="btn btn-primary mt-10">
                Lihat jadwal & daftar <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-5">
              {toc.length >= 3 && <TableOfContents items={toc} />}
              <div className="rounded-2xl bg-navy-900 p-6 text-white">
                <p className="font-bold">Ada pertanyaan tentang IPAL Anda?</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Tanyakan langsung ke admin P3L tentang pelatihan, sertifikasi, atau konsultasi IPAL.
                </p>
                <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full !text-sm">
                  Tanya admin via WhatsApp
                </a>
                <Link href="/jadwal" className="btn btn-on-dark mt-3 w-full !text-sm">
                  Lihat jadwal pelatihan
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper py-14">
          <div className="container-x">
            <h2 className="text-xl font-extrabold text-navy-900">Baca juga</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/artikel/${insightSlug(r)}`} className="group block h-full rounded-2xl border border-line bg-white p-5 hover:border-navy-900/40">
                    <p className="text-xs font-semibold text-muted">
                      {insightTypeLabel[r.type] ?? r.type} • {formatDate(r.date)}
                    </p>
                    <p className="mt-2 font-bold leading-snug text-navy-900 group-hover:text-green-700">{r.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  )
}
