import {
  background,
  glassEffect,
  type ModifierConfig,
  matchedGeometryEffect,
  padding,
  shapes,
} from '@expo/ui/swift-ui/modifiers'

const PILL_ID = 'quote-tab-pill'
const box: ModifierConfig[] = [padding({horizontal: 14, vertical: 8})]

export const quoteTabPill = (namespaceId: string, fill: string): ModifierConfig[] => [
  ...box,
  background(fill, shapes.capsule()),
  glassEffect({glass: {variant: 'regular'}, shape: 'capsule'}),
  matchedGeometryEffect(PILL_ID, namespaceId),
]

export const quoteTabLabel = (): ModifierConfig[] => [...box]
