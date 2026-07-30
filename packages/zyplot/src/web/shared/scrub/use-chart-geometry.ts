'use client'

import type {EChartsType} from 'echarts/core'
import {useEffect, useRef} from 'react'
import type {ChartInteractionEvent, NativeChartAnnotation} from '../types'
import {chartGeometryEvent, readPlotRect} from './scrub-geometry'

/**
 * Where the plot and its annotations ended up, reported as the `'layout'` phase.
 *
 * The scrub layer already does this for the forms that have one, because it has measured
 * the plot anyway. This is the same report for the forms that don't: a chart with no
 * continuous reading still has annotations, and an app still places its own views on them.
 */
export const useChartGeometryReport = (
  instance: EChartsType | null,
  layoutVersion: number,
  annotations: readonly NativeChartAnnotation[] | undefined,
  onInteraction?: (event: ChartInteractionEvent) => void
) => {
  const emitRef = useRef(onInteraction)
  emitRef.current = onInteraction

  useEffect(() => {
    // Nothing has been measured before the first option is applied: no grid, no geometry.
    if (!instance || !annotations?.length || layoutVersion === 0) {
      return
    }

    const plot = readPlotRect(instance)
    if (!plot) {
      return
    }

    emitRef.current?.({geometry: chartGeometryEvent(instance, annotations, plot), phase: 'layout'})
  }, [annotations, instance, layoutVersion])
}
