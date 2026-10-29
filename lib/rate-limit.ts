import 'server-only'
import { createHash } from 'node:crypto'
import { getServerSupabase } from '@/lib/supabase-admin'

// Rate limit untuk formulir pendaftaran & login admin.
// Utama: fungsi p3l_rate_limit di Supabase (lihat supabase/rate-limit.sql), berlaku untuk semua server.
// Cadangan: memori server, dipakai bila tabel belum dibuat atau database sedang bermasalah.

const memory = new Map<string, { count: number; start: number }>()
let warned = false

// Kunci di-hash agar IP & email tidak tersimpan apa adanya di tabel rate_limits.
const hashKey = (key: string) => createHash('sha256').update(`p3l:${key}`).digest('base64url').slice(0, 32)

function memoryCount(key: string, windowSeconds: number, consume: boolean) {
  const now = Date.now()
  const entry = memory.get(key)
  const fresh = !entry || now - entry.start > windowSeconds * 1000
  if (!consume) return fresh ? 0 : entry.count
  const next = fresh ? { count: 1, start: now } : { count: entry.count + 1, start: entry.start }
  memory.set(key, next)
  if (memory.size > 5000) {
    for (const [k, v] of memory) if (now - v.start > 86_400_000) memory.delete(k)
  }
  return next.count
}

async function count(key: string, windowSeconds: number, consume: boolean): Promise<number> {
  const hashed = hashKey(key)
  const local = memoryCount(hashed, windowSeconds, consume)
  try {
    const { data, error } = await getServerSupabase().rpc('p3l_rate_limit', {
      p_key: hashed,
      p_window_seconds: windowSeconds,
      p_consume: consume,
    })
    if (error) throw error
    return Math.max(Number(data) || 0, local)
  } catch (e) {
    if (!warned) {
      warned = true
      console.warn('Rate limit memakai memori server. Jalankan supabase/rate-limit.sql agar lebih kuat.', e)
    }
    return local
  }
}

/** Catat satu percobaan. Mengembalikan true jika masih di bawah batas. */
export async function consume(key: string, limit: number, windowSeconds: number) {
  return (await count(key, windowSeconds, true)) <= limit
}

/** Cek tanpa mencatat. Mengembalikan true jika batas sudah tercapai. */
export async function isLimited(key: string, limit: number, windowSeconds: number) {
  return (await count(key, windowSeconds, false)) >= limit
}
