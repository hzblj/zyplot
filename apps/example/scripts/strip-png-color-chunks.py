#!/usr/bin/env python3
"""Drops colour-management and metadata chunks from captured PNGs.

`sips` writes `gAMA` and `cHRM` into every file it touches. A browser honours
them and colour-manages the image, while the CSS colour behind it is plain
untagged sRGB — so identical values render differently. Near white the shift is
invisible; near black it is not, which is why the dark captures grew a black
frame around the card while the light ones looked fine.

Stripping them leaves the pixels untouched and tells the browser to draw them
as-is, which is what makes the screenshot and the container agree.
"""

import struct
import sys
from pathlib import Path

# Everything the image needs to decode. Anything else is metadata.
KEEP = {b"IHDR", b"PLTE", b"tRNS", b"IDAT", b"IEND"}


def strip(path: Path) -> bool:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        return False

    out = bytearray(data[:8])
    pos = 8
    changed = False
    while pos < len(data):
        (length,) = struct.unpack(">I", data[pos : pos + 4])
        kind = data[pos + 4 : pos + 8]
        end = pos + length + 12
        if kind in KEEP:
            out += data[pos:end]
        else:
            changed = True
        pos = end

    if changed:
        path.write_bytes(bytes(out))
    return changed


if __name__ == "__main__":
    roots = [Path(arg) for arg in sys.argv[1:]] or [Path(".")]
    stripped = 0
    for root in roots:
        targets = [root] if root.is_file() else sorted(root.rglob("*.png"))
        for target in targets:
            if strip(target):
                stripped += 1
    print(f"stripped colour chunks from {stripped} file(s)")
