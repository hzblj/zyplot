import {Host, VStack} from '@expo/ui/swift-ui'
import {padding} from '@expo/ui/swift-ui/modifiers'
import {tooltip} from '@hzblj/zyplot'
import {type QuoteRangeId, type QuoteTabId, quoteRange, quoteTabs, RevolutChart} from '@zyplot/feature-charts/revolut'
import {useMemo, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {AppHeader} from '../components/app-header'
import {QuoteEventBadge, QuoteReadingCard} from './components/quote-chart-overlay'
import {QuoteSymbolHeader} from './components/quote-nav-bar.ios'
import {QuotePageView} from './components/quote-page-view'
import {QuotePriceReadout} from './components/quote-price-readout.ios'
import {QuoteRangeSelector} from './components/quote-range-selector.ios'
import {QuoteTabRow} from './components/quote-tab-row.ios'
import {quoteLayout, useQuoteTheme} from './data/quote-theme'
import {QuoteReadingProvider} from './hooks/quote-reading-context'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useQuoteReadout} from './hooks/use-quote-readout'

/** Held at module scope: a new object on every render would rebuild the chart's config with it. */
const READING_TOOLTIP = tooltip.beside({align: 'center', view: QuoteReadingCard})

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
    <View style={[styles.screen, {backgroundColor: color.background, paddingTop: insets.top}]}>
      <View style={styles.nav}>
        <AppHeader palette={{pill: color.pill, pillPressed: color.pillPressed, text: color.text}} />
      </View>

      <Host matchContents style={styles.host}>
        <VStack alignment="leading" modifiers={[padding({horizontal: quoteLayout.gutter})]} spacing={16}>
          <QuoteSymbolHeader />
          <QuoteTabRow onSelect={setTabId} selected={tabId} />
        </VStack>
      </Host>

      <QuotePageView
        index={quoteTabs.indexOf(tabId)}
        isScrubbing={readout.isScrubbing}
        onIndexChange={position => setTabId(quoteTabs[position])}
        pages={[
          {
            content: (
              <>
                <Host matchContents style={styles.readout}>
                  <VStack alignment="leading" modifiers={[padding({horizontal: quoteLayout.gutter})]}>
                    <QuotePriceReadout readout={readout} />
                  </VStack>
                </Host>

                <View style={styles.chart}>
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
                </View>

                <Host matchContents style={styles.controls}>
                  <VStack modifiers={[padding({horizontal: quoteLayout.gutter})]}>
                    <QuoteRangeSelector
                      isCandlestick={isCandlestick}
                      onSelect={setRangeId}
                      onToggleCandlestick={() => setIsCandlestick(current => !current)}
                      selected={rangeId}
                    />
                  </VStack>
                </Host>
              </>
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
  chart: {marginTop: quoteLayout.chartTop},
  controls: {marginTop: quoteLayout.controlsTop, width: '100%'},
  host: {width: '100%'},
  nav: {paddingBottom: 16, paddingHorizontal: quoteLayout.gutter},
  readout: {marginTop: quoteLayout.readoutTop, width: '100%'},
  screen: {flex: 1},
})
