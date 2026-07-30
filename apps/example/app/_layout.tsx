import {Stack} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import {Platform, useWindowDimensions} from 'react-native'
import {contentInset} from '../src/theme/tokens'
import {useTheme} from '../src/theme/use-theme'

export default function Layout() {
  const {color} = useTheme()
  const {width} = useWindowDimensions()

  return (
    <>
      <Stack
        screenOptions={{
          // Every screen sits on this rather than on the window, which stays at its light
          // default and would otherwise show through wherever a native host paints no
          // background of its own.
          contentStyle: {backgroundColor: color.surface.base},
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          ...Platform.select({
            android: {
              // The DayNight theme colours Material's own toolbar, but not the one
              // react-native-screens draws: without these the header keeps black glyphs on
              // white in dark mode.
              headerStyle: {backgroundColor: color.surface.base},
              headerTintColor: color.content.primary,
              headerTitleStyle: {color: color.content.primary},
            },
            // The bar itself runs the width of the window; what is in it lines up with the
            // column below, so the title sits over the list rather than out on the margin.
            // The inset goes on the header's own containers — `headerStyle` drops padding.
            default: {
              headerLeftContainerStyle: {paddingLeft: contentInset(width)},
              headerRightContainerStyle: {paddingRight: contentInset(width)},
              headerStyle: {backgroundColor: color.surface.base},
              headerTitleAlign: 'left' as const,
              headerTitleContainerStyle: {marginLeft: contentInset(width)},
            },
            ios: {
              // No colours here: UIKit resolves the header — blur, large title, back button
              // tint — from the appearance the switch overrides.
              headerLargeTitle: true,
              headerLargeTitleShadowVisible: false,
            },
          }),
        }}
      />
      <StatusBar style="auto" />
    </>
  )
}
