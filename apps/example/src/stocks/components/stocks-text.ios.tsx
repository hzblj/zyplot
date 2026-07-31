import {Text} from '@expo/ui/swift-ui'
import {fixedSize, font, foregroundStyle, monospacedDigit} from '@expo/ui/swift-ui/modifiers'
import type {ComponentProps} from 'react'
import {useStocksTheme} from '../data/stocks-theme'

export type StocksTextProps = {
  children: string
  color?: string
  modifiers?: NonNullable<ComponentProps<typeof Text>['modifiers']>
  size?: number
  tabular?: boolean
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}

export const StocksText = ({
  children,
  color,
  modifiers = [],
  size = 15,
  tabular = false,
  weight = 'regular',
}: StocksTextProps) => {
  const theme = useStocksTheme()

  return (
    <Text
      modifiers={[
        font({size, weight}),
        foregroundStyle(color ?? theme.color.text),
        ...(tabular ? [monospacedDigit()] : []),
        fixedSize(),
        ...modifiers,
      ]}
    >
      {children}
    </Text>
  )
}
