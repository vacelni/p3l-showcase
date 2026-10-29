import type { Metadata } from 'next'
import { CalendarCheck, FileText, Wallet } from 'lucide-react'
import { getSchedules } from '@/lib/supabase'
import { JsonLd, scheduleEventJsonLd } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import ScheduleBoard from '@/components/schedule/ScheduleBoard'
import CtaBand from '@/components/CtaBand'

export const revalidate = 300

// Tahun dihitung saat halaman dirender ulang (ISR), bukan saat build, agar tidak basi di tahun baru.
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Jadwal Pelatihan IPAL & Sertifikasi BNSP ${new Date().getFullYear()}`,
    description:
      'Jadwal terbaru pelatihan IPAL dan sertifikasi BNSP POPAL & PPPA di Jakarta, Semarang, dan Medan. Lihat biaya dan materi, lalu daftar online.',
    alternates: { canonical: '/jadwal' },
  }
}

export default async function JadwalPage() {
  const schedules = await getSchedules()

  return (
    <>
      {schedules.map((s) => (
        <JsonLd key={s.id} data={scheduleEventJsonLd(s)} />
      ))}

      <PageHero
        crumbs={[{ name: 'Jadwal', path: '/jadwal' }]}
        title="Jadwal pelatihan & sertifikasi"
        lead="Jadwal terbaru pelatihan IPAL dan sertifikasi BNSP POPAL & PPPA. Cek biaya dan materi, lalu daftar online."
      >
        <ul className="mt-10 grid gap-4 text-sm text-white/80 sm:grid-cols-3">
          {[
            { icon: CalendarCheck, text: 'Daftar online, kursi tercatat saat itu juga' },
            { icon: FileText, text: 'Proforma invoice resmi langsung ke email' },
            { icon: Wallet, text: 'Pembayaran via transfer bank instansi' },
          ].map((i) => (
            <li key={i.text} className="flex items-center gap-3">
              <i.icon className="h-5 w-5 shrink-0 text-green-400" />
              {i.text}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="section !pt-12 bg-white">
        <div className="container-x">
          <ScheduleBoard schedules={schedules} withFilters />
        </div>
      </section>

      <CtaBand
        title="Tidak ada jadwal yang cocok?"
        body="Kami bisa mengadakan kelas In-House di lokasi Anda pada tanggal yang Anda tentukan, termasuk untuk sertifikasi BNSP."
      />
    </>
  )
}
