---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Report where the plot and its annotations ended up, so an app can draw its own overlays
instead of the ones the chart bakes in. Native charts now emit a `'layout'` phase carrying
`geometry` — the plot's box and every annotation's position, in the chart view's own
coordinate space — and `useChartScrub` returns it as `geometry` alongside the selection,
which also carries the pointer's `nativeX`/`nativeY` now.

That is enough to place any React component over the chart: your own badge on an event
annotation instead of the built-in glyph-in-a-circle, your own card at the reading under
the finger, a logo, a button, whatever the design asks for. Leave `badge` off the
annotation and the chart draws only the rule, leaving the head to you.
