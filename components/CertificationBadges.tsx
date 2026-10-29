import Image from 'next/image'
import { site } from '@/lib/site'

// Logo BNSP & LSP mitra. Ukuran tampil kecil (≤56px tinggi) agar file asli tetap tajam di layar retina.
function Logos({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const bnsp = size === 'lg' ? 'h-11' : 'h-9'
  const lsp = size === 'lg' ? 'h-16' : 'h-14'
  return (
    <div className="flex shrink-0 items-center gap-5">
      <Image
        src="/sertifikasi/logo-bnsp.jpeg"
        alt="Logo BNSP – Badan Nasional Sertifikasi Profesi"
        width={300}
        height={114}
        sizes="120px"
        className={`${bnsp} w-auto`}
      />
      <span aria-hidden="true" className="h-10 w-px bg-line" />
      <Image
        src="/sertifikasi/logo-lsp-lalinsa.jpeg"
        alt={`Logo ${site.lsp}`}
        width={280}
        height={275}
        sizes="64px"
        className={`${lsp} w-auto`}
      />
    </div>
  )
}

export const certificationNote = `Uji kompetensi skema POPAL dan PPPA dilaksanakan bersama ${site.lsp}, lembaga sertifikasi profesi berlisensi BNSP. Peserta yang dinyatakan kompeten menerima sertifikat kompetensi BNSP.`

export default function CertificationBadges({ variant = 'card' }: { variant?: 'card' | 'strip' }) {
  if (variant === 'strip') {
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:gap-8">
        <Logos size="lg" />
        <p className="leading-relaxed text-muted">
          <strong className="text-navy-900">Sertifikasi kompetensi resmi.</strong> {certificationNote}
        </p>
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <Logos />
      <p className="mt-4 text-sm leading-relaxed text-muted">{certificationNote}</p>
    </div>
  )
}
