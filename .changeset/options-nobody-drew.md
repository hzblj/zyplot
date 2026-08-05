---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Take out the options no renderer ever drew, rather than keep promising them.

`interaction.pan` was decoded on both native platforms and read by neither, and the docs said so
in as many words. `ChartPointAnnotation.symbol` typechecked everywhere and changed nothing
anywhere — the web draws a fixed dot and neither native side has the field at all.
`xAxis.scrollPosition` was advertised as an iOS extra, and the scrollable-axis modifier only ever
read `visibleDomain` beside it. An option that compiles and does nothing is worse than one that
is missing: it reads as a setting that did not take.

Gone with them are the names nothing referenced — `NATIVE_CHART_KINDS`, `NativeChartKind`,
`NativeChartPropsByKind`, `NativeChartConfiguration`, `ChartExtensionKindIos` and
`ChartExtensionKindAndroid`. `ChartSeriesStyle.symbol` stays; that one is drawn.
