import { ImageResponse } from 'next/og'
import { markShapes } from '@/lib/logo'

// Gambar preview (Open Graph) yang muncul saat link dibagikan di WhatsApp, LinkedIn, Facebook, dll.

export const ogSize = { width: 1200, height: 630 }

// Logo untuk gambar raster. Tanpa `background` latarnya transparan (ikon tab, kartu OG di atas navy).
// Dengan `background` (mis. apple-touch-icon dan logo.png) logo diberi ruang kosong di sekelilingnya.
export function markSvg(size: number, background?: string) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {background && <rect width="64" height="64" fill={background} />}
      <g transform={background ? 'translate(32 32) scale(.8) translate(-32 -32)' : undefined}>{markShapes('og')}</g>
    </svg>
  )
}

export function renderOg({ kicker, title, footer }: { kicker: string; title: string; footer?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b2545',
          color: '#ffffff',
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {markSvg(72)}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>P3L</div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)' }}>Pusat Pengolahan dan Pemanfaatan Limbah</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 26, color: '#3ccb9b', fontWeight: 600 }}>{kicker}</div>
          <div style={{ fontSize: title.length > 60 ? 54 : 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1000 }}>
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              height: 6,
              width: '100%',
              borderRadius: 6,
              backgroundImage: 'linear-gradient(90deg, #8a4b2a 0%, #b98a3e 22%, #0e8f6e 62%, #8fe0cb 100%)',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: 'rgba(255,255,255,0.75)' }}>
            <div>{footer ?? 'Sejak 2008 • Instruktur Teknik Lingkungan Universitas Contoh'}</div>
            <div>p3l-showcase</div>
          </div>
        </div>
      </div>
    ),
    ogSize
  )
}
