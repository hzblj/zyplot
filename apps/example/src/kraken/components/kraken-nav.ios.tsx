import {HStack, Image, Spacer} from '@expo/ui/swift-ui'
import {background, clipShape, frame, onTapGesture} from '@expo/ui/swift-ui/modifiers'
import type {SFSymbol} from 'sf-symbols-typescript'
import {setColorScheme} from '../../theme/color-scheme'
import {krakenLayout, useKrakenTheme} from '../data/kraken-theme'

const schemeSymbol = {dark: 'moon.fill', light: 'sun.max.fill'} as const satisfies Record<string, SFSymbol>

export const KrakenCircleButton = ({
  name,
  onPress,
  size = krakenLayout.circleButton,
  tint,
}: {
  name: SFSymbol
  onPress?: () => void
  size?: number
  tint?: string
}) => {
  const {color} = useKrakenTheme()

  return (
    <HStack
      modifiers={[
        frame({height: size, width: size}),
        background(color.pill),
        clipShape('circle'),
        ...(onPress ? [onTapGesture(onPress)] : []),
      ]}
    >
      <Image color={tint ?? color.text} size={size * 0.4} systemName={name} />
    </HStack>
  )
}

export const KrakenNavBar = ({onBack}: {onBack: () => void}) => {
  const {color, scheme} = useKrakenTheme()
  const next = scheme === 'dark' ? 'light' : 'dark'

  return (
    <HStack modifiers={[frame({height: krakenLayout.navHeight})]} spacing={10}>
      <KrakenCircleButton name="chevron.left" onPress={onBack} />
      <Spacer />
      <HStack modifiers={[background(color.pill), clipShape('capsule')]} spacing={0}>
        <KrakenCircleButton name="heart.fill" tint={color.down} />
        {}
        <Spacer modifiers={[frame({height: 20, width: 1}), background(color.divider)]} />
        <KrakenCircleButton name="ellipsis" />
      </HStack>
      <KrakenCircleButton name={schemeSymbol[next]} onPress={() => setColorScheme(next)} />
    </HStack>
  )
}
