'use client'

import type {FC, ReactNode} from 'react'
import {Typography} from '../primitives'
import {useChartFontFallback} from '../tokens'
import {cn} from '../utils'

type ChartFrameProps = {
  actions?: ReactNode
  caption?: string
  children: ReactNode
  className?: string
  description?: string
  title?: string
}

export const ChartFrame: FC<ChartFrameProps> = ({actions, caption, children, className, description, title}) => {
  const fontFamily = useChartFontFallback()

  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-xl border-[0.5px] border-border-tertiary bg-surface-secondary p-4 shadow-card-default',
        className
      )}
      style={{fontFamily}}
    >
      {(title || description || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            {title && (
              <Typography as="h3" color="primary" variant="card-title">
                {title}
              </Typography>
            )}
            {description && (
              <Typography color="secondary" variant="footnote">
                {description}
              </Typography>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}

      {children}

      {caption && (
        <Typography color="tertiary" variant="caption">
          {caption}
        </Typography>
      )}
    </section>
  )
}
