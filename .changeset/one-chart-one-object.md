---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Describe a whole chart as one object.

`zyplot(z => ({…}))` calls the builder with every factory the package exports as `z` and returns the
props a chart takes, so its data, its axes, its arrival and the styling of each series are one
expression behind one import rather than a page of props assembled from six of them. That is what
makes a sample liftable: the object is the chart, so it copies into an app whole. It is on all four
entry points, and `ZyplotFactories` and `ZyplotChartProps` name what goes in and what comes out.

The `style` declared on a series is split into `seriesStyles` on the way out, so `zyplot` is
`seriesProps` as well — the id is written once, and an explicit `seriesStyles` entry still wins over
the `style` on the series it names. Nothing has to be in the object: one that leaves the data out is
a preset, and the props it is spread under fill in the rest.

Naming the form checks the config where it is written rather than where it is spread:
`zyplot<LineChartProps>(…)` for a whole chart, `zyplot<Partial<LineChartProps>>(…)` for a preset that
expects its data at the call site.

Every chart in the example app is built this way now, the five design studies included, so each one
is a config to read and the JSX beside it is a spread. Only the app's own nodes — the tooltip view,
the annotation views — are still passed as props, since a React element is new on every render and
folding one into the config would rebuild the dataset with it.
