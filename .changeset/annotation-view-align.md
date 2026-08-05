---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Say where a view of yours sits in the box the chart lays it in, instead of taking the one place the
chart picked.

`ChartViewAlign` is `'top' | 'center' | 'bottom'`, and two places read it.

An `annotationViews` entry can now be `{align, view}` as well as the view itself. What the three mean
follows from how the mark runs: a rule down the plot is a mark with a height of its own, so they are
its head, its middle and its foot — and its head is still what a view gets unasked, because that is
where the chart's own badge goes. A point and a rule across the plot are spots rather than runs, so
they read as on the mark, above it and below it, and `'center'` is what those get unasked.

```tsx
annotationViews={{
  earnings: {align: 'center', view: EarningsChip},
  live: {align: 'top', view: LiveBadge},
}}
```

`tooltip.beside` takes the same word for the card it places. That card sat against the plot's top edge
whatever it was, which is right for one read as belonging to the reading and wrong for one big enough
to want the middle of the plot:

```tsx
tooltip.beside({align: 'center', view: ReadingCard})
```

`tooltip.above` does not take it: a chip placed above is already lifted clear of the plot, so it has no
room to be placed down, and the builder rejects the field rather than ignoring it.

Nothing moves that did not ask to — every default is what the place did before. One exception, and it
is a fix: a view on a rule down the plot straddled the plot's top edge on the web, with half of it
above the chart, where iOS and Android sat it below the edge. All three now do what the two did.
