// Smoke test end-to-end tanpa dependensi tambahan.
// Pemakaian:
//   node scripts/smoke-test.mjs                         → http://localhost:3000
//   node scripts/smoke-test.mjs https://your-deployment.example
// Tes TIDAK membuat pendaftaran sungguhan: semua uji API sengaja memakai data yang ditolak server.

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const results = []
const ok = (name, pass, detail = '') => results.push({ name, pass, detail })

async function get(path, init) {
  const res = await fetch(BASE + path, { redirect: 'manual', ...init })
  const type = res.headers.get('content-type') || ''
  const text = /text|xml/.test(type) ? await res.text() : ''
  return { res, text }
}

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const pick = (html, re) => decode(html.match(re)?.[1]?.trim() ?? '')

// ---------- Halaman publik ----------
const pages = ['/', '/program', '/jadwal', '/layanan', '/artikel', '/tentang', '/kontak', '/kebijakan-privasi']

const { text: sitemap } = await get('/sitemap.xml')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
ok('sitemap.xml berisi URL', sitemapUrls.length > 10, `${sitemapUrls.length} URL`)
const toCheck = [...new Set([...pages, ...sitemapUrls])]

for (const path of toCheck) {
  const { res, text } = await get(path)
  const title = pick(text, /<title>([^<]*)<\/title>/)
  const desc = pick(text, /<meta name="description" content="([^"]*)"/)
  const canonical = pick(text, /<link rel="canonical" href="([^"]*)"/)
  const h1 = (text.match(/<h1[\s>]/g) || []).length
  const problems = []
  if (res.status !== 200) problems.push(`status ${res.status}`)
  if (!title) problems.push('tanpa <title>')
  else if (title.length > 65) problems.push(`title ${title.length} karakter`)
  if (!desc) problems.push('tanpa meta description')
  else if (desc.length > 160) problems.push(`description ${desc.length} karakter`)
  if (!canonical) problems.push('tanpa canonical')
  if (h1 !== 1) problems.push(`${h1} buah <h1>`)
  if (/>\s*(undefined|NaN|null)\s*</.test(text)) problems.push('ada teks undefined/NaN/null')
  if (/noindex/.test(pick(text, /<meta name="robots" content="([^"]*)"/)) && sitemapUrls.includes(path)) {
    problems.push('noindex tapi ada di sitemap')
  }
  ok(`GET ${path}`, problems.length === 0, problems.join(', ') || title)
}

// ---------- Header keamanan ----------
{
  const { res } = await get('/')
  for (const h of ['content-security-policy', 'x-content-type-options', 'referrer-policy', 'x-frame-options', 'strict-transport-security']) {
    ok(`header ${h}`, res.headers.has(h))
  }
  ok('tanpa header x-powered-by', !res.headers.has('x-powered-by'))
}

// ---------- Ikon & logo (Google mengambil favicon dari /favicon.ico dan logo dari structured data) ----------
for (const [path, type] of [
  ['/favicon.ico', 'image/x-icon'],
  ['/icon/48', 'image/png'],
  ['/apple-icon', 'image/png'],
  ['/logo.png', 'image/png'],
]) {
  const { res } = await get(path)
  ok(`${path} → ${type}`, res.status === 200 && (res.headers.get('content-type') || '').startsWith(type), `${res.status} ${res.headers.get('content-type')}`)
}

// ---------- 404, robots, admin ----------
{
  const { res, text } = await get('/halaman-yang-tidak-ada')
  ok('URL acak → 404', res.status === 404, String(res.status))
  ok('Halaman 404 ber-header situs', text.includes('Halaman tidak ditemukan'))

  const { text: robots } = await get('/robots.txt')
  ok('robots.txt melarang /admin & /api', /Disallow: \/admin/.test(robots) && /Disallow: \/api\//.test(robots))

  const admin = await get('/admin')
  ok('/admin noindex', /noindex/.test(admin.res.headers.get('x-robots-tag') || '') && admin.text.includes('noindex'))
  ok('/admin tanpa cache', /no-store/.test(admin.res.headers.get('cache-control') || ''))
  ok('/admin tidak membocorkan data tanpa login', !/email_korporat|nama_lengkap/.test(admin.text) && admin.text.includes('Kata sandi'))
}

// ---------- API pendaftaran (semua harus DITOLAK) ----------
const origin = new URL(BASE).origin
const valid = {
  schedule_id: 999999999,
  nama_lengkap: 'Uji Coba Otomatis',
  jabatan: 'Penguji',
  instansi: 'PT Uji Coba',
  alamat_instansi: 'Jl. Contoh No. 1, Semarang',
  whatsapp: '081234567890',
  email_korporat: 'smoke-test@example.invalid',
}
const post = (body, headers = { Origin: origin }) =>
  fetch(BASE + '/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

{
  const r = await fetch(BASE + '/api/register')
  ok('GET /api/register → 405', r.status === 405, String(r.status))
}
const apiCases = [
  ['tanpa Origin → 403', () => post(valid, {}), 403],
  ['Origin situs lain → 403', () => post(valid, { Origin: 'https://evil.example' }), 403],
  ['JSON rusak → 400', () => post('{bukan json'), 400],
  ['kolom kosong → 400', () => post({ ...valid, nama_lengkap: '' }), 400],
  ['link di nama → 400', () => post({ ...valid, nama_lengkap: 'Klik www.evil.com' }), 400],
  ['link di instansi → 400', () => post({ ...valid, instansi: 'PT A https://evil.example/login' }), 400],
  ['HTML di alamat → 400', () => post({ ...valid, alamat_instansi: '<img src=x onerror=alert(1)>' }), 400],
  ['email tidak valid → 400', () => post({ ...valid, email_korporat: 'bukan-email' }), 400],
  ['WhatsApp tidak valid → 400', () => post({ ...valid, whatsapp: '123' }), 400],
  ['honeypot terisi → 400', () => post({ ...valid, website: 'http://spam' }), 400],
  ['schedule_id negatif → 400', () => post({ ...valid, schedule_id: -1 }), 400],
  ['body > 10 KB → 413', () => post({ ...valid, alamat_instansi: 'a'.repeat(20_000) }), 413],
]
for (const [name, run, expected] of apiCases) {
  const r = await run()
  ok(`POST /api/register ${name}`, r.status === expected, `status ${r.status}`)
}
{
  // Lolos validasi tapi jadwal tidak ada → 404 (atau 429 jika batas per-IP sudah habis,
  // atau 403 jika Turnstile aktif karena skrip ini tidak punya token). Tidak ada data yang disimpan.
  const r = await post(valid)
  ok('POST jadwal fiktif → 404/429/403', [404, 429, 403].includes(r.status), `status ${r.status}`)
}

// ---------- Ringkasan ----------
const failed = results.filter((r) => !r.pass)
for (const r of results) console.log(`${r.pass ? '✔' : '✘'} ${r.name}${r.detail ? `  — ${r.detail}` : ''}`)
console.log(`\n${results.length - failed.length}/${results.length} lolos (${BASE})`)
process.exit(failed.length ? 1 : 0)
