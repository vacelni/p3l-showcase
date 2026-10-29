import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, CalendarDays, MapPin, Check } from 'lucide-react'
import { getSchedules } from '@/lib/supabase'
import { programs } from '@/lib/programs'
import { clients, faqs, pillars, registrationSteps, serviceHref, services } from '@/lib/content'
import { formatDateRange, formatPrice, isRegistrationOpen } from '@/lib/format'
import { instructor, site, WA_INHOUSE } from '@/lib/site'
import { JsonLd, faqJsonLd, scheduleEventJsonLd } from '@/lib/seo'
import ScheduleBoard from '@/components/schedule/ScheduleBoard'
import ClientsGrid from '@/components/home/ClientsGrid'
import Gallery from '@/components/home/Gallery'
import FaqList from '@/components/home/FaqList'
import CtaBand from '@/components/CtaBand'
import CertificationBadges from '@/components/CertificationBadges'

export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const trustedBy = [
  'RSUD Kota Contoh',
  'PT Pangan Contoh',
  'PT Agro Contoh Lestari',
  'RS Medika Demo',
  'PT Minuman Demo',
  'PT Susu Demo Nusantara',
  'RS Sehat Contoh',
  'PT Tekstil Contoh',
]

export default async function HomePage() {
  const schedules = await getSchedules()
  const next = schedules.find((s) => isRegistrationOpen(s))

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      {schedules.slice(0, 6).map((s) => (
        <JsonLd key={s.id} data={scheduleEventJsonLd(s)} />
      ))}

      {/* HERO */}
      <section className="hero-screen relative overflow-hidden bg-navy-900 text-white">
        <div className="container-x grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-[clamp(1.25rem,4.5svh,3.5rem)]">
          <div>
            <p className="text-[0.9375rem] font-semibold text-green-400">
              Lembaga pelatihan & konsultasi IPAL sejak {site.foundingYear}
            </p>
            <h1 className="hero-title mt-4 text-[clamp(2.25rem,1.5rem+3.4vw,3.9rem)] font-extrabold leading-[1.04]">
              Pelatihan IPAL & sertifikasi BNSP untuk penanggung jawab air limbah
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 lg:mt-[clamp(0.75rem,2.6svh,1.5rem)]">
              Kelas POPAL, PPPA, dan teknologi pengolahan air limbah untuk industri, rumah sakit, dan hotel. Diajar
              akademisi Teknik Lingkungan Universitas Contoh bersama praktisi yang menangani IPAL setiap hari.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:mt-[clamp(1rem,3.6svh,2.25rem)]">
              <Link href="/jadwal" className="btn btn-primary !px-6 !py-3.5 text-base">
                Lihat jadwal & daftar <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={WA_INHOUSE} target="_blank" rel="noopener noreferrer" className="btn btn-on-dark !px-6 !py-3.5 text-base">
                Minta In-House Training
              </a>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4 lg:mt-[clamp(1rem,4.6svh,3rem)] lg:pt-[clamp(1rem,3svh,2rem)]">
              {[
                { k: `${new Date().getFullYear() - site.foundingYear}+ tahun`, v: 'berpengalaman' },
                { k: `${clients.length} instansi`, v: 'industri & rumah sakit' },
                { k: 'BNSP', v: 'skema POPAL & PPPA' },
                { k: 'Kampus', v: 'instruktur akademisi' },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-xl font-extrabold text-white">{s.k}</dt>
                  <dd className="mt-1 text-sm text-white/60">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative pb-36 sm:pb-28 lg:pb-20">
            <div className="hero-photo relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/10 lg:aspect-auto">
              <Image
                src="/galeri/pelatihan-jogja-2018.jpeg"
                alt="Peserta Pelatihan Teknologi Pengolahan Limbah dan Operasional IPAL P3L di Yogyakarta"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>

            {next ? (
              <div className="absolute inset-x-4 bottom-0 rounded-2xl bg-white p-5 text-ink shadow-[0_24px_48px_-20px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:-left-6 sm:w-[22rem]">
                <p className="flex items-center gap-2 text-xs font-bold text-green-700">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                  </span>
                  Kelas terdekat, pendaftaran dibuka
                </p>
                <p className="mt-2 font-bold leading-snug text-navy-900">{next.title}</p>
                <div className="mt-3 space-y-1.5 text-sm text-muted">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-green-700" />
                    {formatDateRange(next.date_start, next.date_end)}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-700" />
                    {next.location}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4">
                  <span className="tabular font-extrabold text-navy-900">{formatPrice(next.price)}</span>
                  <Link href={`/jadwal?daftar=${next.id}`} className="btn btn-primary !px-4 !py-2 !text-sm">
                    Daftar
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flow-line !rounded-none" />
      </section>

      {/* DIPERCAYA OLEH */}
      <section aria-label="Klien P3L" className="border-b border-line bg-white">
        <div className="container-x flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:gap-10">
          <p className="shrink-0 text-sm font-semibold text-muted">Dipercaya oleh</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[0.9375rem] font-bold text-navy-900/70">
            {trustedBy.map((n) => (
              <li key={n}>{n}</li>
            ))}
            <li>
              <a href="#klien" className="text-green-700 hover:underline">
                +{clients.length - trustedBy.length} lainnya
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="section bg-paper">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="section-title">Pilih program sesuai kebutuhan Anda</h2>
              <p className="section-lead">
                Sertifikasi kompetensi BNSP untuk memenuhi persyaratan personel, atau kelas teknis untuk memperdalam
                operasional IPAL.
              </p>
            </div>
            <Link href="/program" className="inline-flex items-center gap-1.5 font-bold text-green-700 hover:text-green-800">
              Bandingkan semua program <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {programs.map((p) => {
              const upcoming = schedules.find((s) => p.matches(s) && isRegistrationOpen(s))
              return (
                <li key={p.slug}>
                  <Link
                    href={`/program/${p.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-colors hover:border-navy-900/40"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          p.certification === 'BNSP' ? 'bg-green-50 text-green-700' : 'bg-navy-100 text-navy-800'
                        }`}
                      >
                        {p.certificationLabel}
                      </span>
                      <span className="text-sm font-semibold text-muted">{p.duration}</span>
                    </div>
                    <h3 className="mt-5 text-xl font-extrabold leading-snug text-navy-900">{p.name}</h3>
                    <p className="mt-3 flex-1 leading-relaxed text-muted">{p.summary}</p>
                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5 text-sm">
                      <span className="text-muted">
                        {upcoming ? (
                          <>
                            Kelas berikutnya:{' '}
                            <strong className="text-navy-900">{formatDateRange(upcoming.date_start, upcoming.date_end)}</strong>
                          </>
                        ) : p.certification === 'Custom' ? (
                          'Jadwal menyesuaikan instansi Anda'
                        ) : (
                          'Jadwal berikutnya segera diumumkan'
                        )}
                      </span>
                      <ArrowRight className="h-5 w-5 shrink-0 text-green-700 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-8">
            <CertificationBadges variant="strip" />
          </div>
        </div>
      </section>

      {/* JADWAL TERDEKAT */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="section-title">Jadwal terdekat</h2>
              <p className="section-lead">Daftar online dalam 2 menit. Proforma invoice langsung dikirim ke email Anda.</p>
            </div>
            <Link href="/jadwal" className="inline-flex items-center gap-1.5 font-bold text-green-700 hover:text-green-800">
              Semua jadwal ({schedules.length}) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10">
            <ScheduleBoard schedules={schedules} limit={3} emptyTitle="Jadwal kelas berikutnya sedang disusun" />
          </div>
        </div>
      </section>

      {/* KENAPA P3L */}
      <section id="tentang" className="section bg-paper">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src="/galeri/profil-instruktur.jpeg"
                alt={`${instructor.name}, instruktur utama dan konsultan ahli P3L, dosen Teknik Lingkungan Universitas Contoh`}
                fill
                sizes="(max-width: 1024px) 90vw, 35vw"
                className="object-cover object-[50%_70%]"
              />
            </div>
            <p className="absolute -bottom-5 left-5 right-5 rounded-xl bg-white px-5 py-4 text-sm shadow-lg">
              <strong className="block text-navy-900">{instructor.name}</strong>
              <span className="text-muted">Instruktur utama P3L · Dosen {instructor.affiliation}</span>
            </p>
          </div>

          <div>
            <h2 className="section-title">Diajar oleh orang yang merancang dan memperbaiki IPAL</h2>
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-muted">
              <p>
                Pusat Pengolahan dan Pemanfaatan Limbah (P3L) aktif sejak {site.foundingYear}, berfokus pada air limbah
                industri, domestik (hotel dan apartemen), dan rumah sakit. Kami melatih, mendesain, mengaudit, hingga
                mendampingi commissioning IPAL.
              </p>
              <p>
                Pengalaman lapangan itulah yang dibawa ke kelas: setiap materi diikuti contoh kasus nyata, sehingga
                peserta pulang dengan cara menyelesaikan masalah di IPAL-nya sendiri.
              </p>
            </div>
            <ul className="mt-10 grid gap-6">
              {pillars.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-green-400">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-navy-900">{p.title}</h3>
                    <p className="mt-1 leading-relaxed text-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/tentang" className="mt-10 inline-flex items-center gap-1.5 font-bold text-green-700 hover:text-green-800">
              Selengkapnya tentang P3L <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ALUR PENDAFTARAN */}
      <section className="section bg-white">
        <div className="container-x">
          <h2 className="section-title">Cara mendaftar</h2>
          <p className="section-lead">Tanpa formulir kertas. Semua dokumen administrasi dikirim lewat email.</p>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {registrationSteps.map((s, i) => (
              <li key={s.title} className="relative">
                <div className="flex items-center gap-4">
                  <span className="tabular flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-green-600 text-lg font-extrabold text-green-700">
                    {i + 1}
                  </span>
                  {i < registrationSteps.length - 1 && <span aria-hidden="true" className="hidden h-0.5 flex-1 bg-line lg:block" />}
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy-900">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* LAYANAN */}
      <section className="section bg-navy-900 text-white">
        <div className="container-x grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <h2 className="text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] font-extrabold leading-[1.12]">
              Bukan hanya pelatihan. Kami juga menangani IPAL Anda.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Dari desain IPAL baru hingga audit biaya operasional, tim engineering P3L membantu instalasi Anda memenuhi
              baku mutu dengan biaya yang wajar.
            </p>
            <Link href="/layanan" className="btn btn-primary mt-8">
              Lihat layanan engineering
            </Link>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug} className="bg-navy-900">
                <Link href={serviceHref(s)} className="group flex h-full flex-col p-6 transition-colors hover:bg-navy-800">
                  <s.icon className="h-6 w-6 text-green-400" />
                  <h3 className="mt-4 font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* KLIEN */}
      <section id="klien" className="section bg-white">
        <div className="container-x">
          <h2 className="section-title">Rekam jejak di industri dan rumah sakit</h2>
          <p className="section-lead">
            Sejak {site.foundingYear}, P3L melatih dan mendampingi tim IPAL dari rumah sakit rujukan nasional hingga
            perusahaan multinasional di seluruh Indonesia.
          </p>
          <div className="mt-10">
            <ClientsGrid />
          </div>
        </div>
      </section>

      {/* GALERI */}
      <section className="section bg-paper">
        <div className="container-x">
          <h2 className="section-title">Dokumentasi kegiatan</h2>
          <p className="section-lead">Kelas pelatihan, pekerjaan lapangan, dan uji laboratorium yang kami lakukan bersama klien.</p>
          <div className="mt-10">
            <Gallery />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="section-title">Pertanyaan yang sering diajukan</h2>
            <p className="section-lead">Tidak menemukan jawabannya? Tanyakan langsung ke admin kami lewat WhatsApp.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {['Jadwal & biaya terbaru', 'Penawaran In-House Training', 'Konsultasi masalah IPAL'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-navy-900">
                  <Check className="h-4 w-4 text-green-700" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
