'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Printer, ShieldCheck } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { WhatsAppIcon } from '@/components/WhatsAppFloat'
import type { Schedule } from '@/lib/types'
import { formatDateRange, formatPrice } from '@/lib/format'
import { billing, site, waLink } from '@/lib/site'
import Turnstile, { TURNSTILE_ENABLED } from '@/components/schedule/Turnstile'

interface FormState {
  name: string
  position: string
  institution: string
  address: string
  whatsapp: string
  email: string
}

const emptyForm: FormState = { name: '', position: '', institution: '', address: '', whatsapp: '', email: '' }

interface Invoice {
  invoiceNumber: string
  program: string
  price: string
  emailSent: boolean
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export default function RegistrationModal({ schedule, onClose }: { schedule: Schedule | null; onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'sending' | 'done'>('form')
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const [token, setToken] = useState('')
  const [attempt, setAttempt] = useState(0)

  // Reset status setiap kali modal dibuka untuk kelas lain; isian peserta dipertahankan.
  const [shownSchedule, setShownSchedule] = useState(schedule)
  if (shownSchedule !== schedule) {
    setShownSchedule(schedule)
    if (schedule) {
      setStep('form')
      setError(null)
      setInvoice(null)
    }
  }

  const close = () => {
    if (step === 'done') setForm(emptyForm)
    onClose()
  }

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!schedule) return
    setStep('sending')
    setError(null)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule_id: schedule.id,
          nama_lengkap: form.name,
          jabatan: form.position,
          instansi: form.institution,
          alamat_instansi: form.address,
          whatsapp: form.whatsapp,
          email_korporat: form.email,
          website: honeypot,
          turnstile_token: token,
        }),
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(result.error || 'Pendaftaran belum tersimpan.')
      setInvoice({
        invoiceNumber: result.invoiceNumber,
        program: result.program,
        price: result.price,
        emailSent: result.emailSent !== false,
      })
      setStep('done')
    } catch (err) {
      const offline = err instanceof TypeError
      setError(
        offline
          ? 'Koneksi terputus. Periksa internet Anda lalu kirim ulang, atau daftar lewat WhatsApp admin.'
          : err instanceof Error
            ? err.message
            : 'Pendaftaran belum tersimpan.'
      )
      // Token Turnstile hanya bisa dipakai sekali; muat ulang widget.
      setToken('')
      setAttempt((a) => a + 1)
      setStep('form')
    }
  }

  const printInvoice = () => {
    if (!schedule || !invoice) return
    const w = window.open('', '_blank', 'width=850,height=1000')
    if (!w) {
      setError('Browser memblokir jendela cetak. Izinkan pop-up untuk situs ini, lalu klik Cetak invoice lagi.')
      return
    }
    const e = escapeHtml
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    w.document.write(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Proforma Invoice ${e(invoice.invoiceNumber)}</title>
<style>
@page{size:A4;margin:18mm}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#0e1c2b;line-height:1.5;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.head{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #0b2545}
.brand{font-size:26px;font-weight:900;color:#0b2545;letter-spacing:-.5px}.sub{font-size:12px;color:#536373}
.flow{height:4px;margin:0 0 24px;background:linear-gradient(90deg,#8a4b2a,#b98a3e 22%,#0e8f6e 62%,#8fe0cb)}
.doc{text-align:right}.doc h1{margin:0;font-size:18px;color:#0b2545}.doc p{margin:4px 0 0;font-size:12px;color:#536373}
h2{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#536373;margin:24px 0 8px}
.grid{display:grid;grid-template-columns:150px 1fr;gap:4px 12px;font-size:13px}.grid b{font-weight:600}
table{width:100%;border-collapse:collapse;font-size:13px}th{background:#f3f6f5;text-align:left;padding:10px;border:1px solid #dbe3e0}
td{padding:12px 10px;border:1px solid #dbe3e0;vertical-align:top}.r{text-align:right;white-space:nowrap}
.bank{margin-top:24px;border:2px solid #0b7a5e;border-radius:8px;padding:16px 20px;background:#edf8f3}
.bank .acc{font-size:24px;font-weight:900;letter-spacing:1px;margin:4px 0}
.note{font-size:12px;color:#334;margin-top:20px}.sign{margin-top:40px;display:flex;justify-content:flex-end;text-align:center;font-size:13px}
.foot{margin-top:40px;border-top:1px solid #dbe3e0;padding-top:12px;text-align:center;font-size:11px;color:#8a98a5}
</style></head><body>
<div class="head"><div><div class="brand">P3L</div><div class="sub">Pusat Pengolahan dan Pemanfaatan Limbah<br>Lembaga Pelatihan &amp; Konsultasi IPAL</div></div>
<div class="doc"><h1>PROFORMA INVOICE</h1><p>No. ${e(invoice.invoiceNumber)}<br>Tanggal: ${e(today)}</p></div></div>
<div class="flow"></div>
<h2>Ditagihkan kepada</h2>
<div class="grid"><b>Nama peserta</b><span>${e(form.name)} (${e(form.position)})</span><b>Instansi</b><span><strong>${e(form.institution)}</strong></span>
<b>Alamat</b><span>${e(form.address)}</span><b>WhatsApp / Email</b><span>${e(form.whatsapp)} / ${e(form.email)}</span></div>
<h2>Rincian</h2>
<table><thead><tr><th>Program pelatihan</th><th class="r">Biaya (IDR)</th></tr></thead><tbody><tr><td><strong>${e(invoice.program)}</strong><br>
<span style="font-size:12px;color:#536373">${e(formatDateRange(schedule.date_start, schedule.date_end))} • ${e(schedule.location)}</span></td>
<td class="r"><strong>${e(invoice.price)}</strong></td></tr></tbody></table>
<div class="bank"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#075e48;font-weight:700">Transfer pembayaran ke</div>
<div style="font-weight:800;margin-top:4px">BANK ${e(billing.bank)}</div><div class="acc">${e(billing.accountNumber)}</div><div style="font-weight:700">a.n. ${e(billing.accountName)}</div></div>
<p class="note"><strong>Ketentuan:</strong> Dokumen ini adalah proforma invoice elektronik yang sah sebagai dasar pembayaran. Kirim bukti transfer melalui WhatsApp admin ${e(site.phone)}.</p>
<div class="sign"><div><p style="margin-bottom:70px">Hormat kami,<br>Semarang, ${e(today)}</p><p style="margin:0;font-weight:800;text-decoration:underline">${e(billing.signatory)}</p><p style="margin:2px 0 0;color:#536373">${e(billing.signatoryTitle)}</p></div></div>
<div class="foot">${e(site.legalName)} (P3L) • ${e(site.city)}, ${e(site.region)} • WhatsApp ${e(site.phone)}</div>
<script>window.onload=function(){setTimeout(function(){window.print()},400)}</script></body></html>`)
    w.document.close()
  }

  const confirmLink =
    invoice &&
    waLink(
      `Halo Admin P3L, saya ingin konfirmasi pembayaran invoice ${invoice.invoiceNumber} atas nama ${form.name} (${form.institution}) untuk ${invoice.program}.`
    )

  return (
    <Modal
      open={!!schedule}
      onClose={close}
      size="lg"
      dismissible={step !== 'sending'}
      title={step === 'done' ? 'Pendaftaran tersimpan' : 'Daftar pelatihan'}
      description={step !== 'done' && schedule ? schedule.title : undefined}
    >
      {schedule && step !== 'done' && (
        <>
          <div className="mb-6 grid gap-3 rounded-xl bg-paper p-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted">Tanggal</p>
              <p className="font-semibold text-navy-900">{formatDateRange(schedule.date_start, schedule.date_end)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Lokasi</p>
              <p className="font-semibold text-navy-900">{schedule.location}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Biaya per peserta</p>
              <p className="tabular font-semibold text-navy-900">{formatPrice(schedule.price)}</p>
            </div>
          </div>

          <form onSubmit={submit} className="grid gap-5">
            {error && (
              <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <fieldset className="grid gap-4 sm:grid-cols-2" disabled={step === 'sending'}>
              <legend className="mb-3 text-sm font-bold text-green-700">Data peserta</legend>
              <div>
                <label htmlFor="reg-name" className="label">Nama lengkap</label>
                <input id="reg-name" name="name" value={form.name} onChange={update} required maxLength={120} autoComplete="name" placeholder="Beserta gelar" className="field" />
              </div>
              <div>
                <label htmlFor="reg-position" className="label">Jabatan</label>
                <input id="reg-position" name="position" value={form.position} onChange={update} required maxLength={100} autoComplete="organization-title" placeholder="Mis. Operator IPAL" className="field" />
              </div>
            </fieldset>

            <fieldset className="grid gap-4" disabled={step === 'sending'}>
              <legend className="mb-3 text-sm font-bold text-green-700">Instansi</legend>
              <div>
                <label htmlFor="reg-inst" className="label">Nama perusahaan / rumah sakit / instansi</label>
                <input id="reg-inst" name="institution" value={form.institution} onChange={update} required maxLength={150} autoComplete="organization" placeholder="Mis. PT Contoh Industri / RSUD Contoh" className="field" />
              </div>
              <div>
                <label htmlFor="reg-addr" className="label">Alamat instansi</label>
                <textarea id="reg-addr" name="address" value={form.address} onChange={update} required rows={2} maxLength={400} autoComplete="street-address" placeholder="Alamat lengkap beserta kota, untuk invoice" className="field resize-y" />
              </div>
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-2" disabled={step === 'sending'}>
              <legend className="mb-3 text-sm font-bold text-green-700">Kontak</legend>
              <div>
                <label htmlFor="reg-wa" className="label">Nomor WhatsApp</label>
                <input id="reg-wa" name="whatsapp" type="tel" inputMode="tel" value={form.whatsapp} onChange={update} required autoComplete="tel" placeholder="08xx xxxx xxxx" pattern="[0-9+\s\-]{9,20}" title="Isi nomor WhatsApp, 9–20 digit" className="field" />
              </div>
              <div>
                <label htmlFor="reg-email" className="label">Email</label>
                <input id="reg-email" name="email" type="email" value={form.email} onChange={update} required maxLength={120} autoComplete="email" placeholder="nama@perusahaan.com" className="field" />
              </div>
            </fieldset>

            {/* Honeypot: disembunyikan dari manusia, biasanya diisi bot. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="reg-website">Website</label>
              <input id="reg-website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <Turnstile key={attempt} onToken={setToken} />

            <p className="flex gap-2 text-xs leading-relaxed text-muted">
              <ShieldCheck className="h-4 w-4 shrink-0 text-green-700" />
              <span>
                Proforma invoice dikirim ke email di atas. Data Anda hanya dipakai untuk administrasi pelatihan. Baca{' '}
                <a href="/kebijakan-privasi" target="_blank" className="font-semibold text-navy-900 underline">
                  kebijakan privasi
                </a>
                .
              </span>
            </p>

            <button type="submit" disabled={step === 'sending' || (TURNSTILE_ENABLED && !token)} className="btn btn-primary w-full !py-3.5">
              {step === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Mengirim pendaftaran…
                </>
              ) : (
                'Kirim pendaftaran & terima invoice'
              )}
            </button>
          </form>
        </>
      )}

      {step === 'done' && invoice && (
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
          <p className="mt-4 text-lg font-bold text-navy-900">Terima kasih, {form.name.split(' ')[0]}.</p>
          {invoice.emailSent ? (
            <p className="mx-auto mt-2 max-w-md text-muted">
              Proforma invoice <strong className="text-navy-900">{invoice.invoiceNumber}</strong> sudah dikirim ke{' '}
              <strong className="text-navy-900">{form.email}</strong>. Jika belum masuk dalam beberapa menit, periksa folder spam.
            </p>
          ) : (
            <p className="mx-auto mt-2 max-w-md text-muted">
              Pendaftaran Anda tercatat dengan nomor invoice <strong className="text-navy-900">{invoice.invoiceNumber}</strong>, tetapi
              email belum berhasil terkirim. Silakan cetak invoice di bawah, atau hubungi admin lewat WhatsApp.
            </p>
          )}

          <ol className="mx-auto mt-6 max-w-md space-y-2 rounded-xl bg-paper p-5 text-left text-sm">
            <li><strong className="text-navy-900">1.</strong> Teruskan invoice ke bagian keuangan instansi.</li>
            <li><strong className="text-navy-900">2.</strong> Transfer ke rekening yang tertera di invoice.</li>
            <li><strong className="text-navy-900">3.</strong> Kirim bukti transfer ke WhatsApp admin.</li>
          </ol>

          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}

          <div className="mx-auto mt-6 grid max-w-md grid-cols-1 gap-3">
            {confirmLink && (
              <a href={confirmLink} target="_blank" rel="noopener noreferrer" className="btn w-full bg-[#1fa855] text-white hover:bg-[#178a45]">
                <WhatsAppIcon /> Konfirmasi pembayaran via WhatsApp
              </a>
            )}
            <button type="button" onClick={printInvoice} className="btn btn-outline w-full">
              <Printer className="h-4 w-4" /> Cetak invoice
            </button>
            <button type="button" onClick={close} className="py-2 text-sm font-semibold text-muted hover:text-navy-900">
              Tutup
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
