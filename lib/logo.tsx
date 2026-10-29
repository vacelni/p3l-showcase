// Geometri logo P3L: dua panah melingkar (pengolahan, lalu pemanfaatan kembali) mengelilingi setetes air.
// Satu sumber untuk header/footer (components/Logo.tsx), gambar OG, logo.png, dan ikon PNG.
// app/icon.svg adalah salinan statis dari bentuk yang sama; ubah keduanya bersamaan.
// Warna dipilih agar terbaca di latar putih maupun navy, jadi logo tidak perlu versi kedua.

export const MARK_BLUE = '#12386b'
export const MARK_SKY = '#27639f'
export const MARK_GREEN = '#0e8f6e'
export const MARK_MINT = '#3ccb9b'

// `id` harus unik per <svg> di satu halaman agar gradasi tidak saling menimpa.
export function markShapes(id: string) {
  const top = `p3l-top-${id}`
  const bottom = `p3l-bottom-${id}`
  const drop = `p3l-drop-${id}`
  // <g>, bukan Fragment: Satori (gambar OG) hanya menerima elemen intrinsik di dalam <svg>.
  return (
    <g>
      <defs>
        <linearGradient id={top} gradientUnits="userSpaceOnUse" x1="8" y1="0" x2="56" y2="0">
          <stop offset="0" stopColor={MARK_BLUE} />
          <stop offset="1" stopColor={MARK_SKY} />
        </linearGradient>
        <linearGradient id={bottom} gradientUnits="userSpaceOnUse" x1="56" y1="0" x2="8" y2="0">
          <stop offset="0" stopColor={MARK_GREEN} />
          <stop offset="1" stopColor={MARK_MINT} />
        </linearGradient>
        <linearGradient id={drop} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={MARK_SKY} />
          <stop offset="1" stopColor={MARK_GREEN} />
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.82 25.79A24 24 0 0 1 55.18 25.79" stroke={`url(#${top})`} />
        <path d="M47.57 20.58 55.18 25.79 59.17 17.48" stroke={MARK_SKY} />
        <path d="M55.18 38.21A24 24 0 0 1 8.82 38.21" stroke={`url(#${bottom})`} />
        <path d="M16.43 43.42 8.82 38.21 4.83 46.52" stroke={MARK_MINT} />
      </g>
      <path d="M32 19C32 19 22.5 29.5 22.5 36.5a9.5 9.5 0 0 0 19 0C41.5 29.5 32 19 32 19Z" fill={`url(#${drop})`} />
      <path d="M27.2 35.5c.3-2.1 1.3-4 2.7-5.6" fill="none" stroke="#ffffff" strokeOpacity=".6" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  )
}
