# @hzblj/zyplot-core

The platform-neutral half of [Zyplot](https://www.zyplot.janblazej.dev): the chart
contract, with no renderer attached.

**Application code should not install this package.** Everything here is
re-exported from `@hzblj/zyplot`, so `import type {ChartSeries} from '@hzblj/zyplot'`
is the supported way in. It is published because the types `@hzblj/zyplot` exposes
refer to it, and because a package boundary is the only thing that can actually keep
a renderer out of the contract.

## What lives here

Anything that is true of a chart regardless of who draws it:

- **Data shapes** — `ChartSeries`, `ChartDatum`, `ChartTimePoints`, and the rest of
  the per-form inputs. Arrays are `readonly`, so the same value can be handed to a
  web chart and a native one.
- **Presentation vocabulary** — `ChartSurface`, `ChartPlotStyle`, `ChartAxisOptions`,
  `ChartAnnotation`, `ChartAnimation`, `ChartInteraction`, `ChartSeriesStyle`,
  `ChartInteractionEvent`.
- **The native props surface** — `NativeChartBaseProps` plus one type per form, and
  `NativeChartPropsByKind` / `NATIVE_CHART_KINDS`, which the native charts are
  generated from.
- **The runtime that has no platform** — the `factories` (`annotation`, `axis`,
  `marker`, `options`, `reveal`, `series`), which only ever return plain prop
  objects, plus `mergeChartSurface`, `resolveChartSurfacePadding` and
  `defaultChartTheme`.

## What does not

- Anything importing `react`, `react-native`, `echarts` or `uplot`. This package has
  no dependencies and should keep none — that is what makes the boundary real
  rather than a naming convention.
- Anything one platform means differently. `ChartTheme` and `ChartColorMode` are the
  standing examples: the web one sets CSS variables and carries `sequential`,
  `diverging` and `'inherit'`; the native one is a resolved palette passed to Swift
  Charts and Compose. They are deliberately separate types, not a shared one with
  optional halves.
- Web props. `ChartBaseProps` lives in `@hzblj/zyplot` because `className`,
  `skeleton` and `texture` only mean something in a DOM.

The test for a new type: would iOS and the DOM both use it, and mean the same thing
by it? If yes it belongs here. If it needs an `if (web)` in its doc comment, it does
not.
