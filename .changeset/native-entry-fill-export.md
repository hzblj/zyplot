---
'@hzblj/zyplot': patch
---

Export `fill` from `@hzblj/zyplot/ios` and `@hzblj/zyplot/android` too.

The builder landed on the shared entry point and the web one and was left off the two platform
subpaths, which are the entries a file already committed to a platform imports from — so the
screens most likely to want a dotted fill under a trace were the ones that could not name it
without reaching back to `@hzblj/zyplot`. Every other builder is on all four, and the docs say
so; this one is now as well.
