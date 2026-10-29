import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Award, Check, Clock, MapPin, Wallet } from 'lucide-react'
import { getProgram, programs } from '@/lib/programs'
import { getSchedules } from '@/lib/supabase'
import { bnspFaqs, faqs } from '@/lib/content'
import { formatPrice, priceNumber } from '@/lib/format'
import { waLink } from '@/lib/site'
import { JsonLd, courseJsonLd, faqJsonLd } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import ScheduleBoard from '@/components/schedule/ScheduleBoard'
import FaqList from '@/components/home/FaqList'
import CtaBand from '@/components/CtaBand'
import CertificationBadges from '@/components/CertificationBadges'
import { WhatsAppIcon } from '@/components/WhatsAppFloat'

export const revalidate = 300
export const dynamicParams = false

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const program = getProgram(slug)
  if (!program) return {}
  return {
    title: program.seoTitle,
    description: program.seoDescription,
    alternates: { canonical: `/program/${program.slug}` },
    openGraph: { type: 'website', url: `/program/${program.slug}`, title: program.seoTitle, description: program.seoDescription },
  }
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = getProgram(slug)
  if (!program) notFound()

  const schedules = (await getSchedules()).filter(program.matches)
  const prices = schedules.map((s) => priceNumber(s.price)).filter((p): p is number => p !== null)
  const cities = [...new Set(schedules.map((s) => s.location.split(',').pop()!.trim()))]
  const isInHouse = program.certification === 'Custom'
  const ask = waLink(`Halo Admin P3L, saya ingin bertanya tentang ${program.name}.`)
  const programFaqs = program.certification === 'BNSP' ? [...bnspFaqs, ...faqs.slice(0, 4)] : faqs.slice(0, 6)

  const facts = [
    { icon: Award, label: 'Sertifikat', value: program.certificationLabel },
    { icon: Clock, label: 'Durasi', value: program.duration },
    { icon: Wallet, label: 'Biaya', value: prices.length ? `mulai ${formatPrice(Math.min(...prices))}` : 'Sesuai penawaran' },
    { icon: MapPin, label: 'Lokasi', value: isInHouse ? 'Di lokasi Anda' : cities.length ? cities.join(', ') : 'Jakarta, Semarang, Medan' },
  ]

  return (
    <>
      <JsonLd data={courseJsonLd(program, schedules)} />
      <JsonLd data={faqJsonLd(programFaqs)} />

      <PageHero
        crumbs={[
          { name: 'Program', path: '/program' },
          { name: program.shortName, path: `/program/${program.slug}` },
        ]}
        title={program.name}
        lead={program.summary}
      >
        <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex gap-3">
              <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
              <div>
                <dt className="text-sm text-white/60">{f.label}</dt>
                <dd className="mt-0.5 font-bold">{f.value}</dd>
              </div>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {isInHouse ? (
            <a href={ask} target="_blank" rel="noopener noreferrer" className="btn btn-primary !px-6 !py-3.5">
              Minta penawaran In-House
            </a>
          ) : (
            <a href="#jadwal" className="btn btn-primary !px-6 !py-3.5">
              Lihat jadwal & daftar
            </a>
          )}
          <a href={ask} target="_blank" rel="noopener noreferrer" className="btn btn-on-dark !px-6 !py-3.5">
            <WhatsAppIcon /> Tanya admin
          </a>
        </div>
      </PageHero>

      <section className="section bg-white">
        <div className="container-x grid gap-14 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900">Tentang program ini</h2>
            <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-muted">
              {program.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <h2 className="mt-14 text-2xl font-extrabold text-navy-900">{program.outcomesTitle}</h2>
            <ul className="mt-6 grid gap-3">
              {program.outcomes.map((o) => (
                <li key={o} className="flex gap-3 rounded-xl border border-line p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-700" strokeWidth={2.5} />
                  <span className="leading-relaxed text-ink">{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:pt-1">
            <div className="space-y-5 lg:sticky lg:top-28">
              {program.certification === 'BNSP' && <CertificationBadges />}
              <div className="rounded-2xl bg-paper p-6">
                <h2 className="font-extrabold text-navy-900">Cocok untuk</h2>
                <ul className="mt-4 space-y-3">
                  {program.audience.map((a) => (
                    <li key={a} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-line pt-6">
                  <p className="text-sm text-muted">Ingin memastikan program ini sesuai untuk tim Anda?</p>
                  <a href={ask} target="_blank" rel="noopener noreferrer" className="btn btn-navy mt-4 w-full">
                    Tanya via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {!isInHouse && (
        <section id="jadwal" className="section bg-paper">
          <div className="container-x">
            <h2 className="section-title">Jadwal {program.shortName}</h2>
            <p className="section-lead">Pilih kelas lalu isi formulir. Proforma invoice langsung dikirim ke email Anda.</p>
            <div className="mt-10">
              <ScheduleBoard schedules={schedules} emptyTitle={`Belum ada kelas ${program.shortName} yang dibuka`} />
            </div>
          </div>
        </section>
      )}

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <h2 className="section-title">Pertanyaan umum</h2>
          <FaqList items={programFaqs} />
        </div>
      </section>

      <section className="border-t border-line bg-white pb-4 pt-12">
        <div className="container-x">
          <h2 className="text-lg font-extrabold text-navy-900">Program lainnya</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {programs
              .filter((p) => p.slug !== program.slug)
              .map((p) => (
                <li key={p.slug}>
                  <Link href={`/program/${p.slug}`} className="group flex items-center justify-between gap-3 rounded-xl border border-line p-4 font-semibold text-navy-900 hover:border-navy-900/40">
                    {p.name}
                    <ArrowRight className="h-4 w-4 shrink-0 text-green-700 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
