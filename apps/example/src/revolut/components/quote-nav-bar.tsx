import {quote} from '@zyplot/feature-charts/revolut'
import {Pressable, StyleSheet, View} from 'react-native'
import {setColorScheme} from '../../theme/color-scheme'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'
import {QuoteText} from './quote-text'

const schemeGlyph = {dark: '☾', light: '☀︎'} as const

export const QuoteCircleButton = ({
  diameter = quoteLayout.navButton,
  glyph,
  onPress,
}: {
  diameter?: number
  glyph: string
  onPress?: () => void
}) => {
  const {color} = useQuoteTheme()

  return (
    <Pressable
      onPress={onPress}
      style={({hovered, pressed}) => [
        styles.circle,
        {
          backgroundColor: pressed || hovered ? color.pillPressed : color.pill,
          borderRadius: diameter / 2,
          height: diameter,
          width: diameter,
        },
      ]}
    >
      <QuoteText size={diameter * 0.42}>{glyph}</QuoteText>
    </Pressable>
  )
}

export const QuoteNavBar = ({onBack}: {onBack: () => void}) => {
  const {scheme} = useQuoteTheme()
  const next = scheme === 'dark' ? 'light' : 'dark'

  return (
    <View style={styles.bar}>
      <QuoteCircleButton glyph="‹" onPress={onBack} />
      <View style={styles.barEnd}>
        <QuoteCircleButton glyph="○" />
        <QuoteCircleButton glyph={schemeGlyph[next]} onPress={() => setColorScheme(next)} />
      </View>
    </View>
  )
}

export const QuoteSymbolHeader = () => {
  const {color} = useQuoteTheme()

  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <QuoteText size={17} weight="600">
          {`${quote.symbol} · ${quote.name}`}
        </QuoteText>
        <QuoteText color={color.textMuted} size={13}>
          {quote.industry}
        </QuoteText>
      </View>
      <View style={[styles.mark, {backgroundColor: quote.markColor}]}>
        <QuoteText color="#ffffff" size={30} weight="bold">
          {quote.mark}
        </QuoteText>
      </View>
    </View>
  )
}

const MARK = 56

const styles = StyleSheet.create({
  bar: {alignItems: 'center', flexDirection: 'row', height: quoteLayout.navButton, justifyContent: 'space-between'},
  barEnd: {alignItems: 'center', flexDirection: 'row', gap: 12},
  circle: {alignItems: 'center', cursor: 'pointer', justifyContent: 'center'},
  header: {alignItems: 'center', flexDirection: 'row', gap: 12},
  headerText: {flex: 1, gap: 2},
  mark: {alignItems: 'center', borderRadius: MARK / 2, height: MARK, justifyContent: 'center', width: MARK},
})
