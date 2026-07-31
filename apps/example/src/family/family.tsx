import {Chart} from '@hzblj/zyplot/web'
import {FamilyChart, type FamilyRangeId, familyChartStyle, familyRange} from '@zyplot/feature-charts/family'
import {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {AppHeader} from '../components/app-header'
import {contentWidth} from '../theme/tokens'
import {FamilyChartArrival} from './components/family-chart-arrival'
import {FamilyTokenIdentity} from './components/family-nav'
import {FamilyPriceReadout} from './components/family-price-readout'
import {FamilyRangeSelector} from './components/family-range-selector'
import {familyLayout, useFamilyTheme} from './data/family-theme'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useFamilyReadout} from './hooks/use-family-readout'

const TOP = 16
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
          paddingTop: Math.max(insets.top, TOP),
        },
      ]}
    >
      <View style={styles.column}>
        <View style={[styles.gutter, styles.header]}>
          <AppHeader palette={{pill: color.pill, pillPressed: color.pillActive, text: color.text}} />
          <FamilyTokenIdentity />
        </View>

        <View style={[styles.gutter, styles.readout]}>
          <FamilyPriceReadout readout={readout} />
        </View>

        <View style={styles.chart}>
          <FamilyChartArrival isLoading={isLoading} scheme={scheme}>
            <Chart.Provider colorMode={scheme} theme={familyChartStyle(scheme).theme}>
              <FamilyChart isLoading={isLoading} onInteraction={readout.onInteraction} range={range} scheme={scheme} />
            </Chart.Provider>
          </FamilyChartArrival>
        </View>

        <View style={[styles.gutter, styles.controls]}>
          <FamilyRangeSelector onSelect={setRangeId} selected={rangeId} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chart: {marginTop: familyLayout.chartTop},
  column: {alignSelf: 'center', maxWidth: contentWidth, width: '100%'},
  controls: {marginTop: familyLayout.controlsTop},
  gutter: {paddingHorizontal: familyLayout.gutter},
  header: {gap: familyLayout.headerGap},
  readout: {marginTop: familyLayout.readoutTop},
  screen: {flex: 1},
})
