#!/usr/bin/env python3
"""Lays the panels of one app screenshot out side by side on a stage.

The panels come in raw — a browser viewport, and a screen dump from each
device — and every frame around them is drawn here rather than photographed.
Capturing the simulator and emulator *windows* would hand us their chrome for
free, but it also hands us whatever is docked to them that day: the emulator's
control strip, a window title, the width the window happened to be. Drawing the
frames keeps the output the same on any machine, at any window arrangement.

The stage colours are the ones the docs put behind a screenshot, so the image
sits on the page rather than on a rectangle of its own.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

# The stage the docs use behind a captured chart, per appearance.
STAGE = {"dark": (23, 23, 23), "light": (250, 250, 250)}

# The bezel drawn around a phone panel. Near-black reads as a device against the
# light stage; on the dark one it needs lifting off the background, and a
# hairline to keep an edge where the two nearly meet.
BEZEL = {"dark": ((43, 43, 43), (58, 58, 58)), "light": ((17, 17, 17), None)}

# Window chrome for the browser panel: bar, hairline under it, dots, address bar.
CHROME = {
    "dark": ((38, 38, 38), (58, 58, 58), (74, 74, 74), (31, 31, 31)),
    "light": ((242, 242, 242), (224, 224, 224), (212, 212, 212), (255, 255, 255)),
}

SHADOW = {"dark": 96, "light": 36}

# A phone's screen corners, as a fraction of its width. iOS rounds far harder
# than the emulator's skin does, and both are read off the captures.
SCREEN_RADIUS = {"android": 0.075, "ios": 0.135}


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    """An 8x-supersampled rounded rectangle, so the corners come out smooth."""
    scale = 8
    big = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    ImageDraw.Draw(big).rounded_rectangle(
        (0, 0, size[0] * scale - 1, size[1] * scale - 1),
        radius=radius * scale,
        fill=255,
    )
    return big.resize(size, Image.LANCZOS)


def round_corners(image: Image.Image, radius: int) -> Image.Image:
    out = image.convert("RGBA")
    out.putalpha(rounded_mask(out.size, radius))
    return out


def trim_bottom(image: Image.Image, pad: int, tolerance: int = 6) -> Image.Image:
    """Cuts the empty page below the screen's content.

    The web screens are as tall as the viewport they are given, and both of them
    stop well short of it. Rather than pick a height per screen — which would
    need revisiting every time a row is added to one — take a tall viewport and
    cut back to the content, measuring the background from the bottom corner.
    """
    rgb = image.convert("RGB")
    width, height = rgb.size
    background = rgb.getpixel((width - 1, height - 1))
    pixels = rgb.load()
    for y in range(height - 1, -1, -1):
        for x in range(0, width, 3):
            pixel = pixels[x, y]
            if any(abs(pixel[i] - background[i]) > tolerance for i in range(3)):
                return image.crop((0, 0, width, min(height, y + 1 + pad)))
    return image


def browser_panel(image: Image.Image, appearance: str) -> Image.Image:
    """The web capture in a window: a title bar, dots and an address bar."""
    bar, hairline, dot, address = CHROME[appearance]
    width = image.width
    height = round(width * 0.052)
    radius = round(width * 0.018)

    panel = Image.new("RGB", (width, height + image.height), bar)
    panel.paste(image.convert("RGB"), (0, height))

    draw = ImageDraw.Draw(panel)
    draw.rectangle((0, height - 1, width, height - 1), fill=hairline)

    span = round(height * 0.28)
    for index in range(3):
        centre = (round(height * 0.62 + index * span * 1.75), height // 2)
        draw.ellipse(
            (centre[0] - span // 2, centre[1] - span // 2, centre[0] + span // 2, centre[1] + span // 2),
            fill=dot,
        )

    field = round(width * 0.34), round(height * 0.5)
    left = (width - field[0]) // 2
    top = (height - field[1]) // 2
    draw.rounded_rectangle(
        (left, top, left + field[0], top + field[1]),
        radius=field[1] // 2,
        fill=address,
        outline=hairline,
    )
    return round_corners(panel, radius)


def phone_panel(image: Image.Image, platform: str, appearance: str) -> Image.Image:
    """The device capture behind a drawn bezel."""
    body, edge = BEZEL[appearance]
    screen = round_corners(image, round(image.width * SCREEN_RADIUS[platform]))
    bezel = max(2, round(image.width * 0.022))
    size = (screen.width + bezel * 2, screen.height + bezel * 2)
    radius = round(image.width * SCREEN_RADIUS[platform]) + bezel

    panel = Image.new("RGBA", size, (*body, 255))
    panel.putalpha(rounded_mask(size, radius))
    if edge:
        outline = Image.new("RGBA", size, (0, 0, 0, 0))
        ImageDraw.Draw(outline).rounded_rectangle(
            (0, 0, size[0] - 1, size[1] - 1), radius=radius, outline=(*edge, 255), width=max(1, bezel // 3)
        )
        panel = Image.alpha_composite(panel, outline)
    panel.alpha_composite(screen, (bezel, bezel))
    return panel


def scale_to_height(image: Image.Image, height: int) -> Image.Image:
    width = max(1, round(image.width * height / image.height))
    return image.resize((width, height), Image.LANCZOS)


def compose(panels: list[Image.Image], appearance: str, width: int, gap: int, pad: int) -> Image.Image:
    aspect = sum(panel.width / panel.height for panel in panels)
    height = round((width - 2 * pad - gap * (len(panels) - 1)) / aspect)
    scaled = [scale_to_height(panel, height) for panel in panels]

    # Rounding each panel's width independently loses a pixel or two off the
    # total, so the stage is measured from what was actually produced and the
    # row is centred in it.
    total = sum(panel.width for panel in scaled) + gap * (len(scaled) - 1)
    stage = Image.new("RGBA", (total + 2 * pad, height + 2 * pad), (*STAGE[appearance], 255))

    # Each panel's own alpha is its shadow's silhouette, so a rounded corner
    # casts a rounded shadow rather than a square one.
    silhouette = Image.new("L", stage.size, 0)
    x = pad
    for panel in scaled:
        silhouette.paste(panel.getchannel("A"), (x, pad + round(height * 0.012)))
        x += panel.width + gap
    shadow = Image.new("RGBA", stage.size, (0, 0, 0, 0))
    shadow.putalpha(silhouette.point(lambda value: value * SHADOW[appearance] // 255))
    stage = Image.alpha_composite(stage, shadow.filter(ImageFilter.GaussianBlur(round(height * 0.022))))

    x = pad
    for panel in scaled:
        stage.alpha_composite(panel, (x, pad))
        x += panel.width + gap
    return stage.convert("RGB")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--appearance", choices=("light", "dark"), default="light")
    parser.add_argument("--web", type=Path)
    parser.add_argument("--android", type=Path)
    parser.add_argument("--ios", type=Path)
    parser.add_argument("--width", type=int, default=1600)
    parser.add_argument("--gap", type=int, default=44)
    parser.add_argument("--pad", type=int, default=44)
    arguments = parser.parse_args()

    panels: list[Image.Image] = []
    if arguments.web:
        capture = Image.open(arguments.web)
        # 24 CSS pixels of page below the last row, at the capture's own scale.
        panels.append(browser_panel(trim_bottom(capture, round(capture.width * 0.028)), arguments.appearance))
    for platform in ("android", "ios"):
        path = getattr(arguments, platform)
        if path:
            panels.append(phone_panel(Image.open(path), platform, arguments.appearance))
    if not panels:
        parser.error("nothing to compose — pass at least one of --web, --android, --ios")

    stage = compose(panels, arguments.appearance, arguments.width, arguments.gap, arguments.pad)
    arguments.out.parent.mkdir(parents=True, exist_ok=True)
    stage.save(arguments.out, optimize=True)
    print(f"composed {arguments.out} ({stage.width}x{stage.height})")


if __name__ == "__main__":
    main()
