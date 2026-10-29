import type { Insight } from '@/lib/types'

const MONTHS_ID: Record<string, number> = {
  jan: 0, januari: 0, feb: 1, februari: 1, mar: 2, maret: 2, apr: 3, april: 3, mei: 4,
  jun: 5, juni: 5, jul: 6, juli: 6, agu: 7, agt: 7, agustus: 7, aug: 7, sep: 8, september: 8,
  okt: 9, oktober: 9, oct: 9, nov: 10, november: 10, des: 11, desember: 11, dec: 11,
}

// Tanggal insight disimpan sebagai teks bebas ("12 Feb 2026") maupun ISO ("2026-02-12").
export function parseLooseDate(value?: string | null): Date | null {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }
  const m = value.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})/)
  if (m) {
    const month = MONTHS_ID[m[2].toLowerCase()]
    if (month !== undefined) return new Date(Date.UTC(Number(m[3]), month, Number(m[1])))
  }
  return null
}

const dayFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', timeZone: 'UTC' })
const dayMonthFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const fullFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const longFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function toDate(iso: string) {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`)
}

export function formatDate(value?: string | null, long = false) {
  const d = parseLooseDate(value)
  if (!d) return value || '-'
  return (long ? longFmt : fullFmt).format(d)
}

// "26–29 Okt 2026" atau "30 Sep – 2 Okt 2026"
export function formatDateRange(start: string, end: string) {
  if (!start) return '-'
  const s = toDate(start)
  const e = toDate(end || start)
  if (s.getTime() === e.getTime()) return fullFmt.format(s)
  if (s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear()) {
    return `${dayFmt.format(s)}–${fullFmt.format(e)}`
  }
  return `${dayMonthFmt.format(s)} – ${fullFmt.format(e)}`
}

export function durationDays(start: string, end: string) {
  if (!start || !end) return null
  return Math.round((toDate(end).getTime() - toDate(start).getTime()) / 86_400_000) + 1
}

export function priceNumber(price: unknown): number | null {
  if (typeof price === 'number') return price
  if (typeof price !== 'string') return null
  const digits = price.replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

export function formatPrice(price: unknown) {
  const n = priceNumber(price)
  if (n === null) return typeof price === 'string' && price ? price : 'Hubungi admin'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' dan ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

// ID ditaruh di akhir slug karena judul bisa kembar (mis. dua event dengan judul sama).
export function insightSlug(insight: Pick<Insight, 'id' | 'title'>) {
  return `${slugify(insight.title)}-${insight.id}`
}

export function idFromInsightSlug(slug: string) {
  const m = slug.match(/-(\d+)$/)
  return m ? Number(m[1]) : null
}

// Teks polos tanpa tanda format artikel (##, **, - , [link](url)) untuk meta description & kartu.
export function stripFormatting(text: string) {
  return text
    .replace(/^\s*#{1,3}\s+/gm, '')
    .replace(/^\s*(?:[-*•]|\d+[.)])\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

export function plainExcerpt(text: string, max = 158) {
  const clean = stripFormatting(text).replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

export function todayISO() {
  // Tanggal hari ini menurut WIB, agar jadwal yang berakhir hari ini masih tampil.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date())
}

// Pendaftaran ditutup setelah hari pertama kelas lewat; kelas yang sedang berjalan tetap tampil.
export function isRegistrationOpen(s: { date_start: string }, today = todayISO()) {
  return s.date_start >= today
}

// Nomor invoice diturunkan dari ID & waktu daftar di database, jadi selalu sama
// antara email peserta dan dasbor admin (tidak perlu kolom tambahan).
export function invoiceNumber(id: string | number, createdAt?: string | null) {
  const d = createdAt ? new Date(createdAt) : new Date()
  const ym = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit' })
    .format(d)
    .replace('-', '')
  const raw = String(id).replace(/[^a-zA-Z0-9]/g, '')
  const suffix = raw.length > 6 ? raw.slice(0, 6) : raw.padStart(4, '0')
  return `INV-P3L-${ym}-${suffix.toUpperCase()}`
}

export function wordCount(text: string) {
  return stripFormatting(text).trim().split(/\s+/).filter(Boolean).length
}

// Halaman yang isinya terlalu tipis tidak diindeks Google (noindex) dan tidak masuk sitemap,
// agar tidak menurunkan penilaian kualitas seluruh situs. Laporan PDF tetap diindeks.
export const MIN_INDEX_WORDS = 250

// Google memotong <title> di sekitar 60–65 karakter; template menambah " | P3L" (6 karakter).
export const SEO_TITLE_MAX = 59

export function isIndexable(insight: Pick<Insight, 'excerpt' | 'external_pdf_url'>) {
  return Boolean(insight.external_pdf_url) || wordCount(insight.excerpt) >= MIN_INDEX_WORDS
}

export const insightTypeLabel: Record<string, string> = { Artikel: 'Artikel', Berita: 'Berita', Event: 'Acara' }
