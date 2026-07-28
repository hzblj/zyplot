"use client";

import { useEffect, useState } from "react";
import { tv } from "tailwind-variants";

const themeToggle = tv({
	base: "cursor-pointer rounded-full border border-border-secondary bg-fill-secondary-primary px-3 py-[7px] text-content-secondary hover:bg-fill-secondary-hover hover:text-content-primary",
});

type Theme = "dark" | "light";

const applyTheme = (theme: Theme) => {
	document.documentElement.classList.toggle("dark", theme === "dark");
	localStorage.setItem("zyplot-theme", theme);
};

export const ThemeToggle = () => {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		const activeTheme = document.documentElement.classList.contains("dark")
			? "dark"
			: "light";
		setTheme(activeTheme);
	}, []);

	const toggleTheme = () => {
		const nextTheme = theme === "dark" ? "light" : "dark";
		applyTheme(nextTheme);
		setTheme(nextTheme);
	};

	return (
		<button
			aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
			className={themeToggle()}
			onClick={toggleTheme}
			type="button"
		>
			{theme === "dark" ? "Light" : "Dark"}
		</button>
	);
};
