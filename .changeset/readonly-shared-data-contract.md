---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Make the data shapes one contract across web and native. The web entry point had
its own copies of `ChartSeries`, `ChartDatum`, `ChartTimePoints` and the other
per-form inputs, identical to the ones in `@hzblj/zyplot-core` except that their
arrays were mutable. It now re-exports the core types, so a value typed once can be
handed to a web chart and a native one.

Every web chart prop that takes a list — `series`, `categories`, `data`, `nodes`,
`cells`, `groups`, `rows`, `values` — now accepts a `readonly` array, as the native
props and web's own `Chart.Candlestick` already did. Passing an `as const` array or
the result of a `readonly`-returning selector no longer needs a cast.
