---
'@hzblj/zyplot': patch
---

Honour `animation` on every web chart, not five of them.

`ChartBaseProps` has always declared it, and `Chart.Line`, `Chart.Area`, `Chart.Bar`,
`Chart.StackedBar` and `Chart.Candlestick` have always read it. The other thirteen forms —
pie, scatter, heatmap, histogram, boxplot, diverging bar, dumbbell, funnel, gauge, radar,
sankey, sunburst, treemap — built their options without it, so `duration`, `delay` and
`easing` went nowhere and `enabled: false` turned nothing off. They animated on the
renderer's own defaults: a full second of `cubicOut`, whatever the chart had been told.

A page that sets one animation for every chart on it now gets one animation for every chart
on it.
