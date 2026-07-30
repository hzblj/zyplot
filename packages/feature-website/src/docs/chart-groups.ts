/**
 * How the twenty-one chart forms are split in the sidebar.
 *
 * The three names are the ones the native page already uses for its coverage
 * table, so a reader meets the same vocabulary in the nav and in the prose.
 * Twenty-one links under one heading is a wall — grouped, the reader scans four
 * short lists and stops at the one that matches what they are plotting.
 */
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
]

const GROUPED_IDS = new Set(CHART_GROUPS.flatMap(group => group.ids))

export type ChartGroup<TChart> = {
  charts: TChart[]
  label: string
}

/**
 * Splits charts into the sidebar groups, keeping the order they were declared in
 * within each one.
 *
 * The trailing group is the safety net: a chart added to the docs and not to a
 * group above still reaches the nav under "More charts" rather than vanishing
 * from it, which is the failure a plain lookup would produce silently.
 */
export const groupCharts = <TChart extends {id: string}>(charts: TChart[]): ChartGroup<TChart>[] =>
  [
    ...CHART_GROUPS.map(group => ({
      charts: charts.filter(chart => group.ids.includes(chart.id)),
      label: group.label,
    })),
    {charts: charts.filter(chart => !GROUPED_IDS.has(chart.id)), label: 'More charts'},
  ].filter(group => group.charts.length > 0)
