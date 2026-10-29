'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, FileDown, MapPin } from 'lucide-react'
import type { Insight } from '@/lib/types'
import { formatDate, insightSlug, insightTypeLabel as typeLabel, plainExcerpt } from '@/lib/format'

const tabs = [
  { id: 'semua', label: 'Semua' },
  { id: 'Artikel', label: 'Artikel teknis' },
  { id: 'Berita', label: 'Berita & laporan PROPER' },
  { id: 'Event', label: 'Acara' },
]

export default function InsightList({ insights }: { insights: Insight[] }) {
  const [filter, setFilter] = useState('semua')
  const list = insights.filter((i) => filter === 'semua' || i.type === filter)

  return (
    <div>
      <div role="tablist" aria-label="Filter konten" className="mb-10 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count = t.id === 'semua' ? insights.length : insights.filter((i) => i.type === t.id).length
          if (t.id !== 'semua' && count === 0) return null
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={filter === t.id}
              onClick={() => setFilter(t.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === t.id ? 'border-navy-900 bg-navy-900 text-white' : 'border-line bg-white text-navy-900 hover:border-navy-900/40'
              }`}
            >
              {t.label} <span className={filter === t.id ? 'text-white/60' : 'text-muted'}>({count})</span>
            </button>
          )
        })}
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-paper p-10 text-center text-muted">
          Belum ada konten di kategori ini.
        </p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((i) => (
            <li key={i.id}>
              <Link
                href={`/artikel/${insightSlug(i)}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-navy-900/40"
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span
                    className={`rounded-full px-2.5 py-1 font-bold ${
                      i.type === 'Artikel'
                        ? 'bg-green-50 text-green-700'
                        : i.type === 'Event'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-navy-100 text-navy-800'
                    }`}
                  >
                    {typeLabel[i.type] ?? i.type}
                  </span>
                  <time className="text-muted">{formatDate(i.date)}</time>
                </div>
                <p className="mt-4 text-sm font-semibold text-muted">{i.category}</p>
                <h2 className="mt-1.5 text-lg font-bold leading-snug text-navy-900 group-hover:text-green-700">{i.title}</h2>
                <p className="mt-3 line-clamp-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{plainExcerpt(i.excerpt, 240)}</p>

                <div className="mt-5 border-t border-line pt-4 text-sm">
                  {i.type === 'Event' ? (
                    <div className="space-y-1.5 text-muted">
                      {i.event_date && (
                        <p className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-green-700" /> {i.event_date}
                        </p>
                      )}
                      {i.event_location && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-700" /> {i.event_location}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-bold text-navy-900">
                      {i.external_pdf_url ? (
                        <>
                          <FileDown className="h-4 w-4 text-green-700" /> Baca & unduh laporan
                        </>
                      ) : (
                        <>
                          Baca artikel <ArrowRight className="h-4 w-4 text-green-700 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
