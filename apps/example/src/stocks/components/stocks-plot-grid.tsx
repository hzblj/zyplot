import type {StocksPlotGrid as Grid} from '@zyplot/feature-charts/stocks'
import {memo} from 'react'
import {StyleSheet, View} from 'react-native'
import {useStocksTheme} from '../data/stocks-theme'

/**
 * The rules behind the plot. They are views rather than annotations because an annotation is
 * drawn over the marks, and a grid over a trace reads as a cage around it — and because the
 * columns carry on past the plot's floor to divide the dates underneath, which is a thing no
 * chart can be asked for.
 *
 * The floor takes the divider colour rather than the grid's: it is the axis, not a rule.
 *
 * Held against the box it was given: the rules are the plot's, so they are laid once and a finger
 * crossing them is none of their business.
 */
const PlotGrid = ({depth, grid}: {depth: number; grid: Grid}) => {
  const {color} = useStocksTheme()
  const top = grid.rows[0] as number
  const floor = grid.rows[grid.rows.length - 1] as number
  const left = grid.columns[0] as number
  const right = grid.columns[grid.columns.length - 1] as number

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {grid.rows.map((y, index) => (
        <View
          key={`row-${y}`}
          style={[
            styles.rule,
            {
              backgroundColor: index === grid.rows.length - 1 ? color.divider : color.chartGrid,
              left,
              top: y,
              width: right - left,
            },
          ]}
        />
      ))}
      {grid.columns.map(x => (
        <View
          key={`column-${x}`}
          style={[styles.rule, {backgroundColor: color.chartGrid, height: floor - top + depth, left: x, top}]}
        />
      ))}
    </View>
  )
}

export const StocksPlotGrid = memo(PlotGrid)

const styles = StyleSheet.create({
  rule: {height: StyleSheet.hairlineWidth, position: 'absolute', width: StyleSheet.hairlineWidth},
})
