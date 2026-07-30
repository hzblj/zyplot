import {type ReactNode, useEffect, useRef} from 'react'
import {StyleSheet, View} from 'react-native'
import PagerView from 'react-native-pager-view'

export type QuotePage = {
  content: ReactNode
  id: string
}

export type QuotePageViewProps = {
  index: number
  isScrubbing: boolean
  onIndexChange: (index: number) => void
  pages: readonly QuotePage[]
}

export const QuotePageView = ({index, isScrubbing, onIndexChange, pages}: QuotePageViewProps) => {
  const pager = useRef<PagerView>(null)
  const page = useRef(index)

  useEffect(() => {
    if (page.current === index) {
      return
    }
    page.current = index
    pager.current?.setPage(index)
  }, [index])

  return (
    <PagerView
      initialPage={index}
      onPageSelected={event => {
        page.current = event.nativeEvent.position
        onIndexChange(event.nativeEvent.position)
      }}
      ref={pager}
      scrollEnabled={!isScrubbing}
      style={styles.pager}
    >
      {pages.map(item => (
        <View collapsable={false} key={item.id} style={styles.page}>
          {item.content}
        </View>
      ))}
    </PagerView>
  )
}

const styles = StyleSheet.create({
  page: {flex: 1},
  pager: {flex: 1},
})
