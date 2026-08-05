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
  `ChartInteractionEvent` and `ChartInteractionHandler`.
- **The native props surface** — `NativeChartBaseProps` plus one type per form.
- **The runtime that has no platform** — the `factories` (`annotation`, `axis`,
  `marker`, `options`, `reveal`, `series`, `tooltip-anchor`), which only ever return
  plain prop objects, and `zyplot`, which hands all of them to one builder and returns
  a whole chart's props as one object, plus `mergeChartSurface`,
  `resolveChartSurfacePadding` and `defaultChartTheme`.

## What does not

- Anything importing `react`, `react-native`, `echarts` or `uplot`. This package has
  no dependencies and should keep none — that is what makes the boundary real
  rather than a naming convention.
- Anything one platform means differently. `ChartTheme` is the standing example: the
  web one sets CSS variables and carries `sequential` and `diverging`; the native one
  is a resolved palette passed to Swift Charts and Compose. They are deliberately
  separate types, not a shared one with optional halves — and where they part they
  take separate names, the way `ChartColorMode` here and `ChartProviderColorMode` in
  `@hzblj/zyplot` do rather than one name meaning two things.
- Web props. `ChartBaseProps` lives in `@hzblj/zyplot` because `className`,
  `skeleton` and `texture` only mean something in a DOM.

The test for a new type: would iOS and the DOM both use it, and mean the same thing
by it? If yes it belongs here. If it needs an `if (web)` in its doc comment, it does
not.
