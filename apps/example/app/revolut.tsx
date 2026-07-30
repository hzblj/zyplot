import {Stack} from 'expo-router'
import {RevolutScreen} from '../src/revolut/revolut'

export default function Revolut() {
  return (
    <>
      {/* The screen paints its own header, the way the app it is modelled on does. */}
      <Stack.Screen options={{headerShown: false}} />
      <RevolutScreen />
    </>
  )
}
