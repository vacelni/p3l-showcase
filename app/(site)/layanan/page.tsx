import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { commonProblems, engineeringServices, getService, serviceHref } from '@/lib/content'
import { waLink } from '@/lib/site'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { WhatsAppIcon } from '@/components/WhatsAppFloat'
import { EngagementSteps, PrepChecklist } from '@/components/layanan/ServiceBits'

export const metadata: Metadata = {
  title: 'Konsultan IPAL: Desain, Audit, Optimalisasi & Commissioning',
  description:
    'Konsultan IPAL untuk industri, rumah sakit, dan hotel: troubleshooting, desain IPAL baru, optimalisasi, audit limbah, dan commissioning.',
  alternates: { canonical: '/layanan' },
}

export default function LayananPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Layanan IPAL', path: '/layanan' }]}
        title="Layanan engineering & konsultasi IPAL"
        lead="Banyak IPAL bekerja di bawah kapasitas desainnya, sementara biaya bahan kimia dan listrik terus naik. Tim P3L membantu Anda menemukan penyebabnya dan memperbaikinya."
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href={waLink('Halo Tim P3L, kami ingin berkonsultasi tentang masalah IPAL kami.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary !px-6 !py-3.5"
          >
            <WhatsAppIcon /> Konsultasikan IPAL Anda
          </a>
          <a href="#layanan" className="btn btn-on-dark !px-6 !py-3.5">
            Lihat semua layanan
          </a>
        </div>
      </PageHero>

      <section className="section bg-white">
        <div className="container-x">
          <h2 className="section-title">Masalah IPAL yang paling sering kami tangani</h2>
          <p className="section-lead">Kenali gejalanya. Setiap masalah di bawah punya pola penyebab yang bisa ditelusuri dari data.</p>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {commonProblems.map((p) => {
              const service = getService(p.service)
              return (
                <li key={p.title}>
                  <Link
                    href={service ? serviceHref(service) : '/layanan'}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-navy-900/40"
                  >
                    <h3 className="text-lg font-bold leading-snug text-navy-900">{p.title}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-muted">{p.body}</p>
                    {service && (
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-green-700">
                        {service.title} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section id="layanan" className="section bg-paper">
        <div className="container-x">
          <h2 className="section-title">Layanan kami</h2>
          <p className="section-lead">Dari kajian satu masalah hingga perancangan IPAL baru, untuk industri, rumah sakit, hotel, dan apartemen.</p>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {engineeringServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={serviceHref(s)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-navy-900/40"
                >
                  {s.photo ? (
                    <div className="relative aspect-[16/9] bg-paper">
                      <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-navy-900">
                      <s.icon className="h-12 w-12 text-green-400" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-extrabold leading-snug text-navy-900">{s.title}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-muted">{s.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-green-700">
                      Selengkapnya <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-muted">
            Butuh pelatihan untuk operator dan penanggung jawab IPAL?{' '}
            <Link href="/program" className="font-bold text-green-700 hover:underline">
              Lihat program pelatihan & sertifikasi BNSP
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <h2 className="section-title">Cara kami bekerja</h2>
            <p className="section-lead">Setiap pekerjaan dimulai dari data Anda, bukan dari paket yang seragam.</p>
            <div className="mt-10">
              <EngagementSteps />
            </div>
          </div>
          <PrepChecklist />
        </div>
      </section>

      <CtaBand
        title="Ceritakan masalah IPAL Anda"
        body="Kirim data debit, parameter limbah, atau foto kondisi IPAL lewat WhatsApp. Tim kami akan membantu menentukan langkah yang tepat."
      />
    </>
  )
}
