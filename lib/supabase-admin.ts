import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Klien Supabase KHUSUS SERVER (jangan di-import dari komponen 'use client').
// Memakai SUPABASE_SERVICE_ROLE_KEY agar tetap bisa menulis setelah Row Level Security
// diaktifkan (lihat supabase/rls.sql). Jika kunci belum di-set, jatuh ke anon key.
export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return createClient(url, key, { auth: { persistSession: false } })
}

// Kunci yang sering tertukar: publishable/anon key TIDAK melewati RLS, sehingga admin & pendaftaran
// gagal menulis. Yang benar adalah secret key (sb_secret_…) atau JWT legacy dengan role service_role.
export function serviceKeyProblem() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!key) return 'SUPABASE_SERVICE_ROLE_KEY belum di-set di Vercel; penyimpanan data akan gagal.'
  if (key.startsWith('sb_secret_')) return null
  let role: string | undefined
  if (key.startsWith('eyJ')) {
    try {
      role = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role
    } catch {}
  }
  if (role === 'service_role') return null
  return 'SUPABASE_SERVICE_ROLE_KEY berisi publishable/anon key, bukan secret key. Ganti dengan Secret key (sb_secret_…) dari Supabase → Project Settings → API Keys, lalu redeploy.'
}
