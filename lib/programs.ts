// Program pelatihan P3L. Setiap program punya halaman sendiri di /program/[slug]
// agar bisa ditemukan Google untuk kata kunci spesifik (POPAL, PPPA, pelatihan IPAL, dst).

import type { Schedule } from '@/lib/types'

export interface Program {
  slug: string
  name: string
  shortName: string
  certification: 'BNSP' | 'P3L' | 'Custom'
  certificationLabel: string
  duration: string
  summary: string
  intro: string[]
  audience: string[]
  outcomesTitle: string
  outcomes: string[]
  seoTitle: string
  seoDescription: string
  matches: (s: Schedule) => boolean
}

export const programs: Program[] = [
  {
    slug: 'sertifikasi-popal-bnsp',
    name: 'Sertifikasi POPAL BNSP',
    shortName: 'POPAL',
    certification: 'BNSP',
    certificationLabel: 'Sertifikat kompetensi BNSP',
    duration: '4 hari',
    summary:
      'Pelatihan dan uji kompetensi Penanggung Jawab Operasional Pengolahan Air Limbah untuk operator dan pengelola IPAL.',
    intro: [
      'POPAL (Penanggung Jawab Operasional Pengolahan Air Limbah) adalah skema sertifikasi kompetensi bagi personel yang menjalankan IPAL sehari-hari. Peserta dibekali cara mengoperasikan, merawat, dan mengoptimalkan setiap unit pengolahan, lalu mengikuti uji kompetensi untuk memperoleh sertifikat BNSP.',
      'Materi disampaikan oleh akademisi Teknik Lingkungan dan praktisi lapangan, dengan contoh kasus nyata dari IPAL industri, rumah sakit, dan hotel.',
    ],
    audience: [
      'Operator dan supervisor IPAL industri',
      'Teknisi IPAL dan sanitarian rumah sakit',
      'Staf engineering hotel, apartemen, dan kawasan',
      'Staf EHS / K3L yang bertanggung jawab atas air limbah',
    ],
    outcomesTitle: 'Kompetensi yang diujikan',
    outcomes: [
      'Mengoperasikan Instalasi Pengolahan Air Limbah (IPAL), terutama proses dan operasionalnya.',
      'Mengetahui sumber timbulan air limbah dan karakteristiknya.',
      'Menilai tingkat pencemaran air limbah.',
      'Menilai kinerja tiap unit pengolahan dan mengoptimalkannya.',
      'Merawat IPAL dan menyelesaikan permasalahan yang timbul.',
      'Mengidentifikasi bahaya dalam pengolahan air limbah.',
      'Melakukan tindakan keselamatan dan kesehatan kerja (K3) terhadap bahaya dalam pengolahan air limbah.',
    ],
    seoTitle: 'Sertifikasi POPAL BNSP – Pelatihan Operator IPAL',
    seoDescription:
      'Pelatihan & sertifikasi POPAL BNSP untuk operator IPAL, bersama instruktur Teknik Lingkungan Universitas Contoh. Lihat jadwal, materi, biaya, dan daftar online.',
    matches: (s) => /popal/i.test(s.title),
  },
  {
    slug: 'sertifikasi-pppa-bnsp',
    name: 'Sertifikasi PPPA BNSP',
    shortName: 'PPPA',
    certification: 'BNSP',
    certificationLabel: 'Sertifikat kompetensi BNSP',
    duration: '4 hari',
    summary:
      'Pelatihan dan uji kompetensi Penanggung Jawab Pengendalian Pencemaran Air untuk penanggung jawab lingkungan perusahaan.',
    intro: [
      'PPPA (Penanggung Jawab Pengendalian Pencemaran Air) adalah skema sertifikasi bagi personel yang merencanakan dan mengawasi pengendalian pencemaran air di perusahaan, mulai dari identifikasi sumber pencemar hingga pemantauan kualitas air limbah.',
      'Pelatihan menggabungkan pemahaman regulasi, teknologi pengolahan, dan penyusunan rencana pemantauan, lalu ditutup dengan uji kompetensi untuk memperoleh sertifikat BNSP.',
    ],
    audience: [
      'Manajer dan penanggung jawab lingkungan perusahaan',
      'Staf EHS / HSE / K3L industri',
      'Penanggung jawab kesehatan lingkungan rumah sakit',
      'Konsultan dan staf perencana pengelolaan lingkungan',
    ],
    outcomesTitle: 'Kompetensi yang diujikan',
    outcomes: [
      'Mengidentifikasi sumber pencemaran air limbah.',
      'Menentukan karakteristik sumber pencemaran air limbah.',
      'Menilai tingkat pencemaran air limbah.',
      'Menentukan peralatan instalasi pengolahan air limbah (IPAL).',
      'Mengoperasikan Instalasi Pengolahan Air Limbah.',
      'Melaksanakan daur ulang olahan air limbah.',
      'Menyusun rencana pemantauan kualitas air limbah.',
      'Melaksanakan pemantauan kualitas air limbah.',
      'Mengidentifikasi bahaya dalam pengolahan air limbah.',
      'Melakukan tindakan K3 terhadap bahaya dalam pengolahan air limbah.',
    ],
    seoTitle: 'Sertifikasi PPPA BNSP – Pengendalian Pencemaran Air',
    seoDescription:
      'Pelatihan & sertifikasi PPPA BNSP untuk penanggung jawab pengendalian pencemaran air di industri dan rumah sakit. Lihat jadwal, biaya, dan daftar.',
    matches: (s) => /pppa/i.test(s.title),
  },
  {
    slug: 'pelatihan-teknologi-pengolahan-air-limbah',
    name: 'Pelatihan Teknologi Pengolahan Air Limbah & Operasional IPAL',
    shortName: 'Teknologi IPAL',
    certification: 'P3L',
    certificationLabel: 'Sertifikat keahlian P3L',
    duration: '3 hari',
    summary:
      'Kelas teknis 11 modul: dari karakteristik limbah, lumpur aktif, penyisihan nitrogen-fosfor, hingga praktik jar test.',
    intro: [
      'Kelas reguler P3L yang paling lama berjalan. Fokusnya memahami cara kerja setiap proses pengolahan, membaca data operasional harian, dan memecahkan masalah yang paling sering muncul di lapangan, misalnya bulking sludge, efisiensi aerasi, dan dosis bahan kimia.',
      'Peserta mempraktikkan jar test langsung sehingga bisa menentukan jenis dan dosis koagulan yang tepat untuk limbah di instansinya sendiri.',
    ],
    audience: [
      'Operator dan teknisi IPAL yang ingin memperdalam proses',
      'Engineer proses dan utilitas',
      'Penanggung jawab IPAL rumah sakit, hotel, dan apartemen',
      'Calon peserta POPAL/PPPA yang ingin memperkuat dasar teknis',
    ],
    outcomesTitle: 'Materi pelatihan',
    outcomes: [
      'Peraturan perundang-undangan pengelolaan lingkungan hidup dan baku mutu air limbah.',
      'Karakteristik air limbah industri.',
      'Teknologi pengolahan air limbah secara fisika dan kimia.',
      'Teknologi pengolahan air limbah secara biologi aerobik dan anaerobik.',
      'Pengolahan air limbah dengan sistem lumpur aktif (activated sludge).',
      'Pengolahan tingkat lanjut untuk penyisihan nitrogen (N) dan fosfor (P).',
      'Pengolahan untuk penyisihan logam berat (limbah B3).',
      'Proses oksidasi lanjut (advanced oxidation process).',
      'Pengolahan lumpur.',
      'Analisis harian parameter operasional IPAL dan permasalahan di lapangan.',
      'Praktik jar test dan aplikasinya di lapangan.',
    ],
    seoTitle: 'Pelatihan Pengolahan Air Limbah & Operasional IPAL',
    seoDescription:
      'Pelatihan pengolahan air limbah & operasional IPAL 3 hari: lumpur aktif, penyisihan N & P, logam berat, lumpur, dan praktik jar test.',
    matches: (s) => s.category !== 'BNSP',
  },
  {
    slug: 'in-house-training-ipal',
    name: 'In-House Training IPAL',
    shortName: 'In-House',
    certification: 'Custom',
    certificationLabel: 'BNSP atau sertifikat P3L',
    duration: 'Disesuaikan',
    summary:
      'Instruktur P3L datang ke lokasi Anda. Materi disusun dari data dan masalah IPAL instansi Anda sendiri.',
    intro: [
      'In-House Training cocok untuk instansi yang ingin melatih banyak personel sekaligus atau membutuhkan materi yang menyasar masalah spesifik IPAL-nya. Pelatihan diadakan di lokasi pabrik, rumah sakit, atau kantor Anda.',
      'Sebelum pelatihan, tim P3L mempelajari data operasional dan karakteristik limbah Anda sehingga sesi kelas, kunjungan IPAL, dan praktik jar test langsung relevan dengan kondisi di lapangan.',
    ],
    audience: [
      'Industri yang ingin melatih banyak operator sekaligus',
      'Rumah sakit dan grup rumah sakit',
      'Grup hotel, apartemen, dan pengelola kawasan',
      'Instansi pemerintah dan BUMN',
    ],
    outcomesTitle: 'Yang bisa disesuaikan',
    outcomes: [
      'Materi berdasarkan jenis limbah dan teknologi IPAL yang Anda pakai.',
      'Jadwal dan durasi mengikuti shift operasional.',
      'Kunjungan dan evaluasi langsung IPAL di lokasi.',
      'Praktik jar test dengan sampel limbah Anda sendiri.',
      'Pilihan sertifikasi BNSP (POPAL/PPPA) atau sertifikat keahlian P3L.',
      'Konsultasi teknis lanjutan untuk masalah yang ditemukan saat pelatihan.',
    ],
    seoTitle: 'In-House Training IPAL – Pelatihan di Lokasi Perusahaan',
    seoDescription:
      'In-House Training IPAL di lokasi perusahaan, rumah sakit, atau hotel Anda. Materi disesuaikan dengan kondisi IPAL, tersedia opsi sertifikasi BNSP.',
    matches: () => false,
  },
]

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug)
}

export function programForSchedule(s: Schedule) {
  return programs.find((p) => p.matches(s))
}
