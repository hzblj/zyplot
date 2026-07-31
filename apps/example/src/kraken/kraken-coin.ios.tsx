import {Host, VStack} from '@expo/ui/swift-ui'
import {padding} from '@expo/ui/swift-ui/modifiers'
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
import {KrakenExtremes} from './components/kraken-extremes.ios'
import {KrakenPriceReadout} from './components/kraken-price-readout.ios'
import {KrakenRangeTabs} from './components/kraken-range-tabs.ios'
import {krakenLayout, useKrakenTheme} from './data/kraken-theme'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useKrakenReadout} from './hooks/use-kraken-readout'

export const KrakenCoinScreen = ({coin}: {coin: KrakenCoin}) => {
  const insets = useSafeAreaInsets()
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
      <View style={styles.nav}>
        <AppHeader palette={{pill: color.pill, pillPressed: color.pillPressed, text: color.text}} />
      </View>

      <Host matchContents style={[styles.host, styles.readout]}>
        <VStack alignment="leading" modifiers={[padding({horizontal: krakenLayout.gutter})]}>
          <KrakenPriceReadout coin={coin} readout={readout} />
        </VStack>
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
        <VStack modifiers={[padding({horizontal: krakenLayout.gutter})]}>
          <KrakenExtremes coin={coin} reading={reading} />
        </VStack>
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
  nav: {paddingHorizontal: krakenLayout.gutter},
  readout: {marginTop: krakenLayout.readoutTop},
  screen: {flex: 1},
})
