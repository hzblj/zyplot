+# Zyplot

Typed React charts for web, iOS, and Android. The web renderer uses ECharts and uPlot; native apps render with Swift Charts and Jetpack Compose.

## Install

```sh
npm install @hzblj/zyplot
```

## Quick start

```tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar', 'Apr'],
  series: [
    z.series({ id: 'revenue', label: 'Revenue', values: [42, 56, 51, 72] }),
  ],
  format: z.format({ prefix: '$' }),
}))

export function RevenueChart() {
  return <Chart.Line {...chart} />
}
```

No stylesheet import is required.
Build every chart configuration with `zyplot(z => ({ ... }))`, then spread the result into the chart component.

## Documentation

[Read the documentation](https://www.zyplot.janblazej.dev/docs) for installation, platform setup, theming, interaction, and a copy-paste example for every chart.

- 21 shared charts render on web, iOS, and Android.
- iOS also includes Range and Rule.
- Android also includes Waterfall and Lollipop.

## License

MIT © Jan Blazej
