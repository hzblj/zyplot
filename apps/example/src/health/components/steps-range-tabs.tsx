import {type StepsRangeId, stepsRangeIds} from '@zyplot/feature-charts/health'
import {Pressable, StyleSheet, View} from 'react-native'
import {stepsLayout, useStepsTheme} from '../data/steps-theme'
import {StepsText} from './steps-text'

export type StepsRangeTabsProps = {
  onSelect: (id: StepsRangeId) => void
  selected: StepsRangeId
}

export const StepsRangeTabs = ({onSelect, selected}: StepsRangeTabsProps) => {
  const {color} = useStepsTheme()

  return (
    <View style={[styles.track, {backgroundColor: color.segment}]}>
      {stepsRangeIds.map(id => (
        <Pressable
          key={id}
          onPress={() => onSelect(id)}
          style={({hovered}) => [
            styles.segment,
            id === selected
              ? {backgroundColor: color.segmentActive}
              : hovered
                ? {backgroundColor: color.segmentActive, opacity: 0.4}
                : null,
          ]}
        >
          <StepsText color={color.text} size={14} weight={id === selected ? '600' : 'normal'}>
            {id}
          </StepsText>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  segment: {
    alignItems: 'center',
    borderRadius: 7,
    cursor: 'pointer',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  track: {
    alignItems: 'center',
    borderRadius: 9,
    flexDirection: 'row',
    height: stepsLayout.segmentHeight,
    padding: 2,
  },
})
