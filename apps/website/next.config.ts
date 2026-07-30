import type {NextConfig} from 'next'

const config: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  /** `/docs/hooks` shipped as one page before the two hooks got one each. */
  redirects: async () => [{destination: '/docs/hooks/use-chart-scrub', permanent: true, source: '/docs/hooks'}],
  transpilePackages: ['@hzblj/zyplot', '@hzblj/zyplot-core', '@zyplot/feature-website'],
}

export default config
