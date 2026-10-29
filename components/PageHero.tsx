import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo'

// Kepala halaman dalam: breadcrumb (juga sebagai structured data), judul H1, dan pengantar.
export default function PageHero({
  crumbs,
  title,
  lead,
  children,
}: {
  crumbs: { name: string; path: string }[]
  title: string
  lead?: React.ReactNode
  children?: React.ReactNode
}) {
  const all = [{ name: 'Beranda', path: '/' }, ...crumbs]
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <div className="container-x pb-14 pt-10 lg:pb-20 lg:pt-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-white/60">
            {all.map((c, i) => (
              <li key={c.path} className="flex min-w-0 items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                {i < all.length - 1 ? (
                  <Link href={c.path} className="shrink-0 hover:text-white">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="block max-w-[14rem] truncate text-white/85 sm:max-w-md lg:max-w-xl">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-6 max-w-5xl text-[clamp(2rem,1.4rem+2.6vw,3.25rem)] font-extrabold leading-[1.08]">{title}</h1>
        {lead && <div className="mt-5 max-w-3xl text-lg leading-relaxed text-white/75">{lead}</div>}
        {children}
      </div>
      <div className="flow-line !rounded-none" />
    </section>
  )
}
