---
'@hzblj/zyplot': patch
---

Draw every placeholder in the plot the chart is about to use, on all three renderers.

A placeholder is only worth having if nothing moves when the data lands, and none of the three
were keeping that promise. The web frame reserved a fixed left gutter for the value labels, six of
them however many the axis had been pinned to, eight bars however many categories there were, and
a 26 point floor — while the real plot gives up the whole row the category labels hang in below
that floor, half a label wherever one is centred on an edge of it, and the width the value labels
need on whichever side they are on. An overlaid axis was the worst of it: the placeholder kept a
gutter on the left for labels the chart draws on the right, so the bars arrived some thirty points
away from where they had been promised, in a plot nearly thirty points shorter than the one they
were drawn in.

`ChartSkeletonFrame` now takes the axis options themselves rather than a pair of booleans — the
same objects the chart was given — and works the geometry out of them: the gutter on the side the
labels are on and no wider than the widest of them, a label for each `tickValue` at the reading it
was pinned to, the category labels on the middle of their own bands, and the plot's own insets
including `plotDimension*Padding`. `SkeletonBars` lays its bars out in bands, four fifths of each
and never wider than `barMaxWidth`, so a week of seven and a month of thirty are spaced the way
they will be. `Chart.Bar` also passes its `xAxis` to the grid, so those paddings are honoured on
the web the way they already were on native — the one cartesian chart that was dropping them.

Native drew across the whole view: eight columns from the bottom edge of it, no matter what the
axes were taking or how many categories there were. Android now draws in `plotRect`, the same rect
the bars themselves are drawn in, and one band per category. iOS keeps the same gutters as
Android — the label row under a visible x axis, a label's width beside one in a gutter, and
`overlayAxisGutter` where the labels sit inside the plot.

All three now also lay down the axis itself: the rules the value axis draws at the readings it was
pinned to, and on the web the line the category axis draws along the plot. They are the chart's own
furniture rather than a value still to come, so they are drawn once in the grid colour and left to
sit — only the marks shimmer. iOS draws no rules for an overlaid axis, since that is a chart with no
y axis marks at all: it keeps the same guard `ZyplotChartAxisModifier` does.

The axes also get their labels: a pill wherever one is about to be written, on the line it will be
written on — the readings the value axis names, held inside the plot's trailing edge where the axis is
overlaid and clamped the way each renderer clamps them, and the categories the x axis names, each on
the middle of its own band.

iOS was the one renderer whose plot was guessed rather than derived, and it was wrong: Swift Charts
gives up only the row its labels are written in, some 21 points for a 13 point label, where the
placeholder was keeping Android's 44. Measured off a real chart, its plot starts 13 points down and
ends a label row above the bottom, which is what the placeholder keeps now — within a point of the
real thing, labels included.

The standalone `.Skeleton` components take the same things, since a Suspense fallback has no chart
above it to fill them in: `xAxis` and `yAxis` are now `boolean | NativeChartAxisOptions` — `false`
for an axis the chart hides, `true` for the label row alone, or the options themselves — beside
`categories` for the names the axis will write, `format` for how the value labels will read, and
`orientation` for the forms that can be turned. `Chart.Bar.Skeleton` keeps a `count` for a fallback
that has no categories to count. Everything already written keeps working: the booleans mean what
they meant.

Two smaller things came out of it. A placed label was landing nowhere: `Skeleton` carries its own
`relative` for the pulse it holds and `cn` only joins classes, so `absolute` never won and every
pinned label was offset from wherever the flow had left it. They are placed by a wrapper now. And the
bars reach less far up the plot — an axis rounds its domain up past the tallest bar, so a placeholder
that filled the plot arrived taller than the data ever was.
