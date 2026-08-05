import {Chart, type ChartInteractionHandler, type ChartSlotViewProps, useLastReading, zyplot} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import {
  familyChartStyle,
  familyStamps,
  familyTiming,
  hasLiveDot,
  plotInsets,
  priceDomain,
  waveValues,
} from './family-chart-style'
import type {FamilyRange} from './family-data'
import {type FamilyScheme, familyColors, familyLayout} from './family-theme'

export type FamilyChartProps = ChartSlotViewProps & {
  height?: number
  /**
   * Draws the resting wave instead of the window. Nothing unmounts while it is held: the wave is
   * the same line with other values, so the data arrives as a morph rather than as a new chart.
   */
  isLoading: boolean
  onInteraction?: ChartInteractionHandler
  range: FamilyRange
  scheme: FamilyScheme
}

const PriceChart = ({
  annotationViews,
  height = familyLayout.chartHeight,
  isLoading,
  onInteraction,
  range,
  rangeView,
  scheme,
  tooltip,
}: FamilyChartProps) => {
  const live = useLastReading(range.categories, range.values)

  const chart = useMemo(() => {
    const color = familyColors[scheme]
    const isDark = scheme === 'dark'
    const domain = priceDomain(range.values)
    const values = isLoading ? waveValues(domain) : range.values
    // Only the windows that end at now get the pulse, and only they keep room for it.
    const isLive = !isLoading && live && hasLiveDot(range.id)

    return zyplot(z => ({
      /**
       * The placeholder curve is the same line with different values, so the data does not arrive —
       * the resting wave becomes it. `'morph'` is what interpolates the two on native; the web
       * renderer moves mark by mark on its own, so long as the slots keep the names they had.
       */
      animation: z.animation({
        duration: familyTiming.morph,
        easing: 'ease-in-out',
        reveal: z.reveal.draw({duration: familyTiming.draw, easing: 'ease-in-out'}),
        transition: 'morph',
        updates: true,
      }),
      annotations: isLive
        ? [
            z.annotation.point({
              color: color.trace,
              glow: z.glow({color: color.trace, opacity: isDark ? 0.3 : 0.16, radius: 6}),
              id: 'live',
              pulse: {duration: 620, interval: 1580, opacity: isDark ? 0.55 : 0.3, scale: 2.4},
              scrubOpacity: isDark ? 0.34 : 0.5,
              size: 7,
              x: live.category,
              y: live.value,
            }),
          ]
        : [],
      annotationViews,
      categories: range.categories,
      height,
      /**
       * The story so far stays lit and the rest of the window steps back, so the reading needs no
       * tooltip. Everything the finger drags is the chart's to draw — the chip above the crosshair
       * and `dot` at the head of the trail — because a view fed from a scrub handler has to cross
       * into JavaScript and back before it moves, and arrives after the finger has gone.
       */
      interaction: isLoading
        ? z.interaction({hover: 'none'})
        : z.interaction.scrub({
            // The stamps are still the chart's to place; the pill around them is the screen's own
            // view, named in `tooltip`.
            crosshairStyle: {color: color.crosshair, labels: familyStamps(range.stamps), width: 1},
            dimDuration: familyTiming.dim,
            dimOpacity: isDark ? 0.34 : 0.5,
            highlightColor: color.trace,
            marker: z.marker.trail({
              color: color.trace,
              dot: true,
              glow: z.glow({color: color.trace, opacity: isDark ? 0.16 : 0.08, radius: 7}),
              size: 11,
            }),
          }),
      // The wave is this chart's own placeholder, so the built-in one never comes up.
      isLoading: false,
      isSmooth: true,
      onInteraction,
      plot: {clip: false},
      rangeView,
      series: [
        z.series({
          color: color.trace,
          id: 'price',
          label: range.label,
          style: {glow: z.glow({opacity: isDark ? 0.18 : 0.08, radius: 7}), strokeWidth: 3},
          values,
        }),
      ],
      theme: familyChartStyle(scheme).theme,
      // The reading is the screen's to write, so the chart's own card is never drawn here.
      tooltip: tooltip ?? false,
      xAxis: {...plotInsets, visible: false},
      yAxis: {domain, visible: false},
    }))
  }, [annotationViews, height, isLoading, live, onInteraction, range, rangeView, scheme, tooltip])

  return <Chart.Line {...chart} />
}

export const FamilyChart = memo(PriceChart)
