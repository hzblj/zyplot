import type {NextConfig} from 'next'

const config: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  redirects: async () => [{destination: '/docs/hooks/use-chart-scrub', permanent: true, source: '/docs/hooks'}],
  transpilePackages: ['@hzblj/zyplot', '@hzblj/zyplot-core', '@zyplot/feature-charts', '@zyplot/feature-website'],
}

export default config
