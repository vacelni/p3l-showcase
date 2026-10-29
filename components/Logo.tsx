// Logo P3L: panah melingkar mengelilingi tetesan air. Geometri ada di lib/logo.tsx.
// Satu desain untuk semua latar; hanya warna tulisan "P3L" yang menyesuaikan latar.

import { markShapes } from '@/lib/logo'

export function LogoMark({
  id,
  className = 'h-11 w-11',
}: {
  id: string
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      {markShapes(id)}
    </svg>
  )
}

export default function Logo({
  id,
  tone = 'dark',
  horizontal = false,
}: {
  id: string
  tone?: 'dark' | 'light'
  horizontal?: boolean
}) {
  if (horizontal) {
    return (
      <span className="flex items-center gap-2.5">
        <LogoMark id={id} />
        <span className={`text-[1.7rem] font-extrabold leading-none tracking-tight ${tone === 'dark' ? 'text-navy-900' : 'text-white'}`}>
          P3L
        </span>
        <span className={`-ml-0.5 whitespace-nowrap text-[0.60rem] font-medium leading-tight sm:text-[0.65rem] ${tone === 'dark' ? 'text-muted' : 'text-white/70'}`}>
          Pusat Pengolahan &amp;
          <br />
          Pemanfaatan Limbah
        </span>
      </span>
    )
  }
  return (
    <span className="flex items-center gap-3">
      <LogoMark id={id} />
      <span className="flex flex-col leading-none">
        <span className={`text-[1.4rem] font-extrabold tracking-tight ${tone === 'dark' ? 'text-navy-900' : 'text-white'}`}>
          P3L
        </span>
        <span className={`mt-1 text-[0.68rem] font-medium leading-tight ${tone === 'dark' ? 'text-muted' : 'text-white/70'}`}>
          Pusat Pengolahan &amp;
          <br />
          Pemanfaatan Limbah
        </span>
      </span>
    </span>
  )
}
