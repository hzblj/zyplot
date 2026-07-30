---
'@hzblj/zyplot': patch
---

Make sure a web chart's stylesheets actually reach the page, which is what `Chart.TimeSeries`
was missing to draw at all.

The two stylesheets a chart needs were imported by the web entry point, which does nothing but
re-export. A bundler is free to read a re-export, resolve the symbol to the module that declares
it and never run the file in between — Turbopack does exactly that — so an app got the charts and
none of the CSS. uPlot's is structural: without it the plot is not positioned, the canvas is not
scaled to its box, and `Chart.TimeSeries` painted a stretched grid and giant axis labels sliding
out of the card with no line in sight. They now sit with `Chart` itself, reached by the same
import that reaches a chart, which no tree shake can drop.

That stylesheet now arrives in the `base` cascade layer, because an app with Tailwind of its own
ends up holding two builds of the same utilities under the same names, and this one — pulled in by
a chart — comes second. A plain `.flex` or `.hidden` from here beat the app's own `dark:block` and
`min-[821px]:hidden` on the app's own markup, since a variant carries no more weight than the
utility it varies: dark-mode pages showed their light-mode element, and elements meant to be hidden
at a width stayed on screen. In `base` these lose to everything an app writes, while a page whose
only stylesheet is this one renders exactly as before.
