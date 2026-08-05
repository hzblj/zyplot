import {REPOSITORY_URL} from '../links'
import type {ChartPlatform} from './types'

const REPO = `${REPOSITORY_URL}/blob/main`

export type ChartImplementation = {
  detail: string
  path: string
}

export type ChartImplementations = Partial<Record<ChartPlatform, ChartImplementation>>

export const sourceUrl = (path: string) => `${REPO}/${path}`
const WEB = 'packages/zyplot/src/web'
const IOS = 'packages/zyplot/ios'
const ANDROID = 'packages/zyplot/android/src/main/java/com/hzblj/zyplot/charts'

export const chartImplementations: Record<string, ChartImplementations> = {
  area: {
    android: {
      detail: 'drawLineOrArea on a Compose Canvas',
      path: `${ANDROID}/kinds/LineChart.kt`,
    },
    ios: {
      detail: 'SwiftUI Canvas, filled under the stroked trace',
      path: `${IOS}/Components/ZyplotLineCanvas.swift`,
    },
    web: {detail: 'ECharts line series with areaStyle', path: `${WEB}/area`},
  },
  bar: {
    android: {
      detail: 'drawBars on a Compose Canvas',
      path: `${ANDROID}/kinds/BarChart.kt`,
    },
    ios: {
      detail: 'Swift Charts BarMark',
      path: `${IOS}/Marks/ZyplotBarMarks.swift`,
    },
    web: {detail: 'ECharts bar series', path: `${WEB}/bar`},
  },
  boxplot: {
    android: {
      detail: 'drawBoxplot on a Compose Canvas',
      path: `${ANDROID}/kinds/BoxplotChart.kt`,
    },
    ios: {
      detail: 'Swift Charts RectangleMark, RuleMark and PointMark',
      path: `${IOS}/Marks/ZyplotBoxplotMarks.swift`,
    },
    web: {detail: 'ECharts boxplot series', path: `${WEB}/boxplot`},
  },
  candlestick: {
    android: {
      detail: 'drawCandlestick on a Compose Canvas',
      path: `${ANDROID}/kinds/CandlestickChart.kt`,
    },
    ios: {
      detail: 'Dedicated Swift Charts view with an optional volume plot',
      path: `${IOS}/Charts/ZyplotCandlestickChart.swift`,
    },
    web: {detail: 'ECharts candlestick series', path: `${WEB}/candlestick`},
  },
  'diverging-bar': {
    android: {
      detail: 'drawDivergingBars on a Compose Canvas',
      path: `${ANDROID}/kinds/DivergingBarChart.kt`,
    },
    ios: {
      detail: 'Swift Charts BarMark around a zero baseline',
      path: `${IOS}/Marks/ZyplotDivergingBarMarks.swift`,
    },
    web: {detail: 'ECharts bar series', path: `${WEB}/diverging-bar`},
  },
  dumbbell: {
    android: {
      detail: 'drawDumbbell on a Compose Canvas',
      path: `${ANDROID}/kinds/DumbbellChart.kt`,
    },
    ios: {
      detail: 'Swift Charts RuleMark and PointMark',
      path: `${IOS}/Marks/ZyplotDumbbellMarks.swift`,
    },
    web: {detail: 'ECharts custom series', path: `${WEB}/dumbbell`},
  },
  funnel: {
    android: {
      detail: 'drawFunnel on a Compose Canvas',
      path: `${ANDROID}/kinds/FunnelChart.kt`,
    },
    ios: {
      detail: 'SwiftUI Canvas',
      path: `${IOS}/Charts/Specialized/ZyplotFunnel.swift`,
    },
    web: {detail: 'ECharts funnel series', path: `${WEB}/funnel`},
  },
  gauge: {
    android: {
      detail: 'drawGauge on a Compose Canvas',
      path: `${ANDROID}/kinds/GaugeChart.kt`,
    },
    ios: {
      detail: 'SwiftUI Canvas',
      path: `${IOS}/Charts/Specialized/ZyplotGauge.swift`,
    },
    web: {detail: 'ECharts gauge series', path: `${WEB}/gauge`},
  },
  heatmap: {
    android: {
      detail: 'drawHeatmap on a Compose Canvas',
      path: `${ANDROID}/kinds/HeatmapChart.kt`,
    },
    ios: {
      detail: 'Swift Charts RectangleMark',
      path: `${IOS}/Marks/ZyplotHeatmapMarks.swift`,
    },
    web: {detail: 'ECharts heatmap series', path: `${WEB}/heatmap`},
  },
  histogram: {
    android: {
      detail: 'drawHistogram on a Compose Canvas',
      path: `${ANDROID}/kinds/HistogramChart.kt`,
    },
    ios: {
      detail: 'Swift Charts RectangleMark over computed bins',
      path: `${IOS}/Marks/ZyplotHistogramMarks.swift`,
    },
    web: {
      detail: 'ECharts bar series over computed bins',
      path: `${WEB}/histogram`,
    },
  },
  line: {
    android: {
      detail: 'drawLineOrArea on a Compose Canvas',
      path: `${ANDROID}/kinds/LineChart.kt`,
    },
    ios: {
      detail: 'SwiftUI Canvas, with Swift Charts holding the scales',
      path: `${IOS}/Components/ZyplotLineCanvas.swift`,
    },
    web: {detail: 'ECharts line series', path: `${WEB}/line`},
  },
  meter: {
    android: {
      detail: 'drawGauge on a Compose Canvas',
      path: `${ANDROID}/kinds/GaugeChart.kt`,
    },
    ios: {
      detail: 'SwiftUI Canvas',
      path: `${IOS}/Charts/Specialized/ZyplotGauge.swift`,
    },
    web: {detail: 'DOM element, no chart engine', path: `${WEB}/meter`},
  },
  pie: {
    android: {
      detail: 'drawPie on a Compose Canvas',
      path: `${ANDROID}/kinds/PieChart.kt`,
    },
    ios: {
      detail: 'Swift Charts SectorMark',
      path: `${IOS}/Marks/ZyplotPieMarks.swift`,
    },
    web: {detail: 'ECharts pie series', path: `${WEB}/pie`},
  },
  radar: {
    android: {
      detail: 'drawRadar on a Compose Canvas',
      path: `${ANDROID}/kinds/RadarChart.kt`,
    },
    ios: {
      detail: 'SwiftUI Canvas',
      path: `${IOS}/Charts/Specialized/ZyplotRadar.swift`,
    },
    web: {detail: 'ECharts radar series', path: `${WEB}/radar`},
  },
  sankey: {
    android: {
      detail: 'drawSankey on a Compose Canvas',
      path: `${ANDROID}/kinds/SankeyChart.kt`,
    },
    ios: {
      detail: 'SwiftUI Canvas',
      path: `${IOS}/Charts/Specialized/ZyplotSankey.swift`,
    },
    web: {detail: 'ECharts sankey series', path: `${WEB}/sankey`},
  },
  scatter: {
    android: {
      detail: 'drawScatter on a Compose Canvas',
      path: `${ANDROID}/kinds/ScatterChart.kt`,
    },
    ios: {
      detail: 'Swift Charts PointMark',
      path: `${IOS}/Marks/ZyplotScatterMarks.swift`,
    },
    web: {detail: 'ECharts scatter series', path: `${WEB}/scatter`},
  },
  sparkline: {
    android: {
      detail: 'drawSparkline on a Compose Canvas',
      path: `${ANDROID}/kinds/SparklineChart.kt`,
    },
    ios: {
      detail: 'Swift Charts LineMark with the legend hidden',
      path: `${IOS}/Marks/ZyplotSparklineMarks.swift`,
    },
    web: {detail: 'uPlot, for dense series', path: `${WEB}/sparkline`},
  },
  'stacked-bar': {
    android: {
      detail: 'drawBars with the series stacked',
      path: `${ANDROID}/kinds/BarChart.kt`,
    },
    ios: {
      detail: 'Swift Charts BarMark with .standard stacking',
      path: `${IOS}/Marks/ZyplotBarMarks.swift`,
    },
    web: {detail: 'ECharts stacked bar series', path: `${WEB}/stacked-bar`},
  },
  sunburst: {
    android: {
      detail: 'drawSunburst on a Compose Canvas',
      path: `${ANDROID}/kinds/SunburstChart.kt`,
    },
    ios: {
      detail: 'SwiftUI Canvas',
      path: `${IOS}/Charts/Specialized/ZyplotSunburst.swift`,
    },
    web: {detail: 'ECharts sunburst series', path: `${WEB}/sunburst`},
  },
  'time-series': {
    android: {
      detail: 'drawTimeSeries on a Compose Canvas',
      path: `${ANDROID}/kinds/TimeSeriesChart.kt`,
    },
    ios: {
      detail: 'Swift Charts LineMark over a date axis',
      path: `${IOS}/Marks/ZyplotTimeSeriesMarks.swift`,
    },
    web: {detail: 'uPlot, for dense series', path: `${WEB}/time-series`},
  },
  treemap: {
    android: {
      detail: 'drawTreemap on a Compose Canvas',
      path: `${ANDROID}/kinds/TreemapChart.kt`,
    },
    ios: {
      detail: 'SwiftUI Canvas',
      path: `${IOS}/Charts/Specialized/ZyplotTreemap.swift`,
    },
    web: {detail: 'ECharts treemap series', path: `${WEB}/treemap`},
  },
}
