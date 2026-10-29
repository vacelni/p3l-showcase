import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import Logo from '@/components/Logo'
import { programs } from '@/lib/programs'
import { engineeringServices, serviceHref } from '@/lib/content'
import { fullAddress, instructor, site, WA_GENERAL } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/75">
      <div className="flow-line !h-1 !rounded-none" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1fr_1.05fr_1.15fr_1.3fr] lg:gap-10">
        <div className="max-w-sm">
          <Logo id="footer" tone="light" />
          <p className="mt-5 text-sm leading-relaxed">
            Lembaga pelatihan dan konsultasi pengolahan air limbah sejak {site.foundingYear}. Instruktur utama,{' '}
            {instructor.name}, adalah akademisi Teknik Lingkungan Universitas Contoh, Semarang.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Program pelatihan</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link href={`/program/${p.slug}`} className="hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/jadwal" className="hover:text-white">
                Jadwal pelatihan
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Layanan IPAL</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {engineeringServices.map((s) => (
              <li key={s.slug}>
                <Link href={serviceHref(s)} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/artikel" className="hover:text-white">
                Artikel & berita PROPER
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Kontak</h2>
          <ul className="mt-4 space-y-3.5 text-sm">
            <li>
              <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <span className="tabular">{site.phone} (WhatsApp)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-3 break-all hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {fullAddress}
                <br />
                <span className="text-white/55">Melayani seluruh Indonesia</span>
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <span>Jam layanan {site.openingHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName} (P3L)
          </p>
          <nav aria-label="Tautan perusahaan">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {[
                { href: '/tentang', label: 'Tentang P3L' },
                { href: '/kontak', label: 'Kontak' },
                { href: '/kebijakan-privasi', label: 'Kebijakan privasi' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
