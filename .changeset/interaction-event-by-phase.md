---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Discriminate the interaction event by its phase, so the field a phase is about stops being optional.

`ChartInteractionEvent` was thirteen optional fields, `phase` included, which left every reader
checking for something the chart had always sent: a `'layout'` event has a `geometry`, a reading
has an `index`, a two-finger one has a `range`. Now testing the phase narrows to the variant that
carries it, and the rest of the fields stay readable without narrowing, since a form fills in what
it can. The one path with no phase — a click or a hover on a form with no scrub layer — is a
variant of its own rather than a gap in the middle of the others.

Nothing changes at runtime; the events are the ones the renderers were already sending.
