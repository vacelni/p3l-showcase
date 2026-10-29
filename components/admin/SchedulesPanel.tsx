'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import type { Schedule } from '@/lib/types'
import { formatDateRange, formatPrice, todayISO } from '@/lib/format'
import { deleteSchedule, saveSchedule, setScheduleActive, type ScheduleInput } from '@/app/admin/actions'
import type { Notify } from './AdminDashboard'
import Toggle from './Toggle'

const blank: ScheduleInput = {
  title: '',
  category: 'BNSP',
  date_start: '',
  date_end: '',
  price: 'Rp 8.500.000 / orang',
  location: 'Hotel Contoh, Jakarta Pusat',
  min_participants: 10,
  description: 'Kurikulum berbasis studi kasus lapangan & regulasi KemenLHK terbaru.',
  syllabus: '',
}

export default function SchedulesPanel({
  schedules,
  notify,
  onChanged,
}: {
  schedules: Schedule[]
  notify: Notify
  onChanged: () => void
}) {
  const [editing, setEditing] = useState<{ id: number | null; values: ScheduleInput } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  // Status tampil/sembunyi langsung berubah saat diklik; kembali otomatis jika server menolak.
  const [shown, setShown] = useOptimistic(schedules, (list, { id, active }: { id: number; active: boolean }) =>
    list.map((s) => (s.id === id ? { ...s, is_active: active } : s))
  )
  const today = todayISO()

  const upcoming = shown.filter((s) => s.date_end >= today).sort((a, b) => a.date_start.localeCompare(b.date_start))
  const past = shown.filter((s) => s.date_end < today)

  const open = (s?: Schedule) => {
    setError(null)
    setEditing(
      s
        ? {
            id: s.id,
            values: {
              title: s.title,
              category: s.category,
              date_start: s.date_start,
              date_end: s.date_end,
              price: s.price ?? '',
              location: s.location,
              min_participants: s.min_participants,
              description: s.description ?? '',
              syllabus: s.syllabus ?? '',
            },
          }
        : { id: null, values: blank }
    )
  }

  const set = (k: keyof ScheduleInput, v: string | number) =>
    setEditing((e) => (e ? { ...e, values: { ...e.values, [k]: v } } : e))

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!editing) return
    start(async () => {
      const res = await saveSchedule(editing.id, editing.values)
      if (res.ok) {
        notify('ok', editing.id === null ? 'Jadwal baru dipublikasikan' : 'Perubahan jadwal disimpan')
        setEditing(null)
        onChanged()
      } else setError(res.error)
    })
  }

  const toggle = (s: Schedule) =>
    start(async () => {
      setShown({ id: s.id, active: !s.is_active })
      const res = await setScheduleActive(s.id, !s.is_active)
      if (res.ok) {
        notify('ok', s.is_active ? 'Jadwal disembunyikan dari website' : 'Jadwal ditampilkan di website')
        onChanged()
      } else notify('error', res.error)
    })

  const remove = (s: Schedule) => {
    if (!confirm(`Hapus jadwal "${s.title}" secara permanen?`)) return
    start(async () => {
      const res = await deleteSchedule(s.id)
      if (res.ok) {
        notify('ok', 'Jadwal dihapus')
        onChanged()
      } else notify('error', res.error)
    })
  }


  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold text-navy-900">Akan datang ({upcoming.length})</h2>
        <button type="button" onClick={() => open()} className="btn btn-primary !py-2.5 !text-sm">
          <Plus className="h-4 w-4" /> Tambah jadwal
        </button>
      </div>
      <ul className="mt-4 grid gap-3">
        {upcoming.length ? upcoming.map((s) => <ScheduleRow key={s.id} s={s} pending={pending} onToggle={() => toggle(s)} onEdit={() => open(s)} onRemove={() => remove(s)} />) : <li className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-muted">Belum ada jadwal mendatang. Website akan menampilkan ajakan menghubungi admin.</li>}
      </ul>

      {past.length > 0 && (
        <details className="mt-10">
          <summary className="cursor-pointer text-sm font-bold text-muted hover:text-navy-900">Jadwal yang sudah lewat ({past.length})</summary>
          <ul className="mt-4 grid gap-3">
            {past.map((s) => (
              <ScheduleRow key={s.id} s={s} done pending={pending} onToggle={() => toggle(s)} onEdit={() => open(s)} onRemove={() => remove(s)} />
            ))}
          </ul>
        </details>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} size="lg" title={editing?.id === null ? 'Jadwal baru' : 'Edit jadwal'} dismissible={!pending}>
        {editing && (
          <form onSubmit={submit} className="grid gap-4">
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <div>
              <label htmlFor="s-title" className="label">Nama pelatihan</label>
              <input id="s-title" className="field" required value={editing.values.title} onChange={(e) => set('title', e.target.value)} placeholder="Mis. POPAL - Penanggung Jawab Operasional Pengolahan Air Limbah" />
              <p className="mt-1 text-xs text-muted">Sertakan kata “POPAL” atau “PPPA” agar jadwal otomatis muncul di halaman program yang sesuai.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="s-cat" className="label">Kategori</label>
                <select id="s-cat" className="field" value={editing.values.category} onChange={(e) => set('category', e.target.value)}>
                  <option value="BNSP">Sertifikasi BNSP</option>
                  <option value="Non-BNSP">Pelatihan teknis (non-BNSP)</option>
                </select>
              </div>
              <div>
                <label htmlFor="s-min" className="label">Minimal peserta</label>
                <input id="s-min" type="number" min={1} className="field" value={editing.values.min_participants ?? ''} onChange={(e) => set('min_participants', Number(e.target.value))} />
              </div>
              <div>
                <label htmlFor="s-start" className="label">Tanggal mulai</label>
                <input id="s-start" type="date" required className="field" value={editing.values.date_start} onChange={(e) => set('date_start', e.target.value)} />
              </div>
              <div>
                <label htmlFor="s-end" className="label">Tanggal selesai</label>
                <input id="s-end" type="date" required min={editing.values.date_start} className="field" value={editing.values.date_end} onChange={(e) => set('date_end', e.target.value)} />
              </div>
              <div>
                <label htmlFor="s-price" className="label">Biaya</label>
                <input id="s-price" className="field" required value={String(editing.values.price ?? '')} onChange={(e) => set('price', e.target.value)} placeholder="Rp 8.500.000 / orang" />
              </div>
              <div>
                <label htmlFor="s-loc" className="label">Lokasi</label>
                <input id="s-loc" className="field" required value={editing.values.location} onChange={(e) => set('location', e.target.value)} placeholder="Nama hotel, Kota" />
              </div>
            </div>
            <div>
              <label htmlFor="s-desc" className="label">Deskripsi singkat</label>
              <textarea id="s-desc" rows={2} className="field" value={editing.values.description ?? ''} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div>
              <label htmlFor="s-syl" className="label">Materi / silabus</label>
              <textarea id="s-syl" rows={6} className="field font-normal" value={editing.values.syllabus ?? ''} onChange={(e) => set('syllabus', e.target.value)} placeholder={'Satu materi per baris\nKarakteristik air limbah industri\nPraktik jar test'} />
              <p className="mt-1 text-xs text-muted">Satu materi per baris. Jika kosong, website menampilkan materi standar program.</p>
            </div>
            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setEditing(null)} className="btn btn-outline">Batal</button>
              <button type="submit" disabled={pending} className="btn btn-primary">
                {pending ? 'Menyimpan…' : editing.id === null ? 'Publikasikan jadwal' : 'Simpan perubahan'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

function ScheduleRow({
  s,
  done,
  pending,
  onToggle,
  onEdit,
  onRemove,
}: {
  s: Schedule
  done?: boolean
  pending: boolean
  onToggle: () => void
  onEdit: () => void
  onRemove: () => void
}) {
  return (
    <li className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 sm:flex-row sm:items-center ${s.is_active ? 'border-line' : 'border-dashed border-line opacity-70'}`}>
      <div className="shrink-0 sm:w-44">
        <p className="tabular font-bold text-navy-900">{formatDateRange(s.date_start, s.date_end)}</p>
        {done && <p className="text-xs font-semibold text-muted">Sudah lewat</p>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-navy-900">{s.title}</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${s.category === 'BNSP' ? 'bg-green-50 text-green-700' : 'bg-navy-100 text-navy-800'}`}>
            {s.category}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {s.location} • {formatPrice(s.price)} • min. {s.min_participants ?? '-'} peserta
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-1">
        <Toggle checked={s.is_active} onChange={onToggle} disabled={pending} label={s.is_active ? 'Tampil' : 'Disembunyikan'} />
        <button type="button" onClick={onEdit} aria-label={`Edit ${s.title}`} className="rounded-lg p-2 text-muted hover:bg-paper hover:text-navy-900">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={onRemove} disabled={pending} aria-label={`Hapus ${s.title}`} className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  )
}
