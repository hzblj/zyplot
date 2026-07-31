import {Column, Host} from '@expo/ui/jetpack-compose'
import {padding} from '@expo/ui/jetpack-compose/modifiers'
import {FamilyChart, type FamilyRangeId, familyRange} from '@zyplot/feature-charts/family'
import {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {AppHeader} from '../components/app-header'
import {FamilyChartArrival} from './components/family-chart-arrival'
import {FamilyTokenIdentity} from './components/family-nav.android'
import {FamilyPriceReadout} from './components/family-price-readout.android'
import {FamilyRangeSelector} from './components/family-range-selector.android'
import {familyLayout, useFamilyTheme} from './data/family-theme'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useFamilyReadout} from './hooks/use-family-readout'

const GUTTER = familyLayout.gutter
const BOTTOM = 20

export const FamilyScreen = () => {
  const insets = useSafeAreaInsets()
  const {color, scheme} = useFamilyTheme()
  const [rangeId, setRangeId] = useState<FamilyRangeId>('1d')
  const isLoading = useChartPlaceholder()
  const range = familyRange(rangeId)
  const readout = useFamilyReadout(range)

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: color.background,
          paddingBottom: Math.max(insets.bottom, BOTTOM),
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.nav}>
        <AppHeader palette={{pill: color.pill, pillPressed: color.pillActive, text: color.text}} />
      </View>

      <Host matchContents style={styles.host}>
        <Column modifiers={[padding(GUTTER, 0, GUTTER, 0)]}>
          <FamilyTokenIdentity />
        </Column>
      </Host>

      <Host matchContents style={[styles.host, styles.readout]}>
        <Column modifiers={[padding(GUTTER, 0, GUTTER, 0)]}>
          <FamilyPriceReadout readout={readout} />
        </Column>
      </Host>

      <View style={styles.chart}>
        <FamilyChartArrival isLoading={isLoading} scheme={scheme}>
          <FamilyChart isLoading={isLoading} onInteraction={readout.onInteraction} range={range} scheme={scheme} />
        </FamilyChartArrival>
      </View>

      <Host matchContents style={[styles.host, styles.controls]}>
        <Column modifiers={[padding(GUTTER, 0, GUTTER, 0)]}>
          <FamilyRangeSelector onSelect={setRangeId} selected={rangeId} />
        </Column>
      </Host>
    </View>
  )
}

const styles = StyleSheet.create({
  chart: {marginTop: familyLayout.chartTop},
  controls: {marginTop: familyLayout.controlsTop, width: '100%'},
  host: {width: '100%'},
  nav: {paddingBottom: familyLayout.headerGap, paddingHorizontal: GUTTER},
  readout: {marginTop: familyLayout.readoutTop, width: '100%'},
  screen: {flex: 1},
})
