import {type StyleProp, StyleSheet, Text, type TextStyle} from 'react-native'
import {useQuoteTheme} from '../data/quote-theme'

export type QuoteTextProps = {
  children: string
  color?: string
  size?: number
  style?: StyleProp<TextStyle>
  tabular?: boolean
  weight?: 'normal' | '500' | '600' | 'bold'
}

export const QuoteText = ({children, color, size = 15, style, tabular = false, weight = 'normal'}: QuoteTextProps) => {
  const theme = useQuoteTheme()

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
