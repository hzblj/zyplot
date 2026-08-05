'use client'

import {Chart, useChartScrub, zyplot} from '@hzblj/zyplot'
import {KrakenChart, krakenColors, krakenRange} from '@zyplot/feature-charts/kraken'
import {quoteChartStyle, quoteColors, quoteRange, RevolutChart} from '@zyplot/feature-charts/revolut'
import {useState} from 'react'
import {CandlesIcon, LineChartIcon} from './icons'
import {marketingStyles} from './marketing-styles'
import {QuoteEventCard} from './quote-event-card'
import {useColorScheme} from './use-color-scheme'
import {cn} from './utils'

const styles = marketingStyles()

const CHART_HEIGHT = 340

const THEMES = [
  {id: 'default', label: 'Default'},
  {id: 'stocks', label: 'Stocks'},
  {id: 'crypto', label: 'Crypto'},
] as const

type DemoTheme = (typeof THEMES)[number]['id']

const demoChart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  height: CHART_HEIGHT,
  isLoading: false,
  series: [z.series({id: 'signal', label: 'Signal', slot: 1, values: [18, 29, 24, 46, 55, 72, 68, 91]})],
}))

const stocksRange = quoteRange('1m')
const cryptoRange = krakenRange('24h')

export const ChartDemo = () => {
  const scheme = useColorScheme()
  const [theme, setTheme] = useState<DemoTheme>('default')
  const [isCandlestick, setIsCandlestick] = useState(false)
  const stocks = useChartScrub()

  const surface = {
    crypto: krakenColors[scheme].card,
    default: undefined,
    stocks: quoteColors[scheme].background,
  }[theme]

  return (
    <div
      className={cn(styles.chartCard(), surface ? undefined : 'bg-chart-surface')}
      style={surface ? {backgroundColor: surface} : undefined}
    >
      <div className={styles.chartHeader()}>
        <div aria-label="Chart theme" className={styles.tabs()} role="tablist">
          {THEMES.map(({id, label}) => (
            <button
              aria-selected={theme === id}
              className={cn(styles.tab(), theme === id ? styles.tabActive() : styles.tabInactive())}
              data-analytics="chart_demo_theme"
              data-analytics-theme={id}
              key={id}
              onClick={() => setTheme(id)}
              role="tab"
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        {theme === 'stocks' && (
          <button
            aria-label={isCandlestick ? 'Show the line chart' : 'Show the candlestick chart'}
            aria-pressed={isCandlestick}
            className={styles.chartToggle()}
            data-analytics="chart_demo_candles"
            data-analytics-view={isCandlestick ? 'line' : 'candles'}
            onClick={() => setIsCandlestick(current => !current)}
            type="button"
          >
            {isCandlestick ? (
              <LineChartIcon className={styles.chartToggleIcon()} />
            ) : (
              <CandlesIcon className={styles.chartToggleIcon()} />
            )}
          </button>
        )}
      </div>

      {theme === 'default' && <Chart.Line {...demoChart} />}

      {theme === 'stocks' && (
        <div className="relative">
          <Chart.Provider colorMode={scheme} theme={quoteChartStyle(scheme).theme}>
            <RevolutChart
              height={CHART_HEIGHT}
              isCandlestick={isCandlestick}
              isEventBadgeVisible
              isLoading={false}
              onInteraction={stocks.onInteraction}
              range={stocksRange}
              scheme={scheme}
              tooltip
            />
          </Chart.Provider>
          {!isCandlestick && stocksRange.event && (
            <QuoteEventCard
              category={stocks.selection?.category}
              event={stocksRange.event}
              geometry={stocks.geometry}
            />
          )}
        </div>
      )}

      {theme === 'crypto' && (
        <Chart.Provider colorMode={scheme}>
          <KrakenChart height={CHART_HEIGHT} isLatestRead isLoading={false} range={cryptoRange} scheme={scheme} />
        </Chart.Provider>
      )}
    </div>
  )
}
