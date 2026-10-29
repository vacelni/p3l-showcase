'use server'

import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getServerSupabase, serviceKeyProblem } from '@/lib/supabase-admin'
import {
  ADMIN_COOKIE,
  TRUSTED_COOKIE,
  checkPassword,
  createSessionToken,
  createTrustedToken,
  isAdmin,
  isPasswordConfigured,
  isTrustedDevice,
} from '@/lib/admin-auth'
import { consume, isLimited } from '@/lib/rate-limit'
import { clientIp, verifyTurnstile } from '@/lib/request'
import { SEO_TITLE_MAX } from '@/lib/format'
import type { Insight, Registration, Schedule } from '@/lib/types'

type Result = { ok: true } | { ok: false; error: string }

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Sesi admin berakhir. Muat ulang halaman lalu masuk kembali.')
}

function refreshSite() {
  // Halaman publik memakai ISR; segarkan agar perubahan langsung tampil.
  revalidatePath('/', 'layout')
}

// Setiap penulisan memakai .select('id') agar jumlah baris yang berubah ikut kembali.
// Dengan RLS aktif, update/delete lewat anon key TIDAK error tetapi mengenai 0 baris;
// tanpa pengecekan ini admin melihat "berhasil" padahal data tidak berubah.
async function run(fn: () => Promise<{ error: { message: string } | null; data: unknown[] | null }>): Promise<Result> {
  try {
    await requireAdmin()
    const { error, data } = await fn()
    if (error) return { ok: false, error: error.message }
    if (!data?.length) {
      return {
        ok: false,
        error: serviceKeyProblem() ?? 'Data tidak ditemukan (mungkin sudah dihapus). Muat ulang data lalu coba lagi.',
      }
    }
    refreshSite()
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Terjadi kesalahan.' }
  }
}

// ---------- Login ----------

// Per IP: maksimal 5 percobaan / 15 menit. Percobaan dihitung SEBELUM password dicek agar
// request paralel tidak bisa lolos bersamaan.
// Global: lewat 30 tebakan salah / jam, login dari perangkat baru wajib lolos Turnstile (jika di-set)
// atau ditutup sementara. Perangkat yang pernah login sukses (cookie tepercaya) tetap bisa masuk.
const LOGIN_IP = { limit: 5, window: 900 }
const LOGIN_GLOBAL = { limit: 30, window: 3600 }

export async function login(_prev: { error?: string } | null, formData: FormData) {
  if (!isPasswordConfigured()) {
    return { error: 'ADMIN_PASSWORD belum diatur di server (Vercel → Settings → Environment Variables).' }
  }
  const ip = clientIp(await headers())
  if (!(await consume(`login:ip:${ip}`, LOGIN_IP.limit, LOGIN_IP.window))) {
    return { error: 'Terlalu banyak percobaan. Tunggu 15 menit lalu coba lagi.' }
  }
  if (!(await isTrustedDevice()) && (await isLimited('login:global', LOGIN_GLOBAL.limit, LOGIN_GLOBAL.window))) {
    if (!process.env.TURNSTILE_SECRET_KEY) {
      return { error: 'Login dari perangkat baru ditutup sementara karena banyak percobaan gagal. Coba lagi dalam 1 jam atau dari perangkat yang biasa dipakai.' }
    }
    if (!(await verifyTurnstile(formData.get('turnstile_token'), ip))) {
      return { error: 'Selesaikan verifikasi keamanan di bawah lalu coba lagi.' }
    }
  }

  // Jeda sebelum pengecekan agar berhasil & gagal sama lamanya dan tebakan tidak bisa dipercepat.
  await new Promise((r) => setTimeout(r, 800))
  const password = String(formData.get('password') || '').slice(0, 256)
  if (!checkPassword(password)) {
    await consume('login:global', LOGIN_GLOBAL.limit, LOGIN_GLOBAL.window)
    return { error: 'Kata sandi salah.' }
  }
  const { token, maxAge } = createSessionToken()
  const store = await cookies()
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  })
  const trusted = createTrustedToken()
  store.set(TRUSTED_COOKIE, trusted.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: trusted.maxAge,
  })
  return { error: undefined }
}

export async function logout() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}

// ---------- Data ----------

export async function getDashboardData() {
  await requireAdmin()
  const db = getServerSupabase()
  const [regs, scheds, ins] = await Promise.all([
    db.from('registrations').select('*').order('created_at', { ascending: false }),
    db.from('schedules').select('*').order('date_start', { ascending: false }),
    db.from('insights').select('*').order('id', { ascending: false }),
  ])
  const warnings: string[] = []
  if ((process.env.ADMIN_PASSWORD ?? '').length < 16) {
    warnings.push('Password admin kurang dari 16 karakter. Ganti ADMIN_PASSWORD di Vercel dengan password acak yang panjang.')
  }
  if (!process.env.ADMIN_SESSION_SECRET) {
    warnings.push('ADMIN_SESSION_SECRET belum di-set di Vercel. Isi dengan string acak panjang agar sesi admin lebih aman.')
  }
  const keyProblem = serviceKeyProblem()
  if (keyProblem) warnings.push(keyProblem)
  return {
    registrations: (regs.data ?? []) as Registration[],
    schedules: (scheds.data ?? []) as Schedule[],
    insights: (ins.data ?? []) as Insight[],
    error: regs.error?.message || scheds.error?.message || ins.error?.message || null,
    warnings,
  }
}

export type ScheduleInput = Pick<
  Schedule,
  'title' | 'category' | 'date_start' | 'date_end' | 'price' | 'location' | 'min_participants' | 'description' | 'syllabus'
>

export type InsightInput = Pick<
  Insight,
  'title' | 'seo_title' | 'type' | 'category' | 'date' | 'excerpt' | 'external_pdf_url' | 'event_location' | 'event_date'
>

// Server Action bisa dipanggil langsung dengan data apa pun, jadi semua isian dibersihkan ulang di sini.
const text = (v: unknown, max: number) => (typeof v === 'string' || typeof v === 'number' ? String(v).trim().slice(0, max) : '')
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const INSIGHT_TYPES = ['Artikel', 'Berita', 'Event']

// null = kosong, undefined = tidak valid (bukan http/https, mis. "javascript:").
function safeUrl(v: unknown) {
  const s = text(v, 1000)
  if (!s) return null
  try {
    const u = new URL(s)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : undefined
  } catch {
    return undefined
  }
}

function cleanSchedule(v: ScheduleInput) {
  const date_start = text(v?.date_start, 10)
  const min = Math.floor(Number(v?.min_participants))
  return {
    title: text(v?.title, 200),
    category: v?.category === 'BNSP' ? 'BNSP' : 'Non-BNSP',
    date_start,
    date_end: text(v?.date_end, 10) || date_start,
    price: text(v?.price, 100),
    location: text(v?.location, 200),
    min_participants: min > 0 && min < 1000 ? min : null,
    description: text(v?.description, 1000) || null,
    syllabus: text(v?.syllabus, 5000) || null,
  }
}

function cleanInsight(v: InsightInput) {
  const type = INSIGHT_TYPES.includes(String(v?.type)) ? String(v.type) : 'Artikel'
  return {
    title: text(v?.title, 200),
    seo_title: text(v?.seo_title, SEO_TITLE_MAX) || null,
    type,
    category: text(v?.category, 80),
    date: text(v?.date, 40),
    excerpt: text(v?.excerpt, 60_000),
    external_pdf_url: type === 'Berita' ? safeUrl(v?.external_pdf_url) : null,
    event_location: type === 'Event' ? text(v?.event_location, 200) || null : null,
    event_date: type === 'Event' ? text(v?.event_date, 100) || null : null,
  }
}

export async function saveSchedule(id: number | null, input: ScheduleInput) {
  const values = cleanSchedule(input)
  if (!values.title || !values.date_start || !values.location) return { ok: false, error: 'Judul, tanggal, dan lokasi wajib diisi.' } as Result
  if (!ISO_DATE.test(values.date_start) || !ISO_DATE.test(values.date_end)) return { ok: false, error: 'Format tanggal tidak valid.' } as Result
  if (values.date_end < values.date_start) return { ok: false, error: 'Tanggal selesai tidak boleh sebelum tanggal mulai.' } as Result
  const db = getServerSupabase()
  return run(async () =>
    id === null
      ? await db.from('schedules').insert([{ ...values, is_active: true }]).select('id')
      : await db.from('schedules').update(values).eq('id', id).select('id')
  )
}

export async function setScheduleActive(id: number, active: boolean) {
  return run(async () => await getServerSupabase().from('schedules').update({ is_active: active }).eq('id', id).select('id'))
}

export async function deleteSchedule(id: number) {
  return run(async () => await getServerSupabase().from('schedules').delete().eq('id', id).select('id'))
}

export async function saveInsight(id: number | null, input: InsightInput) {
  const values = cleanInsight(input)
  if (!values.title || !values.excerpt) return { ok: false, error: 'Judul dan isi wajib diisi.' } as Result
  if (values.external_pdf_url === undefined) return { ok: false, error: 'Link PDF harus diawali https://' } as Result
  const db = getServerSupabase()
  return run(async () =>
    id === null
      ? await db.from('insights').insert([{ ...values, is_active: true }]).select('id')
      : await db.from('insights').update(values).eq('id', id).select('id')
  )
}

export async function setInsightActive(id: number, active: boolean) {
  return run(async () => await getServerSupabase().from('insights').update({ is_active: active }).eq('id', id).select('id'))
}

export async function deleteInsight(id: number) {
  return run(async () => await getServerSupabase().from('insights').delete().eq('id', id).select('id'))
}

const PAYMENT_STATUSES = ['Menunggu Pembayaran', 'Lunas / Terkonfirmasi'] as const

export async function setPaymentStatus(id: string, status: (typeof PAYMENT_STATUSES)[number]) {
  if (typeof id !== 'string' || !PAYMENT_STATUSES.includes(status)) return { ok: false, error: 'Status tidak valid.' } as Result
  return run(async () => await getServerSupabase().from('registrations').update({ status_pembayaran: status }).eq('id', id).select('id'))
}

export async function deleteRegistration(id: string) {
  return run(async () => await getServerSupabase().from('registrations').delete().eq('id', id).select('id'))
}
