import {tooltip} from '@hzblj/zyplot'
import {Chart} from '@hzblj/zyplot/web'
import {
  type QuoteRangeId,
  type QuoteTabId,
  quoteChartStyle,
  quoteRange,
  quoteTabs,
  RevolutChart,
} from '@zyplot/feature-charts/revolut'
import {useMemo, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {AppHeader} from '../components/app-header'
import {contentWidth} from '../theme/tokens'
import {QuoteEventBadge, QuoteReadingCard} from './components/quote-chart-overlay'
import {QuoteSymbolHeader} from './components/quote-nav-bar'
import {QuotePageScroll} from './components/quote-page-scroll'
import {QuotePriceReadout} from './components/quote-price-readout'
import {QuoteRangeSelector} from './components/quote-range-selector'
import {QuoteTabRow} from './components/quote-tab-row'
import {quoteLayout, useQuoteTheme} from './data/quote-theme'
import {QuoteReadingProvider} from './hooks/quote-reading-context'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useQuoteReadout} from './hooks/use-quote-readout'

/** Held at module scope: a new object on every render would rebuild the chart's config with it. */
const READING_TOOLTIP = tooltip.beside({align: 'center', view: QuoteReadingCard})

const TOP = 16

export const RevolutScreen = () => {
  const insets = useSafeAreaInsets()
  const {color, scheme} = useQuoteTheme()
  const [tabId, setTabId] = useState<QuoteTabId>('Overview')
  const [rangeId, setRangeId] = useState<QuoteRangeId>('1d')
  const [isCandlestick, setIsCandlestick] = useState(false)
  const isLoading = useChartPlaceholder()
  const range = quoteRange(rangeId)
  const readout = useQuoteReadout(range)

  // Both views are named as components — one in `tooltip`, one on the event annotation — so this is
  // what they read. Memoized on what actually decides it, which is never the reading itself.
  const reading = useMemo(
    () => ({
      candles: isCandlestick ? range.candles : undefined,
      event: isCandlestick ? undefined : range.event,
      readout,
    }),
    [isCandlestick, range, readout]
  )

  return (
    <View style={[styles.screen, {backgroundColor: color.background, paddingTop: Math.max(insets.top, TOP)}]}>
      {}
      <View style={styles.bar}>
        <View style={[styles.column, styles.header]}>
          <AppHeader palette={{pill: color.pill, pillPressed: color.pillPressed, text: color.text}} />
          <QuoteSymbolHeader />
          <QuoteTabRow onSelect={setTabId} selected={tabId} />
        </View>
      </View>

      <QuotePageScroll
        index={quoteTabs.indexOf(tabId)}
        isScrubbing={readout.isScrubbing}
        onIndexChange={position => setTabId(quoteTabs[position])}
        pages={[
          {
            content: (
              <View style={styles.column}>
                <View style={styles.readout}>
                  <QuotePriceReadout readout={readout} />
                </View>

                <View style={styles.chart}>
                  {}
                  <Chart.Provider colorMode={scheme} theme={quoteChartStyle(scheme).theme}>
                    <QuoteReadingProvider reading={reading}>
                      <RevolutChart
                        eventView={isCandlestick || !range.event ? undefined : QuoteEventBadge}
                        isCandlestick={isCandlestick}
                        isLoading={isLoading}
                        onInteraction={readout.onInteraction}
                        range={range}
                        scheme={scheme}
                        tooltip={READING_TOOLTIP}
                      />
                    </QuoteReadingProvider>
                  </Chart.Provider>
                </View>

                <View style={styles.controls}>
                  <QuoteRangeSelector
                    isCandlestick={isCandlestick}
                    onSelect={setRangeId}
                    onToggleCandlestick={() => setIsCandlestick(current => !current)}
                    selected={rangeId}
                  />
                </View>
              </View>
            ),
            id: 'overview',
          },
          {content: null, id: 'financials'},
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {width: '100%'},
  chart: {marginTop: quoteLayout.chartTop},
  column: {alignSelf: 'center', maxWidth: contentWidth, width: '100%'},
  controls: {marginTop: quoteLayout.controlsTop, paddingHorizontal: quoteLayout.gutter},
  header: {gap: quoteLayout.headerGap, paddingHorizontal: quoteLayout.gutter},
  readout: {marginTop: quoteLayout.readoutTop, paddingHorizontal: quoteLayout.gutter},
  screen: {flex: 1},
})
