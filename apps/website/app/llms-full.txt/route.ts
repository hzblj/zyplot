import {readFileSync} from 'node:fs'
import {join} from 'node:path'

export const dynamic = 'force-static'
const body = readFileSync(join(process.cwd(), 'content/llms-full.md'), 'utf8')
export const GET = () =>
  new Response(body, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
