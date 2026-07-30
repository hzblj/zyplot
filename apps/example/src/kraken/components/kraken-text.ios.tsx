import {Text} from '@expo/ui/swift-ui'
import {
  Animation,
  animation,
  contentTransition,
  fixedSize,
  font,
  foregroundStyle,
  monospacedDigit,
} from '@expo/ui/swift-ui/modifiers'
import type {ComponentProps} from 'react'
import {useKrakenTheme} from '../data/kraken-theme'

export type KrakenTextProps = {
  children: string
  color?: string
  modifiers?: NonNullable<ComponentProps<typeof Text>['modifiers']>
  rolls?: number
  size?: number
  tabular?: boolean
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}

export const KrakenText = ({
  children,
  color,
  modifiers = [],
  rolls,
  size = 15,
  tabular = false,
  weight = 'regular',
}: KrakenTextProps) => {
  const theme = useKrakenTheme()

  return (
    <Text
      modifiers={[
        font({size, weight}),
        foregroundStyle(color ?? theme.color.text),
        ...(tabular ? [monospacedDigit()] : []),
        fixedSize(),
        ...(rolls === undefined
          ? []
          : [contentTransition('numericText'), animation(Animation.easeOut({duration: 0.22}), rolls)]),
        ...modifiers,
      ]}
    >
      {children}
    </Text>
  )
}
