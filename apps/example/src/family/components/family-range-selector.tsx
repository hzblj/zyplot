import {type FamilyRangeId, familyRanges} from '@zyplot/feature-charts/family'
import {useEffect, useRef, useState} from 'react'
import {Animated, type LayoutRectangle, Pressable, StyleSheet, View} from 'react-native'
import {familyLayout, useFamilyTheme} from '../data/family-theme'
import {FamilyText} from './family-text'

export type FamilyRangeSelectorProps = {
  onSelect: (id: FamilyRangeId) => void
  selected: FamilyRangeId
}

const SPRING = {damping: 18, mass: 1, stiffness: 220, useNativeDriver: false} as const

export const FamilyRangeSelector = ({onSelect, selected}: FamilyRangeSelectorProps) => {
  const {color} = useFamilyTheme()
  const [boxes, setBoxes] = useState<Partial<Record<FamilyRangeId, LayoutRectangle>>>({})
  const left = useRef(new Animated.Value(0)).current
  const isMeasured = useRef(false)
  const box = boxes[selected]

  useEffect(() => {
    if (!box) {
      return
    }
    const target = box.x + (box.width - familyLayout.pill) / 2
    if (isMeasured.current) {
      Animated.spring(left, {...SPRING, toValue: target}).start()
      return
    }
    isMeasured.current = true
    left.setValue(target)
  }, [box, left])

  return (
    <View style={styles.row}>
      {box ? <Animated.View style={[styles.pill, {backgroundColor: color.pillActive, left}]} /> : null}

      {familyRanges.map(range => (
        <Pressable
          key={range.id}
          onLayout={event => {
            const {layout} = event.nativeEvent
            setBoxes(current => ({...current, [range.id]: layout}))
          }}
          onPress={() => onSelect(range.id)}
          style={styles.cell}
        >
          <FamilyText color={range.id === selected ? color.text : color.textMuted} size={13} weight="600">
            {range.label}
          </FamilyText>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  cell: {alignItems: 'center', cursor: 'pointer', flex: 1, height: familyLayout.rangeRow, justifyContent: 'center'},
  pill: {
    borderRadius: familyLayout.pill / 2,
    height: familyLayout.pill,
    position: 'absolute',
    top: (familyLayout.rangeRow - familyLayout.pill) / 2,
    width: familyLayout.pill,
  },
  row: {alignItems: 'center', flexDirection: 'row', height: familyLayout.rangeRow},
})
