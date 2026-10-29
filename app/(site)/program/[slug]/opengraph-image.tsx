import { getProgram, programs } from '@/lib/programs'
import { renderOg, ogSize } from '@/lib/og'

export const alt = 'Program pelatihan P3L'
export const size = ogSize
export const contentType = 'image/png'

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = getProgram(slug)
  return renderOg({
    kicker: program ? `${program.certificationLabel} • ${program.duration}` : 'Program pelatihan',
    title: program?.name ?? 'Pelatihan IPAL P3L',
  })
}
