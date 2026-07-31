---
'@hzblj/zyplot': patch
---

Thin a solid fill downwards on the web, the way `fadeTo` already promises.

`ChartSeriesFill.fadeTo` says how much of its strength the paint under a line still has at the
plot's floor, and nothing in it is about dots. The web read it only when the fill was a dot grid
— a solid one took a flat wash at full strength for its whole height, so a quote chart's area
arrived as a slab of colour instead of gathering under the trace. A solid fill with `fadeTo`
below 1 is now a vertical gradient over the filled shape, from the colour at the top to the same
colour at `fadeTo` of its alpha at the bottom, with `fillOpacity` still scaling the whole thing.

Fills that never set `fadeTo`, and dotted ones, draw exactly as they did.
