---
'@hzblj/zyplot': patch
---

Stop an Android trace from stretching over the empty end of its own axis.

A line or an area spread its marks across the whole plot no matter how many categories the axis
had — one step per reading rather than one per slot. A window that ends before its period does,
which is what an intraday chart is, therefore drew its last reading at the trailing edge while
everything placed by category stayed where the category was: the annotation on the latest price
sat in open space with the trace running on past it, and the scrub stopped short of the end of the
line it was reading. Marks now stand on their own slot, the way they already did on the web and on
iOS, and a trace shorter than its axis runs out where its data does.
