import {Host, VStack} from '@expo/ui/swift-ui'
import {formatPrice, formatSigned, type StocksTickerQuote} from '@zyplot/feature-charts/stocks'
import {useStocksTheme} from '../data/stocks-theme'
import {StocksText} from './stocks-text.ios'

/** Carries its own host: the tape that lays these out is one shared React Native view. */
export const StocksTickerCell = ({quote}: {quote: StocksTickerQuote}) => {
  const {color} = useStocksTheme()

  return (
    <Host matchContents>
      <VStack alignment="leading" spacing={1}>
        <StocksText size={15} weight="bold">
          {quote.id}
        </StocksText>
        <StocksText size={19} tabular weight="bold">
          {formatPrice(quote.price)}
        </StocksText>
        <StocksText color={quote.change < 0 ? color.down : color.up} size={15} tabular weight="medium">
          {formatSigned(quote.change)}
        </StocksText>
      </VStack>
    </Host>
  )
}
