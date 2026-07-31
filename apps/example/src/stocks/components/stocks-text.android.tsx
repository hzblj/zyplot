import {Text} from '@expo/ui/jetpack-compose'
import type {ComponentProps} from 'react'
import {useStocksTheme} from '../data/stocks-theme'

type ComposeModifiers = ComponentProps<typeof Text>['modifiers']

export type StocksTextProps = {
  children: string
  color?: string
  modifiers?: ComposeModifiers
  size?: number
  weight?: 'normal' | '500' | '600' | 'bold'
}

export const StocksText = ({children, color, modifiers, size = 15, weight = 'normal'}: StocksTextProps) => {
  const theme = useStocksTheme()

  return (
    <Text color={color ?? theme.color.text} modifiers={modifiers} style={{fontSize: size, fontWeight: weight}}>
      {children}
    </Text>
  )
}
