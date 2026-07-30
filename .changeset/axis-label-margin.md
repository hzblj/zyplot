---
'@hzblj/zyplot': patch
---

Put the axis labels back on every web chart drawn through ECharts.

A gutter axis — the default on both dimensions — asked for no label inset, and asked for it
by handing ECharts `axisLabel.margin: undefined`. An option given explicitly wins over the
engine's own default even when it holds nothing, so the 8px gap the labels are laid out from
went missing, and every label on the axis was placed at the canvas' corner rather than beside
its tick: a pile of overlapping text clipped by the plot's leading edge, no scale to read
anywhere, and a plot pushed down the canvas by the room the same measurement asked for.

The inset is now set only where a chart means to move a label — an `'overlay'` axis, against
the plot's trailing edge — and left off entirely everywhere else. `Chart.Candlestick` built
its category axis by hand and carried the same bug, including for an overlaid axis that named
no `labelInset`; it now takes the shared inset with the rest.
