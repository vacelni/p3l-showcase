import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle, ArrowRight, Check } from 'lucide-react'
import { engineeringServices, getService, serviceHref } from '@/lib/content'
import { waLink } from '@/lib/site'
import { JsonLd, serviceJsonLd } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { WhatsAppIcon } from '@/components/WhatsAppFloat'
import { EngagementSteps, PrepChecklist } from '@/components/layanan/ServiceBits'

export const dynamicParams = false

export function generateStaticParams() {
  return engineeringServices.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  const path = `/layanan/${service.slug}`
  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: path },
    openGraph: { type: 'website', url: path, title: service.seoTitle, description: service.seoDescription },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const ask = waLink(`Halo Tim P3L, kami ingin berkonsultasi tentang layanan ${service.title}.`)

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />

      <PageHero
        crumbs={[
          { name: 'Layanan IPAL', path: '/layanan' },
          { name: service.title, path: serviceHref(service) },
        ]}
        title={service.title}
        lead={service.summary}
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href={ask} target="_blank" rel="noopener noreferrer" className="btn btn-primary !px-6 !py-3.5">
            <WhatsAppIcon /> Diskusikan kebutuhan Anda
          </a>
          <Link href="/layanan" className="btn btn-on-dark !px-6 !py-3.5">
            Semua layanan
          </Link>
        </div>
      </PageHero>

      <section className="section bg-white">
        <div className="container-x grid gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <div className="space-y-4 text-[1.0625rem] leading-relaxed text-muted">
              {service.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {service.photo && (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-paper">
                <Image src={service.photo.src} alt={service.photo.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
              </div>
            )}

            <h2 className="mt-14 text-2xl font-extrabold text-navy-900">Kapan Anda membutuhkan layanan ini</h2>
            <ul className="mt-6 grid gap-3">
              {service.signs.map((s) => (
                <li key={s} className="flex gap-3 rounded-xl border border-line p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  <span className="leading-relaxed text-ink">{s}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-2xl font-extrabold text-navy-900">Lingkup pekerjaan</h2>
            <p className="mt-3 text-muted">Disesuaikan dengan kondisi IPAL dan kebutuhan instansi Anda. Umumnya mencakup:</p>
            <ul className="mt-6 grid gap-3">
              {service.scope.map((s) => (
                <li key={s} className="flex gap-3 rounded-xl border border-line p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-700" strokeWidth={2.5} />
                  <span className="leading-relaxed text-ink">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:pt-1">
            <div className="grid gap-6 lg:sticky lg:top-28">
              <PrepChecklist />
              <div className="rounded-2xl border border-line p-6">
                <p className="font-bold text-navy-900">Siap berdiskusi?</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">Kirim data yang sudah ada lewat WhatsApp untuk diskusi awal.</p>
                <a href={ask} target="_blank" rel="noopener noreferrer" className="btn btn-navy mt-4 w-full">
                  Tanya via WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-x">
          <h2 className="section-title">Cara kami bekerja</h2>
          <div className="mt-10 max-w-4xl">
            <EngagementSteps />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white pb-4 pt-12">
        <div className="container-x">
          <h2 className="text-lg font-extrabold text-navy-900">Layanan lainnya</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {engineeringServices
              .filter((s) => s.slug !== service.slug)
              .map((s) => (
                <li key={s.slug}>
                  <Link
                    href={serviceHref(s)}
                    className="group flex h-full items-center justify-between gap-3 rounded-xl border border-line p-4 font-semibold text-navy-900 hover:border-navy-900/40"
                  >
                    {s.title}
                    <ArrowRight className="h-4 w-4 shrink-0 text-green-700 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Ceritakan masalah IPAL Anda"
        body="Kirim data debit, parameter limbah, atau foto kondisi IPAL lewat WhatsApp. Tim kami akan membantu menentukan langkah yang tepat."
      />
    </>
  )
}
