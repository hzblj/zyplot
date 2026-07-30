import {Text} from '@expo/ui/jetpack-compose'
import type {ComponentProps} from 'react'
import {useKrakenTheme} from '../data/kraken-theme'

type ComposeModifiers = ComponentProps<typeof Text>['modifiers']

export type KrakenTextProps = {
  children: string
  color?: string
  modifiers?: ComposeModifiers
  size?: number
  weight?: 'normal' | '500' | '600' | 'bold'
}

export const KrakenText = ({children, color, modifiers, size = 15, weight = 'normal'}: KrakenTextProps) => {
  const theme = useKrakenTheme()

  return (
    <Text color={color ?? theme.color.text} modifiers={modifiers} style={{fontSize: size, fontWeight: weight}}>
      {children}
    </Text>
  )
}
