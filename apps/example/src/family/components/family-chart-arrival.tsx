import {type FamilyScheme, familyChartStyle, familyTiming} from '@zyplot/feature-charts/family'
import {type ReactNode, useEffect, useRef} from 'react'
import {Animated, Easing} from 'react-native'

/**
 * Holds the plot at its resting strength while the wave is up and fades it in once the window has
 * morphed into place — the trace at a third of its opacity is the grey the placeholder is drawn in,
 * so one fade covers both.
 */
export const FamilyChartArrival = ({
  children,
  isLoading,
  scheme,
}: {
  children: ReactNode
  isLoading: boolean
  scheme: FamilyScheme
}) => {
  const resting = familyChartStyle(scheme).resting
  const opacity = useRef(new Animated.Value(isLoading ? resting : 1)).current

  useEffect(() => {
    Animated.timing(opacity, {
      delay: isLoading ? 0 : familyTiming.fadeDelay,
      duration: isLoading ? 0 : familyTiming.fade,
      easing: Easing.out(Easing.quad),
      toValue: isLoading ? resting : 1,
      useNativeDriver: true,
    }).start()
  }, [isLoading, opacity, resting])

  return <Animated.View style={{opacity}}>{children}</Animated.View>
}
