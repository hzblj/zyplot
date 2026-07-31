import {Column, Row, Spacer} from '@expo/ui/jetpack-compose'
import {background, clickable, clip, size, weight} from '@expo/ui/jetpack-compose/modifiers'
import {quote} from '@zyplot/feature-charts/revolut'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'
import {QuoteText} from './quote-text.android'

export const composeCircle = {type: 'circle'} as const
export const composeRounded = {radius: 18, type: 'roundedCorner'} as const

export const QuoteCircleButton = ({
  diameter = quoteLayout.navButton,
  glyph,
  onPress,
}: {
  diameter?: number
  glyph: string
  onPress?: () => void
}) => {
  const {color} = useQuoteTheme()

  return (
    <Row
      horizontalArrangement="center"
      modifiers={[
        size(diameter, diameter),
        clip(composeCircle),
        background(color.pill),
        ...(onPress ? [clickable(onPress)] : []),
      ]}
      verticalAlignment="center"
    >
      <QuoteText size={diameter * 0.42}>{glyph}</QuoteText>
    </Row>
  )
}

export const QuoteSymbolHeader = () => {
  const {color} = useQuoteTheme()

  return (
    <Row verticalAlignment="center">
      <Column modifiers={[weight(1)]}>
        <QuoteText size={17} weight="600">
          {`${quote.symbol} · ${quote.name}`}
        </QuoteText>
        <QuoteText color={color.textMuted} size={13}>
          {quote.industry}
        </QuoteText>
      </Column>
      <Row
        horizontalArrangement="center"
        modifiers={[size(56, 56), clip(composeCircle), background(quote.markColor)]}
        verticalAlignment="center"
      >
        <QuoteText color="#ffffff" size={30} weight="bold">
          {quote.mark}
        </QuoteText>
      </Row>
    </Row>
  )
}
