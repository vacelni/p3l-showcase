// Konten statis situs: layanan engineering, klien, galeri, FAQ, dan alur pendaftaran.

import {
  GraduationCap,
  MessagesSquare,
  PencilRuler,
  Wrench,
  ClipboardCheck,
  HardHat,
  ShieldCheck,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'

export interface Service {
  slug: string
  title: string
  icon: LucideIcon
  summary: string
  body: string[]
  /** Halaman tujuan kartu layanan. Default: /layanan/[slug]. */
  href?: string
  seoTitle: string
  seoDescription: string
  photo?: { src: string; alt: string }
  /** Tanda-tanda instalasi Anda membutuhkan layanan ini. */
  signs: string[]
  /** Lingkup pekerjaan yang biasa dikerjakan. */
  scope: string[]
}

export const services: Service[] = [
  {
    slug: 'pelatihan-sdm',
    href: '/program',
    title: 'Pelatihan & pengembangan SDM IPAL',
    icon: GraduationCap,
    summary: 'Kelas reguler di hotel atau In-House Training di lokasi Anda, dengan atau tanpa sertifikasi BNSP.',
    body: [
      'Pelatihan mencakup pengolahan air limbah, baik kelas reguler di hotel maupun In-House Training (IHT) langsung di lokasi pabrik atau instansi Anda. Kurikulum berkaitan erat dengan pengolahan dan pemanfaatan air limbah, mulai dari desain unit pengolahan hingga teknis operasional IPAL sehari-hari.',
      'Tersedia pilihan sertifikasi kompetensi BNSP (POPAL dan PPPA) maupun sertifikat keahlian P3L.',
    ],
    seoTitle: 'Pelatihan SDM IPAL',
    seoDescription: 'Pelatihan operator dan penanggung jawab IPAL, sertifikasi BNSP POPAL & PPPA, serta In-House Training.',
    signs: [],
    scope: [],
  },
  {
    slug: 'konsultasi-teknis',
    title: 'Konsultasi teknis & troubleshooting IPAL',
    icon: MessagesSquare,
    summary: 'Analisis masalah operasional IPAL, pemilihan teknologi, dan modifikasi proses.',
    body: [
      'Kami melayani konsultasi mendalam tentang permasalahan pengolahan air limbah, pemilihan teknologi yang tersedia, hingga modifikasi proses agar lebih efisien.',
      'Masalah IPAL jarang punya satu penyebab. Lumpur yang sulit mengendap, misalnya, bisa berasal dari beban organik yang berubah, kekurangan oksigen terlarut, nutrien yang tidak seimbang, atau waktu tinggal lumpur yang tidak tepat. Karena itu kami mulai dari data operasional dan hasil uji laboratorium Anda, lalu menelusuri setiap unit pengolahan sampai akar masalahnya ketemu.',
      'Bagi instansi yang mengikuti program pelatihan kami, konsultasi teknis diberikan gratis selama masa pelatihan berlangsung.',
    ],
    seoTitle: 'Konsultan IPAL: Troubleshooting Masalah IPAL',
    seoDescription:
      'Troubleshooting IPAL: COD/BOD melebihi baku mutu, bulking sludge, lumpur sulit mengendap, IPAL berbau, hingga pemilihan teknologi pengolahan.',
    photo: { src: '/galeri/uji-lab-kimia.jpeg', alt: 'Analisis karakteristik limbah di laboratorium sebagai dasar menelusuri masalah IPAL' },
    signs: [
      'Hasil uji COD, BOD, TSS, atau amonia di outlet sering melebihi baku mutu.',
      'Lumpur sulit mengendap di clarifier (bulking sludge), atau muncul busa dan lumpur mengapung.',
      'IPAL menimbulkan bau dan dikeluhkan lingkungan sekitar.',
      'Kualitas olahan naik-turun meskipun operator sudah bekerja sesuai prosedur.',
      'Anda perlu memilih teknologi atau vendor, tetapi belum yakin mana yang sesuai dengan karakteristik limbah.',
    ],
    scope: [
      'Kajian data operasional harian dan hasil uji laboratorium inlet–outlet.',
      'Kunjungan lapangan untuk memeriksa kondisi setiap unit pengolahan.',
      'Identifikasi akar masalah per unit, dari pengolahan pendahuluan hingga pengolahan lumpur.',
      'Rekomendasi perbaikan operasional dan modifikasi proses yang bisa langsung dijalankan.',
      'Pendampingan saat rekomendasi diterapkan hingga kinerja IPAL stabil.',
    ],
  },
  {
    slug: 'desain-ipal',
    title: 'Desain & rekayasa IPAL baru',
    icon: PencilRuler,
    summary: 'IPAL dirancang dari karakteristik limbah Anda dan baku mutu yang berlaku.',
    body: [
      'Bila perusahaan, industri, atau rumah sakit Anda belum memiliki Instalasi Pengolahan Air Limbah (IPAL) atau ingin membangun fasilitas baru, tim engineering kami siap merancangnya dari nol.',
      'Desain disusun berdasarkan karakteristik parameter limbah dan standar baku mutu terbaru dari Kementerian Lingkungan Hidup. Pilihan teknologi, misalnya lumpur aktif, anaerobik, kombinasi fisika-kimia, atau pengolahan lanjutan, ditentukan dari data limbah Anda, bukan dari paket yang seragam.',
      'Tujuannya IPAL yang memenuhi baku mutu sejak awal beroperasi, dengan biaya operasional yang masuk akal untuk jangka panjang.',
    ],
    seoTitle: 'Jasa Desain IPAL: Perencanaan IPAL Industri & Rumah Sakit',
    seoDescription:
      'Jasa desain dan perencanaan IPAL baru untuk industri, rumah sakit, hotel, dan apartemen, berdasarkan karakteristik limbah dan baku mutu.',
    photo: { src: '/galeri/inspeksi-klarifier.jpeg', alt: 'Evaluasi desain bak klarifier IPAL bersama tim ahli P3L' },
    signs: [
      'Instansi Anda belum memiliki IPAL atau IPAL yang ada tidak lagi memadai.',
      'Ada rencana pabrik, gedung, atau rumah sakit baru yang membutuhkan IPAL.',
      'Produksi atau jumlah tempat tidur bertambah sehingga debit dan beban limbah naik.',
      'Baku mutu yang harus dipenuhi berubah dan teknologi lama tidak sanggup mencapainya.',
    ],
    scope: [
      'Karakterisasi limbah: debit, beban pencemar, dan fluktuasinya.',
      'Pemilihan teknologi dan alur proses yang paling sesuai.',
      'Perhitungan dimensi dan kapasitas setiap unit pengolahan.',
      'Spesifikasi peralatan utama, misalnya pompa, blower, dan aerator.',
      'Perkiraan kebutuhan bahan kimia, energi, dan tenaga operator.',
    ],
  },
  {
    slug: 'upgrade-optimalisasi',
    title: 'Upgrade & optimalisasi IPAL',
    icon: Wrench,
    summary: 'Membuat IPAL lama bekerja sesuai desain dengan biaya operasional yang wajar.',
    body: [
      'Pengalaman kami menunjukkan sebagian besar IPAL industri, rumah sakit, hotel, dan apartemen belum bekerja optimal, sehingga biaya operasionalnya jauh lebih besar dibanding hasil yang diperoleh.',
      'Dari analisis teknis akan terlihat apakah instalasi memerlukan upgrade konstruksi, atau cukup modifikasi proses tanpa penambahan alat. Sering kali penyesuaian pola aerasi, resirkulasi lumpur, atau titik dosis bahan kimia sudah memberi perbaikan yang nyata.',
    ],
    seoTitle: 'Optimalisasi & Upgrade IPAL agar Memenuhi Baku Mutu',
    seoDescription:
      'Upgrade dan optimalisasi IPAL lama agar memenuhi baku mutu dengan biaya lebih rendah: evaluasi kapasitas, aerasi, dan resirkulasi lumpur.',
    photo: { src: '/galeri/ipal-aerasi-2.jpeg', alt: 'Optimalisasi surface aerator pada IPAL' },
    signs: [
      'IPAL sudah berumur dan kinerjanya menurun dibanding saat awal beroperasi.',
      'Kapasitas terasa tidak cukup, padahal debit belum melebihi angka desain.',
      'Tagihan listrik blower dan pembelian bahan kimia terus naik tanpa perbaikan kualitas olahan.',
      'Anda ingin tahu apakah perlu membangun unit baru atau cukup mengubah cara operasi.',
    ],
    scope: [
      'Evaluasi kapasitas dan kinerja setiap unit dibandingkan dengan desain awal.',
      'Analisis neraca massa sederhana: beban masuk, efisiensi tiap unit, dan produksi lumpur.',
      'Rekomendasi modifikasi proses tanpa penambahan alat bila memungkinkan.',
      'Rancangan upgrade konstruksi atau peralatan bila memang dibutuhkan.',
      'Pendampingan saat masa transisi setelah perubahan diterapkan.',
    ],
  },
  {
    slug: 'audit-limbah',
    title: 'Audit limbah & kinerja IPAL',
    icon: ClipboardCheck,
    summary: 'Menghentikan pemborosan bahan kimia dan bakteri yang dibeli tanpa takaran tepat.',
    body: [
      'Banyak industri, rumah sakit, hotel, dan apartemen membeli bahan kimia atau bakteri secara rutin tanpa takaran yang presisi, sehingga biaya pengolahan limbah membengkak setiap bulan.',
      'Pemborosan ini bisa dihindari dengan audit limbah dan kinerja IPAL secara berkala. Audit membantu menekan biaya operasional IPAL secara signifikan, sekaligus memberi gambaran jujur tentang kesiapan IPAL Anda menghadapi pemeriksaan dan penilaian PROPER.',
    ],
    seoTitle: 'Audit IPAL & Audit Limbah Cair: Tekan Biaya Operasional',
    seoDescription:
      'Audit limbah cair dan kinerja IPAL: dosis bahan kimia, pemakaian bakteri, efisiensi aerasi, dan kepatuhan baku mutu air limbah.',
    photo: { src: '/galeri/jar-test-flokulasi.jpeg', alt: 'Jar test untuk menentukan dosis koagulan yang tepat' },
    signs: [
      'Bahan kimia atau bakteri dibeli rutin dengan dosis "kira-kira" atau mengikuti saran pemasok saja.',
      'Belum pernah dilakukan jar test untuk menentukan jenis dan dosis koagulan yang tepat.',
      'Data operasional ada, tetapi belum pernah dianalisis untuk mencari pemborosan.',
      'Instansi bersiap menghadapi pemeriksaan lingkungan atau penilaian PROPER.',
    ],
    scope: [
      'Pemetaan sumber limbah dan karakteristiknya.',
      'Pemeriksaan kinerja tiap unit dan kesesuaiannya dengan baku mutu.',
      'Jar test untuk menentukan jenis dan dosis koagulan/flokulan yang efektif.',
      'Evaluasi kebutuhan bakteri, nutrien, dan energi aerasi.',
      'Laporan temuan beserta prioritas perbaikan dan perkiraan penghematannya.',
    ],
  },
  {
    slug: 'commissioning-supervisi',
    title: 'Commissioning, pendampingan & supervisi',
    icon: HardHat,
    summary: 'Start-up IPAL baru dan pendampingan teknis saat menghadapi pemeriksaan.',
    body: [
      'Commissioning adalah start-up IPAL baru atau sistem yang baru di-upgrade agar beroperasi sesuai spesifikasi desain. Pada IPAL biologis, tahap ini termasuk pembibitan (seeding) dan aklimatisasi mikroorganisme sampai proses stabil.',
      'Karena banyak instansi belum memiliki SDM yang memahami pengolahan limbah, kami juga mendampingi pelaku usaha mengevaluasi kinerja IPAL secara ilmiah, serta menilai kelayakan proposal pengolahan limbah dari pihak ketiga agar hasilnya optimal dan terhindar dari solusi yang tidak tepat.',
    ],
    seoTitle: 'Commissioning IPAL, Supervisi & Pendampingan Teknis',
    seoDescription:
      'Commissioning dan start-up IPAL baru, seeding & aklimatisasi lumpur aktif, supervisi pembangunan, serta pendampingan teknis dan penilaian proposal vendor IPAL.',
    photo: { src: '/galeri/supervisi-mesin-ipal.jpeg', alt: 'Commissioning peralatan mekanikal IPAL industri' },
    signs: [
      'IPAL baru selesai dibangun dan perlu dijalankan sampai stabil.',
      'IPAL biologis perlu pembibitan ulang setelah mati atau berhenti lama.',
      'Anda menerima proposal IPAL dari vendor dan butuh pendapat teknis yang independen.',
      'Tim internal belum berpengalaman dan butuh pendampingan selama masa awal operasi.',
    ],
    scope: [
      'Pemeriksaan kesiapan unit dan peralatan sebelum start-up.',
      'Seeding dan aklimatisasi mikroorganisme pada IPAL biologis.',
      'Penyusunan parameter dan prosedur operasi harian untuk operator.',
      'Supervisi teknis selama pembangunan atau perbaikan.',
      'Kajian independen atas proposal dan penawaran IPAL dari pihak ketiga.',
    ],
  },
]

export const serviceHref = (s: Service) => s.href ?? `/layanan/${s.slug}`
export const engineeringServices = services.filter((s) => !s.href)
export const getService = (slug: string) => engineeringServices.find((s) => s.slug === slug)

// Persiapan data yang membuat diskusi awal jauh lebih cepat.
export const consultationData = [
  'Hasil uji laboratorium inlet dan outlet terbaru (COD, BOD, TSS, pH, amonia, minyak & lemak).',
  'Debit air limbah harian, rata-rata dan puncak.',
  'Gambar layout atau diagram alir IPAL, termasuk dimensi unit bila ada.',
  'Catatan operasional harian, misalnya DO, pH, SV30, dan MLSS.',
  'Daftar dan jumlah pemakaian bahan kimia atau bakteri per bulan.',
  'Foto atau video kondisi setiap unit pengolahan.',
]

export const engagementSteps = [
  { title: 'Diskusi awal', body: 'Ceritakan masalah dan kirim data yang ada lewat WhatsApp atau email.' },
  { title: 'Kajian data & kunjungan', body: 'Tim kami mempelajari data dan, bila perlu, meninjau IPAL langsung di lokasi.' },
  { title: 'Rekomendasi & penawaran', body: 'Anda menerima temuan, rekomendasi, dan ruang lingkup pekerjaan yang jelas.' },
  { title: 'Pelaksanaan & pendampingan', body: 'Pekerjaan dijalankan dan didampingi sampai kinerja IPAL sesuai target.' },
]

// Masalah yang paling sering dicari pengelola IPAL; tiap butir mengarah ke layanan yang relevan.
export const commonProblems = [
  {
    title: 'COD & BOD outlet melebihi baku mutu',
    body: 'Biasanya karena beban organik naik, aerasi kurang, atau waktu tinggal yang tidak sesuai desain.',
    service: 'upgrade-optimalisasi',
  },
  {
    title: 'Bulking sludge, lumpur sulit mengendap',
    body: 'Lumpur mengembang dan terbawa ke outlet. Penyebabnya bisa rasio F/M, DO, atau nutrien yang tidak seimbang.',
    service: 'konsultasi-teknis',
  },
  {
    title: 'Biaya bahan kimia & listrik membengkak',
    body: 'Dosis koagulan dan pola aerasi yang tidak pernah dievaluasi adalah sumber pemborosan paling umum.',
    service: 'audit-limbah',
  },
  {
    title: 'IPAL berbau dan berbusa',
    body: 'Tanda kondisi anaerobik di unit yang seharusnya aerobik, atau surfaktan dan minyak yang tidak tertangani.',
    service: 'konsultasi-teknis',
  },
  {
    title: 'IPAL baru belum juga stabil',
    body: 'Proses biologis butuh seeding dan aklimatisasi yang terkontrol sebelum bisa memenuhi baku mutu.',
    service: 'commissioning-supervisi',
  },
  {
    title: 'Kapasitas tidak cukup karena produksi naik',
    body: 'Sebelum membangun unit baru, cek dulu apakah kapasitas yang ada bisa dimaksimalkan.',
    service: 'desain-ipal',
  },
]

// Alasan utama memilih P3L (beranda & halaman Tentang).
export const pillars = [
  {
    icon: GraduationCap,
    title: 'Akademisi dan praktisi',
    body: 'Instruktur utama, Dr. Instruktur Contoh, S.T., M.T., adalah dosen Departemen Teknik Lingkungan Universitas Contoh yang juga merancang dan memperbaiki IPAL di lapangan.',
  },
  {
    icon: ShieldCheck,
    title: 'Membantu peringkat PROPER',
    body: 'Pendekatan teknis yang terbukti membantu klien memperbaiki kinerja pengelolaan air limbah dan peringkat PROPER-nya.',
  },
  {
    icon: TrendingDown,
    title: 'Biaya operasional lebih rendah',
    body: 'Audit dan optimalisasi proses untuk menghentikan pembelian bahan kimia dan bakteri yang tidak perlu.',
  },
]

export interface Client {
  name: string
  location: string
  type: 'rs' | 'industri'
}

export const clients: Client[] = [
  { name: 'RSUD Kota Contoh', location: 'Jakarta', type: 'rs' },
  { name: 'RS Medika Demo', location: 'Bandung', type: 'rs' },
  { name: 'RS Sehat Contoh', location: 'Surabaya', type: 'rs' },
  { name: 'RSU Demo Sejahtera', location: 'Medan', type: 'rs' },
  { name: 'RSUD Contoh Utara', location: 'Makassar', type: 'rs' },
  { name: 'RS Jiwa Demo', location: 'Yogyakarta', type: 'rs' },
  { name: 'PT Pangan Contoh, Tbk', location: 'Bekasi', type: 'industri' },
  { name: 'PT Minuman Demo Indonesia', location: 'Semarang', type: 'industri' },
  { name: 'PT Agro Contoh Lestari', location: 'Pontianak', type: 'industri' },
  { name: 'PT Susu Demo Nusantara', location: 'Malang', type: 'industri' },
  { name: 'PT Tekstil Contoh', location: 'Karawang', type: 'industri' },
  { name: 'PT Sawit Demo Makmur', location: 'Riau', type: 'industri' },
]

export interface GalleryItem {
  src: string
  title: string
  category: 'pelatihan' | 'lab' | 'lapangan'
  label: string
}

export const gallery: GalleryItem[] = [
  { src: '/galeri/ipal-aerasi-1.jpeg', title: 'Proses aerasi biologis di kolam pengolahan air limbah industri', category: 'lapangan', label: 'Engineering' },
  { src: '/galeri/pelatihan-jogja-2018.jpeg', title: 'Pelatihan teknologi pengolahan limbah lumpur aktif di Yogyakarta', category: 'pelatihan', label: '2018' },
  { src: '/galeri/jar-test-pac-feso4.jpeg', title: 'Uji koagulasi dan flokulasi (jar test) menggunakan PAC dan FeSO4', category: 'lab', label: 'Laboratorium' },
  { src: '/galeri/kunjungan-ipal-industri.jpeg', title: 'Kunjungan dan supervisi IPAL industri minuman', category: 'lapangan', label: 'Proyek' },
  { src: '/galeri/pelatihan-rumah-sakit-2014.jpeg', title: 'Pelatihan pengolahan limbah di rumah sakit daerah', category: 'pelatihan', label: '2014' },
  { src: '/galeri/inspeksi-klarifier.jpeg', title: 'Evaluasi konstruksi dan desain bak klarifier bersama tim ahli', category: 'lapangan', label: 'Audit IPAL' },
  { src: '/galeri/inhouse-training-2018.jpeg', title: 'Sesi In-House Training dan pemaparan materi teknis IPAL', category: 'pelatihan', label: '2018' },
  { src: '/galeri/jar-test-flokulasi.jpeg', title: 'Pembentukan flok dan pembuktian efektivitas pengendapan lumpur', category: 'lab', label: 'Laboratorium' },
  { src: '/galeri/supervisi-mesin-ipal.jpeg', title: 'Inspeksi dan commissioning peralatan mekanikal IPAL industri', category: 'lapangan', label: 'Supervisi' },
  { src: '/galeri/ipal-aerasi-2.jpeg', title: 'Optimalisasi kinerja surface aerator pada instalasi pengolahan limbah', category: 'lapangan', label: 'Engineering' },
  { src: '/galeri/uji-lab-kimia.jpeg', title: 'Analisis parameter kimia dan karakteristik limbah di laboratorium', category: 'lab', label: 'Laboratorium' },
  { src: '/galeri/profil-instruktur.jpeg', title: 'Dr. Instruktur Contoh, S.T., M.T., instruktur utama dan konsultan ahli P3L, dosen Teknik Lingkungan Universitas Contoh', category: 'pelatihan', label: 'Instruktur' },
]

// FAQ yang muncul di kedua halaman program BNSP.
export const bnspFaqs = [
  {
    q: 'POPAL atau PPPA, mana yang saya butuhkan?',
    a: 'POPAL ditujukan bagi personel yang menjalankan IPAL sehari-hari: mengoperasikan, merawat, dan mengoptimalkan unit pengolahan. PPPA ditujukan bagi personel yang merencanakan dan mengawasi pengendalian pencemaran air di perusahaan, termasuk menyusun dan melaksanakan pemantauan kualitas air limbah. Banyak instansi mengirim operator ke POPAL dan penanggung jawab lingkungannya ke PPPA.',
  },
  {
    q: 'Bagaimana alur sertifikasi BNSP di P3L?',
    a: 'Peserta mengikuti pelatihan sesuai unit kompetensi skema, lalu menjalani uji kompetensi oleh asesor dari LSP LALINSA, lembaga sertifikasi profesi berlisensi BNSP. Peserta yang dinyatakan kompeten memperoleh sertifikat kompetensi BNSP.',
  },
]

export const registrationSteps = [
  { title: 'Pilih jadwal', body: 'Tentukan program dan kota pelatihan dari daftar jadwal.' },
  { title: 'Isi formulir', body: 'Data peserta dan instansi, cukup 2 menit.' },
  { title: 'Terima e-invoice', body: 'Proforma invoice resmi langsung terkirim ke email Anda untuk diproses bagian keuangan.' },
  { title: 'Transfer & konfirmasi', body: 'Bayar ke rekening yang tertera di invoice, lalu konfirmasi lewat WhatsApp admin.' },
]

export const faqs = [
  {
    q: 'Apa beda pelatihan bersertifikat BNSP dan pelatihan teknis P3L?',
    a: 'Program BNSP (POPAL dan PPPA) diakhiri uji kompetensi dan menghasilkan sertifikat kompetensi resmi dari BNSP. Pelatihan Teknologi Pengolahan Air Limbah adalah kelas teknis 3 hari yang fokus pada proses dan operasional IPAL, dengan sertifikat keahlian dari P3L.',
  },
  {
    q: 'Siapa yang cocok mengikuti pelatihan ini?',
    a: 'Operator dan supervisor IPAL, penanggung jawab lingkungan, staf EHS/K3L industri, sanitarian dan teknisi IPAL rumah sakit, serta tim engineering hotel dan apartemen.',
  },
  {
    q: 'Bagaimana cara mendaftar dan membayar?',
    a: 'Pilih jadwal, isi formulir pendaftaran, dan proforma invoice akan langsung terkirim ke email Anda. Lakukan transfer ke rekening resmi yang tertera di invoice, lalu konfirmasikan pembayaran melalui WhatsApp admin.',
  },
  {
    q: 'Apakah pelatihan bisa diadakan di lokasi kami?',
    a: 'Bisa. Melalui In-House Training, instruktur P3L datang ke lokasi Anda dengan materi yang disesuaikan dengan kondisi IPAL instansi Anda. Hubungi kami lewat WhatsApp untuk mendapatkan penawaran.',
  },
  {
    q: 'Berapa biaya pelatihan IPAL di P3L?',
    a: 'Biaya per peserta tercantum di setiap jadwal dan di proforma invoice yang Anda terima setelah mendaftar. Untuk In-House Training, biaya dihitung dari jumlah peserta, durasi, dan lokasi. Minta penawarannya lewat WhatsApp.',
  },
  {
    q: 'Apakah P3L melayani instansi di luar Jawa?',
    a: 'Ya. Kelas reguler diadakan di beberapa kota seperti Jakarta, Semarang, dan Medan, sedangkan In-House Training dan layanan engineering bisa dilakukan di seluruh Indonesia. Klien kami tersebar dari Aceh hingga Papua.',
  },
  {
    q: 'Apakah kelas tetap berjalan jika pesertanya sedikit?',
    a: 'Setiap kelas memiliki kuota minimum peserta yang tertera di jadwal. Sebelum memesan tiket perjalanan, hubungi admin untuk memastikan status kelas.',
  },
  {
    q: 'Siapa instrukturnya?',
    a: 'Instruktur utama P3L adalah Dr. Instruktur Contoh, S.T., M.T., dosen Departemen Teknik Lingkungan Universitas Contoh dengan keahlian pengolahan air limbah domestik dan industri. Beliau didampingi praktisi senior yang menangani desain dan operasional IPAL.',
  },
  {
    q: 'Apakah ada konsultasi untuk masalah IPAL kami?',
    a: 'Ya. Selama masa pelatihan, peserta bisa berkonsultasi gratis tentang permasalahan IPAL di instansinya. Untuk pendampingan lanjutan tersedia layanan konsultasi, audit, dan optimalisasi IPAL.',
  },
]
