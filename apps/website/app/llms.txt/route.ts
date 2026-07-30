import {DOCS_ROUTES, HERO_LEDE} from '@zyplot/feature-website'
import {REPOSITORY_URL, SITE_NAME, SITE_URL} from '../site'

/**
 * The llmstxt.org index: every docs page, with the description its own metadata
 * already carries. Generated from the route table rather than written by hand, so
 * a page added to the docs cannot be missing from the file agents read.
 */
export const dynamic = 'force-static'

const entry = ({description, href, title}: {description: string; href: string; title: string}) =>
  `- [${title}](${SITE_URL}${href}): ${description}`

const body = [
  `# ${SITE_NAME}`,
  '',
  `> ${HERO_LEDE}`,
  '',
  'One npm package renders through ECharts and uPlot in the DOM, Swift Charts on iOS and a',
  'Jetpack Compose Canvas on Android, behind a single serializable props contract. Twenty-one',
  'chart forms exist on all three platforms, and each native platform adds two of its own.',
  '',
  '## Guides',
  '',
  ...DOCS_ROUTES.filter(route => route.isGuide).map(entry),
  '',
  '## Charts',
  '',
  ...DOCS_ROUTES.filter(route => !route.isGuide).map(entry),
  '',
  '## Optional',
  '',
  `- [llms-full.txt](${SITE_URL}/llms-full.txt): the whole documentation as one file`,
  `- [Repository](${REPOSITORY_URL}): source, issues and releases`,
  '',
].join('\n')

export const GET = () =>
  new Response(body, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
