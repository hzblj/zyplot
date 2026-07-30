---
'@hzblj/zyplot': patch
---

Let `isLoading={false}` keep the first-frame placeholder off the page.

A web chart cannot paint until it has read its colours off the document, which happens in an
effect, so the built-in placeholder covered that first frame for every chart — including one
mounted with its data already in hand. On a page that swaps charts as you click through them the
cost is visible: a grey shape fades in and out again for a chart that was never loading.

An explicit `isLoading={false}` on the first render now opts out of the placeholder for good, and
the plot fades in on its own. A chart that says nothing about loading keeps the old behaviour,
which is what a server-rendered page wants: markup to paint before hydration. One that starts true
and later flips to false still cross-fades — the placeholder it was showing stays mounted to fade
out.
