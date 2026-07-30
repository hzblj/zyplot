import {type QuoteRangeId, quoteRanges} from '@zyplot/feature-charts/revolut'
import {Pressable, StyleSheet, View} from 'react-native'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'
import {QuoteCircleButton} from './quote-nav-bar'
import {QuoteText} from './quote-text'

export type QuoteRangeSelectorProps = {
  isCandlestick: boolean
  onSelect: (id: QuoteRangeId) => void
  onToggleCandlestick: () => void
  selected: QuoteRangeId
}

export const QuoteRangeSelector = ({
  isCandlestick,
  onSelect,
  onToggleCandlestick,
  selected,
}: QuoteRangeSelectorProps) => {
  const {color} = useQuoteTheme()

  return (
    <View style={styles.row}>
      <View style={[styles.track, {backgroundColor: color.pill}]}>
        {quoteRanges.map(range => (
          <Pressable
            key={range.id}
            onPress={() => onSelect(range.id)}
            style={({hovered}) => [
              styles.segment,
              range.id === selected
                ? {backgroundColor: color.pillActive}
                : hovered
                  ? {backgroundColor: color.pillPressed, opacity: 0.4}
                  : null,
            ]}
          >
            <QuoteText color={range.id === selected ? color.text : color.textMuted} size={13} weight="500">
              {range.label}
            </QuoteText>
          </Pressable>
        ))}
      </View>

      <QuoteCircleButton
        diameter={quoteLayout.controlHeight}
        glyph={isCandlestick ? '∿' : '≡'}
        onPress={onToggleCandlestick}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {alignItems: 'center', flexDirection: 'row', gap: 8},
  segment: {
    alignItems: 'center',
    borderRadius: 15,
    cursor: 'pointer',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 7,
  },
  track: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    flexDirection: 'row',
    height: quoteLayout.controlHeight,
    padding: 3,
  },
})
