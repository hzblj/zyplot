#!/usr/bin/env python3
"""Decides whether a captured panel is the finished screen or a frame in transit.

A screenshot always writes a file, so the ways a capture goes wrong all look
like success: the app is still bundling, the reveal animation is halfway
through, the window is white because the JS has not run yet, or the deep link
never landed and what is on screen is the gallery it launched on — or, worse,
the screen from the capture before this one, held because the app stopped
drawing. Each of those is one comparison away from being caught, and this is
where they are made.

Exits 0 when the frame is good, or 1 with the reason on stderr.
"""

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageStat

# Coarse enough that a pulsing marker or one repainted label cannot fail the
# comparison, fine enough that a different screen always does.
THUMBNAIL = (72, 156)

# Two frames of the same settled screen, as a mean channel difference. The plots
# animate on arrival, so anything above this is still moving.
STILL = 1.5

# How far a screen has to be from one it must not be — the gallery, or an
# earlier capture — to count as somewhere else.
MOVED = 3.0

# A painted screen carries marks, labels and the antialiasing along both edges
# of each. A white window mid-launch, or a bundling screen, has orders of
# magnitude fewer.
COLOURS = 200


def thumbnail(path: Path) -> Image.Image:
    return Image.open(path).convert("L").resize(THUMBNAIL, Image.LANCZOS)


def difference(first: Path, second: Path) -> float:
    return ImageStat.Stat(ImageChops.difference(thumbnail(first), thumbnail(second))).mean[0]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--current", required=True, type=Path)
    parser.add_argument("--previous", required=True, type=Path, help="the frame before it, to prove it has settled")
    parser.add_argument(
        "--unlike",
        action="append",
        default=[],
        type=Path,
        help="a screen this one must not be: the gallery it launched on, or a panel already captured",
    )
    arguments = parser.parse_args()

    if difference(arguments.previous, arguments.current) > STILL:
        sys.exit("still moving")

    # getcolors() returns None once the image has more colours than it was asked
    # to count, which is itself the answer.
    colours = Image.open(arguments.current).convert("RGB").getcolors(maxcolors=1 << 18)
    if colours is not None and len(colours) < COLOURS:
        sys.exit("nothing drawn yet")

    for other in arguments.unlike:
        if difference(other, arguments.current) < MOVED:
            sys.exit(f"still showing {other.stem}")


if __name__ == "__main__":
    main()
