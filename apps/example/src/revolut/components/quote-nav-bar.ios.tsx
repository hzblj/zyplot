import {HStack, Image, Spacer, VStack} from '@expo/ui/swift-ui'
import {background, clipShape, frame, onTapGesture} from '@expo/ui/swift-ui/modifiers'
import type {SFSymbol} from 'sf-symbols-typescript'
import {setColorScheme} from '../../theme/color-scheme'
import {quote} from '../data/quote-data'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'
import {QuoteText} from './quote-text.ios'

/** The switch offers the scheme it moves to, so the symbol is the one you are not in. */
const schemeSymbol = {dark: 'moon.fill', light: 'sun.max.fill'} as const satisfies Record<string, SFSymbol>

export const QuoteCircleButton = ({
  name,
  onPress,
  size = quoteLayout.navButton,
}: {
  name: SFSymbol
  onPress?: () => void
  size?: number
}) => {
  const {color} = useQuoteTheme()

  return (
    <HStack
      modifiers={[
        frame({height: size, width: size}),
        background(color.pill),
        clipShape('circle'),
        ...(onPress ? [onTapGesture(onPress)] : []),
      ]}
    >
      <Image color={color.text} size={size * 0.38} systemName={name} />
    </HStack>
  )
}

/**
 * The star the app this is modelled on puts here is a switch between light and dark instead:
 * the screen is what the two schemes are being shown on, so the control belongs on it.
 */
export const QuoteNavBar = ({onBack}: {onBack: () => void}) => {
  const {scheme} = useQuoteTheme()
  const next = scheme === 'dark' ? 'light' : 'dark'

  return (
    <HStack modifiers={[frame({height: quoteLayout.navButton})]} spacing={12}>
      <QuoteCircleButton name="chevron.left" onPress={onBack} />
      <Spacer />
      <QuoteCircleButton name="bell.badge" />
      <QuoteCircleButton name={schemeSymbol[next]} onPress={() => setColorScheme(next)} />
    </HStack>
  )
}

export const QuoteSymbolHeader = () => {
  const {color} = useQuoteTheme()

  return (
    <HStack spacing={12}>
      <VStack alignment="leading" spacing={2}>
        <QuoteText size={17} weight="semibold">
          {`${quote.symbol} · ${quote.name}`}
        </QuoteText>
        <QuoteText color={color.textMuted} size={13}>
          {quote.industry}
        </QuoteText>
      </VStack>
      <Spacer />
      <HStack modifiers={[frame({height: 56, width: 56}), background(quote.markColor), clipShape('circle')]}>
        <QuoteText color="#ffffff" size={30} weight="bold">
          {quote.mark}
        </QuoteText>
      </HStack>
    </HStack>
  )
}
