'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, Users, Clock, BadgeCheck, ListChecks } from 'lucide-react'
import type { Schedule } from '@/lib/types'
import { durationDays, formatPrice, isRegistrationOpen } from '@/lib/format'
import { programForSchedule } from '@/lib/programs'
import { WA_INHOUSE, waLink } from '@/lib/site'
import SyllabusModal from '@/components/schedule/SyllabusModal'
import RegistrationModal from '@/components/schedule/RegistrationModal'

type Filter = 'semua' | 'bnsp' | 'teknis'

const filters: { id: Filter; label: string }[] = [
  { id: 'semua', label: 'Semua jadwal' },
  { id: 'bnsp', label: 'Sertifikasi BNSP' },
  { id: 'teknis', label: 'Pelatihan teknis IPAL' },
]

const monthFmt = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric', timeZone: 'UTC' })

function DateBlock({ start, end }: { start: string; end: string }) {
  const s = new Date(`${start}T00:00:00Z`)
  const e = new Date(`${end || start}T00:00:00Z`)
  const sameMonth = s.getUTCMonth() === e.getUTCMonth()
  return (
    <div className="flex shrink-0 flex-row items-baseline gap-2 rounded-xl bg-navy-900 px-4 py-3 text-white sm:w-[7.5rem] sm:flex-col sm:items-start sm:gap-0 sm:py-4">
      <span className="tabular text-2xl font-extrabold leading-none sm:text-[1.7rem]">
        {s.getUTCDate()}
        {e.getTime() !== s.getTime() && <>–{e.getUTCDate()}</>}
      </span>
      <span className="text-sm font-semibold text-white/75 sm:mt-1.5">
        {sameMonth ? monthFmt.format(e) : `${monthFmt.format(s).split(' ')[0]} – ${monthFmt.format(e)}`}
      </span>
    </div>
  )
}

export default function ScheduleBoard({
  schedules,
  withFilters = false,
  limit,
  emptyTitle = 'Belum ada jadwal terbuka untuk kategori ini',
}: {
  schedules: Schedule[]
  withFilters?: boolean
  limit?: number
  emptyTitle?: string
}) {
  const [filter, setFilter] = useState<Filter>('semua')
  const [syllabusFor, setSyllabusFor] = useState<Schedule | null>(null)
  const [registerFor, setRegisterFor] = useState<Schedule | null>(null)

  // Link "/jadwal?daftar=<id>" (mis. dari kartu "Kelas terdekat" di beranda) langsung membuka formulir.
  useEffect(() => {
    const id = Number(new URLSearchParams(window.location.search).get('daftar'))
    const target = id ? schedules.find((s) => s.id === id && isRegistrationOpen(s)) : undefined
    // URL baru bisa dibaca setelah hydration (halaman dirender statis), jadi effect memang tempatnya.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (target) setRegisterFor(target)
  }, [schedules])

  const visible = useMemo(() => {
    const list = schedules.filter((s) => {
      if (filter === 'bnsp') return s.category === 'BNSP'
      if (filter === 'teknis') return s.category !== 'BNSP'
      return true
    })
    return limit ? list.slice(0, limit) : list
  }, [schedules, filter, limit])

  const count = (f: Filter) =>
    schedules.filter((s) => (f === 'bnsp' ? s.category === 'BNSP' : f === 'teknis' ? s.category !== 'BNSP' : true)).length

  return (
    <div>
      {withFilters && (
        <div role="tablist" aria-label="Filter jadwal" className="mb-8 flex flex-wrap gap-2">
          {filters.filter((f) => f.id === 'semua' || count(f.id) > 0).map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === f.id
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-line bg-white text-navy-900 hover:border-navy-900/40'
              }`}
            >
              {f.label} <span className={filter === f.id ? 'text-white/60' : 'text-muted'}>({count(f.id)})</span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-paper px-6 py-12 text-center">
          <p className="text-lg font-bold text-navy-900">{emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Jadwal baru diumumkan berkala. Tanyakan jadwal berikutnya atau minta kelas In-House di lokasi Anda.
          </p>
          <a href={WA_INHOUSE} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
            Tanya jadwal via WhatsApp
          </a>
        </div>
      ) : (
        <ul className="grid gap-4">
          {visible.map((s) => {
            const program = programForSchedule(s)
            const days = durationDays(s.date_start, s.date_end)
            const isBnsp = s.category === 'BNSP'
            const open = isRegistrationOpen(s)
            return (
              <li
                key={s.id}
                className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-4 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(11,37,69,0.35)] sm:flex-row sm:items-stretch sm:p-5"
              >
                <DateBlock start={s.date_start} end={s.date_end} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                        isBnsp ? 'bg-green-50 text-green-700' : 'bg-navy-100 text-navy-800'
                      }`}
                    >
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {isBnsp ? 'Sertifikasi BNSP' : 'Sertifikat keahlian P3L'}
                    </span>
                    {!open && (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                        Sedang berlangsung
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2.5 text-lg font-bold leading-snug text-navy-900">
                    {program && program.certification !== 'Custom' ? (
                      <Link href={`/program/${program.slug}`} className="hover:text-green-700">
                        {s.title}
                      </Link>
                    ) : (
                      s.title
                    )}
                  </h3>
                  <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-muted sm:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <dt className="sr-only">Lokasi</dt>
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                      <dd>{s.location}</dd>
                    </div>
                    {days && (
                      <div className="flex items-start gap-2">
                        <dt className="sr-only">Durasi</dt>
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                        <dd>{days} hari</dd>
                      </div>
                    )}
                    {s.min_participants ? (
                      <div className="flex items-start gap-2">
                        <dt className="sr-only">Kuota</dt>
                        <Users className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                        <dd>Kelas berjalan minimal {s.min_participants} peserta</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>

                <div className="flex flex-col justify-between gap-4 border-t border-line pt-4 sm:w-56 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                  <div>
                    <p className="text-xs font-medium text-muted">Biaya per peserta</p>
                    <p className="tabular text-xl font-extrabold text-navy-900">{formatPrice(s.price)}</p>
                  </div>
                  <div className="grid gap-2">
                    {open ? (
                      <button type="button" onClick={() => setRegisterFor(s)} className="btn btn-primary w-full !py-2.5">
                        Daftar kelas ini
                      </button>
                    ) : (
                      <a
                        href={waLink(`Halo Admin P3L, kapan jadwal berikutnya untuk ${s.title}?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline w-full !py-2.5"
                      >
                        Tanya kelas berikutnya
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setSyllabusFor(s)}
                      className="inline-flex items-center justify-center gap-1.5 py-1.5 text-sm font-semibold text-navy-900 hover:text-green-700"
                    >
                      <ListChecks className="h-4 w-4" />
                      Lihat materi
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <SyllabusModal
        schedule={syllabusFor}
        canRegister={!!syllabusFor && isRegistrationOpen(syllabusFor)}
        onClose={() => setSyllabusFor(null)}
        onRegister={(s) => {
          setSyllabusFor(null)
          setRegisterFor(s)
        }}
      />
      <RegistrationModal schedule={registerFor} onClose={() => setRegisterFor(null)} />
    </div>
  )
}
