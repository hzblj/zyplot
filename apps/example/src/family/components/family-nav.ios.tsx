import {HStack, Image, Spacer, VStack} from '@expo/ui/swift-ui'
import {
  Animation,
  animation,
  background,
  clipShape,
  frame,
  onTapGesture,
  scaleEffect,
} from '@expo/ui/swift-ui/modifiers'
import {familyToken} from '@zyplot/feature-charts/family'
import type {SFSymbol} from 'sf-symbols-typescript'
import {familyLayout, useFamilyTheme} from '../data/family-theme'
import {FamilyText} from './family-text.ios'

export const FamilyTokenIdentity = () => {
  const {color} = useFamilyTheme()

  return (
    <VStack alignment="leading" spacing={14}>
      <HStack
        modifiers={[
          frame({height: familyLayout.avatar, width: familyLayout.avatar}),
          background(color.mark),
          clipShape('circle'),
        ]}
      >
        <FamilyText size={22} weight="semibold">
          {familyToken.mark}
        </FamilyText>
      </HStack>

      <VStack alignment="leading" spacing={3}>
        <HStack spacing={6}>
          <FamilyText size={22} weight="bold">
            {familyToken.name}
          </FamilyText>
          <Image color={color.badge} size={16} systemName="checkmark.seal.fill" />
        </HStack>
        <FamilyText color={color.textMuted} size={13}>
          {`${familyToken.symbol} · ${familyToken.chain}`}
        </FamilyText>
      </VStack>
    </VStack>
  )
}
