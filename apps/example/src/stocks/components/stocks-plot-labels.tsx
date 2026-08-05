import {type StocksRange, stocksCategories, tickPosition} from '@zyplot/feature-charts/stocks'
import {memo} from 'react'
import {StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import {useStocksReading} from '../hooks/stocks-reading-context'
import type {StocksReadout} from '../hooks/use-stocks-readout'
import {StocksText} from './stocks-text'

const AXIS_INSET = 5

/**
 * What is being read, in the row the range pills otherwise hold. Only the date: it is centred on the
 * row whichever mark is under the finger, so it is the screen's to place. The number is not — it has
 * to be connected to a place on the line, so the chart mounts and moves it. See `StocksReadingPrice`.
 */
export const StocksReadoutLabels = ({readout}: {readout: StocksReadout}) => {
  const label = readout.span?.dates ?? readout.scrub?.date

  if (label === undefined) {
    return null
  }

  return (
    <View style={styles.slot}>
      <StocksText size={13} weight="600">
        {label}
      </StocksText>
    </View>
  )
}

/**
 * The price over the finger. Named in the chart's config as its `tooltip.above` view, so where it
 * sits is the chart's answer and moves with the touch itself rather than with a render — and what it
 * says is read from the screen's own context, so a reading never touches the chart's props.
 */
export const StocksReadingPrice = () => {
  const {color} = useStocksTheme()
  const scrub = useStocksReading()?.scrub

  if (!scrub) {
    return null
  }

  return (
    <StocksText color={color.scrub} size={17} tabular weight="600">
      {scrub.value}
    </StocksText>
  )
}

/** What the stretch under two fingers did, as the chart's `rangeView` — centred on the span itself. */
export const StocksReadingSpan = () => {
  const {color} = useStocksTheme()
  const span = useStocksReading()?.span

  if (!span) {
    return null
  }
  const tint = span.isDown ? color.down : color.up

  return (
    <View style={styles.pair}>
      <StocksText color={tint} size={17} tabular weight="600">
        {span.delta}
      </StocksText>
      <StocksText color={tint} size={17} tabular weight="600">
        {span.percent}
      </StocksText>
    </View>
  )
}

/** The five dates under the plot, each hanging off the rule it belongs to. */
const AxisLabels = ({left, range, width}: {left: number; range: StocksRange; width: number}) => {
  const {color} = useStocksTheme()

  return (
    <View style={styles.axis}>
      {range.axisTicks.map(tick => (
        <View
          key={tick.index}
          style={[
            styles.axisLabel,
            {left: left + tickPosition(tick.index, stocksCategories.length) * width + AXIS_INSET},
          ]}
        >
          <StocksText color={color.text} size={13} tabular weight="600">
            {tick.label}
          </StocksText>
        </View>
      ))}
    </View>
  )
}

/** Held against the plot's own box, which a reading never moves. */
export const StocksAxisLabels = memo(AxisLabels)

const styles = StyleSheet.create({
  axis: {height: 20},
  axisLabel: {position: 'absolute'},
  pair: {flexDirection: 'row', gap: 26},
  slot: {alignItems: 'center', height: stocksLayout.slotHeight, paddingTop: 1},
})
