import {Column, Row, Spacer} from '@expo/ui/jetpack-compose'
import {background, clickable, clip, size, weight} from '@expo/ui/jetpack-compose/modifiers'
import {familyToken} from '@zyplot/feature-charts/family'
import {familyLayout, useFamilyTheme} from '../data/family-theme'
import {FamilyText} from './family-text.android'

export const composeCircle = {type: 'circle'} as const

export const FamilyTokenIdentity = () => {
  const {color} = useFamilyTheme()

  return (
    <Column verticalArrangement={{spacedBy: 14}}>
      <Row
        horizontalArrangement="center"
        modifiers={[size(familyLayout.avatar, familyLayout.avatar), clip(composeCircle), background(color.mark)]}
        verticalAlignment="center"
      >
        <FamilyText size={22} weight="600">
          {familyToken.mark}
        </FamilyText>
      </Row>

      <Column verticalArrangement={{spacedBy: 3}}>
        <Row verticalAlignment="center">
          <FamilyText size={22} weight="bold">
            {familyToken.name}
          </FamilyText>
          <Spacer modifiers={[size(6, 1)]} />
          <Row
            horizontalArrangement="center"
            modifiers={[size(familyLayout.badge, familyLayout.badge), clip(composeCircle), background(color.badge)]}
            verticalAlignment="center"
          >
            <FamilyText color="#ffffff" size={10} weight="bold">
              ✓
            </FamilyText>
          </Row>
        </Row>
        <FamilyText color={color.textMuted} size={13}>
          {`${familyToken.symbol} · ${familyToken.chain}`}
        </FamilyText>
      </Column>
    </Column>
  )
}
