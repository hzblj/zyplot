---
'@hzblj/zyplot': patch
---

Let `hover: 'none'` actually switch the gesture off, on both native platforms.

It is documented as the off switch and was read as neither. iOS tested whether `hover` had been
set at all, so passing `'none'` announced a gesture rather than declining one; Android compared it
against `'none'` but let the tooltip's own default turn the gesture back on behind it. A chart
handed `hover: 'none'` — a chart mid-placeholder, say, where there is nothing to read yet — kept
following the finger on both.

Now `'none'` is decisive on each: nothing else the chart passes turns a gesture back on. A chart
that names no `hover` at all is untouched, so this only reaches the ones that asked.
