import {type StocksRangeId, stocksRanges} from '@zyplot/feature-charts/stocks'
import {Pressable, ScrollView, StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import {StocksText} from './stocks-text'

export type StocksRangePillsProps = {
  onSelect: (id: StocksRangeId) => void
  selected: StocksRangeId
}

/**
 * Eleven ranges do not fit on a phone, so the row scrolls. Where it is scrolled to is the
 * reader's, not ours: nothing here moves it, so the row a finger left in place is the row it
 * comes back to.
 */
export const StocksRangePills = ({onSelect, selected}: StocksRangePillsProps) => {
  const {color} = useStocksTheme()

  return (
    <ScrollView
      contentContainerStyle={styles.row}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroller}
    >
      {stocksRanges.map(range => (
        <Pressable key={range.id} onPress={() => onSelect(range.id)} style={styles.pill}>
          <View style={[styles.capsule, {backgroundColor: range.id === selected ? color.pillActive : color.pill}]}>
            <StocksText size={15} weight={range.id === selected ? '600' : '500'}>
              {range.label}
            </StocksText>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  capsule: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  pill: {cursor: 'pointer'},
  row: {alignItems: 'center', gap: 6, paddingHorizontal: stocksLayout.gutter},
  scroller: {height: stocksLayout.slotHeight},
})
