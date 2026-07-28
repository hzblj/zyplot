import {
	Button,
	Host,
	HStack,
	Image,
	List,
	Section,
	Spacer,
	Text,
	VStack,
} from "@expo/ui/swift-ui";
import {
	buttonStyle,
	contentShape,
	font,
	foregroundStyle,
	listStyle,
	shapes,
} from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { chartSections } from "../charts/chart-catalog";

/**
 * A real SwiftUI `List` in inset-grouped style — the same view Settings.app is
 * built from. Separators, the press highlight, section headers and scrolling
 * all come from UIKit; nothing here is a styled `View` pretending to be a row.
 *
 * Rows are `Button`s in `plain` style, which keeps the labels in the default
 * text colours instead of tinting the whole row accent-blue. `contentShape`
 * is what makes the row feel right: without it only the glyphs are
 * hit-testable, so tapping the gap beside a label did nothing and no press
 * highlight appeared.
 */
export const ChartGallery = () => {
	const router = useRouter();

	return (
		<Host style={styles.host}>
			<List modifiers={[listStyle("insetGrouped")]}>
				{chartSections.map((section) => (
					<Section key={section.title} title={section.title}>
						{section.data.map((item) => (
							<Button
								key={item.id}
								modifiers={[buttonStyle("plain")]}
								onPress={() => router.push(`/charts/${item.id}`)}
							>
								<HStack
									modifiers={[contentShape(shapes.rectangle())]}
									spacing={12}
								>
									<VStack alignment="leading" spacing={2}>
										<Text>{item.label}</Text>
										<Text
											modifiers={[
												font({ size: 13 }),
												foregroundStyle({
													style: "secondary",
													type: "hierarchical",
												}),
											]}
										>
											{item.layer}
										</Text>
									</VStack>
									<Spacer />
									<Image
										modifiers={[
											font({ size: 13, weight: "semibold" }),
											foregroundStyle({
												style: "tertiary",
												type: "hierarchical",
											}),
										]}
										systemName="chevron.right"
									/>
								</HStack>
							</Button>
						))}
					</Section>
				))}
			</List>
		</Host>
	);
};

const styles = StyleSheet.create({
	host: { flex: 1 },
});
