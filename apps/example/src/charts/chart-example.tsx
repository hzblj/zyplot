import { Platform } from "react-native";
import { PlatformExample } from "./examples/platform-example";
import {
	CartesianExample,
	RadialExample,
	SpecializedExample,
} from "./examples/shared-examples";

const cartesian = new Set([
	"line",
	"area",
	"bar",
	"stacked-bar",
	"diverging-bar",
	"histogram",
	"scatter",
	"time-series",
	"sparkline",
	"advanced-line",
]);
const radial = new Set(["pie", "gauge", "meter", "radar", "sunburst"]);

export const ChartExample = ({ id }: { id: string }) => {
	if (cartesian.has(id)) {
		return <CartesianExample id={id} />;
	}
	if (radial.has(id)) {
		return <RadialExample id={id} />;
	}
	if (id === "candlestick" || id === "finance") {
		return <SpecializedExample id={id} />;
	}
	if (id.startsWith("ios-") || id.startsWith("android-")) {
		return <PlatformExample id={id} />;
	}
	if (Platform.OS === "ios" || Platform.OS === "android") {
		return <SpecializedExample id={id} />;
	}
	return null;
};
