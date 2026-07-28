export const LINE_SEEDS = [1.15, 0.78, 1.62, 0.94, 1.37];
export const LINE_VERTICES = 9;

/** Deterministic geometry keeps skeletons stable between renders. */
export const waveAt = (index: number, seed: number): number =>
	Math.sin((index + 1) * seed) * 0.5 + 0.5;
