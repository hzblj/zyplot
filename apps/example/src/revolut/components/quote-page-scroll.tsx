import {type ReactNode, useEffect, useRef, useState} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'

export type QuotePage = {
  content: ReactNode
  id: string
}

export type QuotePageScrollProps = {
  index: number
  isScrubbing: boolean
  onIndexChange: (index: number) => void
  pages: readonly QuotePage[]
}

/**
 * The web's stand-in for `QuotePageView`: a scroll-snapping row rather than
 * `UIPageViewController` or `ViewPager2`, which have no web side to bridge to.
 *
 * Scrolling is locked while the chart is being read, for the same reason the native pagers
 * turn swiping off — a drag across the plot belongs to the chart, not to the pager.
 */
export const QuotePageScroll = ({index, isScrubbing, onIndexChange, pages}: QuotePageScrollProps) => {
  const scroller = useRef<ScrollView>(null)
  const [width, setWidth] = useState(0)
  const page = useRef(index)

  useEffect(() => {
    if (page.current === index || width === 0) {
      return
    }
    page.current = index
    scroller.current?.scrollTo({animated: true, x: index * width, y: 0})
  }, [index, width])

  return (
    <ScrollView
      horizontal
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      onScroll={event => {
        const settled = Math.round(event.nativeEvent.contentOffset.x / Math.max(1, width))
        if (settled !== page.current) {
          page.current = settled
          onIndexChange(settled)
        }
      }}
      pagingEnabled
      ref={scroller}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      style={[styles.pager, isScrubbing ? styles.locked : null]}
    >
      {width > 0
        ? pages.map(item => (
            <View key={item.id} style={[styles.page, {width}]}>
              {item.content}
            </View>
          ))
        : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  locked: {overflow: 'hidden'},
  page: {flex: 1},
  pager: {flex: 1},
})
