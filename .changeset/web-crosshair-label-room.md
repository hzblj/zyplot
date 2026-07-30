---
'@hzblj/zyplot': patch
---

Give the crosshair's label somewhere to be drawn on the web.

`crosshairStyle.labels` places the words above the plot's ceiling, which is where they belong
and where iOS and Android put them: those draw over the chart's own view, and a view carries on
past the plot in every direction. A canvas does not. The label was hung upwards off a line eight
pixels below the top of the chart, so all of it was painted off the top and none of it was ever
seen — the crosshair arrived on the web with no words on it at all.

The plot now gives up the room the label needs, measured from the same two numbers the label is
drawn with, so the space and the text cannot drift apart. Only a chart that was given labels
gives anything up, and it gives it up whether or not a pointer is over the plot — marks that
changed height the moment one arrived would be worse than either.

The label is also kept whole against both edges, the way iOS pins it. A crosshair reaches the
ends of the plot and a date is wider than the hairline it names, so the first and last readings
of a series were worth half a label each.
