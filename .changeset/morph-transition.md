---
'@hzblj/zyplot': minor
---

Make `transition: 'morph'` do something on iOS and Android.

`ChartTransition` has offered `'crossfade' | 'morph'` since the contract was written, but
only crossfade was ever implemented. Asking for a morph did not fall back to a crossfade —
it fell through to no animation at all, and the plot cut from one dataset to the next.

Both platforms now blend the two: the readings, the pinned axis domain, and the value a rule
or a point sits at, so nothing on the plot jumps while the trace is on its way. Annotations
are matched by `id` — one that exists on both sides slides, one that does not simply
arrives. A morph needs the two sides to correspond, so where the series count or the
reading count differs the new dataset is shown as it is: half a morph reads worse than none.

`animation({duration, easing})` times it, the same two that time the entrance and every
other data change — so a morph is tuned from the props rather than from a curve baked into
the renderer. `'spring'` resolves to the eased curve: there is no closed form to sample at a
fraction, and a transition that overshoots would carry the marks past their new values and
back.

The frames are produced rather than animated towards. SwiftUI and Compose both interpolate
*modifiers*; a fraction fed to a *data* computation is set straight to its final value and
the body runs once, which is an animation that never draws a frame. iOS runs the clock off a
`TimelineView`, the way the traced reveal does, and parks the schedule whenever nothing is
moving. Android reads the clock inside the canvas, so a morph costs a draw a frame rather
than a recomposition of the chart around it.

Implicit animation is switched off underneath the iOS morph — the chart's own update
animation with it, which is the one that mattered. An animation keyed on the data is handed a
new target on every frame of a morph and spends the whole morph chasing it: the trace is drawn
from the frame directly and lands on time, while every mark Swift Charts owns arrives a beat
late and keeps moving after the line has settled. The rule at the latest reading showed it
worst — it hung at its old price and then slid down once the morph was already over. Compose
draws straight from the frame it is given, so it never had the second animation to switch off.

A morph cut short sets off from what is on screen rather than from the dataset the last one
was heading for. A row of range buttons gets pressed in sequence, and snapping back to the
window before to set off again is a jump nobody asked for.

Two datasets only correspond if they agree on how many readings they have. A screen that
switches between windows of different lengths — a day against a year — has to sample them
into the same number of slots to be morphed between; otherwise this stays a crossfade.

`transition` stays a native choice, and is now documented as one. The web renderer
transitions a data change itself, mark by mark: the ones on both sides move, the ones on one
side fade. That is a better answer to a changed axis than dissolving the whole plot, so a web
chart does it whichever name it is given — including for the same `animation` object an app
shares with its native screens.

