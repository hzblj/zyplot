import {NotFoundPage} from '@zyplot/feature-website'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  description: 'The page you were looking for does not exist. Start from the documentation instead.',
  robots: {follow: true, index: false},
  title: 'Page not found',
}

export default function NotFound() {
  return <NotFoundPage />
}
