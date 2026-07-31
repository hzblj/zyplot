'use client'

import type {FC} from 'react'
import {formatChartNumber} from '../shared/format'

import {Typography} from '../shared/primitives'
import {useChartFontFallback} from '../shared/tokens'
import type {ChartNumberFormat, ChartSurface} from '../shared/types'
import {cn} from '../shared/utils'

const MIN_VISIBLE_PERCENT = 1.5

/** Props for `Chart.Meter`. */
export type MeterBarProps = {
  className?: string
  /** The box the meter sits in. Merges over `Chart.Provider`. */
  surface?: ChartSurface
  format?: ChartNumberFormat
  label: string
  max: number
  /** Hides the number when the surrounding row already shows it. */
  showValue?: boolean
  value: number
}

/**
 * One value against its limit, drawn as a bar. Plain DOM rather than a canvas, so
 * a list of them stays cheap and each row does not become a plot.
 */
export const MeterBar: FC<MeterBarProps> = ({className, format, label, max, showValue = true, value}) => {
  const ratio = Math.max(0, Math.min(1, value / max))
  const percent = Math.max(MIN_VISIBLE_PERCENT, ratio * 100)
  const fontFamily = useChartFontFallback()

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)} style={{fontFamily}}>
      <div className="flex items-baseline justify-between gap-3">
        <Typography color="secondary" variant="footnote">
          {label}
        </Typography>
        {showValue && (
          <Typography as="span" color="primary" variant="footnote-medium">
            <span className="tabular-nums">
              {formatChartNumber(value, format)} / {formatChartNumber(max, format)}
            </span>
          </Typography>
        )}
      </div>

      <div
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={value}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-chart-track"
        role="meter"
      >
        <div className="h-full rounded-full bg-chart-1" style={{width: `${percent}%`}} />
      </div>
    </div>
  )
}
