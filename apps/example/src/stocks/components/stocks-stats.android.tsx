import {Column, Host, Row} from '@expo/ui/jetpack-compose'
import {size} from '@expo/ui/jetpack-compose/modifiers'
import {stocksStatColumns} from '@zyplot/feature-charts/stocks'
import {ScrollView, StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import {StocksText} from './stocks-text.android'

/**
 * The figures under the plot. Four columns of three is more than a phone is wide, so the grid
 * scrolls sideways and the rule between two columns is what says there is more of it.
 *
 * Every row states its own width and pushes its two ends apart. A weighted spacer would want a
 * bound to divide, and inside a horizontal scroller there is none — the row would take the
 * whole scrollable extent and carry its value off the screen with it. It states its height too,
 * so the rhythm is the one the other renderers keep.
 */
export const StocksStats = () => {
  const {color} = useStocksTheme()

  return (
    <ScrollView contentContainerStyle={styles.row} horizontal showsHorizontalScrollIndicator={false}>
      {stocksStatColumns.map((column, index) => (
        <View key={column[0]?.id} style={styles.group}>
          {index === 0 ? null : <View style={[styles.rule, {backgroundColor: color.divider}]} />}
          <Host matchContents>
            <Column>
              {column.map(stat => (
                <Row
                  horizontalArrangement="spaceBetween"
                  key={stat.id}
                  modifiers={[size(stocksLayout.stat.column, stocksLayout.stat.row)]}
                  verticalAlignment="center"
                >
                  <StocksText color={color.textMuted} size={15}>
                    {stat.label}
                  </StocksText>
                  <StocksText size={15} weight="500">
                    {stat.value}
                  </StocksText>
                </Row>
              ))}
            </Column>
          </Host>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  group: {flexDirection: 'row'},
  row: {paddingHorizontal: stocksLayout.gutter},
  rule: {alignSelf: 'flex-start', marginHorizontal: stocksLayout.stat.gap, ...stocksLayout.stat.rule},
})
