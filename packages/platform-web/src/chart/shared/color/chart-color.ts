/**
 * Display-P3 → sRGB, for colours on their way into a chart.
 *
 * **Why this exists.** `shared-styles.css` overrides every primitive with a
 * `color(display-p3 …)` value on wide-gamut displays, so that is what
 * `getComputedStyle` resolves a `chart/*` token to on a Mac. The browser's own
 * canvas would accept it — but ECharts does not hand colours to canvas. zrender
 * parses them itself, rejects anything outside its own grammar, falls back to
 * black, and then crashes in `modifyHSL` on the parse it never got. Hence: every
 * token is normalised to sRGB before either engine sees it.
 *
 * The output is exactly the sRGB fallback the token file already documents — the
 * conversion reproduces all eight sampled `@theme` hexes byte for byte, which is
 * the check that the matrices below are transcribed correctly. So on a
 * wide-gamut display a chart paints the sRGB value while the UI around it paints
 * the P3 one: marginally less saturated, and the same colour everywhere else.
 */

/** `color(display-p3 r g b)` / `color(display-p3 r g b / a)`, floats or percentages. */
const DISPLAY_P3_PATTERN = /^color\(\s*display-p3\s+([^)]+?)\s*\)$/i;

// CSS Color 4's reference matrices, applied in sequence: linear Display-P3 →
// XYZ (D65) → linear sRGB. Kept as the two published steps rather than as their
// pre-multiplied product, because that is the form they can be checked against.
const LINEAR_P3_TO_XYZ = [
	[0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
	[0.2289745640697488, 0.6917385218365064, 0.079286914093745],
	[0.0, 0.04511338185890264, 1.043944368900976],
];

const XYZ_TO_LINEAR_SRGB = [
	[3.2409699419045226, -1.537383177570094, -0.4986107602930034],
	[-0.9692436362808796, 1.8759675015077202, 0.04155505740717559],
	[0.05563007969699366, -0.20397695888897652, 1.0569715142428786],
];

/** Display-P3 shares sRGB's transfer function, so one pair of curves covers both. */
const decodeGamma = (channel: number): number => {
	if (channel <= 0.04045) {
		return channel / 12.92;
	}

	return ((channel + 0.055) / 1.055) ** 2.4;
};

const encodeGamma = (channel: number): number => {
	if (channel <= 0.0031308) {
		return channel * 12.92;
	}

	return 1.055 * channel ** (1 / 2.4) - 0.055;
};

const applyMatrix = (matrix: number[][], vector: number[]): number[] =>
	matrix.map((row) =>
		row.reduce(
			(sum, coefficient, index) => sum + coefficient * (vector[index] ?? 0),
			0,
		),
	);

const parseComponent = (raw: string): number => {
	if (raw.endsWith("%")) {
		return Number.parseFloat(raw) / 100;
	}

	return Number.parseFloat(raw);
};

const toByte = (channel: number): number =>
	Math.round(Math.min(1, Math.max(0, channel)) * 255);

const toHexPair = (byte: number): string => byte.toString(16).padStart(2, "0");

/**
 * Returns `value` untouched unless it is a `color(display-p3 …)`, in which case
 * it comes back as `#rrggbb` — or `rgba(…)` when it carries an alpha, which the
 * `*-alpha-*` ramps behind the grid and track tokens do.
 */
export const toCanvasColor = (value: string): string => {
	const match = DISPLAY_P3_PATTERN.exec(value);
	if (!match?.[1]) {
		return value;
	}

	const [channels, alphaPart] = match[1].split("/");
	const components = (channels ?? "").trim().split(/\s+/).map(parseComponent);
	if (components.length < 3 || components.some(Number.isNaN)) {
		return value;
	}

	const linearP3 = components.slice(0, 3).map(decodeGamma);
	const linearSrgb = applyMatrix(
		XYZ_TO_LINEAR_SRGB,
		applyMatrix(LINEAR_P3_TO_XYZ, linearP3),
	);
	const [red, green, blue] = linearSrgb.map((channel) =>
		toByte(encodeGamma(channel)),
	);

	if (alphaPart === undefined) {
		return `#${toHexPair(red ?? 0)}${toHexPair(green ?? 0)}${toHexPair(blue ?? 0)}`;
	}

	const alpha = parseComponent(alphaPart.trim());
	if (Number.isNaN(alpha)) {
		return value;
	}

	return `rgba(${red ?? 0}, ${green ?? 0}, ${blue ?? 0}, ${Math.min(1, Math.max(0, alpha))})`;
};
