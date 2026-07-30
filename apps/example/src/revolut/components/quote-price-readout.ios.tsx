import {HStack, Image, Spacer, VStack} from '@expo/ui/swift-ui'
import {background, clipShape, frame, padding} from '@expo/ui/swift-ui/modifiers'
import {quote} from '@zyplot/feature-charts/revolut'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'
import type {QuoteReadout} from '../hooks/use-quote-readout'
import {QuoteCircleButton} from './quote-nav-bar.ios'
import {QuoteText} from './quote-text.ios'

const MarketStatus = ({isPreMarket}: {isPreMarket: boolean}) => {
  const {color} = useQuoteTheme()

  return isPreMarket ? (
    <HStack
      modifiers={[padding({horizontal: 10, vertical: 5}), background(color.statusChip), clipShape('capsule')]}
      spacing={5}
    >
      <Image color={color.statusChipText} size={11} systemName="sun.max.fill" />
      <QuoteText color={color.statusChipText} size={12} weight="semibold">
        Pre-market
      </QuoteText>
    </HStack>
  ) : (
    <HStack
      modifiers={[
        frame({height: quoteLayout.statusSurface, width: quoteLayout.statusSurface}),
        background(color.pill),
        clipShape('circle'),
      ]}
    >
      <Image color={color.statusChipText} size={13} systemName="sun.max.fill" />
    </HStack>
  )
}

export const QuotePriceReadout = ({readout}: {readout: QuoteReadout}) => {
  const {color} = useQuoteTheme()

  return (
    <VStack alignment="leading" spacing={3}>
      <HStack alignment="center" spacing={8}>
        <HStack alignment="lastTextBaseline" spacing={0}>
          <QuoteText size={36} tabular weight="bold">
            {readout.price.whole}
          </QuoteText>
          <QuoteText size={24} tabular weight="semibold">
            {`.${readout.price.fraction} ${quote.currency}`}
          </QuoteText>
        </HStack>
        <MarketStatus isPreMarket={readout.isPreMarket && readout.isScrubbing} />
        <Spacer />
        <QuoteCircleButton name="arrow.up.left.and.arrow.down.right" size={36} />
      </HStack>

      <HStack spacing={6}>
        <QuoteText color={color.textMuted} size={13} tabular>
          {`${readout.amount} ${quote.currency}`}
        </QuoteText>
        <QuoteText color={readout.isDown ? color.down : color.up} size={13} tabular weight="medium">
          {`${readout.isDown ? '▼' : '▲'} ${readout.percent}`}
        </QuoteText>
        <QuoteText color={color.textMuted} size={13}>
          {`· ${readout.subtitle}`}
        </QuoteText>
      </HStack>
    </VStack>
  )
}
