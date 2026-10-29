'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, ExternalLink, FileText, LogOut, RefreshCw, Users, Wallet, CheckCircle2, AlertCircle } from 'lucide-react'
import { LogoMark } from '@/components/Logo'
import { logout } from '@/app/admin/actions'
import type { Insight, Registration, Schedule } from '@/lib/types'
import { todayISO } from '@/lib/format'
import RegistrationsPanel from './RegistrationsPanel'
import SchedulesPanel from './SchedulesPanel'
import InsightsPanel from './InsightsPanel'

export interface DashboardData {
  registrations: Registration[]
  schedules: Schedule[]
  insights: Insight[]
  error: string | null
  warnings: string[]
}

export type Notify = (type: 'ok' | 'error', message: string) => void

type Tab = 'pendaftar' | 'jadwal' | 'konten'

export default function AdminDashboard({ initial }: { initial: DashboardData }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('pendaftar')
  const [refreshing, startRefresh] = useTransition()
  const [toast, setToast] = useState<{ type: 'ok' | 'error'; message: string } | null>(
    initial.error ? { type: 'error', message: `Sebagian data gagal dimuat: ${initial.error}` } : null
  )

  useEffect(() => {
    if (!toast || toast.type === 'error') return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const notify: Notify = (type, message) => setToast({ type, message })
  const refresh = () => startRefresh(() => router.refresh())

  const { registrations, schedules, insights } = initial
  const today = todayISO()
  const waiting = registrations.filter((r) => r.status_pembayaran !== 'Lunas / Terkonfirmasi').length
  const upcoming = schedules.filter((s) => s.is_active && s.date_end >= today).length
  const liveContent = insights.filter((i) => i.is_active !== false).length

  const stats = [
    { icon: Users, label: 'Total pendaftar', value: registrations.length },
    { icon: Wallet, label: 'Menunggu pembayaran', value: waiting, tone: waiting ? 'text-amber-700' : '' },
    { icon: CalendarDays, label: 'Jadwal tampil & akan datang', value: upcoming },
    { icon: FileText, label: 'Konten tampil', value: liveContent },
  ]

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'pendaftar', label: 'Pendaftar', count: registrations.length },
    { id: 'jadwal', label: 'Jadwal', count: schedules.length },
    { id: 'konten', label: 'Artikel & berita', count: insights.length },
  ]

  return (
    <div>
      <header className="bg-navy-900 text-white">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark id="admin" tone="light" className="h-8 w-8" />
            <span className="font-extrabold">Admin P3L</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <a href="/" target="_blank" rel="noopener" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white sm:flex">
              <ExternalLink className="h-4 w-4" /> Lihat website
            </a>
            <button
              type="button"
              onClick={async () => {
                await logout()
                router.refresh()
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="container-x py-8 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Ringkasan</h1>
            <p className="mt-1 text-sm text-muted">Perubahan jadwal & konten langsung tampil di website.</p>
          </div>
          <button type="button" onClick={refresh} disabled={refreshing} className="btn btn-outline !py-2 !text-sm">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Muat ulang data
          </button>
        </div>

        {initial.warnings.length > 0 && (
          <ul className="mt-6 grid gap-2">
            {initial.warnings.map((w) => (
              <li key={w} className="flex gap-2 rounded-xl border border-amber-700/30 bg-amber-50 p-4 text-sm text-amber-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {w}
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-white p-5">
              <dt className="flex items-center gap-2 text-sm text-muted">
                <s.icon className="h-4 w-4" /> {s.label}
              </dt>
              <dd className={`tabular mt-2 text-3xl font-extrabold text-navy-900 ${s.tone ?? ''}`}>{s.value}</dd>
            </div>
          ))}
        </dl>

        <div role="tablist" aria-label="Bagian admin" className="mt-10 flex gap-1 overflow-x-auto border-b border-line">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === t.id ? 'border-green-600 text-navy-900' : 'border-transparent text-muted hover:text-navy-900'
              }`}
            >
              {t.label} <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-xs text-muted">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'pendaftar' && <RegistrationsPanel registrations={registrations} notify={notify} onChanged={refresh} />}
          {tab === 'jadwal' && <SchedulesPanel schedules={schedules} notify={notify} onChanged={refresh} />}
          {tab === 'konten' && <InsightsPanel insights={insights} notify={notify} onChanged={refresh} />}
        </div>
      </main>

      <div aria-live="polite" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2">
        {toast && (
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
              toast.type === 'ok' ? 'bg-navy-900' : 'bg-red-700'
            }`}
          >
            {toast.type === 'ok' ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <AlertCircle className="h-4 w-4" />}
            {toast.message}
            {toast.type === 'error' && (
              <button type="button" onClick={() => setToast(null)} className="ml-2 underline">
                Tutup
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
