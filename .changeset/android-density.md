---
'@hzblj/zyplot': patch
---

Draw Android charts at the size they were asked for. Every absolute number a chart takes —
plot padding, axis gutters, stroke and wick widths, annotation dot and halo sizes, glow radii,
badge and label geometry, marker sizes — is authored in dp, but the Compose canvas measures
in pixels and the drawing code used the two interchangeably. On a 3× phone that made all of
it a third of its intended size: a 6 dp live dot drew at 2 dp, a 42 dp glow barely left the
stroke, and the axis gutter was too narrow to keep labels off the trace. Pointer hit-testing
had the same mismatch, since the plot box was measured in dp and compared against a pixel
pointer.

The geometry an app lays its own views out with is now reported in dp, matching iOS's points,
so an overlay positioned from `useChartScrub`'s `geometry` and `nativeX` lands where the
chart drew rather than a screen away.
