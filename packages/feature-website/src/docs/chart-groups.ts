const CHART_GROUPS: {ids: readonly string[]; label: string}[] = [
  {
    ids: ['line', 'area', 'bar', 'stacked-bar', 'histogram', 'scatter', 'time-series', 'sparkline'],
    label: 'Cartesian',
  },
  {
    ids: ['pie', 'gauge', 'meter', 'funnel', 'radar', 'sankey', 'sunburst', 'treemap'],
    label: 'Radial and flow',
  },
  {
    ids: ['candlestick', 'boxplot', 'diverging-bar', 'dumbbell', 'heatmap'],
    label: 'Statistical and finance',
  },
  {
    ids: ['ios-range', 'ios-rule'],
    label: 'iOS only',
  },
  {
    ids: ['android-waterfall', 'android-lollipop'],
    label: 'Android only',
  },
]

const GROUPED_IDS = new Set(CHART_GROUPS.flatMap(group => group.ids))

export type ChartGroup<TChart> = {
  charts: TChart[]
  label: string
}

export const groupCharts = <TChart extends {id: string}>(charts: TChart[]): ChartGroup<TChart>[] =>
  [
    ...CHART_GROUPS.map(group => ({
      charts: charts.filter(chart => group.ids.includes(chart.id)),
      label: group.label,
    })),
    {charts: charts.filter(chart => !GROUPED_IDS.has(chart.id)), label: 'More charts'},
  ].filter(group => group.charts.length > 0)
