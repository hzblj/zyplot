import {Stack} from 'expo-router'
import {FamilyScreen} from '../src/family/family'

export default function Family() {
  return (
    <>
      <Stack.Screen options={{headerShown: false}} />
      <FamilyScreen />
    </>
  )
}
