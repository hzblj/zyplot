import {type StyleProp, StyleSheet, Text, type TextStyle} from 'react-native'
import {useFamilyTheme} from '../data/family-theme'

export type FamilyTextProps = {
  children: string
  color?: string
  size?: number
  style?: StyleProp<TextStyle>
  tabular?: boolean
  weight?: 'normal' | '500' | '600' | 'bold'
}

export const FamilyText = ({
  children,
  color,
  size = 15,
  style,
  tabular = false,
  weight = 'normal',
}: FamilyTextProps) => {
  const theme = useFamilyTheme()

  return (
    <Text
      style={[
        {color: color ?? theme.color.text, fontSize: size, fontWeight: weight},
        tabular ? styles.tabular : null,
        style,
      ]}
    >
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  tabular: {fontVariant: ['tabular-nums']},
})
