import {stocksStatColumns} from '@zyplot/feature-charts/stocks'
import {Fragment} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import {StocksText} from './stocks-text'

/**
 * The figures under the plot. Every row states its height and the rule states its own, so the
 * rhythm is the same one the phones keep and the rule ends on the last baseline rather than
 * under the last descender.
 *
 * A browser is wider than four columns need, so the space between them takes the slack and the
 * rules ride centred in it. Narrow the window and those spaces fall back to the width they carry
 * on a phone, and the grid scrolls sideways again.
 */
export const StocksStats = () => {
  const {color} = useStocksTheme()

  return (
    <ScrollView contentContainerStyle={styles.row} horizontal showsHorizontalScrollIndicator={false}>
      {stocksStatColumns.map((column, index) => (
        <Fragment key={column[0]?.id}>
          {index === 0 ? null : (
            <View style={styles.divide}>
              <View style={[styles.rule, {backgroundColor: color.divider}]} />
            </View>
          )}
          <View style={styles.column}>
            {column.map(stat => (
              <View key={stat.id} style={styles.stat}>
                <StocksText color={color.textMuted} size={15}>
                  {stat.label}
                </StocksText>
                <StocksText size={15} tabular weight="500">
                  {stat.value}
                </StocksText>
              </View>
            ))}
          </View>
        </Fragment>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  column: {width: stocksLayout.stat.column},
  divide: {
    alignItems: 'center',
    flex: 1,
    minWidth: stocksLayout.stat.gap * 2 + stocksLayout.stat.rule.width,
  },
  row: {flexGrow: 1, paddingHorizontal: stocksLayout.gutter},
  rule: stocksLayout.stat.rule,
  stat: {
    alignItems: 'center',
    flexDirection: 'row',
    height: stocksLayout.stat.row,
    justifyContent: 'space-between',
  },
})
