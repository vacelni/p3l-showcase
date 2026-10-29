'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import Logo from '@/components/Logo'
import { navItems, site, WA_GENERAL } from '@/lib/site'

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Tutup menu saat pindah halaman (disesuaikan saat render, tanpa render ulang tambahan dari effect).
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-md">
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" aria-label="P3L – Beranda" className="shrink-0">
            <Logo id="header" horizontal />
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-[0.9375rem] font-semibold transition-colors ${
                  isActive(item.href) ? 'bg-green-50 text-green-700' : 'text-navy-900/80 hover:bg-paper hover:text-navy-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 text-sm font-semibold text-navy-900/80 hover:text-navy-900 xl:flex">
              <Phone className="h-4 w-4" />
              <span className="tabular">{site.phone}</span>
            </a>
            <Link href="/jadwal" className="btn btn-primary !py-2.5 !text-sm">
              Daftar pelatihan
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            className="-mr-2 rounded-lg p-2 text-navy-900 hover:bg-paper lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Panel menu sengaja di luar <header>: backdrop-blur pada header membuat elemen `fixed` di dalamnya
          ikut terkurung setinggi header, sehingga menu tidak terlihat di HP. */}
      {open && (
        <div id="menu-mobile" className="fixed inset-x-0 bottom-0 top-[4.5rem] z-[45] overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden">
          <nav aria-label="Menu seluler" className="container-x flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`border-b border-line/70 py-4 text-lg font-semibold ${isActive(item.href) ? 'text-green-700' : 'text-navy-900'}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 grid gap-3">
              <Link href="/jadwal" className="btn btn-primary w-full">
                Daftar pelatihan
              </Link>
              <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
                Tanya admin via WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
