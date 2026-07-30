---
'@hzblj/zyplot': patch
---

Stop painting canvas text in the browser's serif when the page declares no font.

A web chart reads the font in effect where it sits and hands it to the canvas,
which is what makes it match the type around it. When nothing up the tree declares
a font, though, that read answers with the user agent's default — a serif — and the
chart drew its axis labels in Times beside text that was not.

React Native Web is where this shows: its reset puts no `font-family` on `html` or
`body` and gives each `<Text>` the system stack through a class of its own, so an
Expo web app has nothing for a chart to inherit however deeply it looks. Every
chart in one rendered its numbers in Times.

The inherited font is now compared against what the browser resolves with no author
styles in play, and falls back to `system-ui` and the platform stack behind it when
the two match. A page that does set a font is untouched: inheritance still wins, and
`--zyplot-font-family` and `theme.typography.fontFamily` still override both.
