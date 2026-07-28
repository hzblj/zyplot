import { Stack, useLocalSearchParams } from "expo-router";
import {
	ScrollView,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from "react-native";
import { chartTitle } from "../../src/charts/chart-catalog";
import { ChartExample } from "../../src/charts/chart-example";
import { colors } from "../../src/theme/colors";

export default function ChartDetail() {
	const { chart } = useLocalSearchParams<{ chart: string }>();
	const scheme = useColorScheme();
	const theme = colors[scheme === "dark" ? "dark" : "light"];
	const id = chart ?? "line";

	return (
		<>
			<Stack.Screen options={{ title: chartTitle(id) }} />
			<ScrollView
				// Lets the native large title collapse into the translucent bar as
				// this view scrolls, and insets the content past it on first paint.
				contentContainerStyle={styles.content}
				contentInsetAdjustmentBehavior="automatic"
				style={{ backgroundColor: theme.background }}
			>
				<Text style={[styles.description, { color: theme.textMuted }]}>
					Rendered by the platform-native layer from the shared serializable
					API.
				</Text>
				<View
					style={[
						styles.card,
						{ backgroundColor: theme.surface, borderColor: theme.border },
					]}
				>
					<ChartExample id={id} />
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 20,
		borderWidth: 1,
		marginTop: 20,
		overflow: "hidden",
		padding: 16,
	},
	content: { padding: 20, paddingBottom: 48 },
	description: { fontSize: 16, lineHeight: 24 },
});
