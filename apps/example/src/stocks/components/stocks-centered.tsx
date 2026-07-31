import {type ReactNode, useCallback, useState} from 'react'
import {type LayoutChangeEvent, View} from 'react-native'

/**
 * Holds a label centred on a position in the plot, and keeps it inside `width`. The label is
 * measured rather than guessed, because what sits above a crosshair is a price whose width
 * changes with the digits.
 */
export const StocksCentered = ({
  children,
  top,
  width,
  x,
}: {
  children: ReactNode
  top: number
  width: number
  x: number
}) => {
  const [size, setSize] = useState(0)

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const measured = event.nativeEvent.layout.width
    setSize(current => (current === measured ? current : measured))
  }, [])

  return (
    <View
      onLayout={onLayout}
      pointerEvents="none"
      style={{
        left: Math.min(Math.max(x - size / 2, 0), Math.max(width - size, 0)),
        opacity: size === 0 ? 0 : 1,
        position: 'absolute',
        top,
      }}
    >
      {children}
    </View>
  )
}
