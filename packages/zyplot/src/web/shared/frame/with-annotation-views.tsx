'use client'

import type {FunctionComponent} from 'react'
import {useCallback, useMemo, useRef, useState} from 'react'
import {
  annotationViewIds,
  type ChartAnnotationViewProps,
  hasAnnotationView,
  hideViewedAnnotations,
  sameChartGeometry,
} from '../../../shared/annotation-views'
import type {ChartGeometry, ChartInteractionEvent, NativeChartAnnotation} from '../types'

type AnnotationHost = {
  annotations?: readonly NativeChartAnnotation[]
  onInteraction?: (event: ChartInteractionEvent) => void
}

/**
 * Lays the app's own views over the chart, one per annotation that has one.
 *
 * The chart reports where every annotation landed as it lays out, which is all the app
 * used to be given: the placing, the measuring and the state behind it were left to it.
 * They live here now, so a live price, a badge or a logo on a mark is one prop.
 */
export const withAnnotationViews = <Props extends AnnotationHost>(Component: FunctionComponent<Props>) => {
  const WithAnnotationViews = ({annotationViews, ...props}: Props & ChartAnnotationViewProps) => {
    const [geometry, setGeometry] = useState<ChartGeometry | null>(null)
    const ids = annotationViewIds(annotationViews)
    /** Read inside a handler the chart's own memos can hold on to. */
    const listener = useRef(props.onInteraction)
    listener.current = props.onInteraction

    const annotations = useMemo(() => hideViewedAnnotations(props.annotations, ids), [props.annotations, ids])

    const onInteraction = useCallback((event: ChartInteractionEvent) => {
      const reported = event.geometry
      if (reported) {
        setGeometry(current => (sameChartGeometry(current, reported) ? current : reported))
      }
      listener.current?.(event)
    }, [])

    if (!ids) {
      return <Component {...(props as Props)} />
    }

    return (
      <div className="relative">
        <Component {...(props as Props)} annotations={annotations} onInteraction={onInteraction} />
        <div className="pointer-events-none absolute inset-0">
          {(geometry?.annotations ?? []).map(spot => {
            const view = annotationViews?.[spot.id]

            return !hasAnnotationView(view) ? null : (
              // Centred on the spot rather than hung off it, because that is where a dot, a
              // badge or a price belongs.
              <div
                className="absolute"
                key={spot.id}
                style={{left: spot.x, top: spot.y, transform: 'translate(-50%, -50%)'}}
              >
                {view}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  WithAnnotationViews.displayName = `WithAnnotationViews(${Component.displayName ?? Component.name})`

  return Object.assign(WithAnnotationViews, Component)
}
