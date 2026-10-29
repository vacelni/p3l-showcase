'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { gallery, type GalleryItem } from '@/lib/content'

type Filter = 'semua' | GalleryItem['category']

const tabs: { id: Filter; label: string }[] = [
  { id: 'semua', label: 'Semua' },
  { id: 'pelatihan', label: 'Pelatihan' },
  { id: 'lapangan', label: 'Proyek & lapangan' },
  { id: 'lab', label: 'Laboratorium' },
]

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>('semua')
  const [index, setIndex] = useState<number | null>(null)

  const list = gallery.filter((g) => filter === 'semua' || g.category === filter)
  const current = index !== null ? list[index] : null
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + list.length) % list.length))

  return (
    <div>
      <div role="tablist" aria-label="Filter galeri" className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={filter === t.id}
            onClick={() => setFilter(t.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              filter === t.id ? 'border-navy-900 bg-navy-900 text-white' : 'border-line bg-white text-navy-900 hover:border-navy-900/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {list.map((item, i) => (
          <li key={item.src} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className={`group relative block aspect-[4/3] h-full w-full overflow-hidden rounded-xl bg-paper text-left ${i === 0 ? 'md:aspect-auto' : ''}`}
              aria-label={`Perbesar foto: ${item.title}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes={i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 to-transparent p-3 pt-10 text-xs font-medium leading-snug text-white sm:text-sm">
                <span className="line-clamp-2">{item.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Modal open={!!current} onClose={() => setIndex(null)} size="xl" title={current?.title ?? ''} description={current?.label}>
        {current && (
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-navy-950">
              <Image src={current.src} alt={current.title} fill sizes="(max-width: 1024px) 100vw, 900px" className="object-contain" />
            </div>
            {list.length > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <button type="button" onClick={() => step(-1)} className="btn btn-outline !px-3 !py-2" aria-label="Foto sebelumnya">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="tabular text-sm text-muted">
                  {index! + 1} / {list.length}
                </span>
                <button type="button" onClick={() => step(1)} className="btn btn-outline !px-3 !py-2" aria-label="Foto berikutnya">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
