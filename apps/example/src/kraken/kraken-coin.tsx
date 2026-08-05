import {tooltip} from '@hzblj/zyplot'
import {Chart} from '@hzblj/zyplot/web'
import {
  KrakenChart,
  type KrakenCoin,
  type KrakenRangeId,
  krakenRange,
  krakenReading,
} from '@zyplot/feature-charts/kraken'
import {useMemo, useState} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {AppHeader} from '../components/app-header'
import {contentWidth} from '../theme/tokens'
import {KrakenExtremes} from './components/kraken-extremes'
import {KrakenPriceReadout} from './components/kraken-price-readout'
import {KrakenRangeTabs} from './components/kraken-range-tabs'
import {KrakenReadingChip} from './components/kraken-reading-chip'
import {krakenLayout, useKrakenTheme} from './data/kraken-theme'
import {KrakenReadingProvider} from './hooks/kraken-reading-context'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useKrakenReadout} from './hooks/use-kraken-readout'

/** Held at module scope: a new object on every render would rebuild the chart's config with it. */
const READING_TOOLTIP = tooltip.above({view: KrakenReadingChip})

const TOP = 12

export const KrakenCoinScreen = ({coin}: {coin: KrakenCoin}) => {
  const insets = useSafeAreaInsets()
  const {color, scheme} = useKrakenTheme()
  const [rangeId, setRangeId] = useState<KrakenRangeId>('24h')
  const isLoading = useChartPlaceholder()
  const range = krakenRange(rangeId)
  const reading = useMemo(() => krakenReading(range), [range])
  const readout = useKrakenReadout(coin, range)

  return (
    <ScrollView scrollEnabled={!readout.isScrubbing} style={[styles.screen, {backgroundColor: color.background}]}>
      <View style={[styles.column, {paddingTop: Math.max(insets.top, TOP)}]}>
        <View style={styles.gutter}>
          <AppHeader palette={{pill: color.pill, pillPressed: color.pillPressed, text: color.text}} />
        </View>

        <View style={[styles.gutter, styles.readout]}>
          <KrakenPriceReadout coin={coin} readout={readout} />
        </View>

        {}
        <View style={styles.chart}>
          {}
          <Chart.Provider colorMode={scheme}>
            <KrakenReadingProvider readout={readout}>
              <KrakenChart
                tooltip={READING_TOOLTIP}
                isLatestRead={readout.isOnLatest}
                isLoading={isLoading}
                onInteraction={readout.onInteraction}
                range={range}
                scheme={scheme}
              />
            </KrakenReadingProvider>
          </Chart.Provider>
        </View>

        <View style={[styles.gutter, styles.extremes]}>
          <KrakenExtremes coin={coin} reading={reading} />
        </View>

        <KrakenRangeTabs onSelect={setRangeId} selected={rangeId} />

        <View style={{height: insets.bottom + 24}} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  chart: {marginTop: krakenLayout.chartTop},
  column: {alignSelf: 'center', maxWidth: contentWidth, width: '100%'},
  extremes: {marginBottom: krakenLayout.extremesBottom, marginTop: krakenLayout.extremesTop},
  gutter: {paddingHorizontal: krakenLayout.gutter},
  readout: {marginTop: krakenLayout.readoutTop},
  screen: {flex: 1},
})
