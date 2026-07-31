import {Stack} from 'expo-router'
import {StepsScreen} from '../src/health/steps-screen'

export default function Health() {
  return (
    <>
      {}
      <Stack.Screen options={{headerShown: false}} />
      <StepsScreen />
    </>
  )
}
