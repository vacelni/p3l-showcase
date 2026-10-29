'use client'

import { useMemo, useState, useTransition } from 'react'
import { Download, Mail, Search, Trash2 } from 'lucide-react'
import type { Registration } from '@/lib/types'
import { invoiceNumber } from '@/lib/format'
import { deleteRegistration, setPaymentStatus } from '@/app/admin/actions'
import type { Notify } from './AdminDashboard'

const PAID = 'Lunas / Terkonfirmasi'
const WAITING = 'Menunggu Pembayaran'

const dateTime = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })

function toCsv(rows: Registration[]) {
  const head = ['No. invoice', 'Tanggal daftar', 'Nama', 'Jabatan', 'Instansi', 'Alamat', 'WhatsApp', 'Email', 'Program', 'Status']
  // Awalan ' mencegah isian seperti "=HYPERLINK(...)" dieksekusi sebagai rumus oleh Excel.
  const cell = (v: unknown) => {
    const s = String(v ?? '')
    return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`
  }
  const lines = rows.map((r) =>
    [invoiceNumber(r.id, r.created_at), r.created_at, r.nama_lengkap, r.jabatan, r.instansi, r.alamat_instansi, r.whatsapp, r.email_korporat, r.program_pilihan, r.status_pembayaran]
      .map(cell)
      .join(',')
  )
  return '﻿' + [head.map(cell).join(','), ...lines].join('\n')
}

export default function RegistrationsPanel({
  registrations,
  notify,
  onChanged,
}: {
  registrations: Registration[]
  notify: Notify
  onChanged: () => void
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'semua' | 'menunggu' | 'lunas'>('semua')
  const [pending, start] = useTransition()

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim()
    return registrations.filter((r) => {
      const paid = r.status_pembayaran === PAID
      if (status === 'menunggu' && paid) return false
      if (status === 'lunas' && !paid) return false
      if (!q) return true
      return [r.nama_lengkap, r.instansi, r.program_pilihan, r.email_korporat, r.whatsapp, invoiceNumber(r.id, r.created_at)].some((v) =>
        v?.toLowerCase().includes(q)
      )
    })
  }, [registrations, query, status])

  const toggle = (r: Registration) =>
    start(async () => {
      const next = r.status_pembayaran === PAID ? WAITING : PAID
      const res = await setPaymentStatus(r.id, next)
      if (res.ok) {
        notify('ok', next === PAID ? `${r.nama_lengkap} ditandai lunas` : `${r.nama_lengkap} ditandai menunggu pembayaran`)
        onChanged()
      } else notify('error', res.error)
    })

  const remove = (r: Registration) => {
    if (!confirm(`Hapus data pendaftar ${r.nama_lengkap} (${r.instansi})? Tindakan ini tidak bisa dibatalkan.`)) return
    start(async () => {
      const res = await deleteRegistration(r.id)
      if (res.ok) {
        notify('ok', 'Data pendaftar dihapus')
        onChanged()
      } else notify('error', res.error)
    })
  }

  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pendaftar-p3l-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={pending ? 'opacity-70 transition-opacity' : ''}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, instansi, program, email, no. invoice…"
            aria-label="Cari pendaftar"
            className="field !pl-10"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} aria-label="Filter status" className="field sm:!w-56">
          <option value="semua">Semua status</option>
          <option value="menunggu">Menunggu pembayaran</option>
          <option value="lunas">Lunas</option>
        </select>
        <button type="button" onClick={exportCsv} disabled={!rows.length} className="btn btn-outline !py-2.5 !text-sm">
          <Download className="h-4 w-4" /> Unduh CSV
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
          {registrations.length ? 'Tidak ada pendaftar yang cocok dengan pencarian.' : 'Belum ada pendaftar dari formulir website.'}
        </p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {rows.map((r) => {
            const paid = r.status_pembayaran === PAID
            const wa = r.whatsapp?.replace(/\D/g, '').replace(/^0/, '62')
            return (
              <li key={r.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-lg font-bold text-navy-900">{r.nama_lengkap}</h3>
                      <span className="text-sm text-muted">{r.jabatan}</span>
                    </div>
                    <p className="mt-0.5 font-semibold text-ink">{r.instansi}</p>
                    <p className="mt-2 text-sm text-navy-800">
                      <span className="text-muted">Program:</span> {r.program_pilihan}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                      {wa && (
                        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-700 hover:underline">
                          WA {r.whatsapp}
                        </a>
                      )}
                      <a href={`mailto:${r.email_korporat}`} className="flex items-center gap-1 text-navy-800 hover:underline">
                        <Mail className="h-3.5 w-3.5" /> {r.email_korporat}
                      </a>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      <span className="tabular font-semibold text-navy-800">{invoiceNumber(r.id, r.created_at)}</span> • {r.alamat_instansi} • daftar {r.created_at ? dateTime.format(new Date(r.created_at)) : '-'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                    <button
                      type="button"
                      onClick={() => toggle(r)}
                      disabled={pending}
                      title="Klik untuk mengubah status pembayaran"
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                        paid
                          ? 'border-green-600/30 bg-green-50 text-green-700 hover:bg-green-100'
                          : 'border-amber-700/30 bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {paid ? 'Lunas' : 'Menunggu pembayaran'}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(r)}
                      disabled={pending}
                      aria-label={`Hapus ${r.nama_lengkap}`}
                      className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
