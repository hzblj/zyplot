import {Column, Host} from '@expo/ui/jetpack-compose'
import {padding} from '@expo/ui/jetpack-compose/modifiers'
import {tooltip} from '@hzblj/zyplot'
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
import {KrakenExtremes} from './components/kraken-extremes.android'
import {KrakenPriceReadout} from './components/kraken-price-readout.android'
import {KrakenRangeTabs} from './components/kraken-range-tabs.android'
import {KrakenReadingChip} from './components/kraken-reading-chip'
import {krakenLayout, useKrakenTheme} from './data/kraken-theme'
import {KrakenReadingProvider} from './hooks/kraken-reading-context'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useKrakenReadout} from './hooks/use-kraken-readout'

/** Held at module scope: a new object on every render would rebuild the chart's config with it. */
const READING_TOOLTIP = tooltip.above({view: KrakenReadingChip})

const GUTTER = krakenLayout.gutter

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
        <Column modifiers={[padding(GUTTER, 0, GUTTER, 0)]}>
          <KrakenPriceReadout coin={coin} readout={readout} />
        </Column>
      </Host>

      {}
      <View style={styles.chart}>
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
  nav: {paddingHorizontal: GUTTER},
  readout: {marginTop: krakenLayout.readoutTop},
  screen: {flex: 1},
})
