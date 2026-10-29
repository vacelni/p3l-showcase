import type { Metadata } from 'next'
import { site } from '@/lib/site'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Bagaimana P3L mengumpulkan, memakai, dan melindungi data pribadi peserta pelatihan dan pengunjung website.',
  alternates: { canonical: '/kebijakan-privasi' },
}

const sections: { title: string; body: string[] }[] = [
  {
    title: 'Data yang kami kumpulkan',
    body: [
      'Saat Anda mendaftar pelatihan, kami mencatat nama lengkap, jabatan, nama dan alamat instansi, nomor WhatsApp, email, serta program yang dipilih.',
      'Untuk mencegah penyalahgunaan formulir, server kami juga memproses alamat IP Anda. Alamat IP hanya disimpan dalam bentuk acak (hash) dan dihapus otomatis dalam beberapa hari.',
      'Website ini memakai statistik kunjungan tanpa cookie (Vercel Analytics) yang tidak mengidentifikasi Anda secara pribadi.',
    ],
  },
  {
    title: 'Untuk apa data dipakai',
    body: [
      'Data pendaftaran hanya dipakai untuk administrasi pelatihan: menerbitkan proforma invoice, konfirmasi pembayaran, penyusunan daftar peserta dan sertifikat, serta menghubungi Anda terkait kelas yang diikuti.',
      'Kami tidak menjual atau menyewakan data pribadi Anda kepada siapa pun.',
    ],
  },
  {
    title: 'Pihak yang membantu kami',
    body: [
      'Data disimpan di layanan database Supabase dan email invoice dikirim melalui Resend. Website di-hosting oleh Vercel. Penyedia ini hanya memproses data sesuai keperluan layanan tersebut.',
      'Untuk program sertifikasi BNSP, data peserta yang diperlukan diteruskan kepada lembaga sertifikasi yang melaksanakan uji kompetensi.',
    ],
  },
  {
    title: 'Penyimpanan & keamanan',
    body: [
      'Data pendaftar hanya bisa diakses oleh admin P3L melalui halaman yang dilindungi kata sandi. Koneksi ke website dienkripsi (HTTPS).',
      'Data disimpan selama diperlukan untuk administrasi pelatihan dan kewajiban pencatatan keuangan, lalu dihapus atau dianonimkan.',
    ],
  },
  {
    title: 'Hak Anda',
    body: [
      'Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda berhak meminta salinan, memperbaiki, atau menghapus data pribadi Anda.',
      `Kirim permintaan ke ${site.email} atau WhatsApp ${site.phone}. Jika Anda menerima invoice padahal tidak pernah mendaftar, balas email tersebut dan data akan kami hapus.`,
    ],
  },
]

export default function PrivasiPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Kebijakan privasi', path: '/kebijakan-privasi' }]}
        title="Kebijakan privasi"
        lead={`Kebijakan ini menjelaskan bagaimana ${site.legalName} (P3L) memperlakukan data pribadi Anda.`}
      />
      <section className="section bg-white">
        <div className="container-x">
          <div className="max-w-4xl space-y-12">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-2xl font-extrabold text-navy-900">{s.title}</h2>
                <div className="prose-p3l mt-4 text-[1.0625rem] text-ink">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
