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
          contentStyle: {backgroundColor: color.surface.base},
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          ...Platform.select({
            android: {
              headerStyle: {backgroundColor: color.surface.base},
              headerTintColor: color.content.primary,
              headerTitleStyle: {color: color.content.primary},
            },
            default: {
              headerLeftContainerStyle: {paddingLeft: contentInset(width)},
              headerRightContainerStyle: {paddingRight: contentInset(width)},
              headerStyle: {backgroundColor: color.surface.base},
              headerTitleAlign: 'left' as const,
              headerTitleContainerStyle: {marginLeft: contentInset(width)},
            },
            ios: {
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
