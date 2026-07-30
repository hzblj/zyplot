---
'@hzblj/zyplot': patch
---

Give `Chart.Candlestick` a placeholder shaped like a candlestick chart.

`Chart.Candlestick.Skeleton` was `BarChartSkeleton`, and so was the placeholder the chart itself
drew while loading: a row of bars grown from the baseline. A candle does not sit on the baseline —
it floats on its wick — so the shape that landed was never the shape that had been promised, and
the swap moved every mark on the plot.

The candlestick now has its own: bodies of varying height, each centred on a wick, each offset up
or down the plot the way a real series wanders. Nothing to configure — like the other
placeholders it is derived from the props the chart already has.
