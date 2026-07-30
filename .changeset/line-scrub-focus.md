---
'@hzblj/zyplot': patch
---

Stop a hover from dimming a web line chart's fill, and from dimming its stroke twice.

`dimOpacity` says how far the data being read steps back, and the pointer layer applies it
where it belongs: the stroke, on the series' resting style. `Chart.Line` was also handing
ECharts `emphasis.focus`, which puts the series into its own blur state on hover — and that
state takes the whole series down, `areaStyle` included. A line with a fill under it lost
both at once, and the stroke was dimmed twice over, once by each mechanism.

A chart that names `dimOpacity` is saying it will do the dimming itself, so ECharts' focus
is now switched off when it does. Charts that name no `dimOpacity` are unaffected and keep
the focus behaviour they had.
