---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Let a rule annotation set its own thickness. `width` joins `dash` and `color` on
`ChartLineAnnotation`, honoured on iOS, Android and the web — the line width was pinned at 1
in the native drawing code, so a reference line could be dashed and coloured but never made
heavier or lighter than the hairline it started as.

Android drew both the width and the dash lengths in pixels while they are given in dp, which
on a 3× screen made a dashed rule a third of its asked-for thickness with a third of its
asked-for dash; both are scaled now.
