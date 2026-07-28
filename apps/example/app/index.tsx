import { Stack } from "expo-router";
import { ChartGallery } from "../src/gallery/chart-gallery";

export default function Home() {
	return (
		<>
			<Stack.Screen options={{ title: "Charts" }} />
			<ChartGallery />
		</>
	);
}
