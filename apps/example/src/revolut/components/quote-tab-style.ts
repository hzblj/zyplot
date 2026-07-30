import {
  background,
  glassEffect,
  type ModifierConfig,
  matchedGeometryEffect,
  padding,
  shapes,
} from '@expo/ui/swift-ui/modifiers'

const PILL_ID = 'quote-tab-pill'

/** Same box on both layers of the tab row, so the pill lines up with its label. */
const box: ModifierConfig[] = [padding({horizontal: 14, vertical: 8})]

/**
 * Custom modifier chain for the quote tab row. It is only applied to the main tab row —
 * the range selector below the chart stays a plain system picker.
 *
 * `matchedGeometryEffect` is what makes the pill glide and stretch between tabs: the pill
 * only exists under the selected label, so SwiftUI pairs the disappearing pill with the
 * appearing one and interpolates the frame. On iOS 26 the glass effect rides along.
 *
 * The fill is passed in rather than read here, because a modifier chain is not a component
 * and so cannot follow the colour scheme on its own.
 */
export const quoteTabPill = (namespaceId: string, fill: string): ModifierConfig[] => [
  ...box,
  background(fill, shapes.capsule()),
  glassEffect({glass: {variant: 'regular'}, shape: 'capsule'}),
  matchedGeometryEffect(PILL_ID, namespaceId),
]

export const quoteTabLabel = (): ModifierConfig[] => [...box]
