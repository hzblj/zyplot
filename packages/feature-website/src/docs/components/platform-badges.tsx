import {docsStyles} from '../../docs-styles'
import {cn} from '../../utils'
import type {ChartPlatform} from '../types'

const styles = docsStyles()

const ALL: readonly {id: ChartPlatform; label: string}[] = [
  {id: 'web', label: 'Web'},
  {id: 'ios', label: 'iOS'},
  {id: 'android', label: 'Android'},
]

export const PlatformBadges = ({platforms}: {platforms: readonly ChartPlatform[]}) => (
  <div className={styles.platformBadges()}>
    {ALL.map(({id, label}) => {
      const isSupported = platforms.includes(id)
      return (
        <span
          className={cn(styles.platformBadge(), isSupported ? styles.platformBadgeOn() : styles.platformBadgeOff())}
          key={id}
        >
          {label}
          <span className="sr-only">{isSupported ? ' supported' : ' not supported'}</span>
        </span>
      )
    })}
  </div>
)
