"use client";

import { useEffect, useState } from "react";

const MAX_AGE = 60 * 60 * 24 * 365;

/**
 * A docs preference seeded from the server and written back to its cookie.
 *
 * The initial value comes from the request, so the markup React is given
 * already reflects the reader's last choice — nothing to reconcile on mount and
 * nothing to flash. This hook only owns the write side and the guard.
 *
 * `allowed` is that guard: a platform remembered from a chart with three tabs
 * must not select a fourth on a chart that has two.
 */
export const usePreference = <T extends string>(
	initial: T,
	name: string,
	allowed: readonly T[],
) => {
	const [value, setValue] = useState<T>(initial);

	const isAllowed = (allowed as readonly string[]).includes(value);
	const resolved = isAllowed ? value : (allowed[0] ?? initial);

	useEffect(() => {
		if (!isAllowed) {
			setValue(resolved);
		}
	}, [isAllowed, resolved]);

	const choose = (next: T) => {
		setValue(next);
		document.cookie = `${name}=${next}; path=/; max-age=${MAX_AGE}; samesite=lax`;
	};

	return [resolved, choose] as const;
};
