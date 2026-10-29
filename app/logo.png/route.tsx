import { ImageResponse } from 'next/og'
import { markSvg } from '@/lib/og'

// Logo PNG 512×512 untuk structured data Organization (Google butuh format raster).
export const dynamic = 'force-static'

export function GET() {
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%' }}>{markSvg(512, '#ffffff')}</div>, {
    width: 512,
    height: 512,
  })
}
