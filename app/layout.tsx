import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { SITE_URL, site } from '@/lib/site'
import { JsonLd, organizationJsonLd } from '@/lib/seo'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const defaultTitle = 'P3L: Pelatihan IPAL & Sertifikasi BNSP POPAL dan PPPA'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: '%s | P3L',
  },
  description: site.metaDescription,
  keywords: site.keywords,
  applicationName: 'P3L',
  authors: [{ name: site.legalName, url: SITE_URL }],
  creator: site.legalName,
  publisher: site.legalName,
  category: 'education',
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: 'P3L – Pusat Pengolahan dan Pemanfaatan Limbah',
    title: defaultTitle,
    description: site.metaDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: site.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  // Isi kode verifikasi Google Search Console di env NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0b2545',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <JsonLd data={organizationJsonLd()} />
        {children}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
