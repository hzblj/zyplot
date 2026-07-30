'use client'

import {type ReactNode, useMemo} from 'react'
import {docsStyles} from '../../docs-styles'
import {cn} from '../../utils'
import {chartImplementations, sourceUrl} from '../chart-implementations'
import {HIGHLIGHTED_SAMPLES} from '../highlighted-samples.generated'
import {CHARTS_VERSION, type DocsPreferences, PLATFORM_COOKIE, VIEW_COOKIE} from '../preferences'
import type {ChartPlatform} from '../types'
import {usePreference} from '../use-preference'

const styles = docsStyles()
const VIEWS = ['preview', 'code'] as const
const WEB_ONLY = ['web'] as const satisfies readonly ChartPlatform[]

const LABELS: Record<ChartPlatform, string> = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
}

export const Example = ({
  children,
  chartId,
  platforms,
  preferences,
  source,
}: {
  children: ReactNode
  chartId?: string
  platforms?: readonly ChartPlatform[]
  preferences: DocsPreferences
  source: string
}) => {
  const available = useMemo(() => (chartId ? (platforms ?? []) : []), [chartId, platforms])
  const [tab, setTab] = usePreference<'code' | 'preview'>(preferences.view, VIEW_COOKIE, VIEWS)
  const [platform, setPlatform] = usePreference<ChartPlatform>(
    preferences.platform,
    PLATFORM_COOKIE,
    available.length > 0 ? available : WEB_ONLY
  )

  const implementation = chartId ? chartImplementations[chartId]?.[platform] : undefined
  const highlighted = HIGHLIGHTED_SAMPLES[source]

  return (
    <div className={styles.example()}>
      <div className={styles.exampleBar()}>
        <div aria-label="Example view" className={styles.tabs()} role="tablist">
          {(['preview', 'code'] as const).map(value => (
            <button
              aria-selected={tab === value}
              className={cn(styles.tab(), tab === value ? styles.tabActive() : styles.tabInactive())}
              key={value}
              onClick={() => setTab(value)}
              role="tab"
              type="button"
            >
              {value === 'preview' ? 'Preview' : 'Code'}
            </button>
          ))}
        </div>
        {available.length > 1 ? (
          <div aria-label="Platform" className={styles.tabs()} role="tablist">
            {available.map(value => (
              <button
                aria-selected={platform === value}
                className={cn(styles.tab(), platform === value ? styles.tabActive() : styles.tabInactive())}
                data-analytics="chart_platform"
                data-analytics-chart={chartId}
                data-analytics-platform={value}
                key={value}
                onClick={() => setPlatform(value)}
                role="tab"
                type="button"
              >
                {LABELS[value]}
              </button>
            ))}
          </div>
        ) : (
          <span>Web</span>
        )}
      </div>

      {tab === 'code' ? (
        highlighted ? (
          <div className={styles.exampleCode()} dangerouslySetInnerHTML={{__html: highlighted}} />
        ) : (
          <pre className={styles.exampleCode()}>
            <code>{source}</code>
          </pre>
        )
      ) : platform === 'web' || !chartId ? (
        <div className={styles.examplePreview()}>{children}</div>
      ) : (
        <div className={styles.galleryStage()}>
          <img
            alt={`${chartId} chart rendered on ${LABELS[platform]}`}
            className={styles.galleryImageLight()}
            loading="lazy"
            src={`/charts/${platform}/light/${chartId}.png?v=${CHARTS_VERSION}`}
          />
          <img
            alt=""
            className={styles.galleryImageDark()}
            loading="lazy"
            src={`/charts/${platform}/dark/${chartId}.png?v=${CHARTS_VERSION}`}
          />
        </div>
      )}

      {tab === 'preview' && implementation && (
        <p className={styles.galleryMeta()}>
          {implementation.detail}
          {' · '}
          <a href={sourceUrl(implementation.path)} rel="noreferrer" target="_blank">
            View source
          </a>
        </p>
      )}
    </div>
  )
}
