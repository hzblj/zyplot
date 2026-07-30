---
'@hzblj/zyplot': patch
---

Give `Chart.TimeSeries` the same axis spacing as every other form. Its value band was a fixed 48px
— uPlot takes a width, not a measurement — so a two-digit scale sat a long way off its plot while
the ECharts forms beside it kept their labels 8px away. The band is now measured from the widest
reading in it, in the font the chart paints, and both axes take the same 8px gap the rest of the
library uses.
