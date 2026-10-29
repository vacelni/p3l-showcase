import SiteLayout from '@/app/(site)/layout'
import type { Metadata } from 'next'
import NotFoundBody from '@/components/NotFoundBody'

export const metadata: Metadata = { title: 'Halaman tidak ditemukan' }

// URL yang tidak cocok dengan rute mana pun tetap tampil dengan header & footer situs.
export default function NotFound() {
  return (
    <SiteLayout>
      <NotFoundBody />
    </SiteLayout>
  )
}
