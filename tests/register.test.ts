import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/register/route'

// The route is exercised for real; only its outside world (database, rate limiter, email) is replaced.
const { consume, db } = vi.hoisted(() => ({
  consume: vi.fn(async (...args: unknown[]) => args.length > 0),
  db: {
    schedule: null as Record<string, unknown> | null,
    existing: [] as { id: string }[],
    inserted: [] as Record<string, unknown>[],
  },
}))
vi.mock('@/lib/rate-limit', () => ({ consume }))

function query(table: string) {
  const chain = {
    select: () => chain,
    eq: () => chain,
    gte: () => chain,
    limit: async () => ({ data: table === 'registrations' ? db.existing : [] }),
    maybeSingle: async () => ({ data: db.schedule, error: null }),
    insert: (rows: Record<string, unknown>[]) => {
      db.inserted.push(...rows)
      return {
        select: () => ({ single: async () => ({ data: { id: '7b0c5d5e-0000-4000-8000-000000000001', created_at: new Date().toISOString() }, error: null }) }),
      }
    },
  }
  return chain
}
vi.mock('@/lib/supabase-admin', () => ({ getServerSupabase: () => ({ from: query }) }))

const inTwoWeeks = new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10)

const valid = {
  nama_lengkap: 'Siti Rahmawati',
  jabatan: 'Supervisor IPAL',
  instansi: 'RSUD Kota Contoh',
  alamat_instansi: 'Jl. Contoh No. 1\nSemarang',
  whatsapp: '0812 3456 7890',
  email_korporat: 'Siti@RSUD-Contoh.co.id',
  schedule_id: 3,
}

function post(body: unknown, init: { origin?: string; raw?: string } = {}) {
  return POST(
    new Request('https://p3l.example/api/register', {
      method: 'POST',
      headers: { origin: init.origin ?? 'https://p3l.example', host: 'p3l.example', 'x-real-ip': '203.0.113.9' },
      body: init.raw ?? JSON.stringify(body),
    }),
  )
}

async function error(res: Response) {
  return ((await res.json()) as { error?: string }).error
}

beforeEach(() => {
  consume.mockClear()
  consume.mockResolvedValue(true)
  db.schedule = { id: 3, title: 'Pelatihan POPAL', price: 'Rp 6.500.000', location: 'Semarang', date_start: inTwoWeeks, date_end: inTwoWeeks, is_active: true }
  db.existing = []
  db.inserted = []
})

describe('POST /api/register', () => {
  it('stores a valid registration with the title from the database, not from the browser', async () => {
    const res = await post({ ...valid, program_pilihan: 'Kelas gratis palsu' })
    expect(res.status).toBe(200)
    expect(db.inserted).toHaveLength(1)
    expect(db.inserted[0]).toMatchObject({
      schedule_id: 3,
      program_pilihan: 'Pelatihan POPAL',
      status_pembayaran: 'Menunggu Pembayaran',
      email_korporat: 'siti@rsud-contoh.co.id',
    })
  })

  it('rejects a cross-site request before reading the body', async () => {
    const res = await post(valid, { origin: 'https://evil.example' })
    expect(res.status).toBe(403)
    expect(db.inserted).toHaveLength(0)
  })

  it('rejects an oversized body even without a Content-Length header', async () => {
    const res = await post(null, { raw: JSON.stringify({ ...valid, alamat_instansi: 'x'.repeat(20_000) }) })
    expect(res.status).toBe(413)
  })

  it('rejects malformed JSON', async () => {
    expect((await post(null, { raw: '{not json' })).status).toBe(400)
  })

  it('silently drops bots that fill the hidden honeypot field', async () => {
    const res = await post({ ...valid, website: 'https://spam.example' })
    expect(res.status).toBe(400)
    expect(db.inserted).toHaveLength(0)
  })

  it.each([
    ['a missing field', { jabatan: '' }, 'Semua kolom wajib diisi.'],
    ['a non-numeric schedule', { schedule_id: 'abc' }, 'Semua kolom wajib diisi.'],
    ['a too-short name', { nama_lengkap: 'Al' }, 'Nama lengkap minimal 3 karakter.'],
    ['digits in the name', { nama_lengkap: 'Siti 123' }, 'Nama hanya boleh berisi huruf, spasi, titik, koma, dan tanda hubung.'],
    ['markup in the institution', { instansi: 'RS <b>Contoh</b>' }, 'Jabatan, instansi, atau alamat berisi karakter yang tidak diizinkan.'],
    ['a link in the institution (phishing via invoice email)', { instansi: 'Klik www.hadiah.xyz' }, 'Isian tidak boleh berisi link atau alamat website.'],
    ['a bare domain in the job title', { jabatan: 'Admin promo-murah.shop' }, 'Isian tidak boleh berisi link atau alamat website.'],
    ['an invalid email', { email_korporat: 'siti@localhost' }, 'Alamat email tidak valid.'],
    ['a too-short phone number', { whatsapp: '0812' }, 'Nomor WhatsApp tidak valid.'],
  ])('rejects %s', async (_, patch, message) => {
    const res = await post({ ...valid, ...patch })
    expect(res.status).toBe(400)
    expect(await error(res)).toBe(message)
    expect(db.inserted).toHaveLength(0)
  })

  it('answers 429 once the per-IP limit is reached', async () => {
    consume.mockResolvedValueOnce(false)
    const res = await post(valid)
    expect(res.status).toBe(429)
    expect(consume).toHaveBeenCalledWith('reg:ip:203.0.113.9', 5, 3600)
    expect(db.inserted).toHaveLength(0)
  })

  it('refuses an inactive or unknown schedule', async () => {
    db.schedule = null
    expect((await post(valid)).status).toBe(404)
  })

  it('refuses a class that has already started', async () => {
    db.schedule = { ...db.schedule, date_start: '2020-01-01' }
    expect((await post(valid)).status).toBe(409)
  })

  it('does not issue a second invoice to the same email for the same class within a day', async () => {
    db.existing = [{ id: 'earlier' }]
    const res = await post(valid)
    expect(res.status).toBe(409)
    expect(db.inserted).toHaveLength(0)
  })
})
