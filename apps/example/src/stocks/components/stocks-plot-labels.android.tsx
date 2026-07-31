import {Host, Row, Spacer} from '@expo/ui/jetpack-compose'
import {size} from '@expo/ui/jetpack-compose/modifiers'
import {type StocksRange, stocksCategories, tickPosition} from '@zyplot/feature-charts/stocks'
import {StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import type {StocksReadout} from '../hooks/use-stocks-readout'
import {StocksCentered} from './stocks-centered'
import {StocksText} from './stocks-text.android'

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
        <Host matchContents>
          <StocksText size={13} weight="600">
            {span.dates}
          </StocksText>
        </Host>
        <StocksCentered top={ROW} width={width} x={middle}>
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
        </StocksCentered>
      </View>
    )
  }

  if (!scrub) {
    return null
  }

  return (
    <View style={styles.slot}>
      <Host matchContents>
        <StocksText size={13} weight="600">
          {scrub.date}
        </StocksText>
      </Host>
      <StocksCentered top={ROW} width={width} x={scrub.x ?? width / 2}>
        <Host matchContents>
          <StocksText color={color.scrub} size={17} weight="600">
            {scrub.value}
          </StocksText>
        </Host>
      </StocksCentered>
    </View>
  )
}

/** The five dates under the plot, each hanging off the rule it belongs to. */
export const StocksAxisLabels = ({left, range, width}: {left: number; range: StocksRange; width: number}) => (
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

const styles = StyleSheet.create({
  axis: {height: 20},
  axisLabel: {position: 'absolute'},
  slot: {alignItems: 'center', height: stocksLayout.slotHeight, paddingTop: 1},
})
