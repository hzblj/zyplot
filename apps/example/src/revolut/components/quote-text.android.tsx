import {Text} from '@expo/ui/jetpack-compose'
import type {ComponentProps} from 'react'
import {useQuoteTheme} from '../data/quote-theme'

type ComposeModifiers = ComponentProps<typeof Text>['modifiers']

export type QuoteTextProps = {
  children: string
  color?: string
  modifiers?: ComposeModifiers
  size?: number
  weight?: 'normal' | '500' | '600' | 'bold'
}

export const QuoteText = ({children, color, modifiers, size = 15, weight = 'normal'}: QuoteTextProps) => {
  const theme = useQuoteTheme()

  return (
    <Text color={color ?? theme.color.text} modifiers={modifiers} style={{fontSize: size, fontWeight: weight}}>
      {children}
    </Text>
  )
}
