import {Host, VStack} from '@expo/ui/swift-ui'
import {padding} from '@expo/ui/swift-ui/modifiers'
import {useRouter} from 'expo-router'
import {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {QuoteChartOverlay} from './components/quote-chart-overlay'
import {QuoteNavBar, QuoteSymbolHeader} from './components/quote-nav-bar.ios'
import {QuotePageView} from './components/quote-page-view'
import {QuotePriceReadout} from './components/quote-price-readout.ios'
import {QuoteRangeSelector} from './components/quote-range-selector.ios'
import {QuoteTabRow} from './components/quote-tab-row.ios'
import {RevolutChart} from './components/revolut-chart'
import {type QuoteRangeId, type QuoteTabId, quoteRange, quoteTabs} from './data/quote-data'
import {quoteLayout, useQuoteTheme} from './data/quote-theme'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useQuoteReadout} from './hooks/use-quote-readout'

export const RevolutScreen = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {color} = useQuoteTheme()
  const [tabId, setTabId] = useState<QuoteTabId>('Overview')
  const [rangeId, setRangeId] = useState<QuoteRangeId>('1d')
  const [isCandlestick, setIsCandlestick] = useState(false)
  const isLoading = useChartPlaceholder()
  const range = quoteRange(rangeId)
  const readout = useQuoteReadout(range)

  return (
    <View style={[styles.screen, {backgroundColor: color.background, paddingTop: insets.top}]}>
      <Host matchContents style={styles.host}>
        <VStack alignment="leading" modifiers={[padding({horizontal: quoteLayout.gutter})]} spacing={16}>
          <QuoteNavBar onBack={() => router.back()} />
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
                  <RevolutChart
                    isCandlestick={isCandlestick}
                    isLoading={isLoading}
                    onInteraction={readout.onInteraction}
                    range={range}
                  />
                  <QuoteChartOverlay
                    candles={isCandlestick ? range.candles : undefined}
                    event={isCandlestick ? undefined : range.event}
                    readout={readout}
                  />
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
  readout: {marginTop: quoteLayout.readoutTop, width: '100%'},
  screen: {flex: 1},
})
