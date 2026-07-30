#!/usr/bin/env bash
#
# Records the Stock detail example being driven through every feature its chart
# has: the traced reveal on arrival, the scrub readout, a switch of range, the
# card the event annotation opens, and the same again on candlesticks.
#
# The choreography is revolut-demo.yaml. This script does the parts a flow file
# cannot: it launches the app, reads back where the chart, its event annotation
# and its controls actually landed on this device, fills those coordinates into
# the flow, and records the screen while Maestro replays it. The measurement
# matters — Maestro taps absolute points, and a slot on the weekly plot is a few
# points wide, so the beat that opens the event card has to be aimed rather than
# guessed at a percentage.
#
# Usage: scripts/record-revolut-demo.sh <ios|android> [out.mp4]
#
# Requires a booted simulator/emulator with the example app installed, the Metro
# dev server running (`yarn dev:example`), and Maestro on PATH.
set -euo pipefail

PLATFORM="${1:?usage: record-revolut-demo.sh <ios|android> [out.mp4]}"

cd "$(dirname "$0")/.."
OUT="${2:-recordings/revolut-${PLATFORM}.mp4}"
APP_ID="com.hzblj.zyplot.example"
FLOW="scripts/revolut-demo.yaml"
REMOTE_VIDEO="/sdcard/zyplot-revolut-demo.mp4"
WORK="$(mktemp -d)"
RECORDER=""

cleanup() {
	# A recorder left running holds the output file open and keeps writing to it.
	# On Android it runs on the device, where killing the adb client leaves it be.
	if [ -n "$RECORDER" ]; then
		kill -INT "$RECORDER" 2> /dev/null || true
		if [ "$PLATFORM" = android ]; then
			adb -s "${DEVICE:-}" shell 'kill -2 $(pidof screenrecord)' 2> /dev/null || true
		fi
	fi
	rm -rf "$WORK"
}
trap cleanup EXIT INT TERM

case "$PLATFORM" in
ios | android) ;;
*)
	echo "unknown platform: ${PLATFORM} (expected ios or android)" >&2
	exit 1
	;;
esac

command -v maestro > /dev/null || {
	echo "maestro not found — install it with 'brew install maestro'" >&2
	exit 1
}

# The example runs from a dev client, so without Metro the recording would be a
# red box. Fail here rather than film it.
curl -s -m 5 http://localhost:8081/status 2> /dev/null | grep -q running || {
	echo "Metro is not running — start it with 'yarn dev:example'" >&2
	exit 1
}

if [ "$PLATFORM" = ios ]; then
	DEVICE="$(xcrun simctl list devices booted | grep -oE '[0-9A-F]{8}-([0-9A-F]{4}-){3}[0-9A-F]{12}' | head -1)"
	[ -n "$DEVICE" ] || {
		echo "no booted simulator — boot one from Xcode or 'yarn ios:example'" >&2
		exit 1
	}
	xcrun simctl ui "$DEVICE" appearance dark > /dev/null 2>&1 || true
else
	DEVICE="$(adb devices | awk '$2 == "device" {print $1; exit}')"
	[ -n "$DEVICE" ] || {
		echo "no attached device — boot an emulator or 'yarn android:example'" >&2
		exit 1
	}
	# The dev client reaches Metro through this, the emulator stays awake for the
	# length of the run, and the gallery it opens on is themed to match the demo.
	adb -s "$DEVICE" reverse tcp:8081 tcp:8081 > /dev/null
	adb -s "$DEVICE" shell svc power stayon true
	adb -s "$DEVICE" shell input keyevent KEYCODE_WAKEUP
	adb -s "$DEVICE" shell wm dismiss-keyguard
	adb -s "$DEVICE" shell cmd uimode night yes > /dev/null
fi

launch_app() {
	if [ "$PLATFORM" = ios ]; then
		xcrun simctl launch "$DEVICE" "$APP_ID" > /dev/null
	else
		adb -s "$DEVICE" shell monkey -p "$APP_ID" -c android.intent.category.LAUNCHER 1 > /dev/null 2>&1
	fi
}

stop_app() {
	if [ "$PLATFORM" = ios ]; then
		xcrun simctl terminate "$DEVICE" "$APP_ID" > /dev/null 2>&1 || true
	else
		adb -s "$DEVICE" shell am force-stop "$APP_ID"
	fi
}

# ---------------------------------------------------------------------------
# Measure, and fill the flow in. This pass also warms the bundle, so the launch
# that gets filmed is a fast one rather than half a minute of Metro building the
# app.
# ---------------------------------------------------------------------------

cat > "$WORK/measure.yaml" <<-'MEASURE_EOF'
	appId: com.hzblj.zyplot.example
	---
	- extendedWaitUntil:
	    visible: 'Stock detail'
	    timeout: 300000
	- tapOn: 'Stock detail'
	- extendedWaitUntil:
	    visible: 'TSLA · Tesla'
	    timeout: 60000
	# The weekly range is the one carrying the event annotation to measure.
	- tapOn: '1W'
	- waitForAnimationToEnd:
	    timeout: 4000
MEASURE_EOF

echo "measuring ${PLATFORM} chart geometry..."
stop_app
launch_app
maestro --device "$DEVICE" test "$WORK/measure.yaml" > "$WORK/measure.log" 2>&1 || {
	cat "$WORK/measure.log" >&2
	echo "could not reach the Stock detail screen" >&2
	exit 1
}
maestro --device "$DEVICE" hierarchy > "$WORK/hierarchy.json" 2> /dev/null

# Maestro checks a coordinate looks like a coordinate while it parses the flow,
# before it would expand any `--env` value, so the numbers are written into a
# copy of the flow here instead.
python3 - "$WORK/hierarchy.json" "$FLOW" "$WORK/demo.yaml" <<-'PY'
	import json
	import re
	import string
	import sys

	hierarchy, template, rendered = sys.argv[1:4]
	nodes = []


	def collect(node):
	    attributes = node.get("attributes", {})
	    numbers = re.findall(r"-?\d+(?:\.\d+)?", attributes.get("bounds") or "")
	    if len(numbers) == 4:
	        nodes.append(
	            {
	                "id": attributes.get("resource-id") or "",
	                "label": attributes.get("accessibilityText") or "",
	                "text": attributes.get("text") or "",
	                "box": [float(value) for value in numbers],
	            }
	        )
	    for child in node.get("children") or []:
	        collect(child)


	with open(hierarchy) as stream:
	    collect(json.load(stream))


	def width(node):
	    return node["box"][2] - node["box"][0]


	def height(node):
	    return node["box"][3] - node["box"][1]


	def centre(node):
	    return (node["box"][0] + node["box"][2]) / 2, (node["box"][1] + node["box"][3]) / 2


	def first(predicate):
	    return next((node for node in nodes if predicate(node)), None)


	# The plot itself. Swift Charts labels its axis marks "Chart" as well, so take
	# the largest of them rather than the first.
	charts = [node for node in nodes if node["label"] == "Chart"]
	chart = max(charts, key=lambda node: width(node) * height(node), default=None)
	if chart is None:
	    sys.exit("no chart found on screen")

	left, top, right, bottom = chart["box"]
	span = right - left

	# Where the event landed. Android exposes the app's own badge, a text view
	# reading "P"; iOS does not, but Swift Charts exposes the annotation rule that
	# badge caps — a hairline as tall as the plot, labelled with its category.
	badge = first(lambda node: "P" in (node["text"], node["label"]))
	if badge is None:
	    badge = first(
	        lambda node: not node["text"]
	        and left <= node["box"][0] <= right
	        and width(node) <= 4
	        and height(node) >= (bottom - top) / 2
	    )
	if badge is None:
	    sys.exit("no event annotation found — is the weekly range selected?")

	toggle = first(lambda node: node["id"].startswith(("slider.vertical", "chart.xyaxis"))) or first(
	    lambda node: node["text"] in ("≡", "∿")
	)
	if toggle is None:
	    sys.exit("no candlestick toggle found")

	back = first(lambda node: node["id"] == "chevron.left" or node["label"] == "Back") or first(
	    lambda node: node["text"] == "‹"
	)
	if back is None:
	    sys.exit("no back button found")

	event_x, _ = centre(badge)
	toggle_x, toggle_y = centre(toggle)
	back_x, back_y = centre(back)

	# A scrub starts and ends inside the plot's own edges, where there is a datum
	# under the finger; the y-axis writes its labels over the last tenth of it. The
	# hold runs down the middle of the plot rather than the whole of it: iOS ignores
	# a drag that leaves the plot frame.
	values = {
	    "CHART_MID_Y": (top + bottom) / 2,
	    "HOLD_TOP": top + (bottom - top) * 0.34,
	    "HOLD_BOTTOM": top + (bottom - top) * 0.66,
	    "SCRUB_LEFT": left + span * 0.10,
	    "SCRUB_RIGHT": right - span * 0.10,
	    "EVENT_X": event_x,
	    "CANDLE_X": left + span * 0.52,
	    "TOGGLE_X": toggle_x,
	    "TOGGLE_Y": toggle_y,
	    "BACK_X": back_x,
	    "BACK_Y": back_y,
	}

	with open(template) as stream:
	    flow = string.Template(stream.read())
	with open(rendered, "w") as stream:
	    # substitute() rather than safe_substitute(): a placeholder the flow adds and
	    # this script does not measure should stop the run, not reach Maestro.
	    stream.write(flow.substitute({name: round(value) for name, value in values.items()}))

	print(f"  event at x={round(event_x)}, plot centre y={round((top + bottom) / 2)}")
PY

# ---------------------------------------------------------------------------
# Record.
# ---------------------------------------------------------------------------

mkdir -p "$(dirname "$OUT")"
stop_app

if [ "$PLATFORM" = ios ]; then
	# h264 rather than the default HEVC: it plays everywhere a README or a docs
	# page would embed it.
	xcrun simctl io "$DEVICE" recordVideo --codec h264 --force "$OUT" > /dev/null 2>&1 &
else
	adb -s "$DEVICE" shell rm -f "$REMOTE_VIDEO"
	adb -s "$DEVICE" shell screenrecord --bit-rate 12M "$REMOTE_VIDEO" &
fi
RECORDER=$!

echo "recording ${PLATFORM} demo..."
launch_app
maestro --device "$DEVICE" test "$WORK/demo.yaml"

if [ "$PLATFORM" = ios ]; then
	kill -INT "$RECORDER" 2> /dev/null || true
	wait "$RECORDER" 2> /dev/null || true
else
	# screenrecord only writes its moov atom on SIGINT, and it needs the signal on
	# the device: killing the adb client here would leave the file unplayable.
	adb -s "$DEVICE" shell 'kill -2 $(pidof screenrecord)' || true
	wait "$RECORDER" 2> /dev/null || true
	sleep 2
	adb -s "$DEVICE" pull "$REMOTE_VIDEO" "$OUT" > /dev/null
	adb -s "$DEVICE" shell rm -f "$REMOTE_VIDEO"
fi
RECORDER=""

[ -s "$OUT" ] || {
	echo "recording came out empty: ${OUT}" >&2
	exit 1
}
if command -v ffprobe > /dev/null; then
	LENGTH="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT" | cut -d. -f1)"
	echo "recorded ${OUT} (${LENGTH}s)"
else
	echo "recorded ${OUT}"
fi
