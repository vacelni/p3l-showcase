import { ImageResponse } from 'next/og'
import { markSvg } from '@/lib/og'

// Ikon PNG untuk tab browser dan hasil pencarian Google. Google mensyaratkan ukuran kelipatan 48px
// dan memeriksa /favicon.ico; SVG saja tidak cukup andal (lihat juga app/favicon.ico).
export function generateImageMetadata() {
  return [
    { id: '48', size: { width: 48, height: 48 }, contentType: 'image/png' },
    { id: '192', size: { width: 192, height: 192 }, contentType: 'image/png' },
  ]
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const px = Number(await id)
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%' }}>{markSvg(px)}</div>, { width: px, height: px })
}
