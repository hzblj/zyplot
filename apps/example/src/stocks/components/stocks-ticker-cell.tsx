import {formatPrice, formatSigned, type StocksTickerQuote} from '@zyplot/feature-charts/stocks'
import {StyleSheet, View} from 'react-native'
import {useStocksTheme} from '../data/stocks-theme'
import {StocksText} from './stocks-text'

export const StocksTickerCell = ({quote}: {quote: StocksTickerQuote}) => {
  const {color} = useStocksTheme()

  return (
    <View style={styles.cell}>
      <StocksText size={15} weight="bold">
        {quote.id}
      </StocksText>
      <StocksText size={19} tabular weight="bold">
        {formatPrice(quote.price)}
      </StocksText>
      <StocksText color={quote.change < 0 ? color.down : color.up} size={15} tabular weight="500">
        {formatSigned(quote.change)}
      </StocksText>
    </View>
  )
}

const styles = StyleSheet.create({
  cell: {gap: 1, justifyContent: 'center'},
})
