import Link from 'next/link'

export default function NotFoundBody() {
  return (
    <section className="section bg-white">
      <div className="container-x max-w-2xl text-center">
        <p className="font-semibold text-green-700">Halaman tidak ditemukan</p>
        <h1 className="mt-3 text-4xl font-extrabold text-navy-900">Halaman ini sudah dipindah atau tidak ada</h1>
        <p className="mt-4 text-lg text-muted">Coba mulai dari jadwal pelatihan atau kembali ke beranda.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/jadwal" className="btn btn-primary">
            Lihat jadwal pelatihan
          </Link>
          <Link href="/" className="btn btn-outline">
            Ke beranda
          </Link>
        </div>
      </div>
    </section>
  )
}
