---
'@hzblj/zyplot': patch
---

Things the renderers drew that they were never asked to.

The web entry point imported a stylesheet that only gathers two others with `@import`, and
not every bundler follows those in development — Metro leaves them out, so a chart came up
with no styles at all. That loses the layer its placeholder and its plot share: the two
stack up instead, and everything an app positions over the plot is measured from a canvas
that starts a placeholder's height too low. It now imports the built stylesheets themselves.

`Chart.Line` put a symbol on every reading. Its own documentation said symbols appear on
hover, and the native renderers draw none — a dot per datum is a mark the reader did not ask
for. Set `seriesStyles[id].symbol` and they come back.

A `range` or `text` annotation drew nothing at all, because the components that render them
were never registered with ECharts. They are now. A reference line's label showed the value
it sits on rather than the `label` given to it, which dropped a trailing zero from a price;
and with an `'overlay'` axis it printed that number a second time, on top of the axis' own —
`labelPosition: 'auto'` now keeps it at the rule's leading end, away from them.

Scrubbing a candlestick chart left every candle the pointer had passed still lit, because
ECharts' `highlight` adds to a set rather than replacing it. The bloom behind the read mark
was a flat fill with a shadow around it, which reads as a box sitting behind the candle
however soft its edges are; it is a radial gradient now, which has no edge to read.

A traced entrance ran behind the placeholder, so the plot cross-faded in with the trace
already part-drawn — or already finished, depending on which won the race. The marks now
wait for the placeholder to go. Its flash was also rebuilt at full strength whenever the
data changed, and nothing was left to put it out: a chart that had already made its
entrance kept the glow for good.

On Android an overlaid axis reserved a gutter for its labels *and* kept
`plotDimensionEndPadding` clear of them, so the marks stopped a label's width further from
the edge than on iOS. An overlaid axis reserves no gutter — that is what overlaying means.
