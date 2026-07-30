---
'@hzblj/zyplot': patch
---

Let a web line chart's marks travel to a new dataset again once its entrance has run.

A data change was supposed to move the marks reading by reading. It cut instead — the whole
trace at the new dataset the frame the option landed — while the rules and the points drawn over
it travelled the full length of the change on their own. So a range switch read as the plot
jumping and its annotations then sliding into place after it, which is the opposite of what
`transition: 'morph'` promises anywhere else.

The cause was the entrance, of all things. A fade is the stroke's own opacity changing after the
marks have landed, which no option covers, so it is driven frame by frame and written back
through `setOption` — and each of those writes has to turn the renderer's update tween off, or
every frame of the fade is chased by one. That key is merged into the read series and stays
there. Once an entrance had run, the series had no update animation at all, for the life of the
chart. Everything drawn over it kept the chart's own timing and travelled, which is why the two
came apart rather than both cutting.

How a data change is timed is now restated on the series as well as on the chart, so the option
after an entrance puts back what the entrance took away.

Also fixed: the first frame of a fade painted the trace at full strength. A frame's timestamp is
when that frame began, which can be before the fade was asked for, and an unclamped `ease-out`
of a negative elapsed is a negative opacity — not dim but invalid, which a canvas answers by
keeping whatever alpha it had.
