import {type StocksRange, stocksCategories, tickPosition} from '@zyplot/feature-charts/stocks'
import {StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import type {StocksReadout} from '../hooks/use-stocks-readout'
import {StocksCentered} from './stocks-centered'
import {StocksText} from './stocks-text'

const AXIS_INSET = 5
const ROW = 21

/**
 * What is being read, in the row the range pills otherwise hold. The date sits over the plot
 * whichever mark is under the finger; the number sits over the finger itself, because that is
 * the one that has to be connected to a place on the line.
 */
export const StocksReadoutLabels = ({readout, width}: {readout: StocksReadout; width: number}) => {
  const {color} = useStocksTheme()
  const {scrub, span} = readout
  const tint = span?.isDown ? color.down : color.up

  if (span) {
    const middle = ((span.startX ?? 0) + (span.endX ?? width)) / 2
    return (
      <View style={styles.slot}>
        <StocksText size={13} weight="600">
          {span.dates}
        </StocksText>
        <StocksCentered top={ROW} width={width} x={middle}>
          <View style={styles.pair}>
            <StocksText color={tint} size={17} tabular weight="600">
              {span.delta}
            </StocksText>
            <StocksText color={tint} size={17} tabular weight="600">
              {span.percent}
            </StocksText>
          </View>
        </StocksCentered>
      </View>
    )
  }

  if (!scrub) {
    return null
  }

  return (
    <View style={styles.slot}>
      <StocksText size={13} weight="600">
        {scrub.date}
      </StocksText>
      <StocksCentered top={ROW} width={width} x={scrub.x ?? width / 2}>
        <StocksText color={color.scrub} size={17} tabular weight="600">
          {scrub.value}
        </StocksText>
      </StocksCentered>
    </View>
  )
}

/** The five dates under the plot, each hanging off the rule it belongs to. */
export const StocksAxisLabels = ({left, range, width}: {left: number; range: StocksRange; width: number}) => {
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

const styles = StyleSheet.create({
  axis: {height: 20},
  axisLabel: {position: 'absolute'},
  pair: {flexDirection: 'row', gap: 26},
  slot: {alignItems: 'center', height: stocksLayout.slotHeight, paddingTop: 1},
})
