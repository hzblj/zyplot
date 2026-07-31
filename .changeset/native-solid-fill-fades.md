---
'@hzblj/zyplot': patch
---

Thin a solid fill downwards on iOS and Android too, so `fadeTo` means the same thing on all
three renderers.

The SwiftUI and Compose canvases read `fadeTo` only on the way to a dot grid, which is the one
place it had to be a per-row alpha. A solid fill went down as one flat wash at full strength, so
a quote chart asking for `fill({fadeTo: 0.06})` got a slab of colour with a hard edge along the
floor — the exact edge `fadeTo` exists to remove. It is now a vertical gradient over the plot,
from the colour at the top to the same colour at `fadeTo` of its alpha at the bottom, with
`fillOpacity` still scaling the whole thing.

Fills that never set `fadeTo`, and dotted ones, draw exactly as they did.
