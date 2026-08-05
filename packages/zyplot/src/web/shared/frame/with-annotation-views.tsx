'use client'

import type {FunctionComponent} from 'react'
import {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {
  annotationRun,
  annotationViewAligns,
  annotationViewIds,
  type ChartAnnotationRun,
  hasAnnotationView,
  hideViewedAnnotations,
  sameChartGeometry,
  slotNode,
} from '../../../shared/annotation-views'
import {type ChartSlotViewProps, resolveInteraction} from '../../../shared/chart-slots'
import type {
  ChartGeometry,
  ChartInteractionHandler,
  ChartRendererEvent,
  NativeChartAnnotation,
  NativeChartInteraction,
} from '../types'

type AnnotationHost = {
  annotations?: readonly NativeChartAnnotation[]
  interaction?: NativeChartInteraction
  onInteraction?: ChartInteractionHandler
}

const READING_GAP = 12
const CHIP_LIFT = 8

/**
 * Where a view for an annotation sits, up and down: the top it is laid at, and the share of its own
 * height it is then pulled back by.
 *
 * A rule that runs down the plot is a mark with a height of its own, so the three alignments are its
 * head, its middle and its foot; anything else is a spot, so they read as on it, above it or below it.
 * The same arithmetic iOS and Android do, so a view lands in the same place on all three.
 */
const annotationPlacement = (
  run: ChartAnnotationRun | undefined,
  align: string | undefined,
  spot: {y: number},
  plot: ChartGeometry['plot']
): {shift: string; top: number} => {
  if (run === 'down') {
    if (align === 'center') {
      return {shift: '-50%', top: plot.y + plot.height / 2}
    }

    return align === 'bottom' ? {shift: '-100%', top: plot.y + plot.height} : {shift: '0', top: plot.y}
  }

  if (align === 'top') {
    return {shift: '-100%', top: spot.y}
  }

  return align === 'bottom' ? {shift: '0', top: spot.y} : {shift: '-50%', top: spot.y}
}

export const withAnnotationViews = <Props extends AnnotationHost>(Component: FunctionComponent<Props>) => {
  // `rangeView` is taken and dropped: a span needs a second finger, so the web never has one to
  // place it against, and a prop the type promises has to be accepted wherever the type is.
  const WithAnnotationViews = ({
    annotationViews,
    rangeView: _rangeView,
    tooltip,
    ...props
  }: Props & ChartSlotViewProps) => {
    const [geometry, setGeometry] = useState<ChartGeometry | null>(null)
    const [reading, setReading] = useState<{x: number; y: number} | null>(null)
    const ids = annotationViewIds(annotationViews)
    const view = typeof tooltip === 'object' ? tooltip.view : undefined
    const hasTooltip = hasAnnotationView(view)
    const listener = useRef(props.onInteraction)
    listener.current = props.onInteraction
    const readingRef = useRef<HTMLDivElement | null>(null)

    const annotations = useMemo(() => hideViewedAnnotations(props.annotations, ids), [props.annotations, ids])
    const aligns = annotationViewAligns(annotationViews)
    /** How each annotation runs, which is what decides where a view for it can sit. */
    const runs = useMemo(
      () =>
        Object.fromEntries((props.annotations ?? []).map(item => [item.id, annotationRun(item)])) as Record<
          string,
          ChartAnnotationRun
        >,
      [props.annotations]
    )

    /**
     * Where the reading is stops here. It is what this wrapper places the app's own node with, and
     * the event the app is handed is the one the contract describes — without it.
     */
    const onInteraction = useCallback(({nativeX, nativeY, ...event}: ChartRendererEvent) => {
      const reported = event.geometry
      if (reported) {
        setGeometry(current => (sameChartGeometry(current, reported) ? current : reported))
      }
      if (event.phase === 'ended') {
        setReading(null)
      } else if (nativeX !== undefined && nativeY !== undefined) {
        setReading(current => (current?.x === nativeX && current?.y === nativeY ? current : {x: nativeX, y: nativeY}))
      }
      listener.current?.(event)
    }, [])

    /**
     * Placed against the node's own width, which is why it is set on the element rather than
     * rendered: measuring it needs it laid out, and a second render to place it would show it in
     * the wrong spot first.
     */
    useLayoutEffect(() => {
      const node = readingRef.current
      const plot = geometry?.plot
      if (!node || !plot || !reading) {
        return
      }
      const width = node.offsetWidth

      if (typeof tooltip === 'object' && tooltip.placement === 'above') {
        const lift = tooltip.lift ?? CHIP_LIFT
        const centred = reading.x - width / 2
        const room = node.parentElement?.clientWidth ?? plot.x + plot.width
        node.style.transform = `translate(${Math.min(Math.max(0, centred), Math.max(0, room - width))}px, ${plot.y - node.offsetHeight - lift}px)`
        return
      }

      const gap = (typeof tooltip === 'object' ? tooltip.gap : undefined) ?? READING_GAP
      const trailing = reading.x + gap
      const preferred = trailing + width <= plot.x + plot.width ? trailing : reading.x - gap - width
      const x = Math.min(Math.max(plot.x, preferred), Math.max(plot.x, plot.x + plot.width - width))
      /**
       * Down the plot the card sits where the anchor says: against the top by the gap, which is where
       * one read as belonging to the reading goes, or halfway down, or against the floor.
       */
      const align = typeof tooltip === 'object' ? tooltip.align : undefined
      const height = node.offsetHeight
      const y =
        align === 'center'
          ? plot.y + (plot.height - height) / 2
          : align === 'bottom'
            ? plot.y + plot.height - height - gap
            : plot.y + gap
      node.style.transform = `translate(${x}px, ${y}px)`
    }, [geometry, reading, tooltip])

    const interaction = resolveInteraction(props.interaction, tooltip)

    if (!ids && !hasTooltip) {
      return <Component {...(props as Props)} interaction={interaction} />
    }

    return (
      <div className="relative">
        <Component
          {...(props as Props)}
          annotations={annotations}
          interaction={interaction}
          onInteraction={onInteraction}
        />
        <div className="pointer-events-none absolute inset-0">
          {(geometry?.annotations ?? []).map(spot => {
            const view = annotationViews?.[spot.id]
            if (!hasAnnotationView(view) || !geometry) {
              return null
            }
            const {shift, top} = annotationPlacement(runs[spot.id], aligns?.[spot.id], spot, geometry.plot)

            return (
              <div
                className="absolute"
                key={spot.id}
                style={{left: spot.x, top, transform: `translate(-50%, ${shift})`}}
              >
                {slotNode(view)}
              </div>
            )
          })}
          {hasTooltip && reading ? (
            <div className="absolute top-0 left-0" ref={readingRef}>
              {slotNode(view)}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  WithAnnotationViews.displayName = `WithAnnotationViews(${Component.displayName ?? Component.name})`

  return Object.assign(WithAnnotationViews, Component)
}
