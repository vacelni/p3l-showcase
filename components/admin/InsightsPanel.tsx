'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import type { Insight } from '@/lib/types'
import { MIN_INDEX_WORDS, SEO_TITLE_MAX, formatDate, insightSlug, insightTypeLabel, plainExcerpt, wordCount } from '@/lib/format'
import { deleteInsight, saveInsight, setInsightActive, type InsightInput } from '@/app/admin/actions'
import type { Notify } from './AdminDashboard'
import Toggle from './Toggle'

const todayLabel = () => new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

const blank = (): InsightInput => ({
  title: '',
  seo_title: '',
  type: 'Artikel',
  category: 'Teknologi IPAL',
  date: todayLabel(),
  excerpt: '',
  external_pdf_url: '',
  event_location: '',
  event_date: '',
})

export default function InsightsPanel({
  insights,
  notify,
  onChanged,
}: {
  insights: Insight[]
  notify: Notify
  onChanged: () => void
}) {
  const [editing, setEditing] = useState<{ id: number | null; values: InsightInput } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  // Status tampil/sembunyi langsung berubah saat diklik; kembali otomatis jika server menolak.
  const [shown, setShown] = useOptimistic(insights, (list, { id, active }: { id: number; active: boolean }) =>
    list.map((i) => (i.id === id ? { ...i, is_active: active } : i))
  )

  const open = (i?: Insight) => {
    setError(null)
    setEditing(
      i
        ? {
            id: i.id,
            values: {
              title: i.title,
              seo_title: i.seo_title ?? '',
              type: i.type,
              category: i.category,
              date: i.date,
              excerpt: i.excerpt,
              external_pdf_url: i.external_pdf_url ?? '',
              event_location: i.event_location ?? '',
              event_date: i.event_date ?? '',
            },
          }
        : { id: null, values: blank() }
    )
  }

  const set = (k: keyof InsightInput, v: string) => setEditing((e) => (e ? { ...e, values: { ...e.values, [k]: v } } : e))

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!editing) return
    start(async () => {
      const res = await saveInsight(editing.id, editing.values)
      if (res.ok) {
        notify('ok', editing.id === null ? 'Konten baru dipublikasikan' : 'Perubahan konten disimpan')
        setEditing(null)
        onChanged()
      } else setError(res.error)
    })
  }

  const toggle = (i: Insight) =>
    start(async () => {
      const active = i.is_active !== false
      setShown({ id: i.id, active: !active })
      const res = await setInsightActive(i.id, !active)
      if (res.ok) {
        notify('ok', active ? 'Konten disembunyikan dari website' : 'Konten ditampilkan di website')
        onChanged()
      } else notify('error', res.error)
    })

  const remove = (i: Insight) => {
    if (!confirm(`Hapus "${i.title}" secara permanen?`)) return
    start(async () => {
      const res = await deleteInsight(i.id)
      if (res.ok) {
        notify('ok', 'Konten dihapus')
        onChanged()
      } else notify('error', res.error)
    })
  }

  const words = editing ? wordCount(editing.values.excerpt) : 0
  // Panjang judul yang akan tampil di Google: judul SEO jika diisi, selain itu judul artikel.
  const googleTitle = editing ? (editing.values.seo_title?.trim() || editing.values.title.trim()).length : 0

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold text-navy-900">Artikel, berita & acara</h2>
        <button type="button" onClick={() => open()} className="btn btn-primary !py-2.5 !text-sm">
          <Plus className="h-4 w-4" /> Tulis konten
        </button>
      </div>

      <ul className="mt-4 grid gap-3">
        {shown.map((i) => {
          const active = i.is_active !== false
          return (
            <li key={i.id} className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 sm:flex-row sm:items-center ${active ? 'border-line' : 'border-dashed border-line opacity-70'}`}>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted">
                  {insightTypeLabel[i.type] ?? i.type} • {i.category} • {formatDate(i.date)}
                </p>
                <h3 className="mt-1 font-bold text-navy-900">{i.title}</h3>
                <p className="mt-1 line-clamp-1 text-sm text-muted">{plainExcerpt(i.excerpt, 200)}</p>
                {active && !i.external_pdf_url && wordCount(i.excerpt) < MIN_INDEX_WORDS && (
                  <p className="mt-1.5 text-xs font-semibold text-amber-700">
                    Isi baru {wordCount(i.excerpt)} kata: belum diindeks Google (minimal {MIN_INDEX_WORDS} kata).
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1">
                <Toggle checked={active} onChange={() => toggle(i)} disabled={pending} label={active ? 'Tampil' : 'Disembunyikan'} />
                {active && (
                  <a href={`/artikel/${insightSlug(i)}`} target="_blank" aria-label="Buka di website" className="rounded-lg p-2 text-muted hover:bg-paper hover:text-navy-900">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button type="button" onClick={() => open(i)} aria-label={`Edit ${i.title}`} className="rounded-lg p-2 text-muted hover:bg-paper hover:text-navy-900">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => remove(i)} disabled={pending} aria-label={`Hapus ${i.title}`} className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <Modal open={!!editing} onClose={() => setEditing(null)} size="xl" title={editing?.id === null ? 'Konten baru' : 'Edit konten'} dismissible={!pending}>
        {editing && (
          <form onSubmit={submit} className="grid gap-4">
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="i-type" className="label">Jenis</label>
                <select id="i-type" className="field" value={editing.values.type} onChange={(e) => set('type', e.target.value)}>
                  <option value="Artikel">Artikel teknis</option>
                  <option value="Berita">Berita / laporan PDF</option>
                  <option value="Event">Acara / webinar</option>
                </select>
              </div>
              <div>
                <label htmlFor="i-cat" className="label">Kategori</label>
                <input id="i-cat" className="field" required value={editing.values.category} onChange={(e) => set('category', e.target.value)} placeholder="Teknologi IPAL" />
              </div>
              <div>
                <label htmlFor="i-date" className="label">Tanggal terbit</label>
                <input id="i-date" className="field" required value={editing.values.date} onChange={(e) => set('date', e.target.value)} placeholder="15 Jan 2026" />
              </div>
            </div>
            <div>
              <label htmlFor="i-title" className="label">Judul</label>
              <input id="i-title" className="field" required value={editing.values.title} onChange={(e) => set('title', e.target.value)} />
              <p className="mt-1 text-xs text-muted">Gunakan kata kunci yang dicari orang, mis. “Cara Mengatasi Bulking Sludge pada IPAL Lumpur Aktif”.</p>
            </div>
            <div>
              <label htmlFor="i-seo" className="label">Judul di Google (opsional)</label>
              <input id="i-seo" className="field" maxLength={SEO_TITLE_MAX} value={editing.values.seo_title ?? ''} onChange={(e) => set('seo_title', e.target.value)} placeholder="Kosongkan jika judul di atas sudah pendek" />
              <p className={`mt-1 text-xs ${googleTitle > SEO_TITLE_MAX ? 'text-amber-700' : 'text-muted'}`}>
                {googleTitle}/{SEO_TITLE_MAX} karakter.{' '}
                {googleTitle > SEO_TITLE_MAX
                  ? 'Judul terlalu panjang dan akan terpotong di Google. Isi versi pendek di sini; judul di halaman dan link artikel tidak berubah.'
                  : 'Muat utuh di hasil pencarian Google.'}
              </p>
            </div>

            {editing.values.type === 'Berita' && (
              <div>
                <label htmlFor="i-pdf" className="label">Link PDF (opsional)</label>
                <input id="i-pdf" type="url" className="field" value={editing.values.external_pdf_url ?? ''} onChange={(e) => set('external_pdf_url', e.target.value)} placeholder="https://…/laporan.pdf" />
              </div>
            )}
            {editing.values.type === 'Event' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="i-edate" className="label">Waktu acara</label>
                  <input id="i-edate" className="field" value={editing.values.event_date ?? ''} onChange={(e) => set('event_date', e.target.value)} placeholder="25 Agustus 2026, 09.00 WIB" />
                </div>
                <div>
                  <label htmlFor="i-eloc" className="label">Lokasi acara</label>
                  <input id="i-eloc" className="field" value={editing.values.event_location ?? ''} onChange={(e) => set('event_location', e.target.value)} placeholder="Zoom / Hotel Padma, Semarang" />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="i-body" className="label">Isi</label>
              <textarea id="i-body" rows={14} className="field font-normal leading-relaxed" required value={editing.values.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder={'Paragraf pembuka...\n\n## Subjudul\nIsi paragraf...\n- butir daftar\n- butir daftar'} />
              <p className={`mt-1 text-xs ${!editing.values.external_pdf_url && words < MIN_INDEX_WORDS ? 'text-amber-700' : 'text-muted'}`}>
                {words} kata.{' '}
                {!editing.values.external_pdf_url && words < MIN_INDEX_WORDS
                  ? `Di bawah ${MIN_INDEX_WORDS} kata halaman ini tidak diindeks Google. Artikel 600+ kata yang menjawab satu masalah spesifik paling mudah muncul di pencarian.`
                  : 'Artikel 600+ kata yang menjawab satu masalah spesifik paling mudah muncul di pencarian.'}
              </p>
              <p className="mt-1 text-xs text-muted">
                Format: <code>## Subjudul</code>, <code>### Sub-subjudul</code>, <code>- butir</code>, <code>1. butir</code>, <code>**tebal**</code>, <code>[teks](https://link)</code>. Satu baris = satu paragraf.
              </p>
            </div>

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setEditing(null)} className="btn btn-outline">Batal</button>
              <button type="submit" disabled={pending} className="btn btn-primary">
                {pending ? 'Menyimpan…' : editing.id === null ? 'Publikasikan' : 'Simpan perubahan'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
