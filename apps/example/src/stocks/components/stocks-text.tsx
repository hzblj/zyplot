import {type StyleProp, StyleSheet, Text, type TextStyle} from 'react-native'
import {useStocksTheme} from '../data/stocks-theme'

export type StocksTextProps = {
  children: string
  color?: string
  size?: number
  style?: StyleProp<TextStyle>
  tabular?: boolean
  weight?: 'normal' | '500' | '600' | 'bold'
}

export const StocksText = ({
  children,
  color,
  size = 15,
  style,
  tabular = false,
  weight = 'normal',
}: StocksTextProps) => {
  const theme = useStocksTheme()

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
