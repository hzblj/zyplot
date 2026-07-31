import {Host, HStack} from '@expo/ui/swift-ui'
import {background, clipShape, contentShape, frame, onTapGesture, padding, shapes} from '@expo/ui/swift-ui/modifiers'
import {type StocksRangeId, stocksRanges} from '@zyplot/feature-charts/stocks'
import {ScrollView, StyleSheet} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import {StocksText} from './stocks-text.ios'

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
      <Host matchContents>
        <HStack spacing={6}>
          {stocksRanges.map(range => (
            <HStack
              key={range.id}
              modifiers={[
                padding({horizontal: 12}),
                frame({height: 32}),
                background(range.id === selected ? color.pillActive : color.pill),
                clipShape('capsule'),
                contentShape(shapes.rectangle()),
                onTapGesture(() => onSelect(range.id)),
              ]}
            >
              <StocksText size={15} weight={range.id === selected ? 'semibold' : 'medium'}>
                {range.label}
              </StocksText>
            </HStack>
          ))}
        </HStack>
      </Host>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {alignItems: 'center', paddingHorizontal: stocksLayout.gutter},
  scroller: {height: stocksLayout.slotHeight},
})
