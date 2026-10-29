import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { fullAddress, site, waLink } from '@/lib/site'
import PageHero from '@/components/PageHero'
import { WhatsAppIcon } from '@/components/WhatsAppFloat'

export const metadata: Metadata = {
  title: { absolute: 'Kontak P3L – WhatsApp, Email & Alamat' },
  description: `Hubungi P3L untuk jadwal pelatihan IPAL, sertifikasi BNSP, In-House Training, atau konsultasi air limbah. WhatsApp ${site.phone}.`,
  alternates: { canonical: '/kontak' },
}

const topics = [
  { label: 'Tanya jadwal & biaya pelatihan', message: 'Halo Admin P3L, saya ingin bertanya jadwal dan biaya pelatihan terbaru.' },
  { label: 'Minta penawaran In-House Training', message: 'Halo Tim P3L, kami ingin meminta penawaran In-House Training untuk instansi kami.' },
  { label: 'Konsultasi masalah IPAL', message: 'Halo Tim P3L, kami ingin berkonsultasi tentang masalah IPAL kami.' },
  { label: 'Konfirmasi pembayaran', message: 'Halo Admin P3L, saya ingin konfirmasi pembayaran pelatihan.' },
]

export default function KontakPage() {
  const channels = [
    { icon: Phone, label: 'WhatsApp & telepon', value: site.phone, href: waLink('Halo Admin P3L.'), external: true },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: 'Kantor (buka di Google Maps)', value: fullAddress, href: site.mapsUrl || undefined, external: true },
    ...(site.openingHours ? [{ icon: Clock, label: 'Jam layanan', value: site.openingHours }] : []),
  ]

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Kontak', path: '/kontak' }]}
        title="Hubungi P3L"
        lead="Cara tercepat adalah WhatsApp. Ceritakan kebutuhan Anda, admin kami akan membalas pada jam kerja."
      />

      <section className="section bg-white">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold text-navy-900">Kirim pesan sesuai keperluan</h2>
            <p className="mt-2 text-muted">Pilih topik, pesan WhatsApp akan terisi otomatis.</p>
            <ul className="mt-6 grid gap-3">
              {topics.map((t) => (
                <li key={t.label}>
                  <a
                    href={waLink(t.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-line p-4 font-semibold text-navy-900 transition-colors hover:border-[#1fa855]"
                  >
                    <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#1fa855]" />
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted">
              Ingin langsung mendaftar kelas?{' '}
              <Link href="/jadwal" className="font-bold text-green-700 hover:underline">
                Lihat jadwal & daftar online
              </Link>
              .
            </p>
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold text-navy-900">Kontak resmi</h2>
            <ul className="mt-6 grid gap-4">
              {channels.map((c) => {
                const body = (
                  <>
                    <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted">{c.label}</p>
                      <p className="mt-0.5 [overflow-wrap:anywhere] font-bold text-navy-900">{c.value}</p>
                    </div>
                  </>
                )
                return (
                  <li key={c.label}>
                    {c.href ? (
                      <a
                        href={c.href}
                        {...(c.external && { target: '_blank', rel: 'noopener noreferrer' })}
                        className="flex gap-4 rounded-xl bg-paper p-5 transition-colors hover:bg-green-50"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="flex gap-4 rounded-xl bg-paper p-5">{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
            <div className="mt-4 overflow-hidden rounded-xl border border-line">
              <iframe
                title={`Peta lokasi kantor ${site.name} di ${site.city}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.plusCode)}&hl=id&z=16&output=embed`}
                className="block h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-3 text-sm text-muted">
              Plus Code: <span className="font-semibold text-navy-900">{site.plusCode}</span>. Kelas reguler dan In-House
              Training diadakan di berbagai kota; kami melayani instansi di seluruh Indonesia.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Hati-hati penipuan: P3L hanya menerbitkan invoice dari email {site.email} dan hanya menggunakan rekening yang
              tertera di invoice resmi. Jika ragu, konfirmasi ke WhatsApp {site.phone}.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
