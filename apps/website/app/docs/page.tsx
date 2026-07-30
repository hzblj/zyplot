import {DocsPage, docsRouteFor, PLATFORM_COOKIE, readDocsPreferences, VIEW_COOKIE} from '@zyplot/feature-website'
import type {Metadata} from 'next'
import {cookies} from 'next/headers'

const route = docsRouteFor('/docs')

export const metadata: Metadata = {
  alternates: {canonical: '/docs'},
  description: route?.description,
  openGraph: {
    description: route?.description,
    title: route?.title,
    url: '/docs',
  },
  title: route?.title,
}

export default async function DocumentationIndex() {
  const store = await cookies()

  return (
    <DocsPage preferences={readDocsPreferences(store.get(VIEW_COOKIE)?.value, store.get(PLATFORM_COOKIE)?.value)} />
  )
}
