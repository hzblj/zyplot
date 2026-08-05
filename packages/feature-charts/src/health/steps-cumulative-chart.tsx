import {Chart, zyplot} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {stepsArrival, stepsChartStyle} from './steps-chart-style'
import type {StepsCumulative} from './steps-highlights'
import {type StepsScheme, stepsColors} from './steps-theme'

export type StepsCumulativeChartProps = {
  cumulative: StepsCumulative
  height?: number
  scheme: StepsScheme
}

/** The whole card: the plot and the row of marks under it. */
const HEIGHT = 150

/** The row of marks: a dot at every hour, a longer one capping the two the labels name. */
const ROW = {cap: 6, capWidth: 1.6, dot: 2, gap: 3, labelGap: 4, labelSize: 12} as const
const LABEL_LINE = ROW.labelSize + 4
const ROW_HEIGHT = ROW.gap + ROW.cap + ROW.labelGap + LABEL_LINE

/**
 * Free space at both ends of the plot. The row is inset by the same number, so its width is the
 * plot's width and the two agree without measuring either — `0` on every renderer runs the marks
 * to the edge, which would cut the end dots in half.
 */
const PLOT_INSET = 6

/**
 * A box of the same width under every label, wide enough for the longest hour with room to spare.
 * Centring a label by shifting it half of its own width waits on that width being measured, and a
 * first frame that guesses it lands the label off its mark; a box centred on the mark by a number
 * known up front has nothing to wait for, so the label sits in one place on every render.
 */
const LABEL_BOX = 56

/** Where a category sits along the plot, as a percentage: every renderer draws it at its band's centre. */
const bandCentre = (index: number, count: number): `${number}%` => `${((index + 0.5) / count) * 100}%`

/**
 * The axis of the cumulative card, drawn as views. Two hours named out of twenty-four is a ruler
 * rather than a scale, and a row that has to line up with the plot to the pixel is one row here
 * against three renderers' worth of band arithmetic.
 */
const CumulativeAxisRow = ({cumulative, scheme}: {cumulative: StepsCumulative; scheme: StepsScheme}) => {
  const color = stepsColors[scheme]
  const count = cumulative.categories.length
  const named = cumulative.ticks.map(tick => cumulative.categories.indexOf(tick)).filter(index => index >= 0)

  return (
    <View style={styles.row}>
      <View style={styles.marks}>
        {cumulative.categories.map((category, index) => (
          <View
            key={category}
            style={[
              named.includes(index) ? styles.cap : styles.dot,
              {backgroundColor: color.label, left: bandCentre(index, count)},
            ]}
          />
        ))}
        {/*
         * One mark more than there are hours, on the trailing edge of the last band. The row runs to
         * the end of the last hour rather than stopping in the middle of it, which is what leaves
         * `23:00` exactly half a band short of the end of the day.
         */}
        <View style={[styles.cap, styles.close, {backgroundColor: color.label}]} />
      </View>
      {/*
       * Each label centred on its own mark, which is what puts `23:00` half a band short of the
       * mark that closes the row. Both hang a few points past the row at their outer end and land
       * in the free space the plot keeps there, so neither is squared up against an edge instead.
       */}
      <View style={styles.labels}>
        {named.map(index => (
          <Text
            key={cumulative.categories[index]}
            style={[styles.label, {color: color.label, left: bandCentre(index, count)}]}
          >
            {cumulative.categories[index]}
          </Text>
        ))}
      </View>
    </View>
  )
}

/**
 * The day so far against a usual day. No axes but the two hours, no interaction: it is read as
 * one shape — whether the orange line is under the grey one — rather than value by value.
 */
const CumulativeChart = ({cumulative, height = HEIGHT, scheme}: StepsCumulativeChartProps) => {
  const chart = useMemo(() => {
    const color = stepsColors[scheme]
    const last = cumulative.categories[cumulative.categories.length - 1]
    /**
     * The floor sits below zero on purpose. A day that starts at nothing draws its first hours flat
     * along the bottom, and the row of marks is right under that stroke rather than clear of it — the
     * air between the two comes from here, since every renderer keeps a different gap of its own.
     */
    const floor = -Math.round(Math.max(cumulative.todayTotal, cumulative.averageTotal) * 0.12)

    return zyplot(z => ({
      ...stepsArrival,
      annotations: [
        // On the last hour, where the reading is: the same band centre the row's last mark sits on.
        z.annotation.line({axis: 'x', color: color.rule, id: 'now', value: last, width: 1.4}),
        z.annotation.point({color: color.textMuted, id: 'average-end', size: 7, x: last, y: cumulative.averageTotal}),
        z.annotation.point({color: color.bar, id: 'today-end', size: 7, x: last, y: cumulative.todayTotal}),
      ],
      categories: cumulative.categories,
      height: Math.max(0, height - ROW_HEIGHT),
      interaction: z.interaction({crosshair: 'none', hover: 'none'}),
      // A count only ever climbs, so the corners between hours are joins, not readings.
      isSmooth: true,
      // The end dots sit on the last reading, so half of each one is outside the plot.
      plot: {clip: false},
      series: [
        z.series({
          color: color.textMuted,
          id: 'average',
          label: 'Average',
          style: {strokeWidth: 2.4},
          values: cumulative.average,
        }),
        z.series({color: color.bar, id: 'today', label: 'Today', style: {strokeWidth: 2.4}, values: cumulative.today}),
      ],
      theme: stepsChartStyle(scheme).theme,
      tooltip: false,
      // The row under the plot is the axis here, so the chart draws none of its own.
      xAxis: {
        grid: false,
        plotDimensionEndPadding: PLOT_INSET,
        plotDimensionStartPadding: PLOT_INSET,
        visible: false,
      },
      yAxis: {domain: {min: floor}, visible: false},
    }))
  }, [cumulative, height, scheme])

  return (
    <View>
      <Chart.Line {...chart} />
      <CumulativeAxisRow cumulative={cumulative} scheme={scheme} />
    </View>
  )
}

const styles = StyleSheet.create({
  cap: {
    borderRadius: ROW.capWidth / 2,
    height: ROW.cap,
    marginLeft: -ROW.capWidth / 2,
    position: 'absolute',
    top: 0,
    width: ROW.capWidth,
  },
  // Astride the plot's trailing edge, so half of it is outside the row's own width.
  close: {left: '100%'},
  dot: {
    borderRadius: ROW.dot / 2,
    height: ROW.dot,
    marginLeft: -ROW.dot / 2,
    position: 'absolute',
    top: (ROW.cap - ROW.dot) / 2,
    width: ROW.dot,
  },
  // `left` puts the box's leading edge on its mark, the margin pulls it back onto it, and the text
  // is centred in the box: the label lands on the mark whatever the hour it names measures.
  label: {
    fontSize: ROW.labelSize,
    lineHeight: LABEL_LINE,
    marginLeft: -LABEL_BOX / 2,
    position: 'absolute',
    textAlign: 'center',
    top: 0,
    width: LABEL_BOX,
  },
  labels: {height: LABEL_LINE, marginTop: ROW.labelGap, overflow: 'visible'},
  marks: {height: ROW.cap, marginTop: ROW.gap, overflow: 'visible'},
  row: {overflow: 'visible', paddingHorizontal: PLOT_INSET},
})

export const StepsCumulativeChart = memo(CumulativeChart)
