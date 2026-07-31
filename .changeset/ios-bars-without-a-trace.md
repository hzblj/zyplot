---
'@hzblj/zyplot': patch
---

Stop iOS drawing a line across the top of every bar chart.

The canvas that strokes a series' trace was attached to every form `ZyplotMarksChart` renders,
not to the ones that have a trace. On a line or an area that canvas *is* the chart. On anything
drawn as bars or as points it is a second, uninvited chart on top: a polyline through the bar
tops, in the series colour, which reads as a rendering fault because it is one.

It went unseen because it takes a screen built on bars to notice — a gallery example is glanced
at, and the line looks almost like an axis until the bars are the point. The trace canvas and
the scrub highlight canvas now both check the form first: `line`, `area`, `sparkline` and
`time-series` keep them, and the bar, histogram, scatter, heatmap and boxplot families are left
to their own marks.
