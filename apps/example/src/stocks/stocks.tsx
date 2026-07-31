import {Chart} from '@hzblj/zyplot/web'
import {type StocksRangeId, stocksRange} from '@zyplot/feature-charts/stocks'
import {useState} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {AppHeader} from '../components/app-header'
import {contentWidth} from '../theme/tokens'
import {StocksChartPanel} from './components/stocks-chart-panel'
import {StocksHeader} from './components/stocks-header'
import {StocksStats} from './components/stocks-stats'
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
          <View style={styles.column}>
            <View style={[styles.gutter, styles.nav]}>
              <AppHeader palette={{pill: color.pill, pillPressed: color.pillActive, text: color.text}} />
            </View>

            <View style={[styles.gutter, styles.header]}>
              <StocksHeader range={range} readout={readout} />
            </View>

            {}
            <Chart.Provider colorMode={scheme}>
              <StocksChartPanel
                onSelect={setRangeId}
                range={range}
                readout={readout}
                scheme={scheme}
                selected={rangeId}
              />
            </Chart.Provider>

            <View style={styles.stats}>
              <StocksStats />
            </View>

            <View style={{height: insets.bottom + 32}} />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  column: {alignSelf: 'center', maxWidth: contentWidth, width: '100%'},
  gutter: {paddingHorizontal: stocksLayout.gutter},
  header: {marginTop: 6},
  nav: {marginTop: 10},
  screen: {flex: 1},
  sheet: {
    borderTopLeftRadius: stocksLayout.sheetRadius,
    borderTopRightRadius: stocksLayout.sheetRadius,
    flex: 1,
    overflow: 'hidden',
  },
  stats: {marginTop: 18},
})
