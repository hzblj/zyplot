import './styles.css'

import {AnalyticsEvents, HERO_HEADLINE, HERO_LEDE} from '@zyplot/feature-website'
import type {Metadata} from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import type {ReactNode} from 'react'
import {GA_MEASUREMENT_ID, SITE_NAME, SITE_URL} from './site'

export const metadata: Metadata = {
  alternates: {canonical: '/'},
  description: HERO_LEDE,
  icons: {
    apple: {
      sizes: '180x180',
      type: 'image/png',
      url: '/favicon/favicon-180.png',
    },
    icon: [
      {sizes: 'any', url: '/favicon.ico'},
      {sizes: '16x16', type: 'image/png', url: '/favicon/favicon-16.png'},
      {sizes: '32x32', type: 'image/png', url: '/favicon/favicon-32.png'},
      {sizes: '48x48', type: 'image/png', url: '/favicon/favicon-48.png'},
      {sizes: '64x64', type: 'image/png', url: '/favicon/favicon-64.png'},
      {sizes: '192x192', type: 'image/png', url: '/favicon/favicon-192.png'},
      {sizes: '512x512', type: 'image/png', url: '/favicon/favicon-512.png'},
    ],
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: HERO_LEDE,
    images: [
      {
        alt: `${SITE_NAME} — ${HERO_HEADLINE}`,
        height: 630,
        url: '/og.png',
        width: 1200,
      },
    ],
    locale: 'en_US',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${HERO_HEADLINE}`,
    type: 'website',
    url: '/',
  },
  robots: {
    follow: true,
    googleBot: {follow: true, index: true, 'max-image-preview': 'large'},
    index: true,
  },
  title: {
    default: `${SITE_NAME} — ${HERO_HEADLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  twitter: {
    card: 'summary_large_image',
    description: HERO_LEDE,
    images: ['/og.png'],
    title: `${SITE_NAME} — ${HERO_HEADLINE}`,
  },
}

const inter = localFont({
  display: 'swap',
  src: [
    {
      path: '../public/fonts/InterVariable.woff2',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: '../public/fonts/InterVariable-Italic.woff2',
      style: 'italic',
      weight: '100 900',
    },
  ],
  variable: '--font-zyplot-inter',
})

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html
      className={`${inter.className} ${inter.variable}`}
      data-scroll-behavior="smooth"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <Script id="theme" strategy="beforeInteractive">
          {
            'try{const t=localStorage.getItem("zyplot-theme");const d=t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.classList.toggle("light",!d)}catch{}'
          }
        </Script>
      </head>
      <body
        style={{
          fontFamily: "var(--font-zyplot-inter), system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        {children}
        <AnalyticsEvents />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}')`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
