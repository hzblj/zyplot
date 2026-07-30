'use client'

import type {EChartsType} from 'echarts/core'
import {useEffect, useRef} from 'react'
import type {ChartInteractionEvent, NativeChartAnnotation} from '../types'
import {chartGeometryEvent, readPlotRect} from './scrub-geometry'

export const useChartGeometryReport = (
  instance: EChartsType | null,
  layoutVersion: number,
  annotations: readonly NativeChartAnnotation[] | undefined,
  onInteraction?: (event: ChartInteractionEvent) => void
) => {
  const emitRef = useRef(onInteraction)
  emitRef.current = onInteraction

  useEffect(() => {
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
