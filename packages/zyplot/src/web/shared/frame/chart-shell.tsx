'use client'

import type {EChartsCoreOption} from 'echarts/core'
import {type FC, type ReactNode, useState} from 'react'

import {useChartHoverEvents, useECharts} from '../engine'
import {type ChartRevealPlan, useChartReveal} from '../reveal'
import {type ChartScrubConfig, useChartGeometryReport, useChartScrubLayer} from '../scrub'
import type {ChartInteractionEvent, ChartLegendItem, NativeChartAnnotation} from '../types'
import {ChartLegend} from './chart-legend'
import {ChartReveal} from './chart-reveal'

const DEFAULT_HEIGHT = 240

type ChartShellProps = {
  annotations?: readonly NativeChartAnnotation[]
  className?: string
  height?: number
  /** An explicit `false` at mount opts out of the placeholder: the plot fades in on its own. */
  isLoading?: boolean
  legend?: ChartLegendItem[]
  onInteraction?: (event: ChartInteractionEvent) => void
  option: EChartsCoreOption | null
  onRevealed?: () => void
  reveal?: ChartRevealPlan | null
  scrub?: ChartScrubConfig
  skeleton?: ReactNode
}

export const ChartShell: FC<ChartShellProps> = ({
  annotations,
  className,
  height = DEFAULT_HEIGHT,
  isLoading,
  legend = [],
  onInteraction,
  onRevealed,
  option,
  reveal,
  scrub,
  skeleton,
}) => {
  const isPending = isLoading === true || option === null
  const [hasPlaceholder, setHasPlaceholder] = useState(isLoading !== false)

  if (isLoading && !hasPlaceholder) {
    setHasPlaceholder(true)
  }

  const {containerRef, instance, layoutVersion} = useECharts(isPending ? null : option)

  useChartHoverEvents(instance, onInteraction, !scrub)
  useChartScrubLayer(instance, layoutVersion, scrub, onInteraction)
  useChartGeometryReport(instance, layoutVersion, scrub ? undefined : annotations, onInteraction)
  useChartReveal(instance, reveal ?? null, !isPending, onRevealed)

  return (
    <ChartReveal className={className} isPending={isPending} skeleton={hasPlaceholder ? skeleton : undefined}>
      {legend.length > 1 && <ChartLegend items={legend} />}
      <div className="w-full" ref={containerRef} style={{height}} />
    </ChartReveal>
  )
}
