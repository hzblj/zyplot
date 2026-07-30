---
'@hzblj/zyplot': minor
---

Let every entry point hand over the whole contract, not most of it.

`@hzblj/zyplot/ios` and `@hzblj/zyplot/android` re-exported the shared types and `Chart`, and
then stopped: the builders and `useLastReading` are values, and `export type *` does not carry a
value. So the import the documentation shows for a platform file — `import {annotation, Chart}
from '@hzblj/zyplot/ios'` — resolved at the type level and came back `undefined` at runtime. Both
entries now export the fifteen builders and `useLastReading` alongside `useChartScrub`, so a
`*.ios.tsx` file needs one import rather than two.

`@hzblj/zyplot/web` re-exported a hand-kept subset of the shared types, and several a web chart
actually needs were missing from it: `ChartCandlestickDatum` and `ChartCandlestickStyle`, which
`Chart.Candlestick` takes; `ChartRangeAnnotation` and `ChartTextAnnotation`, two of the four
members of the union `annotations` is; `StyledChartSeries`, what the `series` builder returns;
and the small unions the documented shapes are written in terms of — `ChartSymbol`,
`ChartAxisScale`, `ChartCoordinate`, `ChartSurfacePadding` and the rest. Typing a candle array
or a helper that returns a range annotation meant importing from `@hzblj/zyplot-core` directly.
They are all re-exported now.

`Chart.TimeSeries` was also the one web form whose list prop stayed mutable: its `series` is
`readonly Omit<ChartSeries, 'values'>[]` now, like every other list the web charts take.
