import 'server-only'
import { isIP } from 'node:net'
// Utilitas request di sisi server: IP klien, cek asal request, dan verifikasi Cloudflare Turnstile.

type HeaderSource = { get(name: string): string | null }

// Di Vercel, x-vercel-forwarded-for / x-real-ip diisi ulang oleh platform sehingga tidak bisa dipalsukan klien.
export function clientIp(headers: HeaderSource) {
  const ip =
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  // IPv4 yang dibungkus IPv6 (::ffff:1.2.3.4) dihitung sebagai IPv4-nya sendiri.
  const mapped = ip.match(/:(\d{1,3}(?:\.\d{1,3}){3})$/)?.[1]
  if (mapped && isIP(mapped) === 4) return mapped
  return isIP(ip.split('%')[0]) === 6 ? ipv6Prefix(ip) : ip
}

// Satu pelanggan IPv6 biasanya memegang satu blok /64; tanpa ini penyerang bisa
// berganti alamat di blok yang sama untuk melewati rate limit per IP.
function ipv6Prefix(ip: string) {
  const [head, tail] = ip.split('%')[0].split('::')
  const left = head ? head.split(':') : []
  const right = tail !== undefined && tail ? tail.split(':') : []
  const full = tail === undefined ? left : [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill('0'), ...right]
  return `${full.slice(0, 4).map((h) => h.toLowerCase() || '0').join(':')}::/64`
}

// Tolak POST dari situs lain. Browser selalu mengirim Origin pada fetch POST.
export function isSameOrigin(headers: HeaderSource) {
  const origin = headers.get('origin')
  const host = headers.get('x-forwarded-host') || headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

// Opsional: aktif hanya jika TURNSTILE_SECRET_KEY di-set (Cloudflare → Turnstile, gratis).
export async function verifyTurnstile(token: unknown, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (typeof token !== 'string' || !token || token.length > 2048) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, ...(ip !== 'unknown' && { remoteip: ip }) }),
      signal: AbortSignal.timeout(8000),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (e) {
    console.error('Verifikasi Turnstile gagal:', e)
    return false
  }
}
