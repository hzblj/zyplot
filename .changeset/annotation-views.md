---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Put your own component where an annotation lands, with `annotationViews`.

The chart already reported where every annotation ended up, and an app that wanted a logo
at the live reading or its own head on a rule had to take it from there: hold the geometry
in state, absolutely position a view over the plot, keep the two in step. That work was the
same every time, so it lives in the chart now. Key a node by the annotation's `id` and it is
centred on the spot, moves with the data, and the mark the chart would have drawn there is
left out — one prop instead of an overlay of your own.

```tsx
<Chart.Line
  annotations={[annotation.point({id: 'live', x: live.category, y: live.value})]}
  annotationViews={{live: <LivePrice value={live.value} />}}
  categories={categories}
  series={series}
/>
```

The annotations you leave out keep the dot, glow and pulse the renderers draw, on all three
platforms, and nothing about the built-in marks has changed. An annotation can also be an
anchor and nothing else: `hidden: true` keeps it measured and reported in `geometry` while
drawing none of it, which is what a view of your own placed by hand — a card following the
finger, say — wants underneath it.

Charts that draw annotations but had no pointer layer to measure them (`Chart.Area`,
`Chart.Bar`, `Chart.StackedBar` on the web) now report `geometry` on the `'layout'` phase
like the rest, so the views land there too.
