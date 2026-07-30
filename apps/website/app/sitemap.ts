import {DOCS_ROUTES} from '@zyplot/feature-website'
import type {MetadataRoute} from 'next'
import {SITE_URL} from './site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      changeFrequency: 'monthly',
      lastModified,
      priority: 1,
      url: SITE_URL,
    },
    ...DOCS_ROUTES.map(route => ({
      changeFrequency: 'monthly' as const,
      lastModified,
      priority: route.isGuide ? 0.8 : 0.5,
      url: `${SITE_URL}${route.href}`,
    })),
  ]
}
