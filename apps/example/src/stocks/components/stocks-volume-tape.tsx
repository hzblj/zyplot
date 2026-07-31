import type {StocksRange} from '@zyplot/feature-charts/stocks'
import {StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'

/**
 * The volume tape under the plot: one tick per slot, no axes and no scale of its own. It is
 * read as texture rather than as numbers — where the period was busy, not how busy.
 *
 * Views rather than a second chart. It has to line up with the plot above it to the pixel, and
 * two charts never do: each renderer insets its own plot by a different amount, so a bar chart
 * given the same box as a line chart still puts its marks somewhere else. Ticks the screen
 * lays out itself land where the screen says.
 */
export const StocksVolumeTape = ({range}: {range: StocksRange}) => {
  const {color} = useStocksTheme()
  const peak = Math.max(...range.volumes, 1)

  return (
    <View style={styles.tape}>
      {range.volumes.map((volume, index) => (
        <View
          key={`${index}`}
          style={[
            styles.tick,
            {backgroundColor: color.volume, height: Math.max(1, (volume / peak) * stocksLayout.volumeHeight)},
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tape: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: stocksLayout.volumeHeight,
  },
  tick: {borderRadius: 0.5, flex: 1, marginHorizontal: 0.75},
})
