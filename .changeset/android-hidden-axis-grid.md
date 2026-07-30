---
'@hzblj/zyplot': patch
---

Stop Android drawing grid rules for an axis that asked not to be drawn.

`yAxis={{visible: false}}` took the labels off the Compose canvas and left the rules behind:
`drawGrid` only ever consulted `yAxis.grid`, which defaults on, so a chart meant to be read
off its marks alone came out with five grey lines across it — and only on Android, since
Swift Charts and ECharts both drop a hidden axis' grid with the rest of it. A plot styled to
bleed off the window showed the divergence at its clearest: the rules stopped short of the
right edge, where the axis' end padding is.

The grid now follows the axis. `grid` still turns the rules off on their own for an axis that
is drawn, which is what a chart wanting labels without rules already passes.
