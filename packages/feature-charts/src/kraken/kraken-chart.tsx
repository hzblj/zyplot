import {Chart, type ChartInteractionHandler, type ChartSlotViewProps, zyplot} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import {GRID_SPACING, grid, plotInsets, priceDomain, rule} from './kraken-chart-style'
import {type KrakenRange, krakenCategories, krakenReading} from './kraken-data'
import {type KrakenScheme, krakenColors, krakenLayout} from './kraken-theme'

export type KrakenChartProps = ChartSlotViewProps & {
  height?: number
  isLoading: boolean
  isLatestRead: boolean
  onInteraction?: ChartInteractionHandler
  range: KrakenRange
  scheme: KrakenScheme
}

const LAST = krakenCategories[krakenCategories.length - 1] as string

const PriceChart = ({
  annotationViews,
  height = krakenLayout.chartHeight,
  isLoading,
  isLatestRead,
  onInteraction,
  range,
  rangeView,
  scheme,
  tooltip,
}: KrakenChartProps) => {
  const chart = useMemo(() => {
    const color = krakenColors[scheme]
    const dots = grid[scheme]
    const reading = krakenReading(range)
    const domain = priceDomain(reading)

    return zyplot(z => ({
      animation: z.animation({
        duration: 420,
        easing: 'ease-in-out',
        reveal: z.reveal.fade({duration: 240}),
        transition: 'morph',
        updates: true,
      }),
      annotations: [
        // The grey rule on the floor is the axis, so the fill has only the trace to read against.
        z.annotation.line({axis: 'y', color: color.divider, id: 'axis', value: domain.min, width: 1}),
        z.annotation.line({
          axis: 'y',
          color: color.chartFill,
          dash: rule.dash,
          id: 'latest',
          value: reading.last,
          width: rule.width,
        }),
        z.annotation.point({
          color: color.trace,
          halo: z.halo({color: color.chartHalo, size: 17}),
          id: 'now',
          // The dot steps back while a price further up the trace is the one being read.
          scrubOpacity: isLatestRead ? 1 : 0.45,
          size: 8,
          x: LAST,
          y: reading.last,
        }),
      ],
      annotationViews,
      categories: krakenCategories,
      height,
      interaction: z.interaction.scrub({
        crosshairStyle: {color: color.chartTrail, labels: range.pointLabels, width: 1},
        dimOpacity: 0.66,
        marker: z.marker.trail({color: color.trace}),
      }),
      isLoading,
      onInteraction,
      // The trace, its halo and the fill all reach past the plot's edges.
      plot: {clip: false},
      rangeView,
      series: [
        z.series({
          color: color.trace,
          id: 'price',
          label: range.label,
          style: {
            fill: z.fill({
              dotSize: dots.dotSize,
              // A tenth of its strength by the floor, so the paint gathers under the trace.
              fadeTo: 0.12,
              pattern: 'dots',
              spacing: GRID_SPACING,
            }),
            fillOpacity: dots.opacity,
            strokeWidth: 2.4,
          },
          values: range.values,
        }),
      ],
      // The reading is the screen's to write, so the chart's own card is never drawn here.
      tooltip: tooltip ?? false,
      xAxis: {...plotInsets, visible: false},
      yAxis: {domain, visible: false},
    }))
  }, [annotationViews, height, isLatestRead, isLoading, onInteraction, range, rangeView, scheme, tooltip])

  return <Chart.Line {...chart} />
}

export const KrakenChart = memo(PriceChart)
