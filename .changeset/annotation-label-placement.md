---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Give an annotation label a chip and a side that keeps it readable. `labelBackground` paints
a rounded fill behind the label, so a rule's value stays legible where the marks run
through it, and `labelPosition: 'auto'` picks the side from where the rule sits: above it
in the lower half of the plot, below it higher up. Fixed sides still win when named, so
nothing changes for annotations that already pass `'top'` or `'bottom'`.
