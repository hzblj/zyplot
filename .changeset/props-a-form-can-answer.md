---
'@hzblj/zyplot': minor
---

Narrow the web props to the ones each form actually answers.

`ChartBaseProps` carried `annotations`, `interaction`, `onInteraction`, `plot`, `seriesStyles`,
`xAxis`, `yAxis` and the overlay slots onto all twenty-one forms, and five of them read those:
line, area, bar, stacked bar and candlestick. On the other sixteen they typechecked and vanished
— an `interaction` handed to `Chart.Pie` compiled, ran, and did nothing, which reads as a setting
that did not take rather than as one the form has no use for.

The base now splits three ways. `ChartBaseProps` is what every form takes; `ChartAxesProps` adds
the `axis` switch for the forms that draw a pair; `ChartPlotProps` and `ChartSeriesPlotProps` add
the plot, the axes options, the annotations and the scrub slots for the forms with a layer that
reads the pointer. The native props are untouched — the native renderers do read these on every
form, so a `.ios.tsx` or `.android.tsx` file keeps the wider surface.

`ChartInteractionEvent` loses `timestamp`, `x` and `y` in the same pass: no renderer on any
platform ever filled them in.
