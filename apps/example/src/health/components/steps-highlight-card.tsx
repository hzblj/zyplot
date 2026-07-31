import {
  formatSteps,
  type StepsComparison,
  type StepsCumulative,
  StepsCumulativeChart,
} from '@zyplot/feature-charts/health'
import type {ReactNode} from 'react'
import {StyleSheet, View} from 'react-native'
import {stepsLayout, useStepsTheme} from '../data/steps-theme'
import {StepsText} from './steps-text'

const BAR_HEIGHT = 30
/** Nothing shorter than this reads as a bar, however small the value is against the other. */
const MIN_BAR = 0.12

const StepsSourcePill = () => {
  const {color} = useStepsTheme()

  return (
    <StepsText color={color.bar} size={14} weight="600">
      Steps
    </StepsText>
  )
}

const StepsCard = ({children, headline}: {children: ReactNode; headline: string}) => {
  const {color} = useStepsTheme()

  return (
    <View style={[styles.card, {backgroundColor: color.card}]}>
      <StepsSourcePill />
      <StepsText size={17} style={styles.headline} weight="600">
        {headline}
      </StepsText>
      <View style={[styles.divider, {backgroundColor: color.grid}]} />
      {children}
    </View>
  )
}

/**
 * Two periods as bars sharing a scale. Apple's version has no axis, no ticks and the period
 * written inside the bar, so it is drawn here rather than by a chart — a labelled proportional
 * rectangle is chrome, and a plot with its scale hidden would only be pretending.
 */
export const StepsComparisonCard = ({comparison}: {comparison: StepsComparison}) => {
  const {color} = useStepsTheme()

  return (
    <StepsCard headline={comparison.headline}>
      {[
        {row: comparison.current, tint: color.bar},
        {row: comparison.previous, tint: color.grid},
      ].map(({row, tint}) => (
        <View key={row.label} style={styles.compareRow}>
          <View style={styles.amount}>
            <StepsText size={28} tabular weight="600">
              {formatSteps(row.steps)}
            </StepsText>
            <StepsText color={color.textMuted} size={15} style={styles.unit}>
              steps/day
            </StepsText>
          </View>
          <View
            style={[
              styles.bar,
              {
                backgroundColor: tint,
                width: `${Math.max(MIN_BAR, row.steps / Math.max(comparison.max, 1)) * 100}%`,
              },
            ]}
          >
            <StepsText color={color.text} size={15} weight="500">
              {row.label}
            </StepsText>
          </View>
        </View>
      ))}
    </StepsCard>
  )
}

/** The day so far against a usual day, which is the one card here that really is a chart. */
export const StepsCumulativeCard = ({cumulative, scheme}: {cumulative: StepsCumulative; scheme: 'dark' | 'light'}) => {
  const {color} = useStepsTheme()

  return (
    <StepsCard headline={cumulative.headline}>
      <View style={styles.legend}>
        {[
          {label: 'Today', steps: cumulative.todayTotal, tint: color.bar},
          {label: 'Average', steps: cumulative.averageTotal, tint: color.textMuted},
        ].map(entry => (
          <View key={entry.label} style={styles.legendItem}>
            <View style={styles.legendHead}>
              <View style={[styles.dot, {backgroundColor: entry.tint}]} />
              <StepsText color={entry.tint} size={15} weight="500">
                {entry.label}
              </StepsText>
            </View>
            <View style={styles.amount}>
              <StepsText color={entry.tint} size={28} tabular weight="600">
                {formatSteps(entry.steps)}
              </StepsText>
              <StepsText color={entry.tint} size={15} style={styles.unit}>
                steps
              </StepsText>
            </View>
          </View>
        ))}
      </View>
      <StepsCumulativeChart cumulative={cumulative} scheme={scheme} />
    </StepsCard>
  )
}

const styles = StyleSheet.create({
  amount: {alignItems: 'baseline', flexDirection: 'row', gap: 4},
  bar: {borderRadius: 7, height: BAR_HEIGHT, justifyContent: 'center', paddingHorizontal: 10},
  card: {borderRadius: 16, gap: 6, marginHorizontal: stepsLayout.gutter, padding: 16},
  compareRow: {gap: 4},
  divider: {height: StyleSheet.hairlineWidth, marginVertical: 6},
  dot: {borderRadius: 5, height: 10, width: 10},
  headline: {marginTop: 2},
  legend: {flexDirection: 'row', gap: 28},
  legendHead: {alignItems: 'center', flexDirection: 'row', gap: 6},
  legendItem: {gap: 1},
  unit: {marginBottom: 1},
})
