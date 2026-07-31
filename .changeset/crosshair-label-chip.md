---
'@hzblj/zyplot': minor
---

Style the crosshair's label into the chip your design asked for.

`crosshairStyle` takes `labelBackground` for a fill behind the words, `labelPadding` for the room
around them — a number for both ways, or `{x, y}` — `labelRadius` for its corners, defaulting to a
round cap, and `labelLift` for the gap above the plot. Without a background nothing changes: the
label is the text, lifted 8 as before.

It is there because the alternative costs more than it looks. A chip of your own placed from a
scrub handler crosses into JavaScript and back before it moves, so on a fast drag it lands well
behind the crosshair it belongs to — and on release it has already jumped to the latest reading,
which is what fades out. The chart draws this one where it draws the line.
