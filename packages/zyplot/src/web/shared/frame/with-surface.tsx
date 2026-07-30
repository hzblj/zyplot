'use client'

import {type ChartSurface, mergeChartSurface, resolveChartSurfacePadding} from '@hzblj/zyplot-core'
import type {CSSProperties, FunctionComponent} from 'react'
import {useChartSurface} from '../theme/chart-provider'

export const withSurface = <Props extends {surface?: ChartSurface}>(Component: FunctionComponent<Props>) => {
  const WithSurface = ({surface, ...props}: Props) => {
    const inherited = useChartSurface()
    const resolved = mergeChartSurface(inherited, surface)

    if (!resolved) {
      return <Component {...(props as Props)} />
    }

    const padding = resolveChartSurfacePadding(resolved.padding)
    const style: CSSProperties = {
      background: resolved.background,
      borderColor: resolved.border?.color,
      borderRadius: resolved.cornerRadius,
      borderStyle: resolved.border ? 'solid' : undefined,
      borderWidth: resolved.border?.width,
      paddingBottom: padding?.bottom,
      paddingLeft: padding?.left,
      paddingRight: padding?.right,
      paddingTop: padding?.top,
    }

    return (
      <div style={style}>
        <Component {...(props as Props)} />
      </div>
    )
  }

  WithSurface.displayName = `WithSurface(${Component.displayName ?? Component.name})`
  return Object.assign(WithSurface, Component)
}
