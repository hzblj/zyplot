import {Chart, series, seriesProps} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import {stepsChartStyle} from './steps-chart-style'
import type {StepsRange} from './steps-data'
import {type StepsScheme, stepsLayout} from './steps-theme'

export type StepsChartProps = {
  height?: number
  isLoading: boolean
  onInteraction?: Parameters<typeof Chart.Bar>[0]['onInteraction']
  range: StepsRange
  scheme: StepsScheme
}

const BarChart = ({height = stepsLayout.chartHeight, isLoading, onInteraction, range, scheme}: StepsChartProps) => {
  const style = stepsChartStyle(scheme)
  const bars = useMemo(
    () =>
      seriesProps([
        series({
          id: 'steps',
          label: 'Steps',
          style: style.barStyle,
          values: range.values,
        }),
      ]),
    [range, style]
  )

  return (
    <Chart.Bar
      {...bars}
      animation={style.arrival}
      categories={range.categories}
      height={height}
      interaction={style.reading}
      isLoading={isLoading}
      onInteraction={onInteraction}
      theme={style.theme}
      xAxis={style.xAxis(range)}
      yAxis={style.valueAxis(range)}
    />
  )
}

export const StepsChart = memo(BarChart)
