import {Column, Host} from '@expo/ui/jetpack-compose'
import {padding} from '@expo/ui/jetpack-compose/modifiers'
import {type QuoteRangeId, type QuoteTabId, quoteRange, quoteTabs, RevolutChart} from '@zyplot/feature-charts/revolut'
import {useRouter} from 'expo-router'
import {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {QuoteChartOverlay} from './components/quote-chart-overlay'
import {QuoteNavBar, QuoteSymbolHeader} from './components/quote-nav-bar.android'
import {QuotePageView} from './components/quote-page-view'
import {QuotePriceReadout} from './components/quote-price-readout.android'
import {QuoteRangeSelector} from './components/quote-range-selector.android'
import {QuoteTabRow} from './components/quote-tab-row.android'
import {quoteLayout, useQuoteTheme} from './data/quote-theme'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useQuoteReadout} from './hooks/use-quote-readout'

export const RevolutScreen = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {color, scheme} = useQuoteTheme()
  const [tabId, setTabId] = useState<QuoteTabId>('Overview')
  const [rangeId, setRangeId] = useState<QuoteRangeId>('1d')
  const [isCandlestick, setIsCandlestick] = useState(false)
  const isLoading = useChartPlaceholder()
  const range = quoteRange(rangeId)
  const readout = useQuoteReadout(range)

  return (
    <View style={[styles.screen, {backgroundColor: color.background, paddingTop: insets.top}]}>
      <Host matchContents style={styles.host}>
        <Column
          modifiers={[padding(quoteLayout.gutter, 0, quoteLayout.gutter, 0)]}
          verticalArrangement={{spacedBy: quoteLayout.headerGap}}
        >
          <QuoteNavBar onBack={() => router.back()} />
          <QuoteSymbolHeader />
          <QuoteTabRow onSelect={setTabId} selected={tabId} />
        </Column>
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
                  <Column modifiers={[padding(quoteLayout.gutter, 0, quoteLayout.gutter, 0)]}>
                    <QuotePriceReadout readout={readout} />
                  </Column>
                </Host>

                <View style={styles.chart}>
                  <RevolutChart
                    isCandlestick={isCandlestick}
                    isLoading={isLoading}
                    onInteraction={readout.onInteraction}
                    range={range}
                    scheme={scheme}
                  />
                  <QuoteChartOverlay
                    candles={isCandlestick ? range.candles : undefined}
                    event={isCandlestick ? undefined : range.event}
                    readout={readout}
                  />
                </View>

                <Host matchContents style={styles.controls}>
                  <Column modifiers={[padding(quoteLayout.gutter, 0, quoteLayout.gutter, 0)]}>
                    <QuoteRangeSelector
                      isCandlestick={isCandlestick}
                      onSelect={setRangeId}
                      onToggleCandlestick={() => setIsCandlestick(current => !current)}
                      selected={rangeId}
                    />
                  </Column>
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
  readout: {marginTop: quoteLayout.readoutTop, width: '100%'},
  screen: {flex: 1},
})
