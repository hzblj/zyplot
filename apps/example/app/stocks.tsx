import {Stack} from 'expo-router'
import {StocksScreen} from '../src/stocks/stocks'

export default function Stocks() {
  return (
    <>
      {}
      <Stack.Screen options={{headerShown: false}} />
      <StocksScreen />
    </>
  )
}
