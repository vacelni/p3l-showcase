import type { Metadata } from 'next'
import NotFoundBody from '@/components/NotFoundBody'

export const metadata: Metadata = { title: 'Halaman tidak ditemukan' }

export default function NotFound() {
  return <NotFoundBody />
}
