// Data identitas & kontak P3L yang dipakai di seluruh situs (header, footer, SEO, schema).

// Showcase: set NEXT_PUBLIC_SITE_URL to the deployment URL.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const site = {
  name: 'P3L',
  legalName: 'Pusat Pengolahan dan Pemanfaatan Limbah',
  tagline: 'Pelatihan, Sertifikasi BNSP & Konsultasi IPAL',
  description:
    'P3L (Pusat Pengolahan dan Pemanfaatan Limbah) adalah lembaga pelatihan dan konsultasi IPAL sejak 2008. Pelatihan operator IPAL, sertifikasi BNSP POPAL & PPPA, audit limbah, dan desain IPAL untuk industri, rumah sakit, dan hotel.',
  // Versi pendek (≤155 karakter) untuk meta description di hasil Google.
  metaDescription:
    'Pelatihan operator IPAL, sertifikasi BNSP POPAL & PPPA, serta audit dan desain IPAL untuk industri, rumah sakit, dan hotel. Sejak 2008, instruktur Universitas Contoh.',
  foundingYear: 2008,
  phone: '+62 800 0000 0000',
  phoneE164: '+6280000000000',
  email: 'admin@example.com',
  city: 'Semarang',
  region: 'Jawa Tengah',
  streetAddress: 'Jl. Contoh No. 1, Kec. Contoh',
  postalCode: '50000',
  // Plus Code Google Maps, membantu pengunjung menemukan lokasi persis.
  plusCode: 'Semarang (alamat contoh)',
  // Link "Bagikan" dari Google Maps (bukan embed).
  mapsUrl: 'https://maps.google.com/?q=Semarang',
  openingHours: 'Senin–Jumat, 09.00–17.00 WIB',
  // Nama hari schema.org untuk openingHoursSpecification di structured data Google.
  openingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as string[],
  opens: '09:00',
  closes: '17:00',
  // Profil resmi di platform lain (Instagram, LinkedIn, YouTube, Google Business Profile, dst).
  // TODO(data dari P3L): isi URL lengkap akun resmi, mis. 'https://www.instagram.com/...'.
  sameAs: [] as string[],
  // Lembaga Sertifikasi Profesi mitra untuk uji kompetensi skema BNSP (POPAL & PPPA).
  lsp: 'LSP LALINSA',
  keywords: [
    'pelatihan IPAL',
    'pelatihan pengolahan air limbah',
    'sertifikasi POPAL BNSP',
    'sertifikasi PPPA BNSP',
    'pelatihan operator IPAL',
    'pelatihan lumpur aktif',
    'konsultan IPAL',
    'audit IPAL',
    'desain IPAL',
    'in-house training IPAL',
    'pelatihan IPAL rumah sakit',
    'PROPER KLHK',
  ],
}

export function waLink(message: string) {
  return `https://wa.me/${site.phoneE164.replace('+', '')}?text=${encodeURIComponent(message)}`
}

export const WA_GENERAL = waLink('Halo Admin P3L, saya ingin bertanya tentang pelatihan dan sertifikasi IPAL.')
export const WA_INHOUSE = waLink(
  'Halo Tim P3L, kami ingin meminta penawaran In-House Training / konsultasi IPAL untuk instansi kami.'
)

export const navItems = [
  { href: '/program', label: 'Program' },
  { href: '/jadwal', label: 'Jadwal' },
  { href: '/layanan', label: 'Layanan IPAL' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/kontak', label: 'Kontak' },
]

// Data tagihan di email invoice dan invoice cetak. Nama pemilik rekening ditulis persis seperti di buku
// tabungan agar bagian keuangan instansi bisa mencocokkannya saat transfer.
export const billing = {
  bank: 'Bank Contoh',
  accountNumber: '1234567890',
  accountName: 'P3L CONTOH',
  signatory: 'Dr. Instruktur Contoh, S.T., M.T.',
  signatoryTitle: 'Direktur P3L',
}

export const fullAddress =[site.streetAddress, `Kota ${site.city}, ${site.region} ${site.postalCode}`.trim()].filter(Boolean).join(', ')

// Instruktur utama & konsultan ahli P3L (halaman Tentang, FAQ, structured data Person).
export const instructor = {
  name: 'Dr. Instruktur Contoh, S.T., M.T.',
  shortName: 'Instruktur Contoh',
  role: 'Instruktur utama & konsultan ahli P3L',
  affiliation: 'Departemen Teknik Lingkungan, Universitas Contoh',
  affiliationShort: 'Teknik Lingkungan Universitas Contoh',
  photo: '/galeri/profil-instruktur.jpeg',
  expertise: [
    'Pengolahan air limbah domestik dan industri',
    'Pengolahan air lindi (leachate)',
    'Peningkatan kualitas air',
    'Efisiensi sistem pengolahan limbah',
    'Teknologi pengolahan ramah lingkungan',
  ],
  profiles: [] as { label: string; href: string }[],
}
