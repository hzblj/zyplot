import {tooltip} from '@hzblj/zyplot'
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
import {StepsHeadline, StepsReadingCard, StepsSpanCard} from './components/steps-readout'
import {StepsText} from './components/steps-text'
import {stepsLayout, useStepsTheme} from './data/steps-theme'
import {StepsReadingProvider} from './hooks/steps-reading-context'
import {useChartPlaceholder} from './hooks/use-chart-placeholder'
import {useStepsView} from './hooks/use-steps-view'

const TOP = 16
const READOUT_HEIGHT = 84

/**
 * The card's bottom sits on the plot's top edge, which is where the readout row it used to live in
 * left it. Held at module scope so the chart's config is the same value on every render.
 */
const READING_TOOLTIP = tooltip.above({lift: 0, view: StepsReadingCard})

export const StepsScreen = () => {
  const insets = useSafeAreaInsets()
  const {color, scheme} = useStepsTheme()
  const [rangeId, setRangeId] = useState<StepsRangeId>('M')
  const isLoading = useChartPlaceholder()
  const range = stepsRange(rangeId)
  const view = useStepsView(range)
  const cumulative = useMemo(stepsCumulative, [])
  const comparisons = useMemo(stepsComparisons, [])

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
        </View>

        {}
        <View style={styles.column}>
          <StepsReadingProvider view={view}>
            <StepsChart
              isLoading={isLoading}
              onInteraction={view.onInteraction}
              range={range}
              rangeView={StepsSpanCard}
              scheme={scheme}
              tooltip={READING_TOOLTIP}
            />
          </StepsReadingProvider>
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
