'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {docsStyles} from '../../docs-styles'
import {cn} from '../../utils'
import type {ChartGroup} from '../chart-groups'

const styles = docsStyles()

type NavChart = {id: string; name: string}

type DocsNavProps = {
  chartGroups: ChartGroup<NavChart>[]
  label: string
}

type NavGroup = {
  label: string
  links: [href: string, label: string][]
}

const leadingGroups: NavGroup[] = [
  {
    label: 'Getting started',
    links: [
      ['/docs', 'Quick start'],
      ['/docs/installation', 'Installation'],
    ],
  },
  {
    label: 'Core concepts',
    links: [
      ['/docs/builders', 'Builders'],
      ['/docs/theming', 'Theming'],
    ],
  },
]

const trailingGroups: NavGroup[] = [
  {
    label: 'Complete examples',
    links: [
      ['/docs/apps/revolut', 'Revolut'],
      ['/docs/apps/kraken', 'Kraken'],
      ['/docs/apps/family', 'Family'],
      ['/docs/apps/health', 'Health'],
      ['/docs/apps/stocks', 'Stocks'],
    ],
  },
  {
    label: 'Guides',
    links: [
      ['/docs/loading-states', 'Loading states'],
      ['/docs/web', 'Web renderer'],
      ['/docs/composition', 'Frame and legend'],
      ['/docs/native', 'Native setup'],
      ['/docs/native/ios', 'iOS'],
      ['/docs/native/android', 'Android'],
    ],
  },
  {
    label: 'Hooks',
    links: [
      ['/docs/hooks/use-chart-scrub', 'useChartScrub'],
      ['/docs/hooks/use-last-reading', 'useLastReading'],
    ],
  },
  {
    label: 'Reference',
    links: [
      ['/docs/data-types', 'Data types'],
      ['/docs/releases', 'Releases'],
      ['/docs/changelog', 'Changelog'],
    ],
  },
]

const resourceLinks: [href: string, label: string][] = [
  ['/llms.txt', 'llms.txt'],
  ['/llms-full.txt', 'llms-full.txt'],
]

export const DocsNav = ({chartGroups, label}: DocsNavProps) => {
  const pathname = usePathname()
  const navLinkFor = (href: string) =>
    cn(styles.navLink(), pathname === href ? styles.navLinkActive() : styles.navLinkInactive())

  const renderGroup = (group: NavGroup) => (
    <div className={styles.navGroup()} key={group.label}>
      <p className={styles.navGroupLabel()}>{group.label}</p>
      {group.links.map(([href, text]) => (
        <Link className={navLinkFor(href)} href={href} key={href}>
          {text}
        </Link>
      ))}
    </div>
  )

  return (
    <nav aria-label={label} className="grid">
      {leadingGroups.map(renderGroup)}
      <div className={styles.navGroup()}>
        <p className={styles.navGroupLabel()}>Charts</p>
        {chartGroups.map(group => (
          <div className={styles.navSubGroup()} key={group.label}>
            <p className={styles.navSubGroupLabel()}>{group.label}</p>
            {group.charts.map(chart => (
              <Link className={navLinkFor(`/docs/charts/${chart.id}`)} href={`/docs/charts/${chart.id}`} key={chart.id}>
                {chart.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
      {trailingGroups.map(renderGroup)}
      <div className={styles.navGroup()}>
        <p className={styles.navGroupLabel()}>Resources</p>
        {resourceLinks.map(([href, text]) => (
          <a className={cn(styles.navLink(), styles.navLinkInactive())} href={href} key={href}>
            {text}
          </a>
        ))}
      </div>
    </nav>
  )
}
