import type {Href} from 'expo-router'
import {Platform} from 'react-native'

export type ChartCatalogItem = {
  id: string
  label: string
  layer: string
  route?: Href
}

const shared: ChartCatalogItem[] = [
  {id: 'line', label: 'Line', layer: 'Swift Charts · Compose Canvas'},
  {id: 'area', label: 'Area', layer: 'Swift Charts · Compose Canvas'},
  {id: 'bar', label: 'Bar', layer: 'Swift Charts · Compose Canvas'},
  {
    id: 'stacked-bar',
    label: 'Stacked bar',
    layer: 'Swift Charts · Compose Canvas',
  },
  {id: 'pie', label: 'Pie', layer: 'SectorMark · Compose Canvas'},
  {id: 'gauge', label: 'Gauge', layer: 'SwiftUI Canvas · Compose Canvas'},
  {id: 'meter', label: 'Meter', layer: 'SwiftUI Canvas · Compose Canvas'},
  {
    id: 'histogram',
    label: 'Histogram',
    layer: 'Swift Charts · Compose Canvas',
  },
  {id: 'boxplot', label: 'Boxplot', layer: 'Swift Charts · Compose Canvas'},
  {
    id: 'candlestick',
    label: 'Candlestick',
    layer: 'Swift Charts · Compose Canvas',
  },
  {
    id: 'diverging-bar',
    label: 'Diverging bar',
    layer: 'Swift Charts · Compose Canvas',
  },
  {
    id: 'dumbbell',
    label: 'Dumbbell',
    layer: 'Swift Charts · Compose Canvas',
  },
  {id: 'funnel', label: 'Funnel', layer: 'SwiftUI Canvas · Compose Canvas'},
  {id: 'heatmap', label: 'Heatmap', layer: 'Swift Charts · Compose Canvas'},
  {id: 'radar', label: 'Radar', layer: 'SwiftUI Canvas · Compose Canvas'},
  {id: 'scatter', label: 'Scatter', layer: 'Swift Charts · Compose Canvas'},
  {id: 'sankey', label: 'Sankey', layer: 'SwiftUI Canvas · Compose Canvas'},
  {
    id: 'sunburst',
    label: 'Sunburst',
    layer: 'SwiftUI Canvas · Compose Canvas',
  },
  {id: 'treemap', label: 'Treemap', layer: 'SwiftUI Canvas · Compose Canvas'},
  {
    id: 'time-series',
    label: 'Time series',
    layer: 'Swift Charts · Compose Canvas',
  },
  {
    id: 'sparkline',
    label: 'Sparkline',
    layer: 'Swift Charts · Compose Canvas',
  },
]

const iosExtensions: ChartCatalogItem[] = [
  {id: 'ios-rule', label: 'Rule', layer: 'iOS · Swift Charts RuleMark'},
  {id: 'ios-range', label: 'Range', layer: 'iOS · Swift Charts AreaMark'},
]

const androidExtensions: ChartCatalogItem[] = [
  {
    id: 'android-waterfall',
    label: 'Waterfall',
    layer: 'Android · Compose Canvas',
  },
  {
    id: 'android-lollipop',
    label: 'Lollipop',
    layer: 'Android · Compose Canvas',
  },
]

const advanced: ChartCatalogItem[] = [
  {
    id: 'advanced-line',
    label: 'Annotations and interaction',
    layer: 'Axes · plot · crosshair · selection',
  },
  {
    id: 'finance',
    label: 'Finance workspace',
    layer: 'Candles · volume · price ranges',
  },
]

const products: ChartCatalogItem[] = [
  {
    id: 'revolut',
    label: 'Stock detail',
    layer: 'Traced reveal · glow · scrub readout',
    route: '/revolut',
  },
  {
    id: 'kraken',
    label: 'Crypto price',
    layer: 'Dotted fill · baseline rule · trail scrub',
    route: '/kraken',
  },
]

export const chartSections = [
  {data: products, title: 'Product examples'},
  {data: shared, title: 'Cross-platform charts'},
  {data: advanced, title: 'Advanced API'},
  {
    data: Platform.OS === 'ios' ? iosExtensions : androidExtensions,
    title: `${Platform.OS === 'ios' ? 'iOS' : 'Android'} extensions`,
  },
]

export const chartTitle = (id: string) =>
  [...products, ...shared, ...advanced, ...iosExtensions, ...androidExtensions].find(item => item.id === id)?.label ??
  'Chart'
