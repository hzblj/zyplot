---
'@hzblj/zyplot': minor
---

Add `fill` to the series style: a dot-grid pattern, and a baseline other than the plot floor.

`fillOpacity` was the whole vocabulary for the area under a line, and it only did anything on
`Chart.Area`, where the fill runs to the bottom of the plot because there the fill is the
quantity. Two things a price chart wants were unsayable.

A fill can now close against a value — `fill({baseline: latest})` — so the shape between the
trace and that number is filled above the line and below it, and reads as distance from where
the asset stands rather than as volume. And it can be laid down as a grid of dots rather than
a flat wash — `fill({pattern: 'dots', spacing: 3.4})` — which carries a fill across a pale
background without the second, fainter chart a wash leaves behind it.

`fill` lives on `NativeChartSeriesStyle` next to `glow`, so every entry point takes it, the
web one included: a clipped dot path on the SwiftUI and Compose canvases, a repeating canvas
pattern on ECharts. Opacity is still `fillOpacity` — one spelling — though a dot grid usually
wants more of it than a wash, since most of what it covers stays bare.

Giving a series a `fill` also paints an area under `Chart.Line`, where it is decoration rather
than the quantity. `Chart.Area` is unchanged: it still fills by default, and a `fill` only
overrides the pattern and the baseline.
