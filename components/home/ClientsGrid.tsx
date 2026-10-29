'use client'

import { useState } from 'react'
import { Factory, Stethoscope } from 'lucide-react'
import { clients } from '@/lib/content'

type Filter = 'semua' | 'industri' | 'rs'

export default function ClientsGrid() {
  const [filter, setFilter] = useState<Filter>('semua')
  const [expanded, setExpanded] = useState(false)

  const list = clients.filter((c) => filter === 'semua' || c.type === filter)
  const shown = expanded ? list : list.slice(0, 12)

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: 'semua', label: 'Semua', count: clients.length },
    { id: 'industri', label: 'Industri', count: clients.filter((c) => c.type === 'industri').length },
    { id: 'rs', label: 'Rumah sakit', count: clients.filter((c) => c.type === 'rs').length },
  ]

  return (
    <div>
      <div role="tablist" aria-label="Filter klien" className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={filter === t.id}
            onClick={() => {
              setFilter(t.id)
              setExpanded(false)
            }}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              filter === t.id ? 'border-navy-900 bg-navy-900 text-white' : 'border-line bg-white text-navy-900 hover:border-navy-900/40'
            }`}
          >
            {t.label} <span className={filter === t.id ? 'text-white/60' : 'text-muted'}>({t.count})</span>
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <li key={c.name} className="flex items-center gap-3 bg-white px-5 py-4">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                c.type === 'rs' ? 'bg-green-50 text-green-700' : 'bg-navy-100 text-navy-800'
              }`}
              aria-hidden="true"
            >
              {c.type === 'rs' ? <Stethoscope className="h-4 w-4" /> : <Factory className="h-4 w-4" />}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-snug text-navy-900">
                {c.name}
              </span>
              <span className="block text-xs text-muted">{c.location}</span>
            </span>
          </li>
        ))}
      </ul>

      {list.length > 12 && (
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="btn btn-outline">
            {expanded ? 'Tampilkan lebih sedikit' : `Lihat semua ${list.length} klien`}
          </button>
        </div>
      )}
    </div>
  )
}
