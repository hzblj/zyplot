---
'@hzblj/zyplot': minor
---

Export the types the props already had you holding, and stop shipping one name for two shapes.

`ChartTooltipAnchor`, `ChartTooltipPlacement`, `ChartInteractionRange`, `ChartRangeStyle` and
`ChartBandAlign` were all reachable through an exported type and none of them could be imported,
so a web app could hold one of these values but never annotate it. `Chart.Provider` on
`@hzblj/zyplot/ios` and `@hzblj/zyplot/android` now exports its `ChartProviderProps` as well.

`ChartColorMode` meant two different unions depending on the entry point — the core one on native,
and a web one that added `'inherit'` for the provider. The web entry now exports the core union
under that name and the wider one as `ChartProviderColorMode`, so the same import means the same
thing everywhere. `ChartOrientation` likewise replaces the five inline copies of
`'horizontal' | 'vertical'`.
