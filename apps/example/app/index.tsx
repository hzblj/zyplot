import {Stack} from 'expo-router'
import {ChartGallery} from '../src/gallery/chart-gallery'

export default function Home() {
  return (
    <>
      {/* The light/dark switch lives in the Revolut screen's toolbar, on the charts it changes. */}
      <Stack.Screen options={{title: 'Charts'}} />
      <ChartGallery />
    </>
  )
}
