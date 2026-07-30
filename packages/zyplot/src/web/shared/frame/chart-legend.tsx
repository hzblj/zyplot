import type {FC} from 'react'
import {Typography} from '../primitives'
import type {ChartLegendItem} from '../types'
import {cn} from '../utils'

type ChartLegendProps = {
  className?: string
  items: ChartLegendItem[]
}

export const ChartLegend: FC<ChartLegendProps> = ({className, items}) => (
  <ul className={cn('flex list-none flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
    {items.map(item => (
      <li className="flex items-center gap-1.5" key={item.id}>
        <span aria-hidden className="size-2 shrink-0 rounded-[2px]" style={{background: item.color}} />
        <Typography as="span" color="secondary" variant="footnote">
          {item.label}
        </Typography>
      </li>
    ))}
  </ul>
)
