import {SymbolMark} from './symbol-mark'
import {cn} from './utils'

export const Wordmark = ({className}: {className?: string}) => (
  <span className={cn('inline-flex items-baseline gap-[0.1em]', className)}>
    <SymbolMark className="h-[1.05em] w-auto shrink-0 text-content-accent" />
    <span>
      <span className="sr-only">z</span>yplot
    </span>
  </span>
)
