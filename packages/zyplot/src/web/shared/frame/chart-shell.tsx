'use client'

import type {EChartsCoreOption} from 'echarts/core'
import type {FC, ReactNode} from 'react'

import {useChartHoverEvents, useECharts} from '../engine'
import {type ChartRevealPlan, useChartReveal} from '../reveal'
import {type ChartScrubConfig, useChartGeometryReport, useChartScrubLayer} from '../scrub'
import type {ChartInteractionEvent, ChartLegendItem, NativeChartAnnotation} from '../types'
import {ChartLegend} from './chart-legend'
import {ChartReveal} from './chart-reveal'

const DEFAULT_HEIGHT = 240

type ChartShellProps = {
  /**
   * What the chart drew on top of the data, so where each one landed can be reported
   * with the plot's box. A form with a `scrub` layer leaves this out: that layer has
   * measured the plot already and reports the geometry itself.
   */
  annotations?: readonly NativeChartAnnotation[]
  className?: string
  height?: number
  isLoading?: boolean
  legend?: ChartLegendItem[]
  onInteraction?: (event: ChartInteractionEvent) => void
  option: EChartsCoreOption | null
  /** Called once a traced entrance has finished, so its flash is not built again. */
  onRevealed?: () => void
  /** The part of a traced entrance that runs after the marks have landed. */
  reveal?: ChartRevealPlan | null
  /**
   * Turns the pointer into a scrub: phases and the read datum's index through
   * `onInteraction`, the crosshair and marker over the plot. A chart form that has no
   * continuous reading leaves it out and reports hovers instead.
   */
  scrub?: ChartScrubConfig
  skeleton?: ReactNode
}

export const ChartShell: FC<ChartShellProps> = ({
  annotations,
  className,
  height = DEFAULT_HEIGHT,
  isLoading = false,
  legend = [],
  onInteraction,
  onRevealed,
  option,
  reveal,
  scrub,
  skeleton,
}) => {
  /**
   * The marks are not drawn while the placeholder is up. ECharts animates an entrance on the
   * first option it is given, and behind a skeleton that is an entrance nobody sees — the
   * plot would cross-fade in with the trace already part-drawn, or already finished.
   */
  const isPending = isLoading || option === null
  const {containerRef, instance, layoutVersion} = useECharts(isPending ? null : option)

  useChartHoverEvents(instance, onInteraction, !scrub)
  useChartScrubLayer(instance, layoutVersion, scrub, onInteraction)
  useChartGeometryReport(instance, layoutVersion, scrub ? undefined : annotations, onInteraction)
  useChartReveal(instance, reveal ?? null, !isPending, onRevealed)

  return (
    <ChartReveal className={className} isPending={isPending} skeleton={skeleton}>
      {legend.length > 1 && <ChartLegend items={legend} />}
      <div className="w-full" ref={containerRef} style={{height}} />
    </ChartReveal>
  )
}
