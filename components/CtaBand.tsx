import Link from 'next/link'
import { WhatsAppIcon } from '@/components/WhatsAppFloat'
import { WA_INHOUSE } from '@/lib/site'

export default function CtaBand({
  title = 'Ingin melatih tim di lokasi Anda sendiri?',
  body = 'Instruktur P3L bisa datang ke pabrik, rumah sakit, atau hotel Anda. Materi disusun dari kondisi IPAL Anda, dengan opsi sertifikasi BNSP.',
}: {
  title?: string
  body?: string
}) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:py-14">
          <svg aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-72 w-72 text-white/[0.04]" viewBox="0 0 40 40">
            <path fill="currentColor" d="M20 3.5C20 3.5 8 16.6 8 24.6a12 12 0 0 0 24 0C32 16.6 20 3.5 20 3.5Z" />
          </svg>
          <div className="relative max-w-2xl">
            <h2 className="text-[clamp(1.6rem,1.2rem+1.5vw,2.25rem)] font-extrabold leading-tight">{title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">{body}</p>
          </div>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
            <a href={WA_INHOUSE} target="_blank" rel="noopener noreferrer" className="btn bg-[#1fa855] text-white hover:bg-[#178a45]">
              <WhatsAppIcon /> Minta penawaran
            </a>
            <Link href="/program/in-house-training-ipal" className="btn btn-on-dark">
              Tentang In-House Training
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
