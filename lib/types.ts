// Bentuk data dari tabel Supabase.

export interface Schedule {
  id: number
  title: string
  category: 'BNSP' | 'Non-BNSP' | string
  date_start: string
  date_end: string
  price: string | number | null
  location: string
  min_participants: number | null
  is_active: boolean
  description?: string | null
  syllabus?: string | null
}

export interface Insight {
  id: number
  title: string
  seo_title?: string | null
  type: 'Berita' | 'Artikel' | 'Event' | string
  category: string
  date: string
  excerpt: string
  external_pdf_url?: string | null
  event_location?: string | null
  event_date?: string | null
  is_active?: boolean | null
}

export interface Registration {
  id: string
  nama_lengkap: string
  jabatan: string
  instansi: string
  alamat_instansi: string
  whatsapp: string
  email_korporat: string
  schedule_id: number | null
  program_pilihan: string
  status_pembayaran: string
  created_at: string
}
