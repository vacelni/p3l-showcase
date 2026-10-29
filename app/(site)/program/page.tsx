import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { programs } from '@/lib/programs'
import { getSchedules } from '@/lib/supabase'
import { formatDateRange, formatPrice, isRegistrationOpen } from '@/lib/format'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import CertificationBadges from '@/components/CertificationBadges'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Program Pelatihan IPAL & Sertifikasi BNSP POPAL, PPPA',
  description:
    'Bandingkan program pelatihan P3L: sertifikasi POPAL BNSP, sertifikasi PPPA BNSP, pelatihan teknologi pengolahan air limbah, dan In-House Training IPAL.',
  alternates: { canonical: '/program' },
}

const rows: { label: string; values: (string | boolean)[] }[] = [
  { label: 'Sertifikat', values: ['BNSP', 'BNSP', 'Keahlian P3L', 'BNSP / P3L'] },
  { label: 'Durasi', values: ['4 hari', '4 hari', '3 hari', 'Disesuaikan'] },
  { label: 'Uji kompetensi', values: [true, true, false, 'Opsional'] },
  { label: 'Fokus', values: ['Operasional IPAL', 'Pengendalian pencemaran air', 'Teknologi & proses IPAL', 'Masalah IPAL Anda'] },
]

export default async function ProgramIndexPage() {
  const schedules = await getSchedules()

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Program', path: '/program' }]}
        title="Program pelatihan P3L"
        lead="Empat jalur belajar untuk tim pengelola air limbah: dua skema sertifikasi BNSP, satu kelas teknis, dan pelatihan di lokasi Anda."
      />

      <section className="section !pt-12 bg-white">
        <div className="container-x">
          <ul className="grid gap-5 lg:grid-cols-2">
            {programs.map((p) => {
              const upcoming = schedules.filter((s) => p.matches(s) && isRegistrationOpen(s))
              return (
                <li key={p.slug} className="flex flex-col rounded-2xl border border-line p-7">
                  <span
                    className={`self-start rounded-full px-3 py-1 text-xs font-bold ${
                      p.certification === 'BNSP' ? 'bg-green-50 text-green-700' : 'bg-navy-100 text-navy-800'
                    }`}
                  >
                    {p.certificationLabel}
                  </span>
                  <h2 className="mt-4 text-2xl font-extrabold leading-snug text-navy-900">{p.name}</h2>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{p.summary}</p>
                  <div className="mt-6 rounded-xl bg-paper p-4 text-sm">
                    {upcoming.length ? (
                      <>
                        <p className="font-semibold text-navy-900">
                          {upcoming.length} kelas terbuka • mulai {formatPrice(upcoming[0].price)}
                        </p>
                        <p className="mt-1 text-muted">
                          Terdekat: {formatDateRange(upcoming[0].date_start, upcoming[0].date_end)}, {upcoming[0].location}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted">
                        {p.certification === 'Custom'
                          ? 'Jadwal dan biaya disesuaikan dengan instansi Anda.'
                          : 'Belum ada kelas terbuka. Tanyakan jadwal berikutnya ke admin.'}
                      </p>
                    )}
                  </div>
                  <Link href={`/program/${p.slug}`} className="btn btn-navy mt-6 self-start">
                    Detail program <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-8">
            <CertificationBadges variant="strip" />
          </div>

          <h2 className="mt-20 text-2xl font-extrabold text-navy-900">Perbandingan singkat</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead className="bg-paper">
                <tr>
                  <th scope="col" className="p-4 font-semibold text-muted">
                    <span className="sr-only">Aspek</span>
                  </th>
                  {programs.map((p) => (
                    <th key={p.slug} scope="col" className="p-4 font-bold text-navy-900">
                      {p.shortName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-line">
                    <th scope="row" className="p-4 font-semibold text-muted">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className="p-4 text-navy-900">
                        {v === true ? (
                          <Check className="h-5 w-5 text-green-700" aria-label="Ya" />
                        ) : v === false ? (
                          <Minus className="h-5 w-5 text-muted/60" aria-label="Tidak" />
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
