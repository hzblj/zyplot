import {Column, Host} from '@expo/ui/jetpack-compose'
import {formatPrice, formatSigned, type StocksTickerQuote} from '@zyplot/feature-charts/stocks'
import {useStocksTheme} from '../data/stocks-theme'
import {StocksText} from './stocks-text.android'

/** Carries its own host: the tape that lays these out is one shared React Native view. */
export const StocksTickerCell = ({quote}: {quote: StocksTickerQuote}) => {
  const {color} = useStocksTheme()

  return (
    <Host matchContents>
      <Column>
        <StocksText size={15} weight="bold">
          {quote.id}
        </StocksText>
        <StocksText size={19} weight="bold">
          {formatPrice(quote.price)}
        </StocksText>
        <StocksText color={quote.change < 0 ? color.down : color.up} size={15} weight="500">
          {formatSigned(quote.change)}
        </StocksText>
      </Column>
    </Host>
  )
}
