#!/usr/bin/env bash
set -euo pipefail

PLATFORM="${1:?usage: capture-charts.sh <ios|android> [light|dark]}"
APPEARANCE="${2:-light}"

cd "$(dirname "$0")/.."
OUT_DIR="../website/public/charts/${PLATFORM}/${APPEARANCE}"
HARNESS="app/index.tsx"
TARGET="src/charts/shot-target.ts"
BACKUP="$(mktemp)"
TMP_SHOT="$(mktemp -t zyplot-shot).png"
TMP_PROBE="$(mktemp -t zyplot-probe).png"

SHARED=(line area bar stacked-bar pie gauge meter histogram boxplot candlestick
	diverging-bar dumbbell funnel heatmap radar scatter sankey sunburst treemap
	time-series sparkline advanced-line finance)
if [ "$PLATFORM" = "ios" ]; then
	IDS=("${SHARED[@]}" ios-rule ios-range)
else
	IDS=("${SHARED[@]}" android-waterfall android-lollipop)
fi

cp "$HARNESS" "$BACKUP"
restore() {
	cp "$BACKUP" "$HARNESS"
	rm -f "$BACKUP" "$TMP_SHOT" "$TMP_PROBE" "$TARGET"
}
trap restore EXIT INT TERM

mkdir -p "$OUT_DIR"

cat > "$HARNESS" <<'HARNESS_EOF'
import { Stack } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";
import { ChartExample } from "../src/charts/chart-example";
import { SHOT_ID } from "../src/charts/shot-target";

export default function Home() {
	const isDark = useColorScheme() === "dark";

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<View
				style={[
					styles.screen,
					{ backgroundColor: isDark ? "#171717" : "#fafafa" },
				]}
			>
				<View
					style={[
						styles.card,
						{
							backgroundColor: isDark ? "#212121" : "#ffffff",
							borderColor: isDark ? "#333333" : "#ededed",
						},
					]}
				>
					<ChartExample id={SHOT_ID} />
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 22,
		borderWidth: 1,
		left: 18,
		padding: 18,
		position: "absolute",
		right: 18,
		top: 110,
	},
	screen: { flex: 1 },
});
HARNESS_EOF

APP_ID="com.hzblj.zyplot.example"

printf 'export const SHOT_ID = "%s";\n' "${IDS[0]}" > "$TARGET"

if [ "$PLATFORM" = "ios" ]; then
	xcrun simctl ui booted appearance "$APPEARANCE"
	xcrun simctl terminate booted "$APP_ID" > /dev/null 2>&1 || true
	xcrun simctl launch booted "$APP_ID" > /dev/null
else
	adb shell svc power stayon true
	adb shell input keyevent KEYCODE_WAKEUP
	adb shell wm dismiss-keyguard
	adb shell "cmd uimode night $([ "$APPEARANCE" = dark ] && echo yes || echo no)"
	adb shell am force-stop "$APP_ID"
	adb shell monkey -p "$APP_ID" -c android.intent.category.LAUNCHER 1 > /dev/null 2>&1
fi
sleep 25

colour_count() {
	sips -s format png -Z 60 "${OUT_DIR}/${id}.png" --out "$TMP_PROBE" > /dev/null 2>&1
	python3 - "$TMP_PROBE" <<-'PY'
		import struct, sys, zlib
		data = open(sys.argv[1], "rb").read()
		pos, width, height, raw = 8, 0, 0, b""
		while pos < len(data):
		    length, kind = struct.unpack(">I4s", data[pos:pos + 8])
		    body = data[pos + 8:pos + 8 + length]
		    if kind == b"IHDR":
		        width, height = struct.unpack(">II", body[:8])
		    elif kind == b"IDAT":
		        raw += body
		    pos += length + 12
		pixels = zlib.decompress(raw)
		stride = len(pixels) // height - 1
		seen = set()
		for row in range(height):
		    start = row * (stride + 1) + 1
		    line = pixels[start:start + stride]
		    for i in range(0, len(line) - 2, 3):
		        seen.add(line[i:i + 3])
		print(len(seen))
	PY
}

shoot() {
	if [ "$PLATFORM" = "ios" ]; then
		xcrun simctl io booted screenshot "$TMP_SHOT" > /dev/null 2>&1
	else
		adb exec-out screencap -p > "$TMP_SHOT"
	fi
	width="$(sips -g pixelWidth "$TMP_SHOT" | awk '/pixelWidth/ {print $2}')"
	sips -c 1148 $((width - 28)) --cropOffset 290 14 "$TMP_SHOT" --out "$TMP_SHOT" > /dev/null
	sips -Z 620 "$TMP_SHOT" --out "${OUT_DIR}/${id}.png" > /dev/null
	python3 "$(dirname "$0")/strip-png-color-chunks.py" "${OUT_DIR}/${id}.png" \
		> /dev/null
}

for id in "${IDS[@]}"; do
	printf 'export const SHOT_ID = "%s";\n' "$id" > "$TARGET"
	sleep 5
	shoot

	for _ in 1 2 3; do
		[ "$(colour_count)" -ge 24 ] && break
		sleep 6
		shoot
	done
	[ "$(colour_count)" -ge 24 ] || echo "  WARNING: ${id} still looks blank"
	echo "captured ${PLATFORM}/${APPEARANCE}/${id}.png"
done
