import {tooltip} from '@hzblj/zyplot'
import {
  plotGrid,
  StocksChart,
  type StocksRange,
  type StocksRangeId,
  type StocksScheme,
} from '@zyplot/feature-charts/stocks'
import {useMemo, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {stocksLayout} from '../data/stocks-theme'
import {StocksReadingProvider} from '../hooks/stocks-reading-context'
import type {StocksReadout} from '../hooks/use-stocks-readout'
import {StocksPlotGrid} from './stocks-plot-grid'
import {StocksAxisLabels, StocksReadingPrice, StocksReadingSpan, StocksReadoutLabels} from './stocks-plot-labels'
import {StocksRangePills} from './stocks-range-pills'
import {StocksVolumeTape} from './stocks-volume-tape'

export type StocksChartPanelProps = {
  onSelect: (id: StocksRangeId) => void
  range: StocksRange
  readout: StocksReadout
  scheme: StocksScheme
  selected: StocksRangeId
}

const AXIS_ROW = 24

/**
 * The number sits just clear of the plot's top edge, in the lower half of the row above it — where
 * the readout's own row put it before the chart was the one placing it.
 *
 * Held at module scope, both of these: a new object on every render would rebuild the chart's config
 * with it, and a config rebuilt while a finger moves is the whole thing this placement avoids.
 */
const READING_TOOLTIP = tooltip.above({lift: 2, view: StocksReadingPrice})

/**
 * Everything laid against the plot's own box: the row above it, which is the range picker until
 * a finger lands and the reading after that, the grid behind it, the dates under it, and the
 * volume tape under those.
 *
 * The box is the chart's to report, not ours to assume — the price ladder takes a gutter off the
 * trailing edge whose width depends on how many digits a price has. So the chart carries a few
 * marks nobody draws and reports where they landed, and everything here is placed off those.
 * They arrive in the chart's own space, so the view they are placed in has to be the chart's own
 * box: the gutters live on its parent, or every offset is a gutter out.
 *
 * The picker fades rather than leaves. A scroller that unmounts comes back at the offset it was
 * born with, so a row scrolled out to the long ranges would slide itself home every time a
 * finger touched the plot.
 */
export const StocksChartPanel = ({onSelect, range, readout, scheme, selected}: StocksChartPanelProps) => {
  const [width, setWidth] = useState(0)
  /**
   * Held, not recomputed: a finger crossing the plot re-renders this panel on every touch it
   * reports, and a fresh box each time would put the grid and the tape through the whole of React
   * for a reading that never moved either of them.
   */
  const grid = useMemo(() => plotGrid(readout.geometry), [readout.geometry])
  const left = grid ? (grid.columns[0] as number) : 0
  const end = grid ? (grid.columns[grid.columns.length - 1] as number) : width

  return (
    <View>
      <View style={styles.slot}>
        <View
          pointerEvents={readout.isReading ? 'none' : 'auto'}
          style={[styles.layer, {opacity: readout.isReading ? 0 : 1}]}
        >
          <StocksRangePills onSelect={onSelect} selected={selected} />
        </View>
        {readout.isReading ? (
          <View pointerEvents="none" style={[styles.layer, styles.gutter]}>
            <StocksReadoutLabels readout={readout} />
          </View>
        ) : null}
      </View>

      {}
      <View style={styles.gutter}>
        <View onLayout={event => setWidth(event.nativeEvent.layout.width)}>
          {grid ? <StocksPlotGrid depth={AXIS_ROW} grid={grid} /> : null}

          {}
          <StocksReadingProvider readout={readout}>
            <StocksChart
              isReading={readout.isScrubbing}
              onInteraction={readout.onInteraction}
              range={range}
              rangeView={StocksReadingSpan}
              scheme={scheme}
              tooltip={READING_TOOLTIP}
            />
          </StocksReadingProvider>

          <View style={styles.axis}>
            <StocksAxisLabels left={left} range={range} width={end - left} />
          </View>

          <View style={{marginLeft: left, marginRight: Math.max(width - end, 0)}}>
            <StocksVolumeTape range={range} />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  axis: {height: AXIS_ROW, justifyContent: 'flex-end'},
  gutter: {paddingHorizontal: stocksLayout.gutter},
  layer: StyleSheet.absoluteFillObject,
  slot: {height: stocksLayout.slotHeight},
})
