import {Column, Host} from '@expo/ui/jetpack-compose'
import {padding} from '@expo/ui/jetpack-compose/modifiers'
import {
  KrakenChart,
  type KrakenCoin,
  type KrakenRangeId,
  krakenRange,
  krakenReading,
} from '@zyplot/feature-charts/kraken'
import {useRouter} from 'expo-router'
import {useMemo, useState} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {KrakenExtremes} from './components/kraken-extremes.android'
import {KrakenNavBar} from './components/kraken-nav.android'
import {KrakenPriceReadout} from './components/kraken-price-readout.android'
import {KrakenRangeTabs} from './components/kraken-range-tabs.android'
import {krakenLayout, useKrakenTheme} from './data/kraken-theme'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useKrakenReadout} from './hooks/use-kraken-readout'

const GUTTER = krakenLayout.gutter

export const KrakenCoinScreen = ({coin}: {coin: KrakenCoin}) => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {color, scheme} = useKrakenTheme()
  const [rangeId, setRangeId] = useState<KrakenRangeId>('24h')
  const isLoading = useChartPlaceholder()
  const range = krakenRange(rangeId)
  const reading = useMemo(() => krakenReading(range), [range])
  const readout = useKrakenReadout(coin, range)

  return (
    <ScrollView
      scrollEnabled={!readout.isScrubbing}
      style={[styles.screen, {backgroundColor: color.background, paddingTop: insets.top}]}
    >
      <Host matchContents style={styles.host}>
        <Column modifiers={[padding(GUTTER, 0, GUTTER, 0)]}>
          <KrakenNavBar onBack={() => router.back()} />
        </Column>
      </Host>

      <Host matchContents style={[styles.host, styles.readout]}>
        <Column modifiers={[padding(GUTTER, 0, GUTTER, 0)]}>
          <KrakenPriceReadout coin={coin} readout={readout} />
        </Column>
      </Host>

      {}
      <View style={styles.chart}>
        <KrakenChart
          isLatestRead={readout.isOnLatest}
          isLoading={isLoading}
          onInteraction={readout.onInteraction}
          range={range}
          scheme={scheme}
        />
      </View>

      <Host matchContents style={[styles.host, styles.extremes]}>
        <Column modifiers={[padding(GUTTER, 0, GUTTER, 0)]}>
          <KrakenExtremes coin={coin} reading={reading} />
        </Column>
      </Host>

      <Host matchContents style={styles.host}>
        <KrakenRangeTabs onSelect={setRangeId} selected={rangeId} />
      </Host>

      <View style={{height: insets.bottom + 24}} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  chart: {marginTop: krakenLayout.chartTop},
  extremes: {marginBottom: krakenLayout.extremesBottom, marginTop: krakenLayout.extremesTop},
  host: {width: '100%'},
  readout: {marginTop: krakenLayout.readoutTop},
  screen: {flex: 1},
})
