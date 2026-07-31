import {HStack, Spacer, VStack} from '@expo/ui/swift-ui'
import {Animation, animation, contentTransition} from '@expo/ui/swift-ui/modifiers'
import {familyToken} from '@zyplot/feature-charts/family'
import {useFamilyTheme} from '../data/family-theme'
import type {FamilyReadout} from '../hooks/use-family-readout'
import {FamilyText} from './family-text.ios'

/** SwiftUI rolls the digits itself: `numericText` plus an animation keyed to the reading. */
const rolling = (value: number) => [contentTransition('numericText'), animation(Animation.default, value)]

export const FamilyPriceReadout = ({readout}: {readout: FamilyReadout}) => {
  const {color} = useFamilyTheme()
  const cents = Math.round(readout.value * 100)

  return (
    <VStack alignment="leading" spacing={4}>
      <HStack alignment="lastTextBaseline" spacing={0}>
        <FamilyText modifiers={rolling(cents)} size={34} tabular weight="bold">
          {`${familyToken.currency}${readout.price}`}
        </FamilyText>
        <Spacer />
        <FamilyText
          color={readout.isDown ? color.down : color.up}
          modifiers={rolling(cents)}
          size={22}
          tabular
          weight="semibold"
        >
          {`${readout.isDown ? '↓' : '↑'} ${readout.percent}`}
        </FamilyText>
      </HStack>

      <FamilyText color={color.textMuted} size={13} tabular>
        {`${readout.amount} · ${readout.subtitle}`}
      </FamilyText>
    </VStack>
  )
}
