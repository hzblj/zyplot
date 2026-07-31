#!/usr/bin/env bash
#
# Captures the product example screens — the Revolut-style quote screen, the
# Kraken-style coin screen, the Family-style token screen, the Health-style
# steps screen and the Stocks-style quote sheet — on the web, on Android and on
# iOS, in both appearances, and lays each set out as the triptych the docs pages show.
#
# The three panels are photographed the same way every run: a headless Chrome
# for the web build, `simctl io screenshot` and `adb exec-out screencap` for the
# devices. Nothing depends on where a window happens to sit, and the frames in
# the finished image are drawn rather than captured — see compose-app-screens.py.
#
# Usage: scripts/capture-app-screens.sh [options]
#
#   --demo revolut|kraken|family|health|stocks|all
#                                  which screens to shoot (all)
#   --appearance light|dark|both   which appearances (both)
#   --platform web|android|ios     repeatable; defaults to all three
#   --out <dir>                    where the composites go
#                                  (../website/public/apps)
#   --keep                         leave the raw panels behind and print where
#
# Requires: the Metro dev server (`yarn dev:example`), a booted simulator, an
# attached emulator with the example app installed on both, and Pillow for the
# compositing step (`python3 -m pip install pillow`).
set -euo pipefail

cd "$(dirname "$0")/.."

APP_ID="com.hzblj.zyplot.example"
SCHEME="zyplot-example"
METRO="http://localhost:8081"
# A viewport a little wider than the app's 720pt content column, tall enough
# that neither screen is cut off; the empty page below the content is trimmed
# away when the panel is framed.
WEB_WIDTH=760
WEB_HEIGHT=940

# Every screen the script knows, which is also what `--demo all` means and what
# a mistyped name is checked against. The name is the route: the web build
# answers on /<demo> and the deep link is <scheme>://<demo>.
ALL_DEMOS="revolut kraken family health stocks"

DEMOS="$ALL_DEMOS"
APPEARANCES="light dark"
PLATFORMS=""
OUT_DIR="../website/public/apps"
KEEP=""

while [ $# -gt 0 ]; do
	case "$1" in
	--demo)
		DEMOS="$([ "$2" = all ] && echo "$ALL_DEMOS" || echo "$2")"
		shift 2
		;;
	--appearance)
		APPEARANCES="$([ "$2" = both ] && echo "light dark" || echo "$2")"
		shift 2
		;;
	--platform)
		PLATFORMS="${PLATFORMS} $2"
		shift 2
		;;
	--out)
		OUT_DIR="$2"
		shift 2
		;;
	--keep)
		KEEP=1
		shift
		;;
	*)
		echo "unknown option: $1" >&2
		sed -n '12,20p' "$0" >&2
		exit 2
		;;
	esac
done
PLATFORMS="${PLATFORMS:-web android ios}"

# A mistyped value would otherwise shoot a route that does not exist, or drop a
# platform out of the set and then name the file after the typo.
validate() {
	local label="$1" allowed="$2" value
	shift 2
	for value in $*; do
		case " ${allowed} " in
		*" ${value} "*) ;;
		*)
			echo "unknown ${label}: ${value} (expected one of: ${allowed})" >&2
			exit 2
			;;
		esac
	done
}
validate demo "$ALL_DEMOS" $DEMOS
validate appearance 'light dark' $APPEARANCES
validate platform 'web android ios' $PLATFORMS

WORK="$(mktemp -d -t zyplot-app-screens)"
cleanup() {
	if [ -n "$KEEP" ]; then
		echo "panels left in ${WORK}"
	else
		rm -rf "$WORK"
	fi
	# Leave the devices as they were found: a status bar frozen at 9:41 and an
	# emulator pinned awake would outlast the run otherwise.
	[ -n "${SIM:-}" ] && xcrun simctl status_bar "$SIM" clear > /dev/null 2>&1
	if [ -n "${EMULATOR:-}" ]; then
		adb -s "$EMULATOR" shell am broadcast -a com.android.systemui.demo -e command exit > /dev/null 2>&1
		adb -s "$EMULATOR" shell settings delete global hide_error_dialogs > /dev/null 2>&1
		adb -s "$EMULATOR" shell svc power stayon false > /dev/null 2>&1
	fi
	return 0
}
trap cleanup EXIT INT TERM

has() { case " $PLATFORMS " in *" $1 "*) return 0 ;; *) return 1 ;; esac }

# ---------------------------------------------------------------------------
# Preconditions. Each one is something that produces a plausible-looking but
# wrong image rather than an error, so they are all checked up front.
# ---------------------------------------------------------------------------

python3 -c 'import PIL' 2> /dev/null || {
	echo "Pillow is missing — install it with 'python3 -m pip install pillow'" >&2
	exit 1
}

curl -s -m 5 "${METRO}/status" | grep -q running || {
	echo "Metro is not running — start it with 'yarn dev:example'" >&2
	exit 1
}

if has ios; then
	SIM="$(xcrun simctl list devices booted | grep -oE '[0-9A-F]{8}-([0-9A-F]{4}-){3}[0-9A-F]{12}' | head -1)"
	[ -n "$SIM" ] || {
		echo "no booted simulator — boot one from Xcode or run 'yarn ios:example'" >&2
		exit 1
	}
	xcrun simctl get_app_container "$SIM" "$APP_ID" > /dev/null 2>&1 || {
		echo "${APP_ID} is not installed on the simulator — run 'yarn ios:example'" >&2
		exit 1
	}
fi

if has android; then
	EMULATOR="$(adb devices | awk '$2 == "device" {print $1; exit}')"
	[ -n "$EMULATOR" ] || {
		echo "no attached device — boot an emulator or run 'yarn android:example'" >&2
		exit 1
	}
	adb -s "$EMULATOR" shell pm path "$APP_ID" > /dev/null 2>&1 || {
		echo "${APP_ID} is not installed on the emulator — run 'yarn android:example'" >&2
		exit 1
	}
fi

# ---------------------------------------------------------------------------
# Shooting one panel. Whether what came back is the finished screen is
# inspect-panel.py's judgement — see the reasons a capture can be wrong there.
# ---------------------------------------------------------------------------

shoot_ios() { xcrun simctl io "$SIM" screenshot --type png "$1" > /dev/null 2>&1; }

# How much of a screen's top is left out of the "has it settled" comparison. The
# stocks tape scrolls on a loop and never stops, so that screen is never still by
# any measure taken over the whole frame — the band it is in has to be excluded or
# every attempt fails, forever. The rest of the screen still has to come to rest,
# which is what the check is for. The fraction covers the tape and the status bar
# above it on both devices.
ignore_top() {
	case "$1" in
	stocks) echo 0.18 ;;
	*) echo 0 ;;
	esac
}

shoot_android() {
	# screencap regularly hands back the frame before last, and now and then
	# nothing at all: take two, keep the second, and retry if it came out empty.
	for _ in 1 2 3; do
		adb -s "$EMULATOR" exec-out screencap -p > /dev/null
		adb -s "$EMULATOR" exec-out screencap -p > "$1"
		[ -s "$1" ] && return 0
		sleep 1
	done
	echo "  WARNING: the emulator returned no screenshot" >&2
}

# capture_native <ios|android> <route> <out.png>
capture_native() {
	local platform="$1" route="$2" out="$3"
	local previous="${WORK}/${platform}-previous.png"
	local reason=""

	# Screens this one must not turn out to be: the gallery the app launched on,
	# and every panel already taken on this platform. The second catches an app
	# that has stopped drawing — the deep link is delivered, nothing repaints, and
	# the previous screen would otherwise be filed under this route's name.
	local unlike="--unlike ${WORK}/${platform}-launched-${APPEARANCE}.png"
	local taken=""
	for taken in "${WORK}"/*-"${platform}-${APPEARANCE}".png; do
		[ -e "$taken" ] || continue
		[ "$taken" = "$out" ] && continue
		unlike="${unlike} --unlike ${taken}"
	done

	for attempt in 1 2 3 4; do
		# A screen that will not settle twice running is a wedged app rather than a
		# slow one — an "isn't responding" dialog over it, or a reload that lost the
		# route. Relaunching is the only thing that clears either, and it refreshes
		# the launch screen this compares against, which the dialog also spoiled.
		if [ "$attempt" -gt 2 ]; then
			echo "    relaunching ${platform} before trying again"
			"prepare_${platform}"
		fi
		if [ "$platform" = ios ]; then
			xcrun simctl openurl "$SIM" "${SCHEME}://${route}" > /dev/null
		else
			adb -s "$EMULATOR" shell am start -a android.intent.action.VIEW \
				-d "${SCHEME}://${route}" > /dev/null 2>&1
		fi
		# Long enough for the route to push, the placeholder to hand over and the
		# traced reveal to run out.
		sleep 5
		"shoot_${platform}" "$previous"
		sleep 2
		"shoot_${platform}" "$out"
		# shellcheck disable=SC2086 # the --unlike flags are built as a word list
		if reason="$(python3 scripts/inspect-panel.py --previous "$previous" --current "$out" \
			--ignore-top "$(ignore_top "$route")" $unlike 2>&1)"; then
			return 0
		fi
		echo "    ${platform} attempt ${attempt}: ${reason}"
		sleep 4
	done
	echo "  ${platform}/${route} never settled (${reason})" >&2
	return 1
}

# ---------------------------------------------------------------------------
# Putting a device into a known state: the appearance under test, a status bar
# that reads the same every run, and the app relaunched cold — the screens carry
# their own light/dark switch, and a warm relaunch would keep whatever it was
# last set to instead of following the system.
# ---------------------------------------------------------------------------

prepare_ios() {
	xcrun simctl ui "$SIM" appearance "$APPEARANCE" > /dev/null
	# Unplugged rather than charged: a charged battery draws itself green, which is
	# a spot of colour in the corner of one panel and not the other.
	xcrun simctl status_bar "$SIM" override --time '9:41' --batteryLevel 100 \
		--batteryState unplugged --cellularBars 4 --wifiBars 3 > /dev/null 2>&1 || true
	xcrun simctl terminate "$SIM" "$APP_ID" > /dev/null 2>&1 || true
	# The dev client needs telling where Metro is; launched on its own it comes up
	# on the "no script URL" screen and every capture photographs that.
	xcrun simctl openurl "$SIM" \
		"${APP_ID}://expo-development-client/?url=$(printf '%s' "$METRO" | sed 's|:|%3A|g; s|/|%2F|g')" > /dev/null
	settle_launch ios
}

prepare_android() {
	adb -s "$EMULATOR" reverse tcp:8081 tcp:8081 > /dev/null
	adb -s "$EMULATOR" shell svc power stayon true
	adb -s "$EMULATOR" shell input keyevent KEYCODE_WAKEUP
	adb -s "$EMULATOR" shell wm dismiss-keyguard
	# The dev bundle earns itself an "isn't responding" dialog now and then, and a
	# dialog sits over the screen being photographed while every check on the
	# capture still passes: it is stable, it is painted, and it is not the gallery.
	# Hiding the dialogs means a wedged app shows as a screen that never settles,
	# which is caught, rather than as a screenshot with a system card across it.
	adb -s "$EMULATOR" shell settings put global hide_error_dialogs 1 > /dev/null 2>&1 || true
	adb -s "$EMULATOR" shell settings put global sysui_demo_allowed 1 > /dev/null 2>&1 || true
	adb -s "$EMULATOR" shell am broadcast -a com.android.systemui.demo -e command enter > /dev/null 2>&1 || true
	adb -s "$EMULATOR" shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0941 > /dev/null 2>&1 || true
	adb -s "$EMULATOR" shell am broadcast -a com.android.systemui.demo -e command battery -e level 100 -e plugged false > /dev/null 2>&1 || true
	adb -s "$EMULATOR" shell "cmd uimode night $([ "$APPEARANCE" = dark ] && echo yes || echo no)" > /dev/null
	adb -s "$EMULATOR" shell am force-stop "$APP_ID"
	# Plain launcher intent: unlike the simulator, the Android dev client does not
	# answer a URL with the bundle in it, and a debug build looks for Metro on the
	# port reversed above anyway.
	adb -s "$EMULATOR" shell monkey -p "$APP_ID" -c android.intent.category.LAUNCHER 1 > /dev/null 2>&1
	settle_launch android
}

# Waits out the cold start, then keeps the gallery it lands on: the deep links
# are compared against it to tell a route that pushed from one that did not.
#
# "Loaded" has to mean drawn as well as still. A cold start holds a white window
# for seconds while the bundle evaluates, and a white window is perfectly still —
# accepting it means deep-linking into an app that is not listening yet, and
# photographing whatever it settles on afterwards.
settle_launch() {
	local platform="$1"
	local launched="${WORK}/${platform}-launched-${APPEARANCE}.png"
	local previous="${WORK}/${platform}-settling.png"
	local reason=""

	echo "  waiting for the ${platform} app to come up..."
	sleep 8
	for _ in $(seq 40); do
		"shoot_${platform}" "$previous"
		sleep 3
		"shoot_${platform}" "$launched"
		if reason="$(python3 scripts/inspect-panel.py --previous "$previous" --current "$launched" 2>&1)"; then
			return 0
		fi
	done
	echo "  WARNING: the ${platform} app never finished loading (${reason})" >&2
}

# ---------------------------------------------------------------------------
# Run.
#
# A composite is only written when every panel of it came back good. Half a
# triptych, or one with a system dialog across it, would otherwise replace a
# published screenshot with a worse one — so a demo that loses a panel is left
# alone and reported at the end.
# ---------------------------------------------------------------------------

# What the composite is called. The full set is the image the docs pages use;
# anything narrower is named after what is in it, so shooting one platform to
# check something cannot overwrite the published triptych.
SUFFIX=""
[ "$(printf '%s\n' $PLATFORMS | sort | tr '\n' ' ')" = "android ios web " ] ||
	SUFFIX="-$(printf '%s' "$PLATFORMS" | tr -s ' ' '-' | sed 's/^-//; s/-$//')"

STATUS=0

for APPEARANCE in $APPEARANCES; do
	echo "${APPEARANCE}:"
	has ios && prepare_ios
	has android && prepare_android

	for demo in $DEMOS; do
		panels=""
		complete=1
		if has web; then
			if node scripts/capture-web-screen.mjs \
				--url "${METRO}/${demo}" \
				--out "${WORK}/${demo}-web-${APPEARANCE}.png" \
				--scheme "$APPEARANCE" \
				--width "$WEB_WIDTH" \
				--height "$WEB_HEIGHT"; then
				panels="${panels} --web ${WORK}/${demo}-web-${APPEARANCE}.png"
				echo "  captured web/${demo}"
			else
				complete=0
			fi
		fi
		for platform in android ios; do
			has "$platform" || continue
			if capture_native "$platform" "$demo" "${WORK}/${demo}-${platform}-${APPEARANCE}.png"; then
				panels="${panels} --${platform} ${WORK}/${demo}-${platform}-${APPEARANCE}.png"
				echo "  captured ${platform}/${demo}"
			else
				complete=0
			fi
		done

		if [ "$complete" = 0 ]; then
			echo "  WARNING: ${demo}/${APPEARANCE} is incomplete — the image it would replace is left as it was" >&2
			STATUS=1
			continue
		fi
		# shellcheck disable=SC2086 # the panel flags are built as a word list
		python3 scripts/compose-app-screens.py \
			--out "${OUT_DIR}/${demo}/${APPEARANCE}${SUFFIX}.png" \
			--appearance "$APPEARANCE" \
			$panels
	done
done

exit "$STATUS"
