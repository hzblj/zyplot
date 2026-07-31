---
'@hzblj/zyplot': patch
---

Put a pointer cursor over a web plot that answers the pointer.

A chart that reads the pointer — a crosshair following it, a tooltip under it, a readout above the
plot moving with it — said nothing about being interactive until it was touched. The arrow stayed
an arrow over the one region of the page that behaves like a control, which is the cheapest signal
there is and the only one available before the pointer has arrived.

The chart's own wrapper now carries `data-zyplot-interactive` when its plot reads a pointer at all,
and the stylesheet takes the cursor off it. The rule lands on the canvas rather than on the
wrapper, because both engines put something between the two: zrender writes `cursor: default`
inline onto the div it owns, and uPlot lays a bare overlay over its canvas — a rule on the
container loses to the first and is covered by the second. The attribute is part of the CSS
contract, so a page that wants its own cursor, outline or hit affordance can hang a selector off
the same hook.

It is on the forms that read `interaction` — `Chart.Line`, `Chart.Area`, `Chart.Bar`,
`Chart.StackedBar` and `Chart.Candlestick` — where `interaction.hover: 'none'` takes it off again,
and on `Chart.TimeSeries`, which reads a pointer by construction.
