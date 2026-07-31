import {Host, VStack} from '@expo/ui/swift-ui'
import {padding} from '@expo/ui/swift-ui/modifiers'
import {type StocksRangeId, stocksRange} from '@zyplot/feature-charts/stocks'
import {useState} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {AppHeader} from '../components/app-header'
import {StocksChartPanel} from './components/stocks-chart-panel'
import {StocksHeader} from './components/stocks-header.ios'
import {StocksStats} from './components/stocks-stats.ios'
import {StocksTicker} from './components/stocks-ticker'
import {stocksLayout, useStocksTheme} from './data/stocks-theme'
import {useStocksReadout} from './hooks/use-stocks-readout'

export const StocksScreen = () => {
  const insets = useSafeAreaInsets()
  const {color, scheme} = useStocksTheme()
  const [rangeId, setRangeId] = useState<StocksRangeId>('1m')
  const range = stocksRange(rangeId)
  const readout = useStocksReadout(range)

  return (
    <View style={[styles.screen, {backgroundColor: color.background, paddingTop: insets.top}]}>
      <StocksTicker />

      <View style={[styles.sheet, {backgroundColor: color.sheet}]}>
        <ScrollView scrollEnabled={!readout.isReading} showsVerticalScrollIndicator={false}>
          <View style={styles.nav}>
            <AppHeader palette={{pill: color.pill, pillPressed: color.pillActive, text: color.text}} />
          </View>

          <Host matchContents style={[styles.host, styles.header]}>
            <VStack alignment="leading" modifiers={[padding({horizontal: stocksLayout.gutter})]}>
              <StocksHeader range={range} readout={readout} />
            </VStack>
          </Host>

          {}
          <StocksChartPanel onSelect={setRangeId} range={range} readout={readout} scheme={scheme} selected={rangeId} />

          <View style={styles.stats}>
            <StocksStats />
          </View>

          <View style={{height: insets.bottom + 32}} />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {marginTop: 6},
  host: {width: '100%'},
  nav: {marginTop: 10, paddingHorizontal: stocksLayout.gutter},
  screen: {flex: 1},
  sheet: {
    borderTopLeftRadius: stocksLayout.sheetRadius,
    borderTopRightRadius: stocksLayout.sheetRadius,
    flex: 1,
    overflow: 'hidden',
  },
  stats: {marginTop: 18},
})
