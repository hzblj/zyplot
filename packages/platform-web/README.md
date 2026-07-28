# @hzblj/zyplot-platform-web

The web implementation of Zyplot. Its only runtime export is the `Chart` namespace.

```tsx
import { Chart } from "@hzblj/zyplot-platform-web";

<Chart.Line categories={["Jan", "Feb"]} series={series} />;
<Chart.Line.Skeleton height={240} legendCount={series.length} />;
```

Styles are loaded by the JavaScript entry point. No separate CSS import is
required.

## Theming

Zyplot inherits the application's font. Scope a theme with the provider:

```tsx
<Chart.Provider
	colorMode="inherit"
	theme={{
		colors: {
			categorical: ["#7c3aed", "#0284c7", "#ea580c"],
		},
		typography: {
			fontFamily: "Geist, sans-serif",
		},
	}}
>
	<Chart.Line categories={categories} series={series} />
</Chart.Provider>
```

`colorMode` accepts `inherit`, `light`, `dark`, or `system`. Themes can also be
provided through the public `--zyplot-*` CSS variables. A `color` on an
individual series has priority over its palette `slot`.

## Supported forms

- `Chart.Area`
- `Chart.Bar`
- `Chart.Boxplot`
- `Chart.DivergingBar`
- `Chart.Dumbbell`
- `Chart.Funnel`
- `Chart.Gauge`
- `Chart.Heatmap`
- `Chart.Histogram`
- `Chart.Line`
- `Chart.Meter`
- `Chart.Pie`
- `Chart.Radar`
- `Chart.Sankey`
- `Chart.Scatter`
- `Chart.Sparkline`
- `Chart.StackedBar`
- `Chart.Stat`
- `Chart.Sunburst`
- `Chart.TimeSeries`
- `Chart.Treemap`

Every form exposes its matching loading state at `Chart.<Form>.Skeleton`.
`Chart.Frame` and `Chart.Legend` provide optional shared presentation.

ECharts renders general-purpose chart forms. uPlot renders dense time series and sparklines.
