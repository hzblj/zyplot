import {Host, HStack, Spacer, VStack} from '@expo/ui/swift-ui'
import {frame} from '@expo/ui/swift-ui/modifiers'
import {stocksStatColumns} from '@zyplot/feature-charts/stocks'
import {ScrollView, StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import {StocksText} from './stocks-text.ios'

/**
 * The figures under the plot. Four columns of three is more than a phone is wide, so the grid
 * scrolls sideways and the rule between two columns is what says there is more of it.
 *
 * Every row states its own width, so the spacer between label and value has a bound to divide.
 * Inside a horizontal scroller there is otherwise none, and the value goes off the screen. It
 * states its height too, so the rhythm is the one the other renderers keep.
 */
export const StocksStats = () => {
  const {color} = useStocksTheme()

  return (
    <ScrollView contentContainerStyle={styles.row} horizontal showsHorizontalScrollIndicator={false}>
      {stocksStatColumns.map((column, index) => (
        <View key={column[0]?.id} style={styles.group}>
          {index === 0 ? null : <View style={[styles.rule, {backgroundColor: color.divider}]} />}
          <Host matchContents>
            <VStack spacing={0}>
              {column.map(stat => (
                <HStack
                  key={stat.id}
                  modifiers={[frame({height: stocksLayout.stat.row, width: stocksLayout.stat.column})]}
                  spacing={0}
                >
                  <StocksText color={color.textMuted} size={15}>
                    {stat.label}
                  </StocksText>
                  <Spacer />
                  <StocksText size={15} tabular weight="medium">
                    {stat.value}
                  </StocksText>
                </HStack>
              ))}
            </VStack>
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
