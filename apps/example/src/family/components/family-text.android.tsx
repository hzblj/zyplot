import {Text} from '@expo/ui/jetpack-compose'
import type {ComponentProps} from 'react'
import {useFamilyTheme} from '../data/family-theme'

type ComposeModifiers = ComponentProps<typeof Text>['modifiers']

export type FamilyTextProps = {
  children: string
  color?: string
  modifiers?: ComposeModifiers
  size?: number
  weight?: 'normal' | '500' | '600' | 'bold'
}

export const FamilyText = ({children, color, modifiers, size = 15, weight = 'normal'}: FamilyTextProps) => {
  const theme = useFamilyTheme()

  return (
    <Text color={color ?? theme.color.text} modifiers={modifiers} style={{fontSize: size, fontWeight: weight}}>
      {children}
    </Text>
  )
}
