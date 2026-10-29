import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, ExternalLink, Factory, Stethoscope } from 'lucide-react'
import { clients, pillars } from '@/lib/content'
import { programs } from '@/lib/programs'
import { instructor, site } from '@/lib/site'
import PageHero from '@/components/PageHero'
import ClientsGrid from '@/components/home/ClientsGrid'
import Gallery from '@/components/home/Gallery'
import CtaBand from '@/components/CtaBand'
import CertificationBadges from '@/components/CertificationBadges'

export const metadata: Metadata = {
  title: { absolute: 'Tentang P3L – Lembaga Pelatihan & Konsultan IPAL Semarang' },
  description: `P3L berdiri sejak ${site.foundingYear} di Semarang. Pelatihan operator IPAL, sertifikasi BNSP POPAL & PPPA, dan konsultasi air limbah bersama instruktur Universitas Contoh.`,
  alternates: { canonical: '/tentang' },
}

const sectors = [
  {
    icon: Factory,
    title: 'Industri',
    body: 'Makanan & minuman, susu, farmasi, kelapa sawit, tekstil, kayu, perikanan, dan perkebunan.',
  },
  {
    icon: Stethoscope,
    title: 'Rumah sakit',
    body: 'Dari rumah sakit rujukan nasional hingga RSUD di berbagai provinsi.',
  },
  {
    icon: Building2,
    title: 'Hotel, apartemen & kawasan',
    body: 'Air limbah domestik dari gedung, hotel, apartemen, dan kawasan komersial.',
  },
]

export default function TentangPage() {
  const years = new Date().getFullYear() - site.foundingYear
  const stats = [
    { k: `${years}+`, v: 'tahun menangani air limbah' },
    { k: String(clients.length), v: 'instansi klien tercatat' },
    { k: String(programs.length), v: 'program pelatihan' },
    { k: '2', v: 'skema sertifikasi BNSP' },
  ]

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Tentang', path: '/tentang' }]}
        title="Tentang P3L"
        lead={`Pusat Pengolahan dan Pemanfaatan Limbah (P3L) adalah lembaga pelatihan dan konsultasi pengolahan air limbah yang berbasis di ${site.city} sejak ${site.foundingYear}.`}
      >
        <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.v}>
              <dt className="tabular text-2xl font-extrabold text-white">{s.k}</dt>
              <dd className="mt-1 text-sm text-white/60">{s.v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="section bg-white">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <h2 className="section-title">Dari ruang kuliah ke lapangan, lalu kembali ke kelas</h2>
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-muted">
              <p>
                P3L berfokus pada air limbah industri, domestik (hotel dan apartemen), dan rumah sakit. Kami melatih
                operator dan penanggung jawab IPAL, mendesain IPAL baru, mengaudit dan mengoptimalkan IPAL yang sudah
                berjalan, hingga mendampingi commissioning.
              </p>
              <p>
                Instruktur utama P3L, {instructor.name}, adalah akademisi Departemen Teknik Lingkungan Universitas Contoh, didampingi praktisi senior yang menangani desain dan operasional IPAL. Kombinasi ini membuat
                materi pelatihan tidak berhenti di teori: setiap topik diikuti contoh kasus nyata dari IPAL yang pernah
                kami tangani.
              </p>
              <p>
                Sebaliknya, pengalaman di kelas membuat kami memahami masalah yang paling sering dihadapi operator
                sehari-hari. Itulah yang kami bawa saat menangani proyek engineering: solusi yang bisa dijalankan oleh tim
                Anda sendiri, dengan biaya operasional yang wajar.
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
          </div>

          <figure id="instruktur" className="relative mx-auto w-full max-w-md scroll-mt-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src={instructor.photo}
                alt={`${instructor.name}, instruktur utama dan konsultan ahli P3L, dosen Teknik Lingkungan Universitas Contoh`}
                fill
                sizes="(max-width: 1024px) 90vw, 30vw"
                className="object-cover object-[50%_70%]"
              />
            </div>
            <figcaption className="mt-5">
              <strong className="block text-lg text-navy-900">{instructor.name}</strong>
              <span className="text-sm text-muted">
                {instructor.role}. Dosen {instructor.affiliation}.
              </span>
              <p className="mt-4 text-sm font-bold text-navy-900">Bidang keahlian</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                {instructor.expertise.map((e) => (
                  <li key={e} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                    {e}
                  </li>
                ))}
              </ul>
              <ul className="mt-4 flex flex-wrap gap-2">
                {instructor.profiles.map((p) => (
                  <li key={p.label}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-navy-900 hover:border-navy-900/40"
                    >
                      Profil {p.label} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-x">
          <h2 className="section-title">Sektor yang kami layani</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {sectors.map((s) => (
              <li key={s.title} className="rounded-2xl border border-line bg-white p-7">
                <s.icon className="h-7 w-7 text-green-700" />
                <h3 className="mt-4 text-lg font-extrabold text-navy-900">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <CertificationBadges variant="strip" />
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/program" className="btn btn-navy">
              Program pelatihan <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/layanan" className="btn btn-outline">
              Layanan engineering IPAL
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <h2 className="section-title">Klien kami</h2>
          <p className="section-lead">
            Rumah sakit rujukan nasional hingga perusahaan multinasional, dari Aceh sampai Papua.
          </p>
          <div className="mt-10">
            <ClientsGrid />
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-x">
          <h2 className="section-title">Dokumentasi kegiatan</h2>
          <div className="mt-10">
            <Gallery />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
