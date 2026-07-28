# @hzblj/zyplot

Cross-platform React charts with one install and no WebView. The web renders
with ECharts and uPlot; iOS renders with Swift Charts and Android with a Jetpack
Compose `Canvas`, both through an Expo module that ships inside this package.

```bash
yarn add @hzblj/zyplot
```

Native targets need a development build — Expo Go cannot load native modules:

```bash
npx expo prebuild
npx expo run:ios
```

## Entry points

| Import                  | Target     | Gives you                                                     |
| ----------------------- | ---------- | ------------------------------------------------------------- |
| `@hzblj/zyplot`         | any        | The twenty-one forms every platform renders                    |
| `@hzblj/zyplot/web`     | web        | Every web form, plus `Provider`, `Frame`, `Legend`, `Skeleton` |
| `@hzblj/zyplot/ios`     | iOS        | Shared forms, plus `Range` and `Rule`                          |
| `@hzblj/zyplot/android` | Android    | Shared forms, plus `Lollipop` and `Waterfall`                  |

A plain import resolves to the right renderer on its own, so most code never
names a platform:

```tsx
import { Chart } from "@hzblj/zyplot";

<Chart.Line categories={["Jan", "Feb"]} series={series} />;
```

Styles are loaded by the JavaScript entry point. No separate CSS import is
required, and your application does not need Tailwind CSS.

## Platform-only forms

Some marks exist on one renderer alone. They are deliberately absent from the
shared namespace, so what type-checks is what runs. Reach them by giving the
component one file per platform and letting Metro choose:

```tsx
// forecast.ios.tsx
import { Chart } from "@hzblj/zyplot/ios";

export const Forecast = ({ bands }: ForecastProps) => (
	<Chart.Range data={bands} height={300} />
);
```

```tsx
// forecast.android.tsx
import { Chart } from "@hzblj/zyplot/android";

export const Forecast = ({ bands }: ForecastProps) => (
	<Chart.Lollipop data={bands.map(toPoint)} height={300} />
);
```

The call site imports `./forecast` and never learns which file it got. Keep a
plain `forecast.tsx` alongside them: `tsc` does not resolve platform
extensions, and that file doubles as the web version.

## Surface

`theme` answers "what colour is this series"; `surface` answers "what does the
container look like". Keeping them apart is what lets a design system set one
card treatment for every chart while each chart keeps its own palette.

```tsx
<Chart.Provider surface={{ background: "#fff", cornerRadius: 16, padding: 12 }}>
	<Chart.Line categories={categories} series={series} />
	<Chart.Bar surface={{ cornerRadius: 24 }} categories={categories} series={series} />
</Chart.Provider>
```

A chart's own `surface` merges over the provider's key by key, so the bar above
rounds its corners without restating the background it inherits.

| Key            | Type                              |
| -------------- | --------------------------------- |
| `background`   | `string`                          |
| `border`       | `{ color?: string; width?: number }` |
| `cornerRadius` | `number`                          |
| `padding`      | `number \| ChartSurfacePadding`   |

Only properties that mean the same thing to a `div`, a SwiftUI view and a
Compose `Canvas` live here. Anything that would have to be approximated on one
of the three is deliberately absent.

## Theming

Zyplot inherits the application's font. On the web, scope a theme with the
provider:

```tsx
<Chart.Provider
	colorMode="inherit"
	theme={{
		colors: { categorical: ["#7c3aed", "#0284c7", "#ea580c"] },
		typography: { fontFamily: "Geist, sans-serif" },
	}}
>
	<Chart.Line categories={categories} series={series} />
</Chart.Provider>
```

`colorMode` accepts `inherit`, `light`, `dark` or `system`. Themes can also come
from the public `--zyplot-*` CSS variables. A `color` on an individual series
takes priority over its palette `slot`. `Chart.Provider` exists on native too,
so the same code scopes a theme on either side.

## Supported forms

`Area`, `Bar`, `Boxplot`, `Candlestick`, `DivergingBar`, `Dumbbell`, `Funnel`,
`Gauge`, `Heatmap`, `Histogram`, `Line`, `Meter`, `Pie`, `Radar`, `Sankey`,
`Scatter`, `Sparkline`, `StackedBar`, `Sunburst`, `TimeSeries`,
`Treemap` — on every platform. Plus `Range` and `Rule` on iOS, `Lollipop` and
`Waterfall` on Android.

On the web every form exposes its matching loading state at
`Chart.<Form>.Skeleton`, and `Chart.Frame` and `Chart.Legend` provide optional
shared presentation.

## Requirements

- React 19, and Expo 55 with React Native 0.83 for native targets
- iOS 17.0 deployment target — set it with `expo-build-properties` if your app
  targets something lower
