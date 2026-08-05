import {Host, Row, Spacer} from '@expo/ui/jetpack-compose'
import {size} from '@expo/ui/jetpack-compose/modifiers'
import {type StocksRange, stocksCategories, tickPosition} from '@zyplot/feature-charts/stocks'
import {memo} from 'react'
import {StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import {useStocksReading} from '../hooks/stocks-reading-context'
import type {StocksReadout} from '../hooks/use-stocks-readout'
import {StocksText} from './stocks-text.android'

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
      <Host matchContents>
        <StocksText size={13} weight="600">
          {label}
        </StocksText>
      </Host>
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
    <Host matchContents>
      <StocksText color={color.scrub} size={17} weight="600">
        {scrub.value}
      </StocksText>
    </Host>
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
    <Host matchContents>
      <Row>
        <StocksText color={tint} size={17} weight="600">
          {span.delta}
        </StocksText>
        <Spacer modifiers={[size(26, 1)]} />
        <StocksText color={tint} size={17} weight="600">
          {span.percent}
        </StocksText>
      </Row>
    </Host>
  )
}

/** The five dates under the plot, each hanging off the rule it belongs to. */
const AxisLabels = ({left, range, width}: {left: number; range: StocksRange; width: number}) => (
  <View style={styles.axis}>
    {range.axisTicks.map(tick => (
      <View
        key={tick.index}
        style={[
          styles.axisLabel,
          {left: left + tickPosition(tick.index, stocksCategories.length) * width + AXIS_INSET},
        ]}
      >
        <Host matchContents>
          <StocksText size={13} weight="600">
            {tick.label}
          </StocksText>
        </Host>
      </View>
    ))}
  </View>
)

/** Held against the plot's own box, which a reading never moves. */
export const StocksAxisLabels = memo(AxisLabels)

const styles = StyleSheet.create({
  axis: {height: 20},
  axisLabel: {position: 'absolute'},
  slot: {alignItems: 'center', height: stocksLayout.slotHeight, paddingTop: 1},
})
