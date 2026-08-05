import {Host, VStack} from '@expo/ui/swift-ui'
import {padding} from '@expo/ui/swift-ui/modifiers'
import {tooltip} from '@hzblj/zyplot'
import {FamilyChart, type FamilyRangeId, familyRange} from '@zyplot/feature-charts/family'
import {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {AppHeader} from '../components/app-header'
import {FamilyChartArrival} from './components/family-chart-arrival'
import {FamilyTokenIdentity} from './components/family-nav.ios'
import {FamilyPriceReadout} from './components/family-price-readout.ios'
import {FamilyRangeSelector} from './components/family-range-selector.ios'
import {FamilyReadingChip} from './components/family-reading-chip'
import {familyLayout, useFamilyTheme} from './data/family-theme'
import {FamilyReadingProvider} from './hooks/family-reading-context'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useFamilyReadout} from './hooks/use-family-readout'

/** Held at module scope: a new object on every render would rebuild the chart's config with it. */
const READING_TOOLTIP = tooltip.above({lift: 2, view: FamilyReadingChip})

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
        <VStack alignment="leading" modifiers={[padding({horizontal: familyLayout.gutter})]}>
          <FamilyTokenIdentity />
        </VStack>
      </Host>

      <Host matchContents style={[styles.host, styles.readout]}>
        <VStack alignment="leading" modifiers={[padding({horizontal: familyLayout.gutter})]}>
          <FamilyPriceReadout readout={readout} />
        </VStack>
      </Host>

      <View style={styles.chart}>
        <FamilyChartArrival isLoading={isLoading} scheme={scheme}>
          <FamilyReadingProvider readout={readout}>
            <FamilyChart
              isLoading={isLoading}
              onInteraction={readout.onInteraction}
              range={range}
              scheme={scheme}
              tooltip={READING_TOOLTIP}
            />
          </FamilyReadingProvider>
        </FamilyChartArrival>
      </View>

      <Host matchContents style={[styles.host, styles.controls]}>
        <VStack modifiers={[padding({horizontal: familyLayout.gutter})]}>
          <FamilyRangeSelector onSelect={setRangeId} selected={rangeId} />
        </VStack>
      </Host>
    </View>
  )
}

const styles = StyleSheet.create({
  chart: {marginTop: familyLayout.chartTop},
  controls: {marginTop: familyLayout.controlsTop, width: '100%'},
  host: {width: '100%'},
  nav: {paddingBottom: familyLayout.headerGap, paddingHorizontal: familyLayout.gutter},
  readout: {marginTop: familyLayout.readoutTop, width: '100%'},
  screen: {flex: 1},
})
