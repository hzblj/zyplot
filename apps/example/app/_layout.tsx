import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

/**
 * The shell is the platform's own navigation stack, not a styled approximation
 * of one. On iOS that means a large title that collapses into a translucent
 * blurred bar as content scrolls under it; on Android it is the stock top app
 * bar. Nothing here paints a header by hand.
 */
export default function Layout() {
	return (
		<>
			<Stack
				screenOptions={{
					headerBackButtonDisplayMode: "minimal",
					headerShadowVisible: false,
					...Platform.select({
						ios: {
							// No `headerBlurEffect` or `headerTransparent`: since iOS 26 the
							// scroll edge effect makes the bar translucent on its own, and
							// setting both makes RNScreens warn about overlapping effects.
							headerLargeTitle: true,
							headerLargeTitleShadowVisible: false,
						},
						default: {},
					}),
				}}
			/>
			<StatusBar style="auto" />
		</>
	);
}
