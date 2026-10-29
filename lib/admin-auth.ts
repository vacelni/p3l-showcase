import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Sesi admin: cookie httpOnly berisi waktu kedaluwarsa + tanda tangan HMAC.
// Password TIDAK pernah dikirim ke browser; disimpan di env ADMIN_PASSWORD (server).

export const ADMIN_COOKIE = 'p3l_admin'
const SESSION_HOURS = 12

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

export function isPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  // Bandingkan hash agar panjang input tidak bocor lewat waktu respons.
  const h = (s: string) => createHmac('sha256', 'p3l-login').update(s).digest('base64url')
  return safeEqual(h(input), h(expected))
}

export function createSessionToken() {
  const expires = String(Date.now() + SESSION_HOURS * 3_600_000)
  return { token: `${expires}.${sign(expires)}`, maxAge: SESSION_HOURS * 3600 }
}

export function verifySessionToken(token?: string) {
  if (!token || !secret()) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature) return false
  if (!safeEqual(signature, sign(expires))) return false
  return Number(expires) > Date.now()
}

// Cookie "perangkat tepercaya": diberikan setelah login sukses dan berlaku 90 hari.
// Perangkat ini melewati batas global percobaan login, sehingga serangan tebak password
// dari banyak IP tidak bisa mengunci admin asli. Batas per IP tetap berlaku.
// Token diikat ke password: mengganti ADMIN_PASSWORD mencabut semua perangkat tepercaya.
// Sengaja TIDAK dihapus saat logout, karena gunanya justru agar admin tetap bisa masuk lagi.
export const TRUSTED_COOKIE = 'p3l_trusted'
const TRUSTED_DAYS = 90
const passwordVersion = () => createHmac('sha256', 'p3l-trusted').update(process.env.ADMIN_PASSWORD ?? '').digest('base64url').slice(0, 16)

export function createTrustedToken() {
  const expires = String(Date.now() + TRUSTED_DAYS * 86_400_000)
  return { token: `${expires}.${sign(`trusted:${passwordVersion()}:${expires}`)}`, maxAge: TRUSTED_DAYS * 86_400 }
}

export async function isTrustedDevice() {
  const token = (await cookies()).get(TRUSTED_COOKIE)?.value
  if (!token || !secret()) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature) return false
  return safeEqual(signature, sign(`trusted:${passwordVersion()}:${expires}`)) && Number(expires) > Date.now()
}

export async function isAdmin() {
  const store = await cookies()
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value)
}
