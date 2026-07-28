import { Link } from "expo-router";
import {
	Pressable,
	SectionList,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from "react-native";
import { chartSections } from "../charts/chart-catalog";
import { colors } from "../theme/colors";

/**
 * The web fallback. Metro prefers `chart-gallery.ios.tsx` and
 * `chart-gallery.android.tsx`, which are built from real SwiftUI and Compose
 * lists; the DOM has no such thing to borrow, so this one is drawn by hand.
 */
export const ChartGallery = () => {
	const scheme = useColorScheme();
	const theme = colors[scheme === "dark" ? "dark" : "light"];

	return (
		<SectionList
			contentContainerStyle={styles.content}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<Link asChild href={`/charts/${item.id}`}>
					<Pressable
						style={({ pressed }) => [
							styles.row,
							{
								backgroundColor: theme.surface,
								borderColor: theme.border,
								opacity: pressed ? 0.62 : 1,
							},
						]}
					>
						<View style={styles.rowText}>
							<Text style={[styles.rowTitle, { color: theme.text }]}>
								{item.label}
							</Text>
							<Text style={[styles.rowMeta, { color: theme.textMuted }]}>
								{item.layer}
							</Text>
						</View>
						<Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
					</Pressable>
				</Link>
			)}
			renderSectionHeader={({ section }) => (
				<Text style={[styles.section, { color: theme.textMuted }]}>
					{section.title}
				</Text>
			)}
			sections={chartSections}
			style={{ backgroundColor: theme.background }}
		/>
	);
};

const styles = StyleSheet.create({
	chevron: { fontSize: 28, fontWeight: "300" },
	content: { paddingBottom: 48, paddingHorizontal: 20 },
	row: {
		alignItems: "center",
		borderRadius: 14,
		borderWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	rowMeta: { fontSize: 12 },
	rowText: { gap: 4 },
	rowTitle: { fontSize: 16, fontWeight: "600" },
	section: {
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 0.8,
		paddingBottom: 10,
		paddingTop: 22,
		textTransform: "uppercase",
	},
});
