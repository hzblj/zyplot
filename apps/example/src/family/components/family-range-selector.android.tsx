import {Row} from '@expo/ui/jetpack-compose'
import {background, clickable, clip, padding, size, weight} from '@expo/ui/jetpack-compose/modifiers'
import {type FamilyRangeId, familyRanges} from '@zyplot/feature-charts/family'
import {familyLayout, useFamilyTheme} from '../data/family-theme'
import {composeCircle} from './family-nav.android'
import {FamilyText} from './family-text.android'

export type FamilyRangeSelectorProps = {
  onSelect: (id: FamilyRangeId) => void
  selected: FamilyRangeId
}

const gap = (familyLayout.rangeRow - familyLayout.pill) / 2

export const FamilyRangeSelector = ({onSelect, selected}: FamilyRangeSelectorProps) => {
  const {color} = useFamilyTheme()

  return (
    <Row verticalAlignment="center">
      {familyRanges.map(range => (
        <Row
          horizontalArrangement="center"
          key={range.id}
          modifiers={[weight(1), clickable(() => onSelect(range.id)), padding(0, gap, 0, gap)]}
          verticalAlignment="center"
        >
          <Row
            horizontalArrangement="center"
            modifiers={[
              size(familyLayout.pill, familyLayout.pill),
              ...(range.id === selected ? [clip(composeCircle), background(color.pillActive)] : []),
            ]}
            verticalAlignment="center"
          >
            <FamilyText color={range.id === selected ? color.text : color.textMuted} size={13} weight="600">
              {range.label}
            </FamilyText>
          </Row>
        </Row>
      ))}
    </Row>
  )
}
