import { type ChartSeries, LineChart } from "@hzblj/zyplot";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const series: ChartSeries[] = [
	{
		color: "#6d28d9",
		data: [
			{ x: 0, y: 16 },
			{ x: 1, y: 25 },
			{ x: 2, y: 22 },
			{ x: 3, y: 41 },
			{ x: 4, y: 58 },
			{ x: 5, y: 76 },
		],
		id: "revenue",
		label: "Revenue",
	},
];

export default function Home() {
	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.header}>
				<Text style={styles.eyebrow}>ZYPlot · Native renderer</Text>
				<Text style={styles.title}>One chart contract.</Text>
			</View>
			<View style={styles.card}>
				<LineChart
					accessibilityLabel="Revenue over time"
					height={360}
					series={series}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#18181b",
		borderColor: "#27272a",
		borderRadius: 24,
		borderWidth: 1,
		overflow: "hidden",
		padding: 18,
	},
	eyebrow: {
		color: "#a78bfa",
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 1.4,
	},
	header: {
		gap: 14,
	},
	screen: {
		backgroundColor: "#09090b",
		flex: 1,
		gap: 48,
		paddingHorizontal: 24,
		paddingTop: 56,
	},
	title: {
		color: "#fafafa",
		fontSize: 44,
		fontWeight: "700",
		letterSpacing: -2,
		lineHeight: 48,
	},
});
