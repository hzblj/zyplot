import {Host, Row} from '@expo/ui/jetpack-compose'
import {background, clickable, clip, height, padding} from '@expo/ui/jetpack-compose/modifiers'
import {type StocksRangeId, stocksRanges} from '@zyplot/feature-charts/stocks'
import {ScrollView, StyleSheet} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import {StocksText} from './stocks-text.android'

export type StocksRangePillsProps = {
  onSelect: (id: StocksRangeId) => void
  selected: StocksRangeId
}

const CAPSULE = {radius: 16, type: 'roundedCorner'} as const

/**
 * Eleven ranges do not fit on a phone, so the row scrolls. Where it is scrolled to is the
 * reader's, not ours: nothing here moves it, so the row a finger left in place is the row it
 * comes back to.
 *
 * Each pill is its own host, rather than one host holding the whole row. A Compose row measures
 * against the width it is handed, and inside a scroller that is the screen — so the ranges past
 * the edge were measured away and there was nothing left to scroll to. Handing the row to the
 * scroller instead gives it a content width that is the sum of the pills.
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
        <Host key={range.id} matchContents>
          <Row
            horizontalArrangement="center"
            modifiers={[
              padding(3, 0, 3, 0),
              height(32),
              clip(CAPSULE),
              background(range.id === selected ? color.pillActive : 'transparent'),
              clickable(() => onSelect(range.id)),
              padding(12, 0, 12, 0),
            ]}
            verticalAlignment="center"
          >
            <StocksText size={15} weight={range.id === selected ? '600' : '500'}>
              {range.label}
            </StocksText>
          </Row>
        </Host>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {alignItems: 'center', paddingHorizontal: stocksLayout.gutter},
  scroller: {height: stocksLayout.slotHeight},
})
