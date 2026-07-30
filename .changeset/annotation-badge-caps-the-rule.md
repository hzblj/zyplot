---
'@hzblj/zyplot': patch
---

Let an annotation badge cap its rule instead of sitting on it. The badge was placed a
default annotation gap below the plot edge, so a stub of the rule stuck out above it and
the dashes ran straight through the circle — the glyph read as floating in the plot rather
than as the rule's head. It now sits flush with the plot edge, and the rule starts below
it: on Android the rule is drawn from under the badge, and on iOS the badge paints the
chart's plot (or theme) background behind itself to mask the part it covers. Charts with a
transparent plot background keep the previous translucent badge, since there is nothing to
mask with.
