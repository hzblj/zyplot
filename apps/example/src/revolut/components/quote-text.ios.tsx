import {Text} from '@expo/ui/swift-ui'
import {font, foregroundStyle, monospacedDigit} from '@expo/ui/swift-ui/modifiers'
import type {ComponentProps} from 'react'
import {useQuoteTheme} from '../data/quote-theme'

export type QuoteTextProps = {
  children: string
  color?: string
  modifiers?: NonNullable<ComponentProps<typeof Text>['modifiers']>
  size?: number
  tabular?: boolean
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}

export const QuoteText = ({
  children,
  color,
  modifiers = [],
  size = 15,
  tabular = false,
  weight = 'regular',
}: QuoteTextProps) => {
  const theme = useQuoteTheme()

  return (
    <Text
      modifiers={[
        font({size, weight}),
        foregroundStyle(color ?? theme.color.text),
        ...(tabular ? [monospacedDigit()] : []),
        ...modifiers,
      ]}
    >
      {children}
    </Text>
  )
}
