import { Host, LazyColumn, ListItem, Text } from "@expo/ui/jetpack-compose";
import {
	clickable,
	fillMaxWidth,
	padding,
} from "@expo/ui/jetpack-compose/modifiers";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { chartSections } from "../charts/chart-catalog";

/**
 * Material 3 `ListItem` rows inside a Compose `LazyColumn`. The headline,
 * supporting text, ripple and row metrics are all Material's own, so the list
 * matches the platform rather than an iOS list wearing Android colours.
 *
 * No trailing chevron: Material lists signal navigation by the ripple, and
 * adding one would be an iOS habit imported where it does not belong.
 */
export const ChartGallery = () => {
	const router = useRouter();

	return (
		<Host style={styles.host}>
			<LazyColumn>
				{chartSections.flatMap((section) => [
					<Text
						key={`${section.title}-header`}
						modifiers={[padding(16, 24, 16, 8)]}
						style={{ typography: "labelLarge" }}
					>
						{section.title}
					</Text>,
					...section.data.map((item) => (
						<ListItem
							key={item.id}
							modifiers={[
								fillMaxWidth(),
								clickable(() => router.push(`/charts/${item.id}`)),
							]}
						>
							<ListItem.HeadlineContent>
								<Text>{item.label}</Text>
							</ListItem.HeadlineContent>
							<ListItem.SupportingContent>
								<Text>{item.layer}</Text>
							</ListItem.SupportingContent>
						</ListItem>
					)),
				])}
			</LazyColumn>
		</Host>
	);
};

const styles = StyleSheet.create({
	host: { flex: 1 },
});
