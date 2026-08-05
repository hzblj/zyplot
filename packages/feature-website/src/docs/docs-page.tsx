'use client'

import Link from 'next/link'
import type {ReactNode} from 'react'
import {CoffeeMark} from '../coffee-mark'
import {docsStyles} from '../docs-styles'
import {GithubMark} from '../github-mark'
import {COFFEE_URL, REPOSITORY_URL} from '../links'
import {MobileNav} from '../mobile-nav'
import {ThemeToggle} from '../theme-toggle'
import {Wordmark} from '../wordmark'
import {chartDocs, chartGroups, chartIds} from './chart-docs'
import {ChartSection} from './components/chart-section'
import {DocsNav} from './components/docs-nav'
import {DocsToc} from './components/docs-toc'
import {GuideContent} from './guide-content'
import {guidePageHeadings, guidePages} from './guide-pages'
import {DEFAULT_PREFERENCES, type DocsPreferences} from './preferences'
import {docsHrefForPage} from './routes'

const styles = docsStyles()

const supportLinks = (
  <>
    <a
      className={styles.sidebarFooterLink()}
      data-analytics="github_click"
      data-analytics-placement="docs"
      href={REPOSITORY_URL}
    >
      <GithubMark className={styles.sidebarFooterMark()} />
      GitHub
    </a>
    <a
      className={styles.sidebarFooterLink()}
      data-analytics="coffee_click"
      data-analytics-placement="docs"
      href={COFFEE_URL}
    >
      <CoffeeMark className={styles.sidebarFooterMark()} />
      Buy me a coffee
    </a>
  </>
)

export const DocsLayout = ({children}: {children: ReactNode}) => (
  <div className={styles.site()}>
    <header className={styles.mobileHeader()}>
      <div className={styles.mobileHeaderBrand()}>
        <Link className={styles.brandLink()} href="/">
          <Wordmark className={styles.wordmark()} />
        </Link>
        <span className={styles.brandLabel()}>Docs</span>
      </div>
      <div className={styles.mobileHeaderActions()}>
        <ThemeToggle />
        <MobileNav>
          <DocsNav chartGroups={chartGroups} label="Documentation menu" />
          <div className={styles.sidebarFooter()}>{supportLinks}</div>
        </MobileNav>
      </div>
    </header>

    <div className={styles.themeCorner()}>
      <div className={styles.themeCornerInner()}>
        <ThemeToggle />
      </div>
    </div>

    <aside className={styles.sidebar()}>
      <div className={styles.sidebarTop()}>
        <div className={styles.sidebarBrand()}>
          <Link className={styles.brandLink()} href="/">
            <Wordmark className={styles.wordmark()} />
          </Link>
          <span className={styles.brandLabel()}>Docs</span>
        </div>
      </div>
      <DocsNav chartGroups={chartGroups} label="Documentation" />
      <div className={styles.sidebarFooter()}>{supportLinks}</div>
    </aside>

    {children}
  </div>
)

export const DocsPage = ({
  page = 'introduction',
  preferences = DEFAULT_PREFERENCES,
}: {
  page?: string
  preferences?: DocsPreferences
}) => {
  const currentChart = chartDocs.find(chart => chart.id === page)
  const pageIndex = Math.max(0, guidePages.indexOf(page))
  const previousPage = guidePages[pageIndex - 1]
  const nextPage = guidePages[pageIndex + 1]
  const headings = currentChart
    ? [
        {id: currentChart.id, label: currentChart.name},
        {id: `${currentChart.id}-props`, label: 'Configuration'},
      ]
    : (guidePageHeadings[page] ?? guidePageHeadings.introduction)

  return (
    <>
      <main className={styles.content()}>
        {currentChart ? <ChartSection chart={currentChart} preferences={preferences} /> : <GuideContent page={page} />}

        <nav aria-label="Documentation pages" className={styles.pager()}>
          {previousPage ? (
            <Link className={styles.pagerLink()} href={docsHrefForPage(previousPage, chartIds)}>
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          {nextPage && (
            <Link className={styles.pagerLink()} href={docsHrefForPage(nextPage, chartIds)}>
              Next →
            </Link>
          )}
        </nav>
      </main>
      <DocsToc headings={headings} />
    </>
  )
}
