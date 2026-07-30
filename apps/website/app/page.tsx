import {HERO_HEADLINE, HERO_LEDE, MarketingPage} from '@zyplot/feature-website'
import type {Metadata} from 'next'
import {REPOSITORY_URL, SITE_NAME, SITE_URL} from './site'

export const metadata: Metadata = {
  alternates: {canonical: '/'},
  description: HERO_LEDE,
  title: {absolute: `${SITE_NAME} — ${HERO_HEADLINE}`},
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@id': `${SITE_URL}/#website`,
      '@type': 'WebSite',
      description: HERO_LEDE,
      inLanguage: 'en',
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      '@id': `${SITE_URL}/#software`,
      '@type': 'SoftwareApplication',
      applicationCategory: 'DeveloperApplication',
      description: HERO_LEDE,
      isAccessibleForFree: true,
      name: SITE_NAME,
      offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
      operatingSystem: 'Web, iOS, Android',
      url: SITE_URL,
    },
    {
      '@id': `${SITE_URL}/#repository`,
      '@type': 'SoftwareSourceCode',
      codeRepository: REPOSITORY_URL,
      name: `${SITE_NAME} source`,
      programmingLanguage: ['TypeScript', 'Swift', 'Kotlin'],
    },
  ],
}

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}} type="application/ld+json" />
      <MarketingPage />
    </>
  )
}
