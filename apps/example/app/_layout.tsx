import {Stack} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import {useTheme} from '../src/theme/use-theme'

export default function Layout() {
  const {color} = useTheme()

  return (
    <>
      <Stack
        // Every screen draws the shared AppHeader, so the navigator keeps its own out of the way on
        // all three platforms.
        screenOptions={{contentStyle: {backgroundColor: color.surface.base}, headerShown: false}}
      />
      <StatusBar style="auto" />
    </>
  )
}
