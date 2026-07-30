import {readFileSync} from 'node:fs'
import {join} from 'node:path'

/**
 * The whole documentation as one markdown file, for an agent that would otherwise
 * crawl thirty-odd pages to answer one question.
 *
 * It is written by hand in `content/llms-full.md` rather than derived from the
 * docs page: the docs are JSX, and flattening them mechanically produces prose
 * that reads like a scrape. Read at build time — the route is static, so nothing
 * touches the filesystem when a request arrives.
 */
export const dynamic = 'force-static'

const body = readFileSync(join(process.cwd(), 'content/llms-full.md'), 'utf8')

export const GET = () =>
  new Response(body, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
