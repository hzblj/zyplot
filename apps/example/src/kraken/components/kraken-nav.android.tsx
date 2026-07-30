import {Row, Spacer} from '@expo/ui/jetpack-compose'
import {background, clickable, clip, height, size, weight} from '@expo/ui/jetpack-compose/modifiers'
import {setColorScheme} from '../../theme/color-scheme'
import {krakenLayout, useKrakenTheme} from '../data/kraken-theme'
import {KrakenText} from './kraken-text.android'

const schemeGlyph = {dark: '☾', light: '☀︎'} as const
export const composeCircle = {type: 'circle'} as const
export const composeCapsule = {radius: 20, type: 'roundedCorner'} as const
export const composeCard = {radius: krakenLayout.cardRadius, type: 'roundedCorner'} as const

export const KrakenCircleButton = ({
  diameter = krakenLayout.circleButton,
  glyph,
  onPress,
  tint,
}: {
  diameter?: number
  glyph: string
  onPress?: () => void
  tint?: string
}) => {
  const {color} = useKrakenTheme()

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
      <KrakenText color={tint} size={diameter * 0.42}>
        {glyph}
      </KrakenText>
    </Row>
  )
}

export const KrakenNavBar = ({onBack}: {onBack: () => void}) => {
  const {color, scheme} = useKrakenTheme()
  const next = scheme === 'dark' ? 'light' : 'dark'

  return (
    <Row modifiers={[height(krakenLayout.navHeight)]} verticalAlignment="center">
      <KrakenCircleButton glyph="‹" onPress={onBack} />
      <Row horizontalArrangement="end" modifiers={[weight(1)]} verticalAlignment="center">
        <Row modifiers={[clip(composeCapsule), background(color.pill)]} verticalAlignment="center">
          <KrakenCircleButton glyph="♥" tint={color.down} />
          <Spacer modifiers={[size(1, 20), background(color.divider)]} />
          <KrakenCircleButton glyph="⋮" />
        </Row>
        <Spacer modifiers={[size(10, 1)]} />
        <KrakenCircleButton glyph={schemeGlyph[next]} onPress={() => setColorScheme(next)} />
      </Row>
    </Row>
  )
}
