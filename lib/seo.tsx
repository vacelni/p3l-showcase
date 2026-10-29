// Structured data (schema.org JSON-LD) agar Google memahami P3L, program, jadwal, FAQ, dan artikel.
// Bisa diuji di https://search.google.com/test/rich-results

import type { Insight, Schedule } from '@/lib/types'
import type { Program } from '@/lib/programs'
import { SITE_URL, instructor, site } from '@/lib/site'
import { durationDays, isRegistrationOpen, parseLooseDate, plainExcerpt, priceNumber, todayISO } from '@/lib/format'

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify aman di sini; "<" di-escape agar tidak bisa menutup tag script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

const ORG_ID = `${SITE_URL}/#organization`
const INSTRUCTOR_ID = `${SITE_URL}/tentang#instruktur`

const instructorRef = { '@type': 'Person', '@id': INSTRUCTOR_ID, name: instructor.name }

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['EducationalOrganization', 'ProfessionalService'],
        '@id': ORG_ID,
        name: `${site.name} – ${site.legalName}`,
        alternateName: ['P3L', 'PPPL', site.legalName],
        description: site.description,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/opengraph-image`,
        telephone: site.phoneE164,
        email: site.email,
        foundingDate: String(site.foundingYear),
        address: {
          '@type': 'PostalAddress',
          ...(site.streetAddress && { streetAddress: site.streetAddress }),
          ...(site.postalCode && { postalCode: site.postalCode }),
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: 'ID',
        },
        ...(site.mapsUrl && { hasMap: site.mapsUrl }),
        ...(site.openingDays.length > 0 && {
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: site.openingDays,
            opens: site.opens,
            closes: site.closes,
          },
        }),
        ...(site.sameAs.length > 0 && { sameAs: site.sameAs }),
        areaServed: { '@type': 'Country', name: 'Indonesia' },
        knowsAbout: site.keywords,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: site.phoneE164,
          contactType: 'customer service',
          availableLanguage: ['Indonesian'],
        },
        employee: instructorRef,
      },
      {
        '@type': 'Person',
        '@id': INSTRUCTOR_ID,
        name: instructor.name,
        jobTitle: instructor.role,
        image: `${SITE_URL}${instructor.photo}`,
        url: `${SITE_URL}/tentang`,
        worksFor: { '@id': ORG_ID },
        affiliation: { '@type': 'CollegeOrUniversity', name: 'Universitas Contoh', url: 'https://example.ac.id' },
        knowsAbout: instructor.expertise,
        sameAs: instructor.profiles.map((p) => p.href),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: site.name,
        alternateName: [site.legalName, 'p3l-showcase'],
        inLanguage: 'id-ID',
        publisher: { '@id': ORG_ID },
      },
    ],
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

function cityOf(location: string) {
  const parts = location.split(',').map((p) => p.trim())
  return parts[parts.length - 1] || location
}

function place(location: string) {
  return {
    '@type': 'Place',
    name: location,
    address: { '@type': 'PostalAddress', addressLocality: cityOf(location), addressCountry: 'ID' },
  }
}

export function scheduleEventJsonLd(s: Schedule) {
  const price = priceNumber(s.price)
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationEvent',
    name: s.title,
    description: s.description || `Pelatihan ${s.title} oleh P3L.`,
    startDate: s.date_start,
    endDate: s.date_end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: place(s.location),
    url: `${SITE_URL}/jadwal`,
    image: [`${SITE_URL}/opengraph-image`],
    organizer: { '@type': 'Organization', name: site.legalName, url: SITE_URL },
    performer: instructorRef,
    offers: {
      '@type': 'Offer',
      ...(price !== null && { price, priceCurrency: 'IDR' }),
      availability: isRegistrationOpen(s) ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      validFrom: todayISO(),
      url: `${SITE_URL}/jadwal?daftar=${s.id}`,
    },
  }
}

export function courseJsonLd(program: Program, schedules: Schedule[]) {
  const prices = schedules.map((s) => priceNumber(s.price)).filter((p): p is number => p !== null)
  const days = schedules[0] ? durationDays(schedules[0].date_start, schedules[0].date_end) : null
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.name,
    description: program.seoDescription,
    url: `${SITE_URL}/program/${program.slug}`,
    inLanguage: 'id',
    provider: { '@type': 'Organization', name: site.legalName, sameAs: SITE_URL },
    educationalCredentialAwarded: program.certificationLabel,
    teaches: program.outcomes,
    offers: prices.length
      ? [{ '@type': 'Offer', category: 'Paid', price: Math.min(...prices), priceCurrency: 'IDR' }]
      : [{ '@type': 'Offer', category: 'Paid' }],
    hasCourseInstance: schedules.length
      ? schedules.map((s) => ({
          '@type': 'CourseInstance',
          courseMode: 'Onsite',
          startDate: s.date_start,
          endDate: s.date_end,
          location: place(s.location),
          instructor: instructorRef,
          ...(durationDays(s.date_start, s.date_end) && {
            courseWorkload: `P${durationDays(s.date_start, s.date_end)}D`,
          }),
        }))
      : [{ '@type': 'CourseInstance', courseMode: 'Onsite', instructor: instructorRef, ...(days && { courseWorkload: `P${days}D` }) }],
  }
}

export function serviceJsonLd(service: { title: string; seoDescription: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.seoDescription,
    url: `${SITE_URL}/layanan/${service.slug}`,
    provider: { '@id': ORG_ID, '@type': 'Organization', name: site.legalName, url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
  }
}

export function articleJsonLd(insight: Insight, url: string) {
  const published = parseLooseDate(insight.date)
  return {
    '@context': 'https://schema.org',
    '@type': insight.type === 'Berita' ? 'NewsArticle' : 'Article',
    headline: insight.title,
    description: plainExcerpt(insight.excerpt),
    ...(published && { datePublished: published.toISOString() }),
    inLanguage: 'id-ID',
    mainEntityOfPage: url,
    image: [`${SITE_URL}/opengraph-image`],
    author: { '@type': 'Organization', name: 'Tim P3L', url: SITE_URL },
    publisher: { '@id': ORG_ID, '@type': 'Organization', name: site.legalName, logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
  }
}
