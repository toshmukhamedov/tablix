export const Ms = {
	seconds: (n: number) => n * 1000,
	minutes: (n: number) => n * 60 * 1000,
	hours: (n: number) => n * 60 * 60 * 1000,
	days: (n: number) => n * 24 * 60 * 60 * 1000,
	weeks: (n: number) => n * 7 * 24 * 60 * 60 * 1000,
};

import { platform } from "@tauri-apps/plugin-os";

export function filename(path: string): string {
	const platformName = platform();
	let separator = "/";
	if (platformName === "windows") {
		separator = "\\";
	}
	const slices = path.split(separator);
	return slices.at(-1) ?? "";
}

export function formatError(e: unknown): string {
	let message: string;
	if (e instanceof Error) {
		message = e.message;
	} else {
		message = e as string;
	}

	const parts = message.split(":");
	const last = parts.at(-1);
	if (last) {
		return capitalize(last.trim());
	}

	return message;
}

export function capitalize(str: string): string {
	const char = str.at(0);
	if (!char) {
		return str;
	}
	return char.toUpperCase() + str.slice(1);
}
