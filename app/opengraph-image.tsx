import { renderOg, ogSize } from '@/lib/og'

export const alt = 'P3L – Pelatihan, Sertifikasi BNSP & Konsultasi IPAL'
export const size = ogSize
export const contentType = 'image/png'

export default function Image() {
  return renderOg({
    kicker: 'Pelatihan, sertifikasi BNSP & konsultasi IPAL',
    title: 'Operator IPAL yang kompeten, limbah yang memenuhi baku mutu.',
  })
}
