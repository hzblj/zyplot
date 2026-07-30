import {DocsPage, docsRouteFor, PLATFORM_COOKIE, readDocsPreferences, VIEW_COOKIE} from '@zyplot/feature-website'
import type {Metadata} from 'next'
import {cookies} from 'next/headers'
import {notFound} from 'next/navigation'

type DocumentationPageProps = {
  params: Promise<{slug: string[]}>
}

const NESTED_GROUPS = new Set(['apps', 'charts', 'hooks'])

const pageFor = (slug: string[]): string => {
  if (NESTED_GROUPS.has(slug[0])) {
    return slug[1]
  }

  if (slug[0] === 'web') {
    return 'web-package'
  }

  if (slug[0] === 'native') {
    return slug[1] ? `native-${slug[1]}` : 'native-package'
  }

  return slug[0]
}

export const generateMetadata = async ({params}: DocumentationPageProps): Promise<Metadata> => {
  const {slug} = await params
  const href = `/docs/${slug.join('/')}`
  const route = docsRouteFor(href)

  if (!route) {
    return {}
  }

  return {
    alternates: {canonical: href},
    description: route.description,
    openGraph: {
      description: route.description,
      title: route.title,
      type: 'article',
      url: href,
    },
    title: route.title,
  }
}

export default async function DocumentationPage({params}: DocumentationPageProps) {
  const [{slug}, store] = await Promise.all([params, cookies()])

  if (!docsRouteFor(`/docs/${slug.join('/')}`)) {
    notFound()
  }

  return (
    <DocsPage
      page={pageFor(slug)}
      preferences={readDocsPreferences(store.get(VIEW_COOKIE)?.value, store.get(PLATFORM_COOKIE)?.value)}
    />
  )
}
