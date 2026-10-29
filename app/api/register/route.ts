import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getServerSupabase } from '@/lib/supabase-admin'
import { formatDateRange, formatPrice, invoiceNumber, isRegistrationOpen } from '@/lib/format'
import { SITE_URL, billing, site, waLink } from '@/lib/site'
import { consume } from '@/lib/rate-limit'
import { clientIp, isSameOrigin, verifyTurnstile } from '@/lib/request'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
// Penerima pemberitahuan pendaftar baru; bisa diisi beberapa alamat dipisah koma.
const notifyTo = (process.env.ADMIN_NOTIFY_EMAIL || site.email).split(',').map((v) => v.trim()).filter(Boolean)

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

// Buang karakter kontrol & rapikan spasi. Alamat boleh berisi baris baru.
const field = (v: unknown, max: number, multiline = false) =>
  typeof v === 'string'
    ? v
        .replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .trim()
        .slice(0, max)
    : ''

// Isian ini ikut tampil di email invoice, jadi tolak link agar endpoint tidak bisa dipakai untuk phishing.
const LINKISH = /(https?:|www\.|[a-z0-9-]\.(com|net|org|info|biz|xyz|top|link|click|ru|io|me|ly|site|online|shop)\b|[<>{}[\]\\|^`])/i
const NAME = /^[\p{L}\p{M}][\p{L}\p{M}\s.,'’()-]*$/u
const TEXT = /^[\p{L}\p{M}\p{N}\s.,'’"&()/:#+-]*$/u
const EMAIL = /^[a-z0-9._%+-]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,24}$/
const PHONE = /^\+?[0-9\s().-]{9,20}$/

const LIMITS = {
  perIp: { limit: 5, window: 3600 },
  perEmail: { limit: 3, window: 86_400 },
  global: { limit: 40, window: 3600 },
}

const MAX_BODY = 10_000

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

type Notice = Record<
  'nama_lengkap' | 'jabatan' | 'instansi' | 'alamat_instansi' | 'whatsapp' | 'email_korporat' | 'invoice' | 'program' | 'dates' | 'location' | 'price',
  string
>

// Pemberitahuan ke admin setiap ada pendaftar baru. Gagal kirim tidak membatalkan pendaftaran.
async function notifyAdmin(client: Resend, n: Notice) {
  const rows: [string, string][] = [
    ['Nama', `${n.nama_lengkap} (${n.jabatan})`],
    ['Instansi', n.instansi],
    ['Alamat', n.alamat_instansi],
    ['WhatsApp', n.whatsapp],
    ['Email', n.email_korporat],
    ['Program', n.program],
    ['Jadwal', `${n.dates}, ${n.location}`],
    ['Tagihan', `${n.price} (${n.invoice})`],
  ]
  const wa = `https://wa.me/${n.whatsapp.replace(/\D/g, '').replace(/^0/, '62')}`
  try {
    const { error } = await client.emails.send({
      from: `Website P3L <${site.email}>`,
      to: notifyTo,
      replyTo: n.email_korporat,
      subject: `Pendaftar baru: ${n.nama_lengkap} (${n.instansi}) – ${n.program}`,
      text: [
        'Ada pendaftar baru dari website. Proforma invoice sudah dikirim otomatis ke email peserta.',
        '',
        ...rows.map(([k, v]) => `${k.padEnd(9)}: ${v}`),
        '',
        `Chat WhatsApp peserta: ${wa}`,
        `Kelola pendaftaran: ${SITE_URL}/admin`,
      ].join('\n'),
      html: `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Pendaftar baru</title></head>
<body style="margin:0;padding:24px;background:#f3f6f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0e1c2b">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #dbe3e0;border-radius:12px;padding:24px">
  <p style="margin:0 0 16px;font-size:14px">Ada pendaftar baru dari website. Proforma invoice sudah dikirim otomatis ke email peserta.</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#536373;width:90px;vertical-align:top">${k}</td><td style="padding:6px 0;font-weight:600;white-space:pre-line">${esc(v)}</td></tr>`).join('')}
  </table>
  <p style="margin:20px 0 0">
    <a href="${esc(wa)}" style="display:inline-block;background:#1fa855;color:#ffffff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:8px;font-size:14px">Chat WhatsApp peserta</a>
    <a href="${SITE_URL}/admin" style="display:inline-block;margin-left:8px;color:#0b2545;font-weight:700;font-size:14px">Buka dasbor admin</a>
  </p>
</div></body></html>`,
    })
    if (error) console.error('Resend error (notifikasi admin):', error)
  } catch (err) {
    console.error('Resend error (notifikasi admin):', err)
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return fail('Permintaan tidak diizinkan.', 403)
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return fail('Data terlalu besar.', 413)

  let body: Record<string, unknown>
  try {
    // Header content-length bisa dihilangkan (chunked), jadi ukuran sebenarnya dicek lagi setelah dibaca.
    const raw = await request.text()
    if (raw.length > MAX_BODY) return fail('Data terlalu besar.', 413)
    body = JSON.parse(raw)
  } catch {
    return fail('Format data tidak valid.')
  }
  if (!body || typeof body !== 'object') return fail('Format data tidak valid.')

  // Honeypot: kolom tersembunyi yang hanya diisi bot.
  if (field(body.website, 200)) return fail('Pendaftaran tidak dapat diproses.')

  const data = {
    nama_lengkap: field(body.nama_lengkap, 120),
    jabatan: field(body.jabatan, 100),
    instansi: field(body.instansi, 150),
    alamat_instansi: field(body.alamat_instansi, 400, true),
    whatsapp: field(body.whatsapp, 20),
    email_korporat: field(body.email_korporat, 120).toLowerCase(),
  }
  const scheduleId = Number(body.schedule_id)

  if (Object.values(data).some((v) => !v) || !Number.isInteger(scheduleId) || scheduleId <= 0) {
    return fail('Semua kolom wajib diisi.')
  }
  if (data.nama_lengkap.length < 3) return fail('Nama lengkap minimal 3 karakter.')
  if (!NAME.test(data.nama_lengkap)) {
    return fail('Nama hanya boleh berisi huruf, spasi, titik, koma, dan tanda hubung.')
  }
  if (!TEXT.test(data.jabatan) || !TEXT.test(data.instansi) || !TEXT.test(data.alamat_instansi.replace(/\n/g, ' '))) {
    return fail('Jabatan, instansi, atau alamat berisi karakter yang tidak diizinkan.')
  }
  if ([data.nama_lengkap, data.jabatan, data.instansi, data.alamat_instansi].some((v) => LINKISH.test(v))) {
    return fail('Isian tidak boleh berisi link atau alamat website.')
  }
  if (!EMAIL.test(data.email_korporat)) return fail('Alamat email tidak valid.')
  const digits = data.whatsapp.replace(/\D/g, '')
  if (!PHONE.test(data.whatsapp) || digits.length < 9 || digits.length > 15) return fail('Nomor WhatsApp tidak valid.')

  const ip = clientIp(request.headers)
  if (!(await verifyTurnstile(body.turnstile_token, ip))) {
    return fail('Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.', 403)
  }

  const busy = 'Terlalu banyak pendaftaran dari jaringan atau email ini. Coba lagi nanti atau daftar lewat WhatsApp admin.'
  if (!(await consume(`reg:ip:${ip}`, LIMITS.perIp.limit, LIMITS.perIp.window))) return fail(busy, 429)
  if (!(await consume(`reg:email:${data.email_korporat}`, LIMITS.perEmail.limit, LIMITS.perEmail.window))) return fail(busy, 429)
  if (!(await consume('reg:global', LIMITS.global.limit, LIMITS.global.window))) {
    console.warn('Batas global pendaftaran tercapai; kemungkinan ada penyalahgunaan formulir.')
    return fail('Sistem pendaftaran sedang sibuk. Silakan daftar lewat WhatsApp admin.', 429)
  }

  const supabase = getServerSupabase()

  // Program & harga diambil dari database, bukan dari browser, agar tidak bisa dimanipulasi.
  const { data: schedule, error: scheduleError } = await supabase
    .from('schedules')
    .select('id, title, price, location, date_start, date_end, is_active')
    .eq('id', scheduleId)
    .maybeSingle()

  if (scheduleError || !schedule || !schedule.is_active) {
    return fail('Jadwal yang dipilih sudah tidak tersedia.', 404)
  }
  if (!isRegistrationOpen(schedule)) {
    return fail('Pendaftaran untuk kelas ini sudah ditutup karena kelas sudah dimulai.', 409)
  }

  // Cegah invoice ganda ke email yang sama untuk kelas yang sama.
  const since = new Date(Date.now() - 86_400_000).toISOString()
  const { data: existing } = await supabase
    .from('registrations')
    .select('id')
    .eq('email_korporat', data.email_korporat)
    .eq('schedule_id', schedule.id)
    .gte('created_at', since)
    .limit(1)
  if (existing?.length) {
    return fail('Email ini sudah terdaftar untuk kelas tersebut. Cek kotak masuk atau folder spam, atau hubungi admin.', 409)
  }

  const { data: saved, error: dbError } = await supabase
    .from('registrations')
    // program_pilihan tetap disimpan sebagai catatan judul saat mendaftar, meski jadwalnya nanti diedit atau dihapus.
    .insert([{ ...data, schedule_id: schedule.id, program_pilihan: schedule.title, status_pembayaran: 'Menunggu Pembayaran' }])
    .select('id, created_at')
    .single()

  if (dbError || !saved) {
    console.error('Database error:', dbError)
    return fail('Pendaftaran gagal disimpan.', 500)
  }

  const invoice = invoiceNumber(saved.id, saved.created_at)
  const price = formatPrice(schedule.price)
  const dates = formatDateRange(schedule.date_start, schedule.date_end)
  const issued = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(saved.created_at))
  const confirmUrl = waLink(`Halo Admin P3L, saya ingin konfirmasi pembayaran invoice ${invoice} atas nama ${data.instansi}.`)

  let emailSent = false
  if (resend) {
    const notice = { ...data, invoice, program: schedule.title, dates, location: schedule.location, price }
    const [{ error: emailError }] = await Promise.all([
      resend.emails.send({
        from: `P3L Training Center <${site.email}>`,
        to: [data.email_korporat],
        replyTo: site.email,
        text: [
          `Proforma Invoice ${invoice} (${issued})`,
          '',
          `Yth. ${data.nama_lengkap} (${data.jabatan}), ${data.instansi}.`,
          'Terima kasih telah mendaftar. Berikut rincian tagihan untuk diteruskan ke bagian keuangan instansi Anda.',
          '',
          `Program : ${schedule.title}`,
          `Jadwal  : ${dates}`,
          `Lokasi  : ${schedule.location}`,
          `Total   : ${price}`,
          '',
          `Transfer pembayaran ke: BANK ${billing.bank} ${billing.accountNumber} a.n. ${billing.accountName}`,
          `Setelah transfer, kirim bukti pembayaran ke WhatsApp admin: ${confirmUrl}`,
          '',
          `Butuh faktur pajak atau dokumen lain? Balas email ini atau hubungi WhatsApp ${site.phone}.`,
          'Tidak merasa mendaftar? Abaikan email ini atau balas agar data Anda kami hapus.',
          '',
          `${site.legalName} (P3L), ${site.city}, ${site.region}`,
        ].join('\n'),
        subject: `Proforma Invoice ${invoice} – ${schedule.title}`,
        html: `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Proforma Invoice P3L</title></head>
<body style="margin:0;padding:0;background:#f3f6f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0e1c2b">
<div style="max-width:600px;margin:32px auto;background:#ffffff;border:1px solid #dbe3e0;border-radius:16px;overflow:hidden">
  <div style="background:#0b2545;padding:24px 32px;color:#ffffff">
    <div style="font-size:24px;font-weight:900;letter-spacing:-0.5px">P3L</div>
    <div style="font-size:12px;opacity:.75">Pusat Pengolahan dan Pemanfaatan Limbah</div>
  </div>
  <div style="height:4px;background:linear-gradient(90deg,#8a4b2a,#b98a3e 22%,#0e8f6e 62%,#8fe0cb)"></div>
  <div style="padding:28px 32px">
    <p style="margin:0 0 4px;font-size:12px;color:#536373">Proforma Invoice</p>
    <p style="margin:0 0 4px;font-size:18px;font-weight:800;color:#0b2545">${esc(invoice)}</p>
    <p style="margin:0 0 20px;font-size:12px;color:#536373">Diterbitkan ${esc(issued)}</p>
    <p style="font-size:14px;line-height:1.6;margin:0 0 20px">
      Yth. <strong>${esc(data.nama_lengkap)}</strong> (${esc(data.jabatan)}), <strong>${esc(data.instansi)}</strong>.<br>
      Terima kasih telah mendaftar. Berikut rincian tagihan yang dapat diteruskan ke bagian keuangan / procurement instansi Anda.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;background:#f3f6f5;border-radius:10px">
      <tr><td style="padding:12px 16px;color:#536373;width:120px">Program</td><td style="padding:12px 16px;font-weight:700">${esc(schedule.title)}</td></tr>
      <tr><td style="padding:0 16px 12px;color:#536373">Jadwal</td><td style="padding:0 16px 12px">${esc(dates)}</td></tr>
      <tr><td style="padding:0 16px 12px;color:#536373">Lokasi</td><td style="padding:0 16px 12px">${esc(schedule.location)}</td></tr>
      <tr><td style="padding:12px 16px;color:#536373;border-top:1px dashed #c9d3d0">Total</td><td style="padding:12px 16px;font-size:18px;font-weight:900;border-top:1px dashed #c9d3d0">${esc(price)}</td></tr>
    </table>
    <div style="margin:24px 0;padding:18px 20px;border:2px solid #0b7a5e;border-radius:10px;background:#edf8f3">
      <div style="font-size:11px;font-weight:700;color:#075e48;text-transform:uppercase;letter-spacing:.5px">Transfer pembayaran ke</div>
      <div style="font-size:15px;font-weight:800;margin-top:6px">BANK ${esc(billing.bank)}</div>
      <div style="font-size:24px;font-weight:900;letter-spacing:1px;margin:4px 0">${esc(billing.accountNumber)}</div>
      <div style="font-size:14px;font-weight:700">a.n. ${esc(billing.accountName)}</div>
    </div>
    <p style="font-size:14px;margin:0 0 14px">Setelah transfer, kirim bukti pembayaran ke WhatsApp admin:</p>
    <a href="${esc(confirmUrl)}" style="display:inline-block;background:#1fa855;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:10px;font-size:14px">Konfirmasi pembayaran via WhatsApp</a>
    <p style="font-size:12px;color:#536373;line-height:1.6;margin:24px 0 0">
      Butuh faktur pajak, kuitansi bermeterai, atau dokumen pendukung lain? Balas email ini atau hubungi WhatsApp ${esc(site.phone)}.
    </p>
    <p style="font-size:11px;color:#8a98a5;line-height:1.6;margin:16px 0 0">
      Tidak merasa mendaftar? Abaikan email ini atau balas agar data Anda kami hapus.
    </p>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #dbe3e0;font-size:11px;color:#8a98a5;text-align:center">
    ${esc(site.legalName)} (P3L) • ${esc(site.city)}, ${esc(site.region)}
  </div>
</div></body></html>`,
      }),
      notifyAdmin(resend, notice),
    ])
    if (emailError) console.error('Resend error:', emailError)
    else emailSent = true
  } else {
    console.warn('RESEND_API_KEY belum di-set; email invoice tidak dikirim.')
  }

  return NextResponse.json({ success: true, invoiceNumber: invoice, program: schedule.title, price, emailSent })
}
