import {Column, Row, Spacer} from '@expo/ui/jetpack-compose'
import {background, clip, padding, size} from '@expo/ui/jetpack-compose/modifiers'
import {quote} from '../data/quote-data'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'
import type {QuoteReadout} from '../hooks/use-quote-readout'
import {composeCircle, composeRounded} from './quote-nav-bar.android'
import {QuoteText} from './quote-text.android'

const MarketStatus = () => {
  const {color} = useQuoteTheme()

  return (
    <Row
      modifiers={[clip(composeRounded), background(color.statusChip), padding(10, 5, 10, 5)]}
      verticalAlignment="center"
    >
      <QuoteText color={color.statusChipText} size={12} weight="600">
        Pre-market
      </QuoteText>
    </Row>
  )
}

const MarketSun = () => {
  const {color} = useQuoteTheme()

  return (
    <Row
      horizontalArrangement="center"
      modifiers={[
        size(quoteLayout.statusSurface, quoteLayout.statusSurface),
        clip(composeCircle),
        background(color.pill),
      ]}
      verticalAlignment="center"
    >
      {/* U+FE0E, as in the nav bar's switch: without it this sun is painted by the emoji
          font and none of the colour above reaches it. */}
      <QuoteText color={color.statusChipText} size={13}>
        ☀︎
      </QuoteText>
    </Row>
  )
}

export const QuotePriceReadout = ({readout}: {readout: QuoteReadout}) => {
  const {color} = useQuoteTheme()

  return (
    <Column>
      <Row verticalAlignment="center">
        <Row verticalAlignment="bottom">
          <QuoteText size={36} weight="bold">
            {readout.price.whole}
          </QuoteText>
          <QuoteText size={24} weight="600">
            {`.${readout.price.fraction} ${quote.currency}`}
          </QuoteText>
        </Row>
        <Spacer modifiers={[size(8, 1)]} />
        {readout.isPreMarket && readout.isScrubbing ? <MarketStatus /> : <MarketSun />}
      </Row>
      <Row>
        <QuoteText color={color.textMuted} size={13}>
          {`${readout.amount} ${quote.currency}  `}
        </QuoteText>
        <QuoteText color={readout.isDown ? color.down : color.up} size={13} weight="500">
          {`${readout.isDown ? '▼' : '▲'} ${readout.percent}`}
        </QuoteText>
        <QuoteText color={color.textMuted} size={13}>
          {` · ${readout.subtitle}`}
        </QuoteText>
      </Row>
    </Column>
  )
}
