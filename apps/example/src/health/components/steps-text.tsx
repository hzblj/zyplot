import {type StyleProp, StyleSheet, Text, type TextStyle} from 'react-native'
import {useStepsTheme} from '../data/steps-theme'

export type StepsTextProps = {
  children: string
  color?: string
  size?: number
  style?: StyleProp<TextStyle>
  tabular?: boolean
  tracking?: number
  weight?: '500' | '600' | 'bold' | 'normal'
}

export const StepsText = ({
  children,
  color,
  size = 15,
  style,
  tabular = false,
  tracking,
  weight = 'normal',
}: StepsTextProps) => {
  const theme = useStepsTheme()

  return (
    <Text
      style={[
        {color: color ?? theme.color.text, fontSize: size, fontWeight: weight, letterSpacing: tracking},
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
