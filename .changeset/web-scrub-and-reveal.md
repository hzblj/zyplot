---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Make the web renderer read a pointer the way the native ones read a finger, so a screen
built on a scrub is one screen on all three platforms rather than two.

`useChartScrub` is now exported from the web entry point as well. The scrub lifetime is no
longer native's alone: `ChartInteractionEvent` carries `phase`, `index` and `geometry` on
every platform, and `Chart.Line` and `Chart.Candlestick` report them from the pointer —
`'began'` when it enters the plot, `'changed'` as it moves, `'ended'` when it leaves, and
`'layout'` with the plot's box and every annotation's position once the chart has measured
itself. `NativeChartInteractionEvent` stays as a name for the same shape.

The web props also take the fuller presentation vocabulary they were previously typed out
of, and the renderer honours it:

- `interaction.marker` lights the mark being read — a stretch of the line for
  `marker.segment`, a bloom behind the candle for a mark that has its own body — with
  `crosshairStyle`, `dimOpacity`, `highlightColor` and `highlightBlend` around it.
- `animation.reveal` traces a line open: `trackColor` lays the shape down first, and
  `flashColor` with its glow, hold and decay lands with the frontier and then leaves.
- `annotations` draw their `glow`, `halo`, `pulse`, `badge`, `label`, `labelBackground`,
  `labelPosition` and `scrubOpacity`.
- `axis.overlay` puts the tick labels inside the plot at `labelInset`, `tickValues` pins
  them to exact readings, and `plotDimensionStartPadding`/`plotDimensionEndPadding` keep the
  marks clear of them.
- `seriesStyles[id].glow` blooms behind a stroke, and `style.candleWidth`/`style.wickWidth`
  size a candle. `style.candleRadius` is the one prop the web cannot honour: ECharts draws a
  candle as a single path with no corner radius to give.
- Every chart takes a `theme` of its own, merged over `Chart.Provider`'s, so a preset that
  carries colours can be handed to a web chart and a native one alike.
