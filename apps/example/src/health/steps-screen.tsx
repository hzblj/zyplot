import {
  StepsChart,
  type StepsRangeId,
  stepsComparisons,
  stepsCumulative,
  stepsRange,
} from '@zyplot/feature-charts/health'
import {useMemo, useState} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {AppHeader} from '../components/app-header'
import {contentWidth} from '../theme/tokens'
import {StepsComparisonCard, StepsCumulativeCard} from './components/steps-highlight-card'
import {StepsRangeTabs} from './components/steps-range-tabs'
import {CARD_WIDTH, StepsHeadline, StepsSpanCard} from './components/steps-readout'
import {StepsText} from './components/steps-text'
import {stepsLayout, useStepsTheme} from './data/steps-theme'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useStepsView} from './hooks/use-steps-view'

const TOP = 16
const READOUT_HEIGHT = 84

export const StepsScreen = () => {
  const insets = useSafeAreaInsets()
  const {color, scheme} = useStepsTheme()
  const [rangeId, setRangeId] = useState<StepsRangeId>('M')
  const isLoading = useChartPlaceholder()
  const range = stepsRange(rangeId)
  const view = useStepsView(range)
  const cumulative = useMemo(stepsCumulative, [])
  const comparisons = useMemo(stepsComparisons, [])

  const plot = view.geometry?.plot
  const cardLeft =
    plot === undefined || view.anchor === null
      ? null
      : Math.min(Math.max(view.anchor - CARD_WIDTH / 2, plot.x), Math.max(plot.x, plot.x + plot.width - CARD_WIDTH))

  return (
    <View style={[styles.screen, {backgroundColor: color.background, paddingTop: Math.max(insets.top, TOP)}]}>
      {}
      <View style={[styles.column, styles.header]}>
        <AppHeader palette={{pill: color.segment, pillPressed: color.segmentActive, text: color.text}} title="Steps" />
        <StepsRangeTabs onSelect={setRangeId} selected={rangeId} />
      </View>

      {}
      <ScrollView
        contentContainerStyle={styles.content}
        scrollEnabled={!view.isReading}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.column, styles.readout]}>
          <View style={[styles.headline, view.isReading ? styles.hidden : null]}>
            <StepsHeadline readout={view.readout} />
          </View>
          {view.isReading && cardLeft !== null ? <StepsSpanCard left={cardLeft} readout={view.readout} /> : null}
        </View>

        <View style={styles.column}>
          <StepsChart isLoading={isLoading} onInteraction={view.onInteraction} range={range} scheme={scheme} />
        </View>

        <View style={[styles.column, styles.highlights]}>
          <StepsText size={22} style={styles.sectionTitle} weight="bold">
            Highlights
          </StepsText>
          <StepsCumulativeCard cumulative={cumulative} scheme={scheme} />
          {comparisons.map(comparison => (
            <StepsComparisonCard comparison={comparison} key={comparison.id} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  column: {alignSelf: 'center', maxWidth: contentWidth, width: '100%'},
  content: {paddingBottom: 40},
  header: {gap: stepsLayout.segmentTop, paddingHorizontal: stepsLayout.gutter},
  headline: {paddingHorizontal: stepsLayout.gutter},
  hidden: {opacity: 0},
  highlights: {gap: 12, marginTop: 26},
  readout: {height: READOUT_HEIGHT, marginTop: stepsLayout.readoutTop},
  screen: {flex: 1},
  sectionTitle: {paddingHorizontal: stepsLayout.gutter},
})
