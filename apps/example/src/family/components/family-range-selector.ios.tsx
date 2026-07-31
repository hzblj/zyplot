import {HStack, Namespace, ZStack} from '@expo/ui/swift-ui'
import {
  Animation,
  animation,
  background,
  contentShape,
  frame,
  hidden,
  matchedGeometryEffect,
  onTapGesture,
  shapes,
} from '@expo/ui/swift-ui/modifiers'
import {type FamilyRangeId, familyRanges} from '@zyplot/feature-charts/family'
import {useId} from 'react'
import {useWindowDimensions} from 'react-native'
import {familyLayout, useFamilyTheme} from '../data/family-theme'
import {FamilyText} from './family-text.ios'

export type FamilyRangeSelectorProps = {
  onSelect: (id: FamilyRangeId) => void
  selected: FamilyRangeId
}

const PILL_ID = 'family-range-pill'

export const FamilyRangeSelector = ({onSelect, selected}: FamilyRangeSelectorProps) => {
  const {color} = useFamilyTheme()
  const namespaceId = useId()
  const {width} = useWindowDimensions()
  const column = (width - familyLayout.gutter * 2) / familyRanges.length

  return (
    <Namespace id={namespaceId}>
      <HStack
        modifiers={[
          animation(
            Animation.spring({bounce: 0.22, duration: 0.42}),
            familyRanges.findIndex(range => range.id === selected)
          ),
        ]}
        spacing={0}
      >
        {familyRanges.map(range => (
          <ZStack
            key={range.id}
            modifiers={[
              frame({height: familyLayout.rangeRow, width: column}),
              contentShape(shapes.rectangle()),
              onTapGesture(() => onSelect(range.id)),
            ]}
          >
            {range.id === selected ? (
              <HStack
                modifiers={[
                  frame({height: familyLayout.pill, width: familyLayout.pill}),
                  background(color.pillActive, shapes.circle()),
                  matchedGeometryEffect(PILL_ID, namespaceId),
                ]}
              >
                <FamilyText modifiers={[hidden()]} size={13} weight="semibold">
                  {range.label}
                </FamilyText>
              </HStack>
            ) : null}

            <FamilyText color={range.id === selected ? color.text : color.textMuted} size={13} weight="semibold">
              {range.label}
            </FamilyText>
          </ZStack>
        ))}
      </HStack>
    </Namespace>
  )
}
