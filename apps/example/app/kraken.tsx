import {krakenCoin} from '@zyplot/feature-charts/kraken'
import {Stack} from 'expo-router'
import {KrakenCoinScreen} from '../src/kraken/kraken-coin'

export default function Kraken() {
  return (
    <>
      {}
      <Stack.Screen options={{headerShown: false}} />
      <KrakenCoinScreen coin={krakenCoin} />
    </>
  )
}
