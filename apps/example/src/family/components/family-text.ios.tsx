import {Text} from '@expo/ui/swift-ui'
import {font, foregroundStyle, monospacedDigit} from '@expo/ui/swift-ui/modifiers'
import type {ComponentProps} from 'react'
import {useFamilyTheme} from '../data/family-theme'

export type FamilyTextProps = {
  children: string
  color?: string
  modifiers?: NonNullable<ComponentProps<typeof Text>['modifiers']>
  size?: number
  tabular?: boolean
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}

export const FamilyText = ({
  children,
  color,
  modifiers = [],
  size = 15,
  tabular = false,
  weight = 'regular',
}: FamilyTextProps) => {
  const theme = useFamilyTheme()

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
