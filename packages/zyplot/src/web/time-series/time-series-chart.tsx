'use client'

import {type FC, useMemo} from 'react'
import type uPlot from 'uplot'
import {useUplot} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartLegend, ChartReveal} from '../shared/frame'
import {seriesColor, useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartNumberFormat, ChartSeries, ChartTimePoints} from '../shared/types'
import {TimeSeriesChartSkeleton} from './time-series-chart-skeleton'

const DEFAULT_HEIGHT = 240
const LINE_WIDTH = 2

/** Props for `Chart.TimeSeries`. */
export type TimeSeriesChartProps = ChartBaseProps & {
  format?: ChartNumberFormat
  points: ChartTimePoints
  /** Identity and colour only: the values live in `points`, one row per series. */
  series: readonly Omit<ChartSeries, 'values'>[]
}

/**
 * A line chart for tens of thousands of points, drawn by uPlot so panning and
 * zooming stay smooth. For a dozen points use `Chart.Line`, which has per-mark
 * hover and emphasis this one gives up.
 */
export const TimeSeriesChart: FC<TimeSeriesChartProps> = ({
  axis,
  className,
  format,
  height = DEFAULT_HEIGHT,
  isLoading,
  points,
  series,
  theme,
}) => {
  const tokens = useChartTokens(theme)

  const setup = useMemo(() => {
    if (!tokens) {
      return null
    }

    const axisStyle = {
      font: `11px ${tokens.fontFamily}`,
      grid: {stroke: tokens.grid, width: 1},
      stroke: tokens.label,
      ticks: {show: false},
    }

    const options: uPlot.Options = {
      axes: [
        {...axisStyle, show: axis?.x !== false},
        {
          ...axisStyle,
          show: axis?.y !== false,
          size: 48,
          values: (_plot, splits) => splits.map(split => formatChartNumber(split, format)),
        },
      ],
      cursor: {points: {size: 7, width: 1}, y: false},
      height,
      legend: {show: false},
      padding: [8, 8, 0, 0],
      series: [
        {},
        ...series.map((item, index) => ({
          label: item.label,
          points: {show: false},
          stroke: seriesColor(tokens, item, index),
          width: LINE_WIDTH,
        })),
      ],
      width: 600,
    }

    const data = [points.timestamps, ...points.values] as unknown as uPlot.AlignedData

    return {data, options}
  }, [axis, format, height, points, series, tokens])

  const containerRef = useUplot(setup)

  const legend = useMemo(() => {
    if (!tokens) {
      return []
    }

    return series.map((item, index) => ({
      color: seriesColor(tokens, item, index),
      id: item.id,
      label: item.label,
    }))
  }, [series, tokens])

  return (
    <ChartReveal
      className={className}
      isPending={isLoading || setup === null}
      skeleton={
        <TimeSeriesChartSkeleton
          height={height}
          legendCount={series.length}
          xAxis={axis?.x !== false}
          yAxis={axis?.y !== false}
        />
      }
    >
      {legend.length > 1 && <ChartLegend items={legend} />}
      <div className="w-full" ref={containerRef} style={{height}} />
    </ChartReveal>
  )
}
