---
'@hzblj/zyplot': patch
---

Draw a web reference line solid when it was not asked to be dashed.

`annotation.line()` with no `dash` is a solid rule, and is one on iOS and Android. On the web it
came out dashed, because a reference line is the one thing ECharts has an opinion about: its
`markLine` defaults to `'dashed'`, and the key was handed over holding nothing — which leaves a
renderer's own default standing rather than overriding it, the same trap the axis label margin
was in. The rule standing in for an axis on a plot that has none was a row of faint dashes
instead of the hairline it was written as.
