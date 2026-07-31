import {Column, Row, Spacer} from '@expo/ui/jetpack-compose'
import {weight as composeWeight} from '@expo/ui/jetpack-compose/modifiers'
import {familyToken} from '@zyplot/feature-charts/family'
import {useFamilyTheme} from '../data/family-theme'
import type {FamilyReadout} from '../hooks/use-family-readout'
import {FamilyText} from './family-text.android'

export const FamilyPriceReadout = ({readout}: {readout: FamilyReadout}) => {
  const {color} = useFamilyTheme()

  return (
    <Column verticalArrangement={{spacedBy: 4}}>
      <Row verticalAlignment="bottom">
        <FamilyText size={34} weight="bold">
          {`${familyToken.currency}${readout.price}`}
        </FamilyText>
        <Spacer modifiers={[composeWeight(1)]} />
        <FamilyText color={readout.isDown ? color.down : color.up} size={22} weight="600">
          {`${readout.isDown ? '↓' : '↑'} ${readout.percent}`}
        </FamilyText>
      </Row>

      <FamilyText color={color.textMuted} size={13}>
        {`${readout.amount} · ${readout.subtitle}`}
      </FamilyText>
    </Column>
  )
}
